@echo off

REM Clean the dist folder
rmdir /s /q dist

REM Build the Angular app
ng build --configuration production


REM Deploy to GitHub Pages
npx angular-cli-ghpages --dir=dist/snake-game/browser

echo Deployment Complete
