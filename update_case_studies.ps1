# PowerShell script to update navigation in case study files
$files = Get-ChildItem -Path "case-study-*.html"

foreach ($file in $files) {
    Write-Host "Updating navigation in $($file.Name)"
    
    # Read the file content
    $content = Get-Content $file.FullName -Raw
    
    # Replace old navigation with new one
    $oldNav = @"
            <ul class="nav-menu" id="nav-menu">
                <li><a href="index.html" class="nav-link">Home</a></li>
                <li><a href="about.html" class="nav-link">About</a></li>
                <li><a href="services.html" class="nav-link">Services</a></li>
                <li><a href="products.html" class="nav-link">Products</a></li>
                <li><a href="portfolio.html" class="nav-link active">Portfolio</a></li>
                <li><a href="blog.html" class="nav-link">Blog</a></li>
                <li><a href="news.html" class="nav-link">News</a></li>
                <li><a href="events.html" class="nav-link">Events</a></li>
                <li><a href="contact.html" class="nav-link nav-cta">Contact</a></li>
            </ul>
"@

    $newNav = @"
            <ul class="nav-menu" id="nav-menu">
                <li><a href="index.html" class="nav-link">Home</a></li>
                <li><a href="about.html" class="nav-link">About</a></li>
                <li><a href="services.html" class="nav-link">Services</a></li>
                <li><a href="products.html" class="nav-link">Products</a></li>
                <li><a href="resources.html" class="nav-link active">Resources</a></li>
                <li><a href="contact.html" class="nav-link nav-cta">Contact</a></li>
            </ul>
"@
    
    # Replace old "Back to Portfolio" with "Back to Resources"
    $oldBack = 'href="portfolio.html" class="btn btn-outline">? Back to Portfolio'
    $newBack = 'href="resources.html" class="btn btn-outline">← Back to Resources'
    
    # Apply replacements
    $content = $content -replace [regex]::Escape($oldNav), $newNav
    $content = $content -replace [regex]::Escape($oldBack), $newBack
    
    # Write back to file
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
    
    Write-Host "Updated $($file.Name) successfully"
}

Write-Host "All case study files updated!"
