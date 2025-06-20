# PowerShell script to add footers to resource category pages that don't have them

$footer = @'

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h4>Enfrasys</h4>
                    <p>Transforming Malaysia's digital landscape through innovative cloud solutions and strategic partnerships.</p>
                </div>
                <div class="footer-section">
                    <h4>Solutions</h4>
                    <ul>
                        <li><a href="services.html">Modern Workplace</a></li>
                        <li><a href="services.html">Cloud Transformation</a></li>
                        <li><a href="services.html">Data & AI</a></li>
                        <li><a href="services.html">Security</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Resources</h4>
                    <ul>
                        <li><a href="resources.html">Case Studies</a></li>
                        <li><a href="resources.html">Blog Articles</a></li>
                        <li><a href="resources.html">Company News</a></li>
                        <li><a href="resources.html">Events</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Connect</h4>
                    <ul>
                        <li><a href="contact.html">Contact Us</a></li>
                        <li><a href="about.html">About</a></li>
                        <li><a href="careers.html">Careers</a></li>
                        <li><a href="support.html">Support</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2025 Enfrasys. All rights reserved.</p>
                <div class="footer-links">
                    <a href="privacy.html">Privacy Policy</a>
                    <a href="terms.html">Terms of Service</a>
                </div>
            </div>
        </div>
    </footer>
'@

# Get all resource category files
$files = Get-ChildItem -Name "case-study-*.html", "blog-post-*.html", "news-*.html", "events-*.html"

Write-Host "Checking footers for $($files.Count) resource category files..." -ForegroundColor Cyan

$addedCount = 0
foreach ($file in $files) {
    try {
        $content = Get-Content -Path $file -Raw -Encoding UTF8
        
        # Check if file already has a footer
        if ($content -notmatch '<footer class="footer">') {
            # Find the closing </body> tag and add footer before it
            if ($content -match '</body>') {
                $newContent = $content -replace '</body>', "$footer`n</body>"
                Set-Content -Path $file -Value $newContent -Encoding UTF8 -NoNewline
                Write-Host "Added footer to: $file" -ForegroundColor Green
                $addedCount++
            } else {
                Write-Host "Warning: No </body> tag found in: $file" -ForegroundColor Yellow
            }
        } else {
            Write-Host "Footer exists in: $file" -ForegroundColor Gray
        }
    }
    catch {
        Write-Host "Error processing: $file - $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nFooter addition complete: $addedCount footers added" -ForegroundColor Cyan
