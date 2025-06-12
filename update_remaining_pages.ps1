# PowerShell script to update remaining HTML pages with global design system

$pages = @(
    "testimonials.html",
    "news.html", 
    "resources.html",
    "careers.html",
    "events.html",
    "gallery.html",
    "support.html",
    "faq.html",
    "privacy.html",
    "terms.html",
    "sitemap.html",
    "404.html"
)

# Navigation HTML template
$navTemplate = @'
    <nav class="nav">
        <a href="index.html" class="nav-brand">Enfrasys</a>
        <ul class="nav-menu">
            <li><a href="index.html" class="nav-link">Home</a></li>
            <li><a href="about.html" class="nav-link">About</a></li>
            <li><a href="services.html" class="nav-link">Services</a></li>
            <li><a href="products.html" class="nav-link">Products</a></li>
            <li><a href="portfolio.html" class="nav-link">Portfolio</a></li>
            <li><a href="team.html" class="nav-link">Team</a></li>
            <li><a href="blog.html" class="nav-link">Blog</a></li>
            <li><a href="contact.html" class="nav-link">Contact</a></li>
            <li><a href="testimonials.html" class="nav-link">Testimonials</a></li>
            <li><a href="faq.html" class="nav-link">FAQ</a></li>
            <li><a href="gallery.html" class="nav-link">Gallery</a></li>
            <li><a href="careers.html" class="nav-link">Careers</a></li>
            <li><a href="news.html" class="nav-link">News</a></li>
            <li><a href="events.html" class="nav-link">Events</a></li>
            <li><a href="resources.html" class="nav-link">Resources</a></li>
            <li><a href="support.html" class="nav-link">Support</a></li>
        </ul>
    </nav>
'@

# Footer template
$footerTemplate = @'
    <footer class="section bg-dark text-light">
        <div class="container">
            <div class="text-center">
                <p>&copy; 2025 Enfrasys. All rights reserved.</p>
                <div class="flex justify-center gap-md mt-sm">
                    <a href="privacy.html" class="text-light">Privacy Policy</a>
                    <a href="terms.html" class="text-light">Terms of Service</a>
                    <a href="sitemap.html" class="text-light">Sitemap</a>
                </div>
            </div>
        </div>
    </footer>
'@

foreach ($page in $pages) {
    Write-Host "Processing $page..."
    
    if (Test-Path $page) {
        $content = Get-Content $page -Raw
        
        # Update CSS link
        $content = $content -replace 'href="css/[^"]*\.css"', 'href="globaldesign.css"'
        
        # Update title
        $pageTitle = ($page -replace '\.html$', '') -replace '-', ' '
        $pageTitle = (Get-Culture).TextInfo.ToTitleCase($pageTitle)
        $content = $content -replace '<title>[^<]*</title>', "<title>$pageTitle - Enfrasys</title>"
        
        # Update navigation - set active class for current page
        $activeNav = $navTemplate -replace "href=`"$page`" class=`"nav-link`"", "href=`"$page`" class=`"nav-link active`""
        
        # Replace old navigation structure
        $content = $content -replace '(?s)<header>.*?</header>', $activeNav
        $content = $content -replace '(?s)<nav>.*?</nav>', $activeNav
        
        # Replace footer
        $content = $content -replace '(?s)<footer>.*?</footer>', $footerTemplate
        
        # Update brand name in content
        $content = $content -replace 'Your Website', 'Enfrasys'
        
        Set-Content $page $content -Encoding UTF8
        Write-Host "Updated $page successfully"
    }
    else {
        Write-Host "File $page not found"
    }
}

Write-Host "All pages processed!"
