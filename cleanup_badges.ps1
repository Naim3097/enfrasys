# PowerShell script to clean up resource badges
$filePath = "resources.html"
$content = Get-Content $filePath -Raw

# Define industry mappings for each resource
$industries = @{
    "Healthcare" = "Healthcare"
    "Government" = "Government" 
    "Education" = "Education"
    "Financial" = "Financial Services"
    "Telecom" = "Telecommunications"
    "Property" = "Property"
    "Entertainment" = "Entertainment"
    "Energy" = "Energy"
    "Cloud" = "Cloud & AI"
    "AI" = "AI Innovation"
    "Data" = "Data Analytics"
    "Security" = "Security"
    "Startup" = "Startup Ecosystem"
}

# Replace Healthcare badges
$content = $content -replace '(?s)<div class="resource-badges">\s*<span class="badge badge-primary">Healthcare</span>\s*<span class="badge badge-secondary">[^<]*</span>\s*</div>', '<span class="industry-tag">Healthcare</span>'

# Replace Government badges  
$content = $content -replace '(?s)<div class="resource-badges">\s*<span class="badge badge-primary">Government</span>\s*<span class="badge badge-secondary">[^<]*</span>\s*</div>', '<span class="industry-tag">Government</span>'

# Replace Education badges
$content = $content -replace '(?s)<div class="resource-badges">\s*<span class="badge badge-primary">Education</span>\s*<span class="badge badge-secondary">[^<]*</span>\s*</div>', '<span class="industry-tag">Education</span>'

# Replace Financial badges
$content = $content -replace '(?s)<div class="resource-badges">\s*<span class="badge badge-primary">Financial[^<]*</span>\s*<span class="badge badge-secondary">[^<]*</span>\s*</div>', '<span class="industry-tag">Financial Services</span>'

# Replace Technology badges
$content = $content -replace '(?s)<div class="resource-badges">\s*<span class="badge badge-primary">Technology</span>\s*<span class="badge badge-secondary">[^<]*</span>\s*</div>', '<span class="industry-tag">Technology</span>'

# Replace Telecommunications badges
$content = $content -replace '(?s)<div class="resource-badges">\s*<span class="badge badge-primary">Telecom[^<]*</span>\s*<span class="badge badge-secondary">[^<]*</span>\s*</div>', '<span class="industry-tag">Telecommunications</span>'

# Replace Property badges
$content = $content -replace '(?s)<div class="resource-badges">\s*<span class="badge badge-primary">Property</span>\s*<span class="badge badge-secondary">[^<]*</span>\s*</div>', '<span class="industry-tag">Property</span>'

# Replace Entertainment badges
$content = $content -replace '(?s)<div class="resource-badges">\s*<span class="badge badge-primary">Entertainment</span>\s*<span class="badge badge-secondary">[^<]*</span>\s*</div>', '<span class="industry-tag">Entertainment</span>'

# Replace Energy badges
$content = $content -replace '(?s)<div class="resource-badges">\s*<span class="badge badge-primary">Energy</span>\s*<span class="badge badge-secondary">[^<]*</span>\s*</div>', '<span class="industry-tag">Energy</span>'

# Replace any remaining complex badge patterns with generic ones
$content = $content -replace '(?s)<div class="resource-badges">\s*<span class="badge badge-primary">([^<]+)</span>\s*<span class="badge badge-secondary">[^<]*</span>\s*</div>', '<span class="industry-tag">$1</span>'

$content | Set-Content $filePath
Write-Host "Badge cleanup completed!"
