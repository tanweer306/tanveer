// Fallback portfolio data - used if JSON file fails to load
// You can still edit public/portfolio-data.json - this is just a backup

export const fallbackData = {
  hero: {
    name: "Alex Johnson",
    title: "Full Stack Developer & UI/UX Enthusiast",
    bio: "Passionate software developer with 5+ years of experience building scalable web applications. I specialize in React, Node.js, and cloud technologies. I love turning complex problems into simple, beautiful, and intuitive designs.",
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    resumeUrl: "https://example.com/resume.pdf",
    social: {
      github: "https://github.com/alexjohnson",
      linkedin: "https://linkedin.com/in/alexjohnson",
      twitter: "https://twitter.com/alexjohnson",
      email: "alex.johnson@example.com",
    },
  },
  skills: {
    languages: ["JavaScript/TypeScript", "Python", "Java", "Go", "SQL"],

    frameworks: [
      "React",
      "Next.js",
      "Node.js",
      "Express",
      "Django",
      "Spring Boot",
    ],

    tools: [
      "Git",
      "Docker",
      "Kubernetes",
      "AWS",
      "PostgreSQL",
      "MongoDB",
      "Redis",
    ],

    design: [
      "Figma",
      "Adobe XD",
      "Tailwind CSS",
      "Material-UI",
      "Framer Motion",
    ],
  },
  experience: [
    {
      company: "TechCorp Solutions",
      role: "Senior Full Stack Developer",
      duration: "Jan 2022 - Present",
      location: "San Francisco, CA",
      responsibilities: [
        "Led development of a microservices architecture serving 1M+ users",
        "Mentored junior developers and conducted code reviews",
        "Improved application performance by 40% through optimization",
      ],

      achievements: [
        "Reduced deployment time by 60% by implementing CI/CD pipeline",
        "Architected real-time notification system handling 100K concurrent users",
      ],

      technologies: ["React", "Node.js", "AWS", "PostgreSQL", "Redis"],
    },
    {
      company: "StartupX",
      role: "Full Stack Developer",
      duration: "Jun 2020 - Dec 2021",
      location: "Remote",
      responsibilities: [
        "Built responsive web applications from scratch",
        "Collaborated with designers to implement pixel-perfect UIs",
        "Integrated third-party APIs and payment systems",
      ],

      achievements: [
        "Developed MVP that secured $2M in seed funding",
        "Created reusable component library used across 5 projects",
      ],

      technologies: ["React", "Django", "PostgreSQL", "Stripe API"],
    },
    {
      company: "Digital Agency Inc",
      role: "Junior Developer",
      duration: "Jan 2019 - May 2020",
      location: "New York, NY",
      responsibilities: [
        "Developed client websites using modern web technologies",
        "Fixed bugs and implemented new features",
        "Participated in agile development processes",
      ],

      achievements: [
        "Delivered 15+ client projects on time and within budget",
        "Improved site performance scores to 90+ on Google Lighthouse",
      ],

      technologies: ["JavaScript", "React", "WordPress", "PHP"],
    },
  ],

  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "University of California, Berkeley",
      duration: "2015 - 2019",
      gpa: "3.8/4.0",
      relevantCourses: [
        "Data Structures & Algorithms",
        "Web Development",
        "Database Systems",
        "Software Engineering",
        "Machine Learning",
      ],

      achievements: [
        "Dean's List all semesters",
        "President of Computer Science Club",
      ],
    },
    {
      degree: "Online Certifications",
      institution: "Various Platforms",
      duration: "2019 - Present",
      courses: [
        "AWS Certified Solutions Architect",
        "Google Cloud Professional Developer",
        "Advanced React Patterns (Kent C. Dodds)",
      ],
    },
  ],

  projects: [
    {
      name: "TaskFlow Pro",
      description:
        "A modern project management tool with real-time collaboration features. Built with React, Node.js, and WebSockets to enable seamless team coordination.",
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=500&fit=crop",
      technologies: ["React", "Node.js", "Socket.io", "MongoDB", "AWS"],
      liveUrl: "https://taskflow-demo.com",
      githubUrl: "https://github.com/alexjohnson/taskflow-pro",
      featured: true,
    },
    {
      name: "AI Content Generator",
      description:
        "An AI-powered content creation platform that helps marketers generate blog posts, social media content, and marketing copy using GPT-4.",
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop",
      technologies: ["Next.js", "OpenAI API", "Tailwind CSS", "PostgreSQL"],
      liveUrl: "https://ai-content-demo.com",
      githubUrl: "https://github.com/alexjohnson/ai-content-generator",
      featured: true,
    },
    {
      name: "E-Commerce Dashboard",
      description:
        "A comprehensive analytics dashboard for e-commerce stores with real-time metrics, sales tracking, and inventory management.",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
      technologies: ["React", "TypeScript", "Chart.js", "Express", "Redis"],
      liveUrl: "https://ecommerce-dashboard-demo.com",
      githubUrl: "https://github.com/alexjohnson/ecommerce-dashboard",
      featured: true,
    },
    {
      name: "Weather Forecast App",
      description:
        "A beautiful weather application with location-based forecasts, interactive maps, and detailed weather metrics.",
      image:
        "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&h=500&fit=crop",
      technologies: ["React Native", "OpenWeather API", "Redux", "Maps API"],
      githubUrl: "https://github.com/alexjohnson/weather-app",
      featured: false,
    },
    {
      name: "Social Media Scheduler",
      description:
        "Automate your social media posts across multiple platforms with scheduling, analytics, and content management features.",
      image:
        "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=500&fit=crop",
      technologies: ["Vue.js", "Node.js", "Twitter API", "Facebook API"],
      liveUrl: "https://social-scheduler-demo.com",
      featured: false,
    },
    {
      name: "Fitness Tracker",
      description:
        "Track your workouts, nutrition, and fitness goals with this comprehensive health and fitness application.",
      image:
        "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=500&fit=crop",
      technologies: ["React Native", "Firebase", "HealthKit API"],
      githubUrl: "https://github.com/alexjohnson/fitness-tracker",
      featured: false,
    },
  ],

  contact: {
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    availability:
      "Available for freelance projects and full-time opportunities",
    social: {
      github: "https://github.com/alexjohnson",
      linkedin: "https://linkedin.com/in/alexjohnson",
      twitter: "https://twitter.com/alexjohnson",
    },
  },
};
