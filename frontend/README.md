# Frontend

This is the frontend application for Scientism Poetry.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

## Project Structure

```
frontend/
├── public/
│   ├── images/              # Public images
│   │   ├── hero-bg.jpg     # Homepage hero background
│   │   ├── book-cover.jpg  # Featured book cover
│   │   ├── community.jpg   # Community feature image
│   │   ├── workshops.jpg   # Workshops feature image
│   │   ├── publish.jpg     # Publish feature image
│   │   └── science-poetry.jpg  # About page image
│   ├── static/
│   │   └── images/
│   │       └── avatar/     # User avatar images
│   └── locales/           # Translation files
│       ├── en/
│       └── zh/
├── src/
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   └── utils/
```

## Image Requirements

The following images are required for the application:

### Homepage Images

1. `/images/hero-bg.jpg`
   - Used as: Hero section background
   - Recommended size: 1920x1080px
   - Content: Science and poetry themed background with dark overlay
   - Note: Should work well with white text overlay

2. `/images/book-cover.jpg`
   - Used in: Featured book section
   - Recommended size: 800x1200px
   - Content: "The Quantum Verses" book cover

3. `/images/community.jpg`
   - Used in: Community feature card
   - Recommended size: 600x400px
   - Content: Community/collaboration themed image

4. `/images/workshops.jpg`
   - Used in: Workshops feature card
   - Recommended size: 600x400px
   - Content: Workshop/learning themed image

5. `/images/publish.jpg`
   - Used in: Publish feature card
   - Recommended size: 600x400px
   - Content: Publishing/writing themed image

### About Page Images

6. `/images/science-poetry.jpg`
   - Used on: About page
   - Recommended size: 1200x600px
   - Content: Science and poetry themed image

### User Images

7. `/static/images/avatar/*.jpg`
   - Used for: User avatars
   - Recommended size: 150x150px
   - Format: Square images

## Development Notes

- Images in `/public` are served as static assets
- Use relative paths starting with `/` for image src attributes
- Optimize images before deployment to reduce load times
- Consider using WebP format with JPG fallback for better performance
- Ensure images have good contrast for text overlays where applicable
