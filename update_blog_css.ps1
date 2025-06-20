# PowerShell script to add blogs.css to all blog post files
$blogFiles = Get-ChildItem -Path "blog-post-*.html"

foreach ($file in $blogFiles) {
    Write-Host "Updating CSS links in $($file.Name)"
    
    # Read the file content
    $content = Get-Content $file.FullName -Raw
    
    # Replace the CSS link to include blogs.css
    $oldCssLink = '<link rel="stylesheet" href="globaldesign.css">'
    $newCssLink = @"
<link rel="stylesheet" href="globaldesign.css">
    <link rel="stylesheet" href="blogs.css">
"@
    
    # Apply replacement
    $content = $content -replace [regex]::Escape($oldCssLink), $newCssLink
    
    # Write back to file
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
    
    Write-Host "Updated $($file.Name) successfully"
}

Write-Host "All blog post files updated with blogs.css!"
