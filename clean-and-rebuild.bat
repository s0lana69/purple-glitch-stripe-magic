@echo off
echo === Cleaning Next.js build artifacts and dependencies ===

echo Removing .next directory...
if exist .next rmdir /s /q .next

echo Removing node_modules directory...
if exist node_modules rmdir /s /q node_modules

echo Clearing npm cache...
call npm cache clean --force

echo Updating Next.js to latest version...
call npm install next@latest

echo Reinstalling dependencies...
call npm install

echo Rebuilding the project...
call npm run build

echo === Clean and rebuild process completed ===