# PowerShell script to update navigation in blog post files
$files = Get-ChildItem -Path "blog-post-*.html"

foreach ($file in $files) {
    Write-Host "Updating navigation in $($file.Name)"
    
    # Read the file content
    $content = Get-Content $file.FullName -Raw
    
    # Replace old navigation with new one for blog posts
    $oldNav = @"
            <ul class="nav-menu" id="nav-menu">
                <li><a href="index.html" class="nav-link">Home</a></li>
                <li><a href="about.html" class="nav-link">About</a></li>
                <li><a href="services.html" class="nav-link">Services</a></li>
                <li><a href="products.html" class="nav-link">Products</a></li>
                <li><a href="portfolio.html" class="nav-link">Portfolio</a></li>
                <li><a href="blog.html" class="nav-link active">Blog</a></li>
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
    
    # Replace breadcrumb links from blog.html to resources.html
    $content = $content -replace 'href="blog\.html"', 'href="resources.html"'
    $content = $content -replace '<a href="blog\.html">Blog</a>', '<a href="resources.html">Resources</a>'
    
    # Apply navigation replacement
    $content = $content -replace [regex]::Escape($oldNav), $newNav
    
    # Write back to file
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
    
    Write-Host "Updated $($file.Name) successfully"
}

Write-Host "All blog post files updated!"
