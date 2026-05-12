# Modern Portfolio Website

A beautiful, responsive portfolio website built with React, Next.js, and Tailwind CSS. All content is dynamically loaded from a JSON file for easy customization.

![Portfolio Preview](https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=600&fit=crop)

## ✨ Features

- 🎨 **Modern Design** - Stunning gradient effects and smooth animations
- 📱 **Fully Responsive** - Perfect on all devices
- ⚡ **Easy to Customize** - Just edit one JSON file
- 🚀 **Fast Performance** - Built with Next.js 15
- 💼 **Professional Sections** - Hero, Skills, Experience, Education, Projects, Contact
- 🔗 **Social Integration** - GitHub, LinkedIn, Twitter links
- 🎯 **SEO Friendly** - Optimized meta tags

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) installed on your system

### Installation

1. **Clone and install dependencies:**
```bash
bun install
```

2. **Customize your portfolio:**
   - Edit `public/portfolio-data.json` with your information
   - Replace image URLs with your own

3. **Run development server:**
```bash
bun run dev
```

4. **Open in browser:**
```
http://localhost:3000
```

## 📝 Customization

### Edit Your Portfolio Data

All portfolio content is in `public/portfolio-data.json`. Simply edit this file to:

- Update personal information
- Add/remove skills
- Update work experience
- Add education history
- Showcase projects
- Update contact information

See `PORTFOLIO_INSTRUCTIONS.md` for detailed customization guide.

### Key Files

- `public/portfolio-data.json` - All your portfolio content
- `src/app/page.tsx` - Main portfolio component
- `src/app/layout.tsx` - Layout and metadata
- `PORTFOLIO_INSTRUCTIONS.md` - Detailed customization guide

## 📦 Project Structure

```
portfolio/
├── public/
│   └── portfolio-data.json    # Your portfolio content
├── src/
│   └── app/
│       ├── page.tsx            # Main portfolio page
│       ├── layout.tsx          # App layout
│       └── globals.css         # Global styles
├── PORTFOLIO_INSTRUCTIONS.md   # Detailed guide
└── README.md                   # This file
```

## 🎨 Sections Included

1. **Hero/Home** - Eye-catching introduction with profile image
2. **About** - Personal bio and introduction
3. **Skills** - Organized by categories (languages, frameworks, tools, design)
4. **Experience** - Work history with achievements
5. **Education** - Academic background and certifications
6. **Projects** - Showcase your work with images and links
7. **Contact** - Multiple ways to get in touch

## 🖼️ Image Guidelines

### Recommended Sizes:
- **Profile Photo**: 400x400px (square)
- **Project Images**: 800x500px (landscape)

### Where to Host:
- [Unsplash](https://unsplash.com) - Free stock photos
- [Imgur](https://imgur.com) - Free image hosting
- Your own server or CDN

## 🌐 Deployment

### Vercel (Recommended)
```bash
# Push to GitHub, then:
# 1. Go to vercel.com
# 2. Import your repository
# 3. Deploy!
```

### Netlify
```bash
# Build command:
bun run build

# Publish directory:
.next
```

### Other Platforms
Compatible with any platform that supports Next.js:
- AWS Amplify
- Railway
- Render
- Digital Ocean

## 🛠️ Scripts

```bash
bun run dev        # Start development server
bun run build      # Build for production
bun run start      # Start production server
bun run lint       # Run ESLint
bun run format     # Format code with Prettier
```

## 📚 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Runtime**: [React 19](https://react.dev)
- **Package Manager**: [Bun](https://bun.sh)

## 🎯 Key Features Explained

### Dynamic Content Loading
- All content loaded from JSON file
- No code changes needed to update content
- Easy to maintain and update

### Smooth Animations
- Fade-in effects on page load
- Hover animations on cards
- Smooth scroll navigation

### Responsive Design
- Mobile-first approach
- Optimized for all screen sizes
- Touch-friendly navigation

### SEO Optimized
- Meta tags for social sharing
- Semantic HTML structure
- Fast loading times

## 🤔 Need Help?

1. Read `PORTFOLIO_INSTRUCTIONS.md` for detailed customization guide
2. Check the example `portfolio-data.json` structure
3. Validate your JSON at [jsonlint.com](https://jsonlint.com)
4. Check browser console (F12) for errors

## 📄 License

This portfolio template is free to use for personal and commercial projects.

## 🙏 Credits

- Built with [Next.js](https://nextjs.org)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Icons from [Heroicons](https://heroicons.com)
- Sample images from [Unsplash](https://unsplash.com)

---

**Made with ❤️ using React, Next.js, and Tailwind CSS**

⭐ Star this repo if you found it helpful!
