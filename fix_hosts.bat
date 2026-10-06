@echo off
echo Adding erentkarar.com to Windows hosts file...
powershell -Command "if ((Get-Content $env:windir\System32\drivers\etc\hosts -Raw) -notmatch 'erentkarar\.com') { Add-Content -Path $env:windir\System32\drivers\etc\hosts -Value \"`r`n16.170.201.75 erentkarar.com www.erentkarar.com`r`n\" }; ipconfig /flushdns"
echo Done! Please reload https://erentkarar.com in your browser.
pause
