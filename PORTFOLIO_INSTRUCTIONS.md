# Portfolio Website - Customization Guide

## Overview

This is a modern, fully responsive portfolio website built with React, Next.js, and Tailwind CSS. All content is loaded dynamically from a JSON file, making it easy to customize without touching any code.

## Features

✨ **Modern Design**: Gradient effects, smooth animations, and a professional color scheme
📱 **Fully Responsive**: Perfect display on mobile, tablet, and desktop devices
🎨 **Easy Customization**: Edit one JSON file to update all content
🚀 **Smooth Navigation**: Smooth scrolling between sections
💼 **Professional Sections**: Hero, About, Skills, Experience, Education, Projects, and Contact
🔗 **Social Integration**: Links to GitHub, LinkedIn, Twitter, and email
🎯 **Project Showcase**: Highlight your best work with images and links

## Quick Start

### 1. Edit Your Portfolio Data

Open `public/portfolio-data.json` and customize all sections with your information.

### 2. Run the Development Server

```bash
bun run dev
```

Your portfolio will be available at `http://localhost:3000`

### 3. Build for Production

```bash
bun run build
bun run start
```

## JSON Structure Guide

### Hero Section

```json
{
  "hero": {
    "name": "Your Name",
    "title": "Your Professional Title",
    "bio": "Brief introduction about yourself",
    "profileImage": "URL to your profile photo",
    "resumeUrl": "URL to your resume PDF (optional)",
    "social": {
      "github": "https://github.com/yourusername",
      "linkedin": "https://linkedin.com/in/yourusername",
      "twitter": "https://twitter.com/yourusername",
      "email": "your.email@example.com"
    }
  }
}
```

**Tips:**
- Use a square image (400x400px or larger) for best results
- Host images on Unsplash, Imgur, or your own server
- All social links are optional - remove any you don't use

### Skills Section

```json
{
  "skills": {
    "languages": ["JavaScript", "Python", "Java"],
    "frameworks": ["React", "Node.js", "Django"],
    "tools": ["Git", "Docker", "AWS"],
    "design": ["Figma", "Tailwind CSS"]
  }
}
```

**Tips:**
- Organize skills into logical categories
- Add or remove categories as needed
- List skills from most proficient to least

### Experience Section

```json
{
  "experience": [
    {
      "company": "Company Name",
      "role": "Your Job Title",
      "duration": "Jan 2022 - Present",
      "location": "City, State/Country",
      "responsibilities": [
        "Key responsibility 1",
        "Key responsibility 2"
      ],
      "achievements": [
        "Major achievement 1",
        "Major achievement 2"
      ],
      "technologies": ["React", "Node.js", "AWS"]
    }
  ]
}
```

**Tips:**
- List most recent experience first
- Use action verbs for responsibilities
- Quantify achievements when possible (e.g., "Improved performance by 40%")
- Add as many positions as you want - just duplicate the structure

### Education Section

```json
{
  "education": [
    {
      "degree": "Bachelor of Science in Computer Science",
      "institution": "University Name",
      "duration": "2015 - 2019",
      "gpa": "3.8/4.0",
      "relevantCourses": [
        "Data Structures",
        "Web Development"
      ],
      "achievements": [
        "Dean's List",
        "Club President"
      ]
    }
  ]
}
```

**Tips:**
- GPA is optional - remove if you prefer not to show it
- relevantCourses and achievements are optional
- For certifications, use a separate entry with "courses" field instead

### Projects Section

```json
{
  "projects": [
    {
      "name": "Project Name",
      "description": "Brief project description explaining what it does",
      "image": "URL to project screenshot",
      "technologies": ["React", "Node.js", "MongoDB"],
      "liveUrl": "https://your-project.com",
      "githubUrl": "https://github.com/you/project",
      "featured": true
    }
  ]
}
```

**Tips:**
- Use landscape images (800x500px or 16:9 ratio) for best results
- Set "featured" to true for your best 3-4 projects
- liveUrl and githubUrl are optional
- Describe what problem the project solves
- List 4-6 projects for optimal display

### Contact Section

```json
{
  "contact": {
    "email": "your.email@example.com",
    "phone": "+1 (555) 123-4567",
    "location": "City, State",
    "availability": "Available for freelance and full-time opportunities",
    "social": {
      "github": "https://github.com/yourusername",
      "linkedin": "https://linkedin.com/in/yourusername",
      "twitter": "https://twitter.com/yourusername"
    }
  }
}
```

**Tips:**
- Phone is optional
- Customize availability message to your situation
- Social links should match your hero section

## Image Guidelines

### Where to Host Images

1. **Unsplash** (free stock photos): `https://unsplash.com`
2. **Imgur** (free image hosting): `https://imgur.com`
3. **GitHub** (if your repo is public): Use raw GitHub URLs
4. **Your own server**: Any publicly accessible URL

### Recommended Image Sizes

- **Profile Photo**: 400x400px (square)
- **Project Screenshots**: 800x500px (landscape, 16:9 ratio)
- **Format**: JPG or PNG
- **Optimization**: Keep file sizes under 500KB for fast loading

### Getting Unsplash URLs

1. Go to unsplash.com and find an image
2. Click the image to open it
3. Right-click and "Copy Image Address"
4. The URL will look like: `https://images.unsplash.com/photo-xxxxx`
5. Add `?w=800&h=500&fit=crop` to crop and resize

Example: `https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=500&fit=crop`

## Customization Tips

### Colors

The portfolio uses a purple-to-pink gradient theme. To change colors:

1. Edit the gradient classes in `src/app/page.tsx`:
   - `from-purple-400 to-pink-400` → Change to your preferred colors
   - `bg-purple-500` → Update to match your theme
   - Search for "purple" and "pink" and replace with your colors

### Fonts

The project uses system fonts by default. To use custom fonts:

1. Add Google Fonts in `src/app/layout.tsx`
2. Update Tailwind classes with your font family

### Adding New Sections

To add a new section:

1. Add data to `portfolio-data.json`
2. Create a new section in `page.tsx` following the existing pattern
3. Add the section ID to the navigation array

### Removing Sections

To remove a section:

1. Delete the section data from `portfolio-data.json`
2. Remove or comment out the section in `page.tsx`
3. Remove from navigation array

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy (it's automatic!)

### Deploy to Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Import your repository
4. Build command: `bun run build`
5. Publish directory: `.next`

### Other Platforms

This is a standard Next.js app and can be deployed to:
- AWS Amplify
- Railway
- Render
- Digital Ocean
- Your own server with Node.js

## Troubleshooting

### Portfolio not loading?

- Check browser console for errors (F12)
- Verify `portfolio-data.json` is valid JSON (use jsonlint.com)
- Ensure all image URLs are accessible

### Images not showing?

- Check if URLs are publicly accessible
- Verify URLs don't have spaces or special characters
- Try opening URLs directly in browser

### Sections look broken?

- Make sure all required fields are present
- Check for missing commas or brackets in JSON
- Ensure arrays are not empty (use at least one item)

### TypeScript errors?

- Run `bun run build` to check for type errors
- Make sure all required fields match the interface

## Support

If you need help:

1. Check this guide thoroughly
2. Validate your JSON at [jsonlint.com](https://jsonlint.com)
3. Check browser console for specific errors
4. Review the example `portfolio-data.json` structure

## License

This portfolio template is free to use for personal and commercial projects.

---

**Made with ❤️ using React, Next.js, and Tailwind CSS**
