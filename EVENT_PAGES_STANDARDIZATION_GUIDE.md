# Event Pages Standardization Guide

## Overview
This guide provides instructions for converting all event pages to follow the new standardized design template established in `events-mbpj-smart-city.html`. All event pages should have a consistent, professional appearance that follows the globaldesign.css theme.

## Recent Updates
- **Event Header**: Updated to use the dark gradient background (`linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-blue) 100%)`) matching the card-accent-glow style from globaldesign.css
- **Status Badge**: "Event Completed" badge now uses light blue accent background (`var(--accent-blue)`) with dark text (`var(--primary-dark)`) for proper contrast and brand consistency
- **Event Card Footer**: All colors updated to use consistent globaldesign.css variables throughout the event card sections

## Source of Truth Template
**Reference File**: `events-mbpj-smart-city.html`

## Design Principles

### 1. No Emojis or Icons
- Remove all emojis from headings and content
- Use clean, professional typography
- Follow the text-only approach consistent with the rest of the website

### 2. Theme Consistency
- Use globaldesign.css color variables
- Maintain consistent spacing and typography
- Follow brand color scheme (#0066cc primary blue)
- Use consistent border radius (4px)

### 3. Professional Layout
- Clean card-based design
- Proper section hierarchy
- Consistent padding and margins
- Mobile-responsive layout

## Standard Event Page Structure

### 1. Navigation
```html
<nav class="nav">
    <!-- Standard navigation with Blog active state for events -->
    <li><a href="blog.html" class="nav-link active">Blog</a></li>
</nav>
```

### 2. Hero Section
```html
<section class="hero hero-gradient">
    <div class="hero-overlay"></div>
    <div class="container">
        <div class="hero-content">
            <div class="breadcrumb">
                <a href="index.html">Home</a> 
                <span>/</span> 
                <a href="events.html">Events</a> 
                <span>/</span> 
                <span>[Event Name]</span>
            </div>
            <div class="hero-badge">
                <span class="badge-text">[Event Type]</span>
            </div>
            <h1 class="hero-title">[Event Title]</h1>
            <p class="hero-subtitle">[Event Subtitle/Description]</p>
            <div class="flex gap-sm mt-md">
                <!-- Event category badges -->
            </div>
        </div>
    </div>
</section>
```

### 3. Main Event Content
```html
<section class="section">
    <div class="container">
        <div class="max-width-content mx-auto">
            <div class="event-card">
                <!-- Event Header -->
                <div class="event-header">
                    <div class="event-status">
                        <span class="status-badge [status-class]">[Status]</span>
                    </div>
                    <div class="event-meta">
                        <div class="event-date">
                            <span class="date-day">[Day]</span>
                            <span class="date-month">[Month Year]</span>
                        </div>
                        <div class="event-time">
                            <span class="time">[Time Range]</span>
                            <span class="timezone">[Timezone]</span>
                        </div>
                    </div>
                </div>

                <!-- Event Details -->
                <div class="event-details">
                    <div class="event-location">
                        <h3>Event Location</h3>
                        <!-- Location details -->
                    </div>
                    <div class="event-description">
                        <h3>Event Description</h3>
                        <!-- Description and agenda -->
                    </div>
                    <div class="event-speakers">
                        <h3>Event Hosts</h3>
                        <!-- Speaker/host information -->
                    </div>
                    <div class="event-highlights">
                        <h3>Key Highlights</h3>
                        <!-- Key topics/highlights -->
                    </div>
                </div>

                <!-- RSVP/Status Section -->
                <div class="event-rsvp">
                    <!-- Event status and follow-up actions -->
                </div>

                <!-- Event Summary -->
                <div class="event-summary">
                    <div class="summary-stats">
                        <!-- Event statistics -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
```

## Required CSS Styles

### Include in Each Event Page
Add the following CSS styles in the `<head>` section after the globaldesign.css link:

```html
<style>
/* Event Page Specific Styles */
.event-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    overflow: hidden;
    border: 1px solid #e2e8f0;
}

.event-header {
    background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-blue) 100%);
    padding: 2rem;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
}

.status-badge {
    background: rgba(255,255,255,0.15);
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 600;
    border: 1px solid rgba(255,255,255,0.2);
}

.status-completed {
    background: var(--accent-blue);
    color: var(--primary-dark);
    border-color: var(--accent-blue);
}

.status-upcoming {
    background: var(--warning-color, #f59e0b);
    color: white;
    border-color: var(--warning-color, #f59e0b);
}

.status-live {
    background: var(--danger-color, #ef4444);
    color: white;
    border-color: var(--danger-color, #ef4444);
}

.event-meta {
    display: flex;
    gap: 2rem;
    align-items: center;
}

.event-date {
    text-align: center;
    background: rgba(255,255,255,0.1);
    padding: 1rem;
    border-radius: 4px;
    border: 1px solid rgba(255,255,255,0.2);
}

.date-day {
    display: block;
    font-size: 2rem;
    font-weight: 700;
    line-height: 1;
}

.date-month {
    display: block;
    font-size: 0.875rem;
    opacity: 0.9;
}

.event-time {
    text-align: center;
}

.time {
    display: block;
    font-size: 1.125rem;
    font-weight: 600;
}

.timezone {
    display: block;
    font-size: 0.875rem;
    opacity: 0.8;
}

.event-details {
    padding: 2rem;
}

.event-details h3 {
    color: var(--primary-dark);
    margin-bottom: 1rem;
    font-size: 1.125rem;
    font-weight: 600;
    border-bottom: 2px solid var(--primary-blue);
    padding-bottom: 0.5rem;
}

.event-details > div {
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid #e2e8f0;
}

.event-details > div:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
}

.speakers-grid, .highlights-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}

.speaker, .highlight {
    background: var(--neutral-light);
    padding: 1.5rem;
    border-radius: 4px;
    border-left: 4px solid var(--primary-blue);
    transition: transform 0.2s ease;
}

.speaker:hover, .highlight:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.speaker h4, .highlight h4 {
    color: var(--primary-dark);
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
}

.speaker p, .highlight p {
    color: var(--primary-dark);
    opacity: 0.7;
    font-size: 0.875rem;
    margin: 0;
}

.event-rsvp {
    background: var(--neutral-light);
    padding: 2rem;
    border-top: 1px solid #e2e8f0;
}

.event-rsvp h3 {
    color: var(--primary-dark);
    margin-bottom: 1rem;
    font-size: 1.125rem;
    font-weight: 600;
    border-bottom: 2px solid var(--primary-blue);
    padding-bottom: 0.5rem;
}

.status-message {
    background: rgba(185, 232, 249, 0.1);
    border: 1px solid var(--accent-blue);
    border-radius: 4px;
    padding: 1rem;
    margin-bottom: 1.5rem;
}

.status-message.completed {
    background: rgba(185, 232, 249, 0.15);
    border-color: var(--accent-blue);
}

.status-message.upcoming {
    background: #fefce8;
    border-color: #fde047;
}

.follow-up-actions {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
}

.event-summary {
    background: var(--primary-dark);
    color: white;
    padding: 2rem;
}

.summary-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 2rem;
    text-align: center;
}

.stat-number {
    display: block;
    font-size: 2rem;
    font-weight: 700;
    color: var(--accent-blue);
    margin-bottom: 0.5rem;
}

.stat-label {
    display: block;
    font-size: 0.875rem;
    opacity: 0.8;
}

@media (max-width: 768px) {
    .event-header {
        flex-direction: column;
        text-align: center;
    }

    .event-meta {
        flex-direction: column;
        gap: 1rem;
    }

    .follow-up-actions {
        flex-direction: column;
    }

    .follow-up-actions .btn {
        width: 100%;
    }

    .event-details {
        padding: 1rem;
    }

    .event-rsvp {
        padding: 1rem;
    }
}
</style>
```

## Content Guidelines

### Event Status Options
- **Live Event**: `status-live` - For ongoing events
- **Upcoming Event**: `status-upcoming` - For future events  
- **Event Completed**: `status-completed` - For past events
- **Registration Open**: `status-upcoming` - For events accepting registrations

### Event Types (Hero Badge)
- Live Event
- Webinar
- Workshop
- Showcase
- Conference
- Training
- Demo

### Content Structure
1. **Location**: Venue name and address
2. **Description**: Event overview and objectives
3. **Agenda**: What attendees can expect (bullet points, no emojis)
4. **Hosts/Speakers**: Key presenters and their roles
5. **Key Highlights**: Main topics or focus areas
6. **RSVP/Status**: Registration info or post-event follow-up
7. **Statistics**: Event metrics (attendees, sessions, etc.)

## Files to Update

### Event Pages List
1. `events-cloud-first-webinar.html`
2. `events-data-classification.html`
3. `events-intan-tech-update.html`
4. `events-microsoft-dc-tour.html`
5. `events-prompt-a-thon.html`
6. `events-raya-open-house.html`
7. `events-security-webinar.html`
8. `events-upm-golden-jubilee.html`
9. `events-usim-ai-day.html`

### Update Process for Each File

1. **Update Navigation**
   - Ensure "Blog" is the active nav link for events
   
2. **Replace Hero Section**
   - Use standard hero structure with proper breadcrumbs
   - Update event badges to match content
   
3. **Replace Main Content**
   - Implement the event-card structure
   - Remove all emojis from headings and content
   - Organize content into standard sections
   
4. **Add Required CSS**
   - Include the complete CSS styles
   - Ensure responsive behavior
   
5. **Test and Validate**
   - Check for HTML errors
   - Verify responsive design
   - Confirm theme consistency

## Quality Assurance Checklist

### Before Completion
- [ ] No emojis in headings or content
- [ ] Consistent color scheme (primary blue #0066cc)
- [ ] Proper navigation with "Blog" active
- [ ] Event status clearly indicated
- [ ] Mobile responsive design
- [ ] No HTML validation errors
- [ ] Consistent typography and spacing
- [ ] Proper breadcrumb navigation
- [ ] Clear call-to-action buttons
- [ ] Theme-consistent styling

### Testing
- [ ] Desktop view (1920px, 1366px)
- [ ] Tablet view (768px)
- [ ] Mobile view (375px)
- [ ] Cross-browser compatibility
- [ ] Link functionality
- [ ] Button hover states

## Notes
- All event pages should maintain the same structure for consistency
- Content should be adapted to fit the standard sections
- Event-specific information should be preserved while following the template
- Focus on professional, business-appropriate presentation
- Maintain accessibility standards

## Completion Tracking
Create a checklist to track progress:
- [x] events-cloud-first-webinar.html
- [x] events-data-classification.html  
- [x] events-intan-tech-update.html
- [x] events-microsoft-dc-tour.html
- [x] events-prompt-a-thon.html
- [x] events-raya-open-house.html
- [x] events-security-webinar.html
- [x] events-upm-golden-jubilee.html
- [x] events-usim-ai-day.html

**ALL EVENT PAGES STANDARDIZATION COMPLETED** ✅

---

**Template Source**: `events-mbpj-smart-city.html`
**Last Updated**: January 2025
**Status**: COMPLETED - All event pages standardized
