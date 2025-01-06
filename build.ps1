npm run build
$sourcePath = "dist\*" 
$destinationPath = "samples\OvldUnobsVld1\OvldUnobsVld1\wwwroot\lib\ovld" 
Copy-Item -Path $sourcePath -Destination $destinationPath -Recurse -Force
pause