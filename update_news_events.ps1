# PowerShell script to update navigation in news and events files
$newsFiles = Get-ChildItem -Path "news-*.html"
$eventsFiles = Get-ChildItem -Path "events-*.html"
$allFiles = $newsFiles + $eventsFiles

foreach ($file in $allFiles) {
    Write-Host "Updating navigation in $($file.Name)"
    
    # Read the file content
    $content = Get-Content $file.FullName -Raw
    
    # Determine if it's a news or events file for active navigation
    $isNews = $file.Name -like "news-*"
    $isEvents = $file.Name -like "events-*"
    
    # Replace old navigation with new one
    $oldNavPatterns = @(
        # Pattern for news files
        @"
            <ul class="nav-menu" id="nav-menu">
                <li><a href="index.html" class="nav-link">Home</a></li>
                <li><a href="about.html" class="nav-link">About</a></li>
                <li><a href="services.html" class="nav-link">Services</a></li>
                <li><a href="products.html" class="nav-link">Products</a></li>
                <li><a href="portfolio.html" class="nav-link">Portfolio</a></li>
                <li><a href="blog.html" class="nav-link">Blog</a></li>
                <li><a href="news.html" class="nav-link active">News</a></li>
                <li><a href="events.html" class="nav-link">Events</a></li>
                <li><a href="contact.html" class="nav-link nav-cta">Contact</a></li>
            </ul>
"@,
        # Pattern for events files
        @"
            <ul class="nav-menu" id="nav-menu">
                <li><a href="index.html" class="nav-link">Home</a></li>
                <li><a href="about.html" class="nav-link">About</a></li>
                <li><a href="services.html" class="nav-link">Services</a></li>
                <li><a href="products.html" class="nav-link">Products</a></li>
                <li><a href="portfolio.html" class="nav-link">Portfolio</a></li>
                <li><a href="blog.html" class="nav-link">Blog</a></li>
                <li><a href="news.html" class="nav-link">News</a></li>
                <li><a href="events.html" class="nav-link active">Events</a></li>
                <li><a href="contact.html" class="nav-link nav-cta">Contact</a></li>
            </ul>
"@
    )

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
    
    # Try to replace both patterns
    foreach ($pattern in $oldNavPatterns) {
        $content = $content -replace [regex]::Escape($pattern), $newNav
    }
    
    # Replace breadcrumb links
    $content = $content -replace 'href="news\.html"', 'href="resources.html"'
    $content = $content -replace 'href="events\.html"', 'href="resources.html"'
    $content = $content -replace '<a href="news\.html">News</a>', '<a href="resources.html">Resources</a>'
    $content = $content -replace '<a href="events\.html">Events</a>', '<a href="resources.html">Resources</a>'
    
    # Write back to file
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
    
    Write-Host "Updated $($file.Name) successfully"
}

Write-Host "All news and events files updated!"
