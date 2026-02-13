

# 💕 Valentine's Love Birds Gift

A romantic, animated Valentine's Day gift website where you create a personalized surprise for your loved one — with photos, a love letter, and a promise contract — delivered via a single-use secret link.

---

## Design & Theme
- **Color palette**: Pastel pinks, rose gradients, soft red accents
- **Typography**: Elegant cursive fonts for headings, clean readable body text
- **Animations**: Floating hearts, sparkle particles, bouncing/flying love birds throughout
- **Overall feel**: Warm, dreamy, romantic

---

## Flow 1: Creator's Journey

### Page 1 — Welcome & Names
- Animated landing page with floating hearts and romantic greeting
- Two input fields: "Your Name" and "Your Lover's Name"
- "Create Gift" button to proceed

### Page 2 — Three Love Birds Hub
- Three animated love birds displayed with labels:
  - 🐦 **Photo Bird** — Upload 3-5 photos
  - 🐦 **Letter Bird** — Write a love letter
  - 🐦 **Promise Bird** — Write a promise contract
- Each bird opens its own input page when clicked
- Progress indicator showing completion status
- "Generate Gift Link" button appears when all three are filled

### Photo Upload Page
- Upload up to 5 photos (stored in Supabase Storage)
- Preview thumbnails with remove option
- Back button to hub

### Love Letter Page
- Parchment-style text area for writing the letter
- Back button to hub

### Promise Contract Page
- Formal love contract/agreement styling
- Text area for promises
- Back button to hub

### Link Generated Page
- Unique shareable link displayed
- Copy-to-clipboard button
- Reminder that the link is single-use and data is deleted after viewing

---

## Flow 2: Receiver's Journey

### Page 1 — "I Love You" Reveal
- Dramatic romantic animation with "I Love You, [Name]" in elegant cursive
- Floating hearts and sparkle effects
- "Open Your Gift 🎁" button

### Page 2 — Three Love Birds Hub
- Three animated love birds matching creator's style
- Each bird is clickable to reveal its content

### Photo Bird → Photo Gallery
- Romantic slideshow/gallery of uploaded photos
- Floating heart emojis drifting around each image
- Photos deleted from storage after viewing

### Letter Bird → Love Letter
- Letter displayed on parchment/envelope-style page
- Letter content deleted after viewing

### Promise Bird → Promise Contract
- Wax seal aesthetic and formal contract look
- Contract deleted after viewing

### After All Viewed
- All data permanently deleted from database and storage
- Link becomes invalid — shows "This gift has already been opened" message

---

## Backend (Lovable Cloud / Supabase)

### Database
- **gifts table**: Names, letter text, promise text, unique link token, viewed status per section (photos, letter, promise)

### Storage
- Secure bucket for uploaded photos (up to 5 per gift)

### Single-Use Logic
- Track which content sections have been viewed
- Delete each piece of content after it's viewed
- Invalidate entire link after all three sections are opened

### Privacy
- No data persists after the gift is fully opened
- Edge function to handle secure deletion

