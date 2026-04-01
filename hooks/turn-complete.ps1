$f = "$env:TEMP\claude_turn_start.txt"
if (Test-Path $f) {
    $start = [datetime](Get-Content $f)
    $elapsed = ((Get-Date) - $start).TotalSeconds
    Remove-Item $f
    if ($elapsed -gt 30) {
        [console]::beep(392,100); [console]::beep(392,100); [console]::beep(392,100)
        [console]::beep(392,300); [console]::beep(311,300); [console]::beep(349,300)
        [console]::beep(392,100); Start-Sleep -m 100
        [console]::beep(349,100); [console]::beep(392,400)
    } elseif ($elapsed -gt 5) {
        [console]::beep(262,200); [console]::beep(330,200); [console]::beep(349,200)
    }
}

# reset timer
(Get-Date).ToString() | Set-Content $f
