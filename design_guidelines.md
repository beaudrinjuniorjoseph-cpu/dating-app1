# Dating App Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern dating apps like Tinder, Hily, and Bumble for their proven user engagement patterns, visual appeal, and intuitive swipe mechanics.

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Light Mode: 350 85% 55% (vibrant pink-red for brand identity)
- Dark Mode: 350 75% 45% (slightly muted for dark backgrounds)

**Secondary Colors:**
- Light Mode: 220 15% 95% (soft gray backgrounds)
- Dark Mode: 220 15% 12% (deep charcoal backgrounds)

**Accent Colors:**
- Success/Match: 142 76% 36% (green for positive actions)
- Warning/Like: 45 93% 58% (warm orange for likes)

**Gradients:**
- Hero backgrounds: Soft gradient from primary color to deeper variant
- Card overlays: Subtle dark-to-transparent gradients for text readability
- VIP features: Luxury gold gradient (45 85% 60% to 35 90% 45%)

### B. Typography
**Primary Font**: Inter (Google Fonts)
- Headings: 600-700 weight
- Body text: 400-500 weight
- Buttons: 500-600 weight

**Hierarchy:**
- Hero headlines: text-4xl to text-6xl
- Section headers: text-2xl to text-3xl
- Body content: text-base to text-lg
- Captions: text-sm

### C. Layout System
**Tailwind Spacing**: Primary units of 2, 4, 6, and 8
- Consistent padding: p-4, p-6, p-8
- Margins: m-2, m-4, m-8
- Gaps: gap-4, gap-6, gap-8

### D. Component Library

**Navigation:**
- Bottom tab bar with 4 main sections (Discover, Matches, Chat, Profile)
- Clean icons with active state indicators

**Cards:**
- Profile cards with rounded corners (rounded-2xl)
- Smooth swipe animations with subtle shadows
- Overlay gradients for text readability

**Forms:**
- Onboarding: Step-by-step with progress indicators
- Minimal input styling with focus states
- Toggle buttons for preferences

**Overlays:**
- Modal dialogs for settings and VIP features
- Toast notifications for matches and system feedback
- Photo verification flow with camera integration

**Data Displays:**
- Grid layouts for matches page
- Chat bubbles with timestamp styling
- VIP feature cards with premium styling

### E. Key UI Patterns

**Swipe Interface:**
- Large, full-screen profile cards
- Smooth gesture recognition
- Visual feedback for like/dislike actions
- Match celebration animations (subtle)

**Chat System:**
- WhatsApp-inspired message bubbles
- Emoji picker integration
- Voice note waveform visualization
- Typing indicators

**VIP Experience:**
- Premium badge styling throughout
- Exclusive color treatments (gold accents)
- Feature comparison tables
- Payment form integration

## Images Section

**Hero Background Image:**
- Large hero image on landing page featuring diverse, attractive people in social settings
- Subtle dark overlay (40% opacity) for text readability
- Mobile-optimized cropping

**Profile Photos:**
- Square aspect ratio profile images with rounded corners
- Placeholder avatars with gradient backgrounds
- Photo verification overlay indicators

**Background Elements:**
- Subtle pattern overlays for empty states
- Gradient backgrounds for premium sections
- Location-based matching map integration

The design emphasizes emotional connection through warm colors, generous whitespace, and intuitive gestures while maintaining the professional polish expected of modern dating applications.