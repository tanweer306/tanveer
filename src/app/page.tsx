"use client";

import { useState, useEffect } from "react";
import { fallbackData } from "./portfolioData";
import { useTheme } from "./ThemeProvider";

/**
 * Portfolio Data Structure
 *
 * This component loads portfolio data from /portfolio-data.json
 *
 * JSON Structure:
 * {
 *   hero: { name, title, bio, profileImage, resumeUrl, social: { github, linkedin, twitter, email } }
 *   skills: { languages: [], frameworks: [], tools: [], design: [] }
 *   experience: [{ company, role, duration, location, responsibilities: [], achievements: [], technologies: [] }]
 *   education: [{ degree, institution, duration, gpa?, relevantCourses?: [], achievements?: [] }]
 *   projects: [{ name, description, image, technologies: [], liveUrl?, githubUrl?, featured: boolean }]
 *   contact: { email, phone, location, availability, social: {} }
 * }
 *
 * To customize your portfolio:
 * 1. Edit /public/portfolio-data.json
 * 2. Replace URLs with your own images (use Unsplash, Imgur, or your own hosting)
 * 3. Add/remove entries from arrays (projects, experience, etc.)
 * 4. All fields are optional except for the main structure
 */

interface PortfolioData {
  hero: {
    name: string;
    title: string;
    bio: string;
    aboutMe?: string;
    recommendationImage?: string;
    profileImage: string;
    resumeUrl?: string;
    social: {
      github?: string;
      linkedin?: string;
      twitter?: string;
      email?: string;
    };
  };
  skills: {
    languages: string[];
    frameworks: string[];
    tools: string[];
    design: string[];
  };
  experience: Array<{
    company: string;
    role: string;
    duration: string;
    location: string;
    responsibilities: string[];
    achievements: string[];
    technologies: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    duration: string;
    gpa?: string;
    relevantCourses?: string[];
    achievements?: string[];
    courses?: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    image: string;
    technologies: string[];
    liveUrl?: string;
    githubUrl?: string;
    featured: boolean;
  }>;
  contact: {
    email: string;
    phone?: string;
    location: string;
    availability: string;
    social: {
      github?: string;
      linkedin?: string;
      twitter?: string;
    };
  };
}

export default function Page() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("home");
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let cancelled = false;

    // Fetch portfolio data
    const loadData = async () => {
      try {
        console.log("Fetching portfolio data from /portfolio-data.json...");

        // Set a timeout to detect if loading takes too long
        timeoutId = setTimeout(() => {
          if (!cancelled) {
            console.error("Fetch timeout after 10 seconds");
            console.warn("Using fallback data due to timeout");
            setData(fallbackData as PortfolioData);
            setLoading(false);
          }
        }, 10000);

        const res = await fetch("/portfolio-data.json", {
          cache: "no-store",
        });

        clearTimeout(timeoutId);

        if (cancelled) return;

        if (!res.ok) {
          throw new Error(
            `Failed to load portfolio data: ${res.status} ${res.statusText}`,
          );
        }

        const jsonData = await res.json();
        console.log("Portfolio data loaded successfully!", jsonData);
        setData(jsonData);
        setLoading(false);
      } catch (err) {
        if (timeoutId) clearTimeout(timeoutId);
        if (cancelled) return;
        console.error("Error loading portfolio data:", err);
        console.warn("Using fallback data instead");
        // Use fallback data instead of showing error
        setData(fallbackData as PortfolioData);
        setLoading(false);
        // setError(err instanceof Error ? err.message : "Unknown error");
      }
    };

    loadData();

    // Handle scroll for active section
    const handleScroll = () => {
      const sections = [
        "home",
        "about",
        "skills",
        "experience",
        "education",
        "projects",
        "contact",
      ];

      const scrollPos = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-white dark:via-gray-50 dark:to-white">
        <div className="text-center" data-oid="8arsxp:">
          <div
            className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mb-4"
            data-oid="9uiedgv"
          ></div>
          <p className="text-white dark:text-slate-900 text-xl" data-oid="9m-v8nm">
            Loading Portfolio...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-white dark:via-gray-50 dark:to-white">
        <div className="text-center text-white dark:text-slate-900 p-8" data-oid="zve2-04">
          <h1 className="text-4xl font-bold mb-4" data-oid="n8mcjan">
            ⚠️ Error
          </h1>
          <p className="text-xl" data-oid="7i1i5pc">
            Failed to load portfolio data
          </p>
          <p className="text-gray-400 mt-2" data-oid="i-q7o5y">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 min-h-screen" data-oid="kb:k3vb">
      {/* Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 bg-slate-900/95 dark:bg-white/95 backdrop-blur-sm z-50 border-b border-slate-800 dark:border-gray-200"
        data-oid="zhb:5u7"
      >
        <div className="container mx-auto px-6 py-4" data-oid="2n808a4">
          <div className="flex justify-between items-center" data-oid="_br:-:l">
            <div
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent"
              data-oid="1qhxc8a"
            >
              {data.hero.name}
            </div>
            <div className="flex items-center gap-4" data-oid="n:zq8lp">
              <div className="hidden md:flex space-x-8" data-oid="n:zq8lp">
              {[
                "home",
                "about",
                "skills",
                "experience",
                "education",
                "projects",
                "contact",
              ].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`capitalize hover:text-blue-600 transition-colors ${
                    activeSection === section
                      ? "text-blue-600"
                      : "text-gray-300 dark:text-gray-700"
                  }`}
                  data-oid="jh7ve8b"
                >
                  {section}
                </button>
              ))}
              </div>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-slate-800 dark:bg-gray-200 hover:bg-slate-700 dark:hover:bg-gray-300 transition-colors"
                aria-label="Toggle theme"
                data-oid="theme-toggle"
              >
                {theme === "dark" ? (
                  <svg className="w-5 h-5 text-yellow-400 dark:text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20"
        data-oid="xujcqpn"
      >
        <div
          className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-white dark:via-gray-50 dark:to-white"
          data-oid="hx8p43z"
        ></div>
        <div className="absolute inset-0 opacity-20" data-oid="3fg89qe">
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse"
            data-oid="m:evwcv"
          ></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl animate-pulse delay-1000"
            data-oid="b7whoeh"
          ></div>
        </div>

        <div
          className="container mx-auto px-6 relative z-10"
          data-oid="x2833mz"
        >
          <div
            className="flex flex-col md:flex-row items-center justify-between gap-12"
            data-oid="pfba99w"
          >
            <div className="flex-1 text-center md:text-left" data-oid="d_gmw0f">
              <h1
                className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in"
                data-oid="-pw7pzd"
              >
                Hi, I'm{" "}
                <span
                  className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent"
                  data-oid="b-q3qqf"
                >
                  {data.hero.name}
                </span>
              </h1>
              <p
                className="text-2xl md:text-3xl text-gray-300 dark:text-gray-600 mb-6 animate-fade-in-delay-1"
                data-oid="b.myjh5"
              >
                {data.hero.title}
              </p>
              <p
                className="text-lg text-gray-400 dark:text-gray-500 mb-8 max-w-2xl animate-fade-in-delay-2"
                data-oid="j7sq-ze"
              >
                {data.hero.bio}
              </p>
              <div
                className="flex gap-4 justify-center md:justify-start mb-8 animate-fade-in-delay-3"
                data-oid="g.ir._t"
              >
                {data.hero.social.github && (
                  <a
                    href={data.hero.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-800 dark:bg-gray-200 hover:bg-blue-600 dark:hover:bg-blue-500 p-3 rounded-full transition-all transform hover:scale-110"
                    data-oid="ct22biy"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      data-oid="k9nw:zg"
                    >
                      <path
                        d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
                        data-oid="wlz524z"
                      />
                    </svg>
                  </a>
                )}
                {data.hero.social.linkedin && (
                  <a
                    href={data.hero.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-800 dark:bg-gray-200 hover:bg-blue-600 dark:hover:bg-blue-500 p-3 rounded-full transition-all transform hover:scale-110"
                    data-oid="0p1_tza"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      data-oid="kx2ab11"
                    >
                      <path
                        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                        data-oid="6mhb21:"
                      />
                    </svg>
                  </a>
                )}
                {data.hero.social.twitter && (
                  <a
                    href={data.hero.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-800 dark:bg-gray-200 hover:bg-blue-600 dark:hover:bg-blue-500 p-3 rounded-full transition-all transform hover:scale-110"
                    data-oid="urrxn3j"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      data-oid="32.84no"
                    >
                      <path
                        d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                        data-oid="rup:f9r"
                      />
                    </svg>
                  </a>
                )}
                {data.hero.social.email && (
                  <a
                    href={`mailto:${data.hero.social.email}`}
                    className="bg-slate-800 dark:bg-gray-200 hover:bg-blue-600 dark:hover:bg-blue-500 p-3 rounded-full transition-all transform hover:scale-110"
                    data-oid="oi2sfyn"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      data-oid="xu0fdln"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        data-oid="qojniw8"
                      />
                    </svg>
                  </a>
                )}
              </div>
              <div
                className="flex gap-4 justify-center md:justify-start animate-fade-in-delay-4"
                data-oid="ufa8116"
              >
                <button
                  onClick={() => scrollToSection("contact")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all transform hover:scale-105"
                  data-oid="0her8ip"
                >
                  Get In Touch
                </button>
                {data.hero.resumeUrl && (
                  <a
                    href={data.hero.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700 px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105"
                    data-oid="i42org4"
                  >
                    Download Resume
                  </a>
                )}
              </div>
            </div>
            <div
              className="flex-shrink-0 animate-fade-in-delay-2"
              data-oid="6z:itog"
            >
              <div className="relative" data-oid="g:8ar8y">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full blur-2xl opacity-50 animate-pulse"
                  data-oid=":_sy4j9"
                ></div>
                <img
                  src={data.hero.profileImage}
                  alt={data.hero.name}
                  className="relative w-64 h-64 md:w-80 md:h-80 rounded-full object-cover border-4 border-black shadow-2xl"
                  data-oid="l84ufcv"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-slate-800 dark:bg-gray-100" data-oid="dxdx_rc">
        <div className="container mx-auto px-6" data-oid="xdd83j.">
          <h2
            className="text-4xl md:text-5xl font-bold mb-12 text-center text-white dark:text-slate-900"
            data-oid="51yc5sd"
          >
            About{" "}
            <span
              className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent dark:from-blue-600 dark:to-blue-500"
              data-oid="ra:482v"
            >
              Me
            </span>
          </h2>
          <div className="max-w-4xl mx-auto" data-oid="-piasn4">
            <p
              className="text-xl text-gray-300 dark:text-gray-600 leading-relaxed mb-12"
              data-oid="94lcqga"
            >
              {data.hero.aboutMe || data.hero.bio}
            </p>
            {data.hero.recommendationImage && (
              <div className="mt-12">
                <img
                  src={data.hero.recommendationImage}
                  alt="LinkedIn Recommendation"
                  className="w-full rounded-lg shadow-lg border border-slate-700 dark:border-gray-300"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 bg-slate-900 dark:bg-white" data-oid="ina-9vi">
        <div className="container mx-auto px-6" data-oid="10ebw3:">
          <h2
            className="text-4xl md:text-5xl font-bold mb-12 text-center text-white dark:text-slate-900"
            data-oid="gp7pn7t"
          >
            Skills &{" "}
            <span
              className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent dark:from-blue-600 dark:to-blue-500"
              data-oid="jjno3ht"
            >
              Expertise
            </span>
          </h2>
          <div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            data-oid="pq98dbu"
          >
            {Object.entries(data.skills).map(([category, items]) => (
              <div
                key={category}
                className="bg-slate-800 dark:bg-white dark:border dark:border-gray-200 rounded-xl p-6 shadow-sm shadow-slate-950/10 dark:shadow-slate-900/10 hover:shadow-xl hover:shadow-slate-900/20 dark:hover:shadow-slate-500/30 transition-all transform hover:-translate-y-2"
                data-oid="wryqk6c"
              >
                <h3
                  className="text-2xl font-semibold mb-4 capitalize text-blue-600 dark:text-blue-600"
                  data-oid="4vormyz"
                >
                  {category}
                </h3>
                <ul className="space-y-2" data-oid="30iegry">
                  {items.map((skill, idx) => (
                    <li
                      key={idx}
                      className="flex items-center text-gray-300 dark:text-gray-700"
                      data-oid="c.r.qui"
                    >
                      <svg
                        className="w-5 h-5 mr-2 text-black dark:text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        data-oid="8blpcnu"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                          data-oid="o6_dk28"
                        />
                      </svg>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section
        id="experience"
        className="py-20 bg-slate-800 dark:bg-gray-100"
        data-oid="m06ze3x"
      >
        <div className="container mx-auto px-6" data-oid="9j.15-o">
          <h2
            className="text-4xl md:text-5xl font-bold mb-12 text-center text-white dark:text-slate-900"
            data-oid="-s4_9du"
          >
            Work{" "}
            <span
              className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent dark:from-blue-600 dark:to-blue-500"
              data-oid="ih-zb2j"
            >
              Experience
            </span>
          </h2>
          <div className="max-w-4xl mx-auto space-y-8" data-oid="x6ovqzd">
            {data.experience.map((exp, idx) => (
              <div
                key={idx}
                className="bg-slate-900 dark:bg-gray-50 dark:border dark:border-gray-300 rounded-xl p-8 shadow-sm shadow-slate-950/10 dark:shadow-slate-900/10 hover:shadow-xl hover:shadow-slate-900/20 dark:hover:shadow-slate-500/30 transition-all"
                data-oid="5v1pewu"
              >
                <div
                  className="flex flex-col md:flex-row md:justify-between md:items-start mb-4"
                  data-oid="h3b63e:"
                >
                  <div data-oid="cev-zp6">
                    <h3
                      className="text-2xl font-bold text-white dark:text-gray-900"
                      data-oid="pdy4j:4"
                    >
                      {exp.role}
                    </h3>
                    <p className="text-gray-300 dark:text-gray-700" data-oid="qe-qh5j">
                      {exp.company}
                    </p>
                  </div>
                  <div
                    className="text-gray-400 dark:text-gray-500 mt-2 md:mt-0 text-right"
                    data-oid="xus2nxn"
                  >
                    <p data-oid="z.gynou">{exp.duration}</p>
                    <p data-oid="5-vea1h">{exp.location}</p>
                  </div>
                </div>
                <div className="mb-4" data-oid="fsvgxds">
                  <h4
                    className="font-semibold text-grey mb-2"
                    data-oid="evr8cly"
                  >
                    Responsibilities:
                  </h4>
                  <ul
                    className="list-disc list-inside space-y-1 text-gray-400 dark:text-gray-600"
                    data-oid="nca4vqd"
                  >
                    {exp.responsibilities.map((resp, i) => (
                      <li key={i} data-oid=".desgs2">
                        {resp}
                      </li>
                    ))}
                  </ul>
                </div>
                {exp.achievements.length > 0 && (
                  <div className="mb-4" data-oid="6-qg9cn">
                    <h4
                      className="font-semibold text-gray-300 dark:text-gray-600 mb-2"
                      data-oid="6z5r.wz"
                    >
                      Key Achievements:
                    </h4>
                    <ul
                      className="list-disc list-inside space-y-1 text-gray-400 dark:text-gray-600"
                      data-oid="vogtas5"
                    >
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} data-oid="nt:e.n2">
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mt-4" data-oid="7ok-yx9">
                  {exp.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm font-medium"
                      data-oid="-4vw_f8"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-20 bg-slate-900 dark:bg-white" data-oid="xvq4fp7">
        <div className="container mx-auto px-6" data-oid="xil:ykr">
          <h2
            className="text-4xl md:text-5xl font-bold mb-12 text-center text-white dark:text-slate-900"
            data-oid="bn.ht9q"
          >
            <span
              className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent dark:from-blue-600 dark:to-blue-500"
              data-oid=":agkf6g"
            >
              Education
            </span>
          </h2>
          <div className="max-w-4xl mx-auto space-y-8" data-oid="y3l6uu3">
            {data.education.map((edu, idx) => (
              <div
                key={idx}
                className="bg-slate-800 dark:bg-gray-50 dark:border dark:border-gray-300 rounded-xl p-8 shadow-sm shadow-slate-950/10 dark:shadow-slate-900/10 hover:shadow-xl hover:shadow-slate-900/20 dark:hover:shadow-slate-500/30 transition-all"
                data-oid="ynrc0_g"
              >
                <div
                  className="flex flex-col md:flex-row md:justify-between md:items-start mb-4"
                  data-oid="i8-0iao"
                >
                  <div data-oid="07t087q">
                    <h3
                      className="text-2xl font-bold text-white dark:text-gray-900"
                      data-oid="y6-.zlx"
                    >
                      {edu.degree}
                    </h3>
                    <p className="text-xl text-gray-300 dark:text-gray-700" data-oid="6lk97fo">
                      {edu.institution}
                    </p>
                  </div>
                  <div
                    className="text-gray-400 dark:text-gray-500 mt-2 md:mt-0 text-right"
                    data-oid="y3g19wt"
                  >
                    <p data-oid="y-n6y9x">{edu.duration}</p>
                    {edu.gpa && (
                      <p className="text-blue-600 dark:text-blue-600" data-oid="m2o0j9t">
                        GPA: {edu.gpa}
                      </p>
                    )}
                  </div>
                </div>
                {edu.relevantCourses && edu.relevantCourses.length > 0 && (
                  <div className="mb-4" data-oid="oads5qi">
                    <h4
                      className="font-semibold text-gray-300 dark:text-gray-600 mb-2"
                      data-oid="0-jz7rt"
                    >
                      Relevant Courses:
                    </h4>
                    <div className="flex flex-wrap gap-2" data-oid="bm_ajuo">
                      {edu.relevantCourses.map((course, i) => (
                        <span
                          key={i}
                      className="bg-gray-700 text-white dark:bg-gray-100 dark:text-gray-700 px-3 py-1 rounded-full text-sm"
                          data-oid="j9p26ku"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {edu.courses && edu.courses.length > 0 && (
                  <div className="mb-4" data-oid="ejou75w">
                    <h4
                      className="font-semibold text-gray-300 dark:text-gray-600 mb-2"
                      data-oid="d7zwwd4"
                    >
                      Certifications:
                    </h4>
                    <ul
                      className="list-disc list-inside space-y-1 text-gray-400 dark:text-gray-600"
                      data-oid="e42.uwg"
                    >
                      {edu.courses.map((course, i) => (
                        <li key={i} data-oid="19fujtl">
                          {course}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {edu.achievements && edu.achievements.length > 0 && (
                  <div data-oid="mqeg:74">
                    <h4
                      className="font-semibold text-gray-300 dark:text-gray-600 mb-2"
                      data-oid="dbxpszh"
                    >
                      Achievements:
                    </h4>
                    <ul
                      className="list-disc list-inside space-y-1 text-gray-400 dark:text-gray-600"
                      data-oid="bv-9m5_"
                    >
                      {edu.achievements.map((achievement, i) => (
                        <li key={i} data-oid="4fxe13i">
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-slate-800 dark:bg-gray-100" data-oid="czkd7qj">
        <div className="container mx-auto px-6" data-oid="mqhqo5_">
          <h2
            className="text-4xl md:text-5xl font-bold mb-12 text-center text-white dark:text-slate-900"
            data-oid="6hxrx2m"
          >
            Featured{" "}
            <span
              className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent dark:from-blue-600 dark:to-blue-500"
              data-oid="kw6t5_-"
            >
              Projects
            </span>
          </h2>
          <div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            data-oid=".q:e_j_"
          >
            {data.projects.map((project, idx) => (
              <div
                key={idx}
                className="bg-slate-900 dark:bg-gray-50 dark:border dark:border-gray-300 rounded-xl overflow-hidden shadow-sm shadow-slate-950/10 dark:shadow-slate-900/10 hover:shadow-xl hover:shadow-slate-900/20 dark:hover:shadow-slate-500/30 transition-all transform hover:-translate-y-2 group"
                data-oid="g1k_6ql"
              >
                <div
                  className="relative overflow-hidden h-48"
                  data-oid="zgwpvwu"
                >
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    data-oid="jgw51eg"
                  />

                  {project.featured && (
                    <div
                      className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold"
                      data-oid="_mowu7u"
                    >
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-6" data-oid="blszf-f">
                  <h3
                    className="text-2xl font-bold mb-2 text-blue-400 dark:text-blue-600"
                    data-oid="p2ahzxw"
                  >
                    {project.name}
                  </h3>
                  <p className="text-gray-400 dark:text-gray-600 mb-4" data-oid="9ec-4qc">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4" data-oid="jlqhbhi">
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="dark:bg-gray-100 dark:text-gray-700 bg-gray-200 text-black px-2 py-1 rounded text-sm"
                        data-oid="q3pers:"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4" data-oid="2:prfs-">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-400 hover:text-blue-300 dark:text-blue-600 dark:hover:text-blue-700 transition-colors"
                        data-oid="d18r_t5"
                      >
                        <svg
                          className="w-5 h-5 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          data-oid="g3tgab:"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            data-oid="jq5xbmw"
                          />
                        </svg>
                        Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-400 hover:text-blue-300 dark:text-blue-600 dark:hover:text-blue-700 transition-colors"
                        data-oid="lx2k30d"
                      >
                        <svg
                          className="w-5 h-5 mr-1"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          data-oid="w1st8by"
                        >
                          <path
                            d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
                            data-oid="xptimf_"
                          />
                        </svg>
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-slate-900 dark:bg-white" data-oid=".k0b7i6">
        <div className="container mx-auto px-6" data-oid="o_ke.og">
          <h2
            className="text-4xl md:text-5xl font-bold mb-12 text-center text-white dark:text-slate-900"
            data-oid="kly5rp0"
          >
            Get In{" "}
            <span
              className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent dark:from-blue-600 dark:to-blue-500"
              data-oid="0xam-x:"
            >
              Touch
            </span>
          </h2>
          <div className="max-w-4xl mx-auto" data-oid="jgj19pq">
            <div
              className="bg-slate-800 dark:bg-white dark:border dark:border-gray-200 rounded-xl p-8 md:p-12 shadow-sm shadow-slate-950/10 dark:shadow-slate-900/10"
              data-oid="gkoyxsb"
            >
              <p
                className="text-xl text-gray-300 dark:text-gray-600 mb-8 text-center"
                data-oid="ksv6az3"
              >
                {data.contact.availability}
              </p>
              <div
                className="grid md:grid-cols-2 gap-8 mb-8"
                data-oid="f9k90il"
              >
                <div className="flex items-center" data-oid="390vnl4">
                  <div
                    className="bg-blue-600/10 p-4 rounded-full mr-4"
                    data-oid="-lfw7n9"
                  >
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      data-oid="2jy:ore"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        data-oid="jjs4shh"
                      />
                    </svg>
                  </div>
                  <div data-oid="c.s9e.s">
                    <p className="text-gray-400 dark:text-gray-500 text-sm" data-oid="xza4t6y">
                      Email
                    </p>
                    <a
                      href={`mailto:${data.contact.email}`}
                      className="text-black hover:text-gray-700 dark:text-blue-600 dark:hover:text-blue-700"
                      data-oid="m.7-72-"
                    >
                      {data.contact.email}
                    </a>
                  </div>
                </div>
                {data.contact.phone && (
                  <div className="flex items-center" data-oid="hse_mrn">
                  <div
                    className="bg-blue-600/10 p-4 rounded-full mr-4"
                    data-oid="0zhsm4o"
                  >
                    <svg
                      className="w-6 h-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="b0ua1s2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          data-oid="vbo3_ch"
                        />
                      </svg>
                    </div>
                    <div data-oid=".-l7rnv">
                      <p className="text-gray-400 text-sm" data-oid="w1qsylc">
                        Phone
                      </p>
                      <a
                        href={`tel:${data.contact.phone}`}
                        className="text-black hover:text-gray-700 dark:text-blue-600 dark:hover:text-blue-700"
                        data-oid="f1.wb:i"
                      >
                        {data.contact.phone}
                      </a>
                    </div>
                  </div>
                )}
                <div className="flex items-center" data-oid="vmq9gwl">
                  <div
                    className="bg-blue-600/10 p-4 rounded-full mr-4"
                    data-oid="mk433n4"
                  >
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      data-oid="cgdgc-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        data-oid="k8.8im:"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        data-oid="b5kh204"
                      />
                    </svg>
                  </div>
                  <div data-oid="ilhkkxj">
                    <p className="text-gray-400 text-sm" data-oid="77k0.zd">
                      Location
                    </p>
                    <p className="text-gray-300 dark:text-gray-700" data-oid="0v3by42">
                      {data.contact.location}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="flex justify-center gap-4 pt-8 border-t border-slate-700 dark:border-gray-300"
                data-oid="7fz9z-r"
              >
                {data.contact.social.github && (
                  <a
                    href={data.contact.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-700 dark:bg-gray-200 hover:bg-black dark:hover:bg-gray-300 p-4 rounded-full transition-all transform hover:scale-110"
                    data-oid="gsvs:2z"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      data-oid="pfbgv-p"
                    >
                      <path
                        d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
                        data-oid="i_spgoa"
                      />
                    </svg>
                  </a>
                )}
                {data.contact.social.linkedin && (
                  <a
                    href={data.contact.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-700 dark:bg-gray-200 hover:bg-black dark:hover:bg-gray-300 p-4 rounded-full transition-all transform hover:scale-110"
                    data-oid="391aqx4"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      data-oid="p.m0-1d"
                    >
                      <path
                        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                        data-oid="wjykv:u"
                      />
                    </svg>
                  </a>
                )}
                {data.contact.social.twitter && (
                  <a
                    href={data.contact.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-700 dark:bg-gray-200 hover:bg-black dark:hover:bg-gray-300 p-4 rounded-full transition-all transform hover:scale-110"
                    data-oid="4_f9_0o"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      data-oid="i3s.moc"
                    >
                      <path
                        d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                        data-oid="extk1ao"
                      />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="bg-slate-950 dark:bg-gray-100 py-8 border-t border-slate-800 dark:border-gray-300"
        data-oid="gkr-gjo"
      >
        <div
          className="container mx-auto px-6 text-center text-gray-400 dark:text-gray-600"
          data-oid="-y2.n5h"
        >
          <p data-oid="3:n8xvk">
            &copy; {new Date().getFullYear()} {data.hero.name}. All rights
            reserved.
          </p>
          <p className="mt-2 text-sm" data-oid="rl1v4rb">
            Built with React, Next.js & Tailwind CSS
          </p>
        </div>
      </footer>

      <style jsx data-oid="7gy8e1j">{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-delay-1 {
          animation: fade-in 0.8s ease-out 0.2s both;
        }

        .animate-fade-in-delay-2 {
          animation: fade-in 0.8s ease-out 0.4s both;
        }

        .animate-fade-in-delay-3 {
          animation: fade-in 0.8s ease-out 0.6s both;
        }

        .animate-fade-in-delay-4 {
          animation: fade-in 0.8s ease-out 0.8s both;
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}
