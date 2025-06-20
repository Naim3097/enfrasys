# PowerShell script to update navigation structure across all HTML files
$htmlFiles = Get-ChildItem -Path "*.html" -Exclude "portfolio_redirect.html", "404.html"

$newNavStructure = @"
            <ul class="nav-menu" id="nav-menu">
                <li><a href="index.html" class="nav-link">Home</a></li>
                <li><a href="about.html" class="nav-link">About</a></li>
                <li><a href="products.html" class="nav-link">Products</a></li>
                <li><a href="services.html" class="nav-link">Services</a></li>
                <li><a href="resources.html" class="nav-link">Resources</a></li>
                <li><a href="contact.html" class="nav-link nav-cta">Contact</a></li>
            </ul>
"@

foreach ($file in $htmlFiles) {
    Write-Host "Updating navigation in $($file.Name)"
    
    # Read the file content
    $content = Get-Content $file.FullName -Raw
    
    # Skip files that don't have nav-menu
    if ($content -notmatch '<ul class="nav-menu"') {
        Write-Host "Skipping $($file.Name) - no nav-menu found"
        continue
    }
    
    # Pattern to match any existing nav-menu structure
    $pattern = '<ul class="nav-menu"[^>]*>.*?</ul>'
    
    # Replace with new structure
    $content = $content -replace $pattern, $newNavStructure, [System.Text.RegularExpressions.RegexOptions]::Singleline
    
    # Write back to file
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
    
    Write-Host "Updated $($file.Name) successfully"
}

Write-Host "All navigation structures updated!"
