:: Verifiies if p5 is installed, install it if not present. 
where p5 >nul 2>nul
if %errorlevel% neq 0 (
    echo Installing p5-server.
    call npm install -g p5-server
) else (
    echo p5-server already installed.
)

:: Opens the browser in the port of the server.
start http://localhost:3000

:: Starts the server.
npx p5-server server