# PowerShell script to replace all placeholder images with tbc.jpg
$filePath = "resources.html"
$content = Get-Content $filePath -Raw

# Replace all placeholder URLs with assets/tbc.jpg while preserving alt text and other attributes
$content = $content -replace 'src="https://via\.placeholder\.com/[^"]*"', 'src="assets/tbc.jpg"'

$content | Set-Content $filePath
Write-Host "All placeholder images replaced with assets/tbc.jpg!"
