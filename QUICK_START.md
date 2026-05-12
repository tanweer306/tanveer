# Quick Start Guide - 5 Minutes to Your Portfolio! ⚡

Follow these simple steps to have your portfolio running in 5 minutes.

## Step 1: Edit Your Information (2 minutes)

Open `public/portfolio-data.json` and replace the example data with yours:

### 🎯 Priority 1 - Essential Info (Must Update)
```json
{
  "hero": {
    "name": "YOUR NAME HERE",
    "title": "YOUR TITLE HERE", 
    "email": "your.email@example.com"
  }
}
```

### 📸 Priority 2 - Your Photo (Recommended)
Replace the profile image URL with your photo:
- Use a photo hosting service like [Imgur](https://imgur.com)
- Or use your LinkedIn profile photo URL
- Or use a placeholder from [Unsplash](https://unsplash.com)

### 💼 Priority 3 - Projects (Important)
Add at least 2-3 of your best projects in the `projects` array.

## Step 2: Run the Portfolio (1 minute)

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 3: Customize Further (2 minutes)

Now that it's running, take time to:
- ✅ Add your skills
- ✅ Add work experience  
- ✅ Add education
- ✅ Update social media links
- ✅ Add more projects

## 🎨 Don't Have Images Yet?

Use these free resources for placeholder images:

**For Profile Photo:**
- Use your existing LinkedIn photo
- Use [This Person Does Not Exist](https://thispersondoesnotexist.com)
- Take a quick photo with good lighting

**For Project Screenshots:**
- Use [Unsplash](https://unsplash.com/s/photos/website) - Search "website", "app", "code"
- Take screenshots of your actual projects
- Use [Placeholder.com](https://placeholder.com) temporarily

**Quick Unsplash URLs:**
```
Profile: https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop
Projects: https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=500&fit=crop
```

## 🚀 Quick Deployment (5 minutes)

Once you're happy with it locally:

### Deploy to Vercel (Easiest)
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repo
5. Click "Deploy" - Done! 🎉

### Deploy to Netlify
1. Push code to GitHub  
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Select your repo
5. Deploy - Done! 🎉

## ✨ Customization Tips

### Change Colors
Search for `purple` and `pink` in `src/app/page.tsx` and replace with your preferred colors:
- `purple-400` → `blue-400`
- `pink-400` → `green-400`

### Remove Sections You Don't Need
Just delete that section's data from `portfolio-data.json`.

### Add More Sections
Copy an existing section structure and modify it.

## 🆘 Common Issues

**Portfolio shows "Failed to load"?**
→ Check your JSON file for syntax errors at [jsonlint.com](https://jsonlint.com)

**Images not showing?**
→ Make sure image URLs are publicly accessible (try opening them in a new tab)

**Styles look broken?**
→ Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)

## 📚 Need More Help?

- Read `PORTFOLIO_INSTRUCTIONS.md` for detailed guide
- Check `README.md` for technical documentation  
- Look at `public/portfolio-data-template.json` for structure reference

## 🎯 Next Steps

Once your portfolio is live:

1. ✅ Share it on LinkedIn, Twitter
2. ✅ Add the link to your resume  
3. ✅ Use it in job applications
4. ✅ Keep it updated with new projects
5. ✅ Gather feedback and iterate

---

**You've got this! 🚀 Your portfolio will look amazing!**

Need help? Check the other documentation files or validate your JSON at jsonlint.com.
