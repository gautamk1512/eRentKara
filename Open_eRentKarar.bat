@echo off
echo Launching eRentKarar in Chrome with direct server mapping...
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --host-rules="MAP erentkarar.com 16.170.201.75, MAP *.erentkarar.com 16.170.201.75" "https://erentkarar.com"
) else if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --host-rules="MAP erentkarar.com 16.170.201.75, MAP *.erentkarar.com 16.170.201.75" "https://erentkarar.com"
) else (
    start https://erentkarar.com
)
