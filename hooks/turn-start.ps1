$f = "$env:TEMP\claude_turn_start.txt"
if (-not (Test-Path $f)) {
    (Get-Date).ToString() | Set-Content $f
}
