# Store a GitHub Personal Access Token for THIS repository only.
#
# Why it is built this way:
#   - The token is typed into a masked GUI box, so it never appears on a command
#     line, in PSReadLine history, in the process list, or in any transcript.
#   - It is handed to git over stdin, never as an argument and never via a temp
#     file.
#   - It is stored by git-credential-wincred in Windows Credential Manager,
#     encrypted with DPAPI under your Windows account -- not in a plaintext file.
#   - Every git setting it writes is --local, so a shared/work global git config
#     is left completely untouched.
#
# Run:  powershell -ExecutionPolicy Bypass -File tools\set-github-token.ps1

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$repo = Split-Path -Parent $PSScriptRoot
Set-Location $repo

# --- confirm we are in the right repo -------------------------------------
try { $remote = (git config --local --get remote.origin.url) } catch { $remote = '' }
if (-not $remote) { [System.Windows.Forms.MessageBox]::Show('No git remote found in ' + $repo, 'LinguaMap'); exit 1 }

# --- the dialog -----------------------------------------------------------
$form                = New-Object System.Windows.Forms.Form
$form.Text           = 'GitHub token'
$form.Size           = New-Object System.Drawing.Size(470, 265)
$form.StartPosition  = 'CenterScreen'
$form.FormBorderStyle= 'FixedDialog'
$form.MaximizeBox    = $false
$form.MinimizeBox    = $false
$form.TopMost        = $true

$lblRepo             = New-Object System.Windows.Forms.Label
$lblRepo.Text        = "Repository:  $remote"
$lblRepo.Location    = New-Object System.Drawing.Point(14, 14)
$lblRepo.Size        = New-Object System.Drawing.Size(430, 18)
$lblRepo.ForeColor   = [System.Drawing.Color]::DimGray
$form.Controls.Add($lblRepo)

$lblUser             = New-Object System.Windows.Forms.Label
$lblUser.Text        = 'GitHub username'
$lblUser.Location    = New-Object System.Drawing.Point(14, 46)
$lblUser.Size        = New-Object System.Drawing.Size(430, 18)
$form.Controls.Add($lblUser)

$txtUser             = New-Object System.Windows.Forms.TextBox
$txtUser.Location    = New-Object System.Drawing.Point(14, 66)
$txtUser.Size        = New-Object System.Drawing.Size(425, 24)
# Derived from the remote URL, so it is right by default.
if ($remote -match 'github\.com[:/]([^/]+)/') { $txtUser.Text = $Matches[1] }
$form.Controls.Add($txtUser)

$lblTok              = New-Object System.Windows.Forms.Label
$lblTok.Text         = 'Personal Access Token  (paste it here -- it stays hidden)'
$lblTok.Location     = New-Object System.Drawing.Point(14, 100)
$lblTok.Size         = New-Object System.Drawing.Size(430, 18)
$form.Controls.Add($lblTok)

$txtTok              = New-Object System.Windows.Forms.TextBox
$txtTok.Location     = New-Object System.Drawing.Point(14, 120)
$txtTok.Size         = New-Object System.Drawing.Size(425, 24)
$txtTok.UseSystemPasswordChar = $true
$form.Controls.Add($txtTok)

$lblNote             = New-Object System.Windows.Forms.Label
$lblNote.Text        = 'Stored encrypted in Windows Credential Manager, for this repo only.'
$lblNote.Location    = New-Object System.Drawing.Point(14, 150)
$lblNote.Size        = New-Object System.Drawing.Size(430, 18)
$lblNote.ForeColor   = [System.Drawing.Color]::DimGray
$form.Controls.Add($lblNote)

$btnOk               = New-Object System.Windows.Forms.Button
$btnOk.Text          = 'Save'
$btnOk.Location      = New-Object System.Drawing.Point(255, 180)
$btnOk.Size          = New-Object System.Drawing.Size(90, 30)
$btnOk.DialogResult  = [System.Windows.Forms.DialogResult]::OK
$form.Controls.Add($btnOk)
$form.AcceptButton   = $btnOk

$btnCancel           = New-Object System.Windows.Forms.Button
$btnCancel.Text      = 'Cancel'
$btnCancel.Location  = New-Object System.Drawing.Point(350, 180)
$btnCancel.Size      = New-Object System.Drawing.Size(90, 30)
$btnCancel.DialogResult = [System.Windows.Forms.DialogResult]::Cancel
$form.Controls.Add($btnCancel)
$form.CancelButton   = $btnCancel

$form.Add_Shown({ $txtTok.Focus() })
$result = $form.ShowDialog()

if ($result -ne [System.Windows.Forms.DialogResult]::OK) { Write-Output 'Cancelled -- nothing changed.'; $form.Dispose(); exit 0 }

$user  = $txtUser.Text.Trim()
$token = $txtTok.Text
# Clear the control immediately; the form is disposed right after.
$txtTok.Text = ''
$form.Dispose()

if (-not $token) { Write-Output 'No token entered -- nothing changed.'; exit 1 }
if (-not $user)  { Write-Output 'No username entered -- nothing changed.'; exit 1 }

# --- hand the token to git over stdin -------------------------------------
function Send-Credential([string]$verb, [string]$u, [string]$p) {
  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName               = 'git'
  $psi.Arguments              = "credential $verb"
  $psi.WorkingDirectory       = $repo
  $psi.RedirectStandardInput  = $true
  $psi.RedirectStandardOutput = $true
  $psi.UseShellExecute        = $false
  $psi.CreateNoWindow         = $true
  $proc = [System.Diagnostics.Process]::Start($psi)
  # A "reject" must NOT carry a password line: the helper matches on what it is
  # given, so an empty password simply fails to match and the old entry survives.
  $payload = "protocol=https`nhost=github.com`nusername=$u`n"
  if ($p) { $payload += "password=$p`n" }
  $proc.StandardInput.Write($payload + "`n")
  $proc.StandardInput.Close()
  $null = $proc.StandardOutput.ReadToEnd()
  $proc.WaitForExit()
  return $proc.ExitCode
}

# Remember what was configured before we change anything, so the old plaintext
# file can be found and wiped afterwards. --get-all: there can be several.
$previous = @(git config --local --get-all credential.helper)

# 1. Clear the OLD token everywhere it might live, while the old helper chain is
#    still in place. Git for Windows sets credential.helper=manager at SYSTEM
#    level, so without this the expired token could stay cached in Git
#    Credential Manager and keep being offered ahead of the new one.
$null = Send-Credential 'reject' $user ''
Write-Output 'Cleared any previously stored github.com credential.'

# 2. Point THIS repo at Windows Credential Manager only.
#
#    The empty first value resets the inherited helper list. Without it two
#    things go wrong: the system-level "manager" answers first and can shadow
#    the token we are about to store, and -- worse -- any leftover
#    "store --file=" helper stays in the chain. Git calls approve on EVERY
#    helper after a successful authentication, so that one would quietly write
#    the token back out to a plaintext file.
#
#    The empty argument goes through cmd because Windows PowerShell 5.1 drops
#    empty-string arguments to native commands: passing '' here silently becomes
#    no argument at all, leaving the old helpers in place.
#
#    Every write is --local; the system and global config are untouched.
git config --local --unset-all credential.helper
cmd /c 'git config --local --add credential.helper ""'
git config --local --add credential.helper wincred

$chain = @(git config --local --get-all credential.helper)
if ($chain.Count -ne 2 -or $chain[0] -ne '' -or $chain[1] -ne 'wincred') {
  Write-Output 'ERROR: could not set the credential helper chain. Run this by hand:'
  Write-Output '  git config --local --unset-all credential.helper'
  Write-Output '  git config --local --add credential.helper ""'
  Write-Output '  git config --local --add credential.helper wincred'
  exit 1
}
Write-Output 'Credential helper for this repo -> wincred (Windows Credential Manager)'

# 3. Store the new token.
$code = Send-Credential 'approve' $user $token
if ($code -ne 0) { Write-Output "git credential approve failed (exit $code)"; exit 1 }
Write-Output 'Token stored in Windows Credential Manager.'

# --- verify against GitHub, without ever printing the token ---------------
try {
  $headers = @{ Authorization = "Bearer $token"; 'User-Agent' = 'linguamap-token-setup' }
  $resp    = Invoke-WebRequest -Uri 'https://api.github.com/user' -Headers $headers -UseBasicParsing
  $login   = ($resp.Content | ConvertFrom-Json).login
  $scopes  = $resp.Headers['x-oauth-scopes']
  $expiry  = $resp.Headers['github-authentication-token-expiration']
  Write-Output "Authenticated as: $login"
  if ($scopes) { Write-Output "Scopes: $scopes" }
  if ($expiry) { Write-Output "Token expires: $expiry" }
  if ($scopes -and ($scopes -notmatch 'repo')) {
    Write-Output "WARNING: this token has no 'repo' scope -- pushing to a private repo will fail."
  }
} catch {
  Write-Output "WARNING: GitHub rejected the token ($($_.Exception.Message))."
  Write-Output 'It was still stored; re-run this script to replace it.'
}

# Remove the plaintext copy from memory as far as .NET allows.
$token = $null
[System.GC]::Collect()

# --- retire any old plaintext credential file -----------------------------
foreach ($h in $previous) {
  if ($h -match '--file=(.+)$') {
    $oldFile = $Matches[1].Trim()
    if (Test-Path $oldFile) {
      # Overwrite before deleting, so the old token is not left in free space.
      $len = (Get-Item $oldFile).Length
      [System.IO.File]::WriteAllBytes($oldFile, (New-Object byte[] $len))
      Remove-Item $oldFile -Force
      Write-Output "Old plaintext credential file wiped and removed: $oldFile"
    }
  }
}

Write-Output ''
Write-Output 'Done. Global git config was not touched. Test with:  git ls-remote origin'
