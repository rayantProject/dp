@echo on

set ASPNETCORE_ENVIRONMENT=Development
set ASPNETCORE_URLS=http://+:8080
set ASPNETCORE_HTTP_PORT=8080

echo Lancement de blur-service-dotnet.exe...
where blur-service-dotnet.exe
if not exist blur-service-dotnet.exe echo ERREUR: Le fichier blur-service-dotnet.exe est introuvable! & pause & exit /b

call blur-service-dotnet.exe

pause
