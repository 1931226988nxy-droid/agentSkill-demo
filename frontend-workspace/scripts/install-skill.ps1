$ErrorActionPreference = 'Stop'

$source = (Resolve-Path (Join-Path $PSScriptRoot '..\..\frontend-system')).Path
$skillsDirectory = Join-Path $env:USERPROFILE '.agents\skills'
$destination = Join-Path $skillsDirectory 'frontend-system'

New-Item -ItemType Directory -Path $skillsDirectory -Force | Out-Null
if (Test-Path -LiteralPath $destination) {
  $existing = Get-Item -LiteralPath $destination -Force
  if ($existing.LinkType -eq 'Junction' -and $existing.Target -eq $source) {
    Write-Output "Skill already linked to $source"
    exit 0
  }
  throw "Destination exists and is not linked to this repository: $destination. Inspect it manually; this script will not overwrite it."
}

New-Item -ItemType Junction -Path $destination -Target $source | Out-Null
Write-Output "Linked $destination -> $source"
