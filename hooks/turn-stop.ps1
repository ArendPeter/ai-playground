$f = "$env:TEMP\claude_turn_start.txt"
if (Test-Path $f) {
    $start = [datetime](Get-Content $f)
    $elapsed = ((Get-Date) - $start).TotalSeconds
    Remove-Item $f
		[console]::beep(262,200); [console]::beep(262,200); 
}

# reset timer
(Get-Date).ToString() | Set-Content $f
