# PowerShell script to update navigation structure across all resource category pages
# This script handles multiple navigation patterns and standardizes them

$targetNavigation = @'
    <nav class="nav">
        <div class="nav-container">
            <a href="index.html" class="nav-brand">Enfrasys</a>
            <button class="nav-toggle" id="nav-toggle">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <ul class="nav-menu" id="nav-menu">
                <li><a href="index.html" class="nav-link">Home</a></li>
                <li><a href="about.html" class="nav-link">About</a></li>
                <li><a href="services.html" class="nav-link">Services</a></li>
                <li><a href="products.html" class="nav-link">Products</a></li>
                <li><a href="resources.html" class="nav-link active">Resources</a></li>
            </ul>
            <a href="contact.html" class="nav-cta">Contact</a>
        </div>
    </nav>
'@

# Get all resource category files
$files = Get-ChildItem -Name "case-study-*.html", "blog-post-*.html", "news-*.html", "events-*.html"

Write-Host "Updating navigation for $($files.Count) resource category files..." -ForegroundColor Cyan

$updatedCount = 0
foreach ($file in $files) {
    try {
        $content = Get-Content -Path $file -Raw -Encoding UTF8
        
        # Find the existing <nav> section and replace it with standardized version
        if ($content -match '(?s)<nav class="nav">.*?</nav>') {
            $newContent = $content -replace '(?s)<nav class="nav">.*?</nav>', $targetNavigation
            Set-Content -Path $file -Value $newContent -Encoding UTF8 -NoNewline
            Write-Host "Updated: $file" -ForegroundColor Green
            $updatedCount++
        } else {
            Write-Host "Skipped: $file (nav section not found)" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "Error updating: $file - $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nNavigation update complete: $updatedCount files updated" -ForegroundColor Cyan
