import {
  ChevronRight,
  Download,
  ExternalLink,
  Github,
  Mail,
  MapPin,
  Menu,
  Phone,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  SiAmazon,
  SiDocker,
  SiGit,
  SiLinkedin,
  SiLinux,
  SiPython,
  SiWhatsapp,
} from "react-icons/si";
import { useScrollReveal } from "./hooks/useScrollReveal";

// ─── Scroll Progress ───────────────────────────────────────────────────────────
function ScrollProgress() {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setWidth(max > 0 ? (el.scrollTop / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div id="scroll-progress" style={{ width: `${width}%` }} />;
}

// ─── Leaf SVG ────────────────────────────────────────────────────────────────────
function LeafIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="rgba(100,245,154,0.7)"
      style={style}
      role="img"
      aria-label="leaf particle"
    >
      <title>leaf particle</title>
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2 0-2 5-4 5-4C14 1 11 5 11 5.5 9 8 9 10.5 11 12 13 13.5 17 12 17 12c0 1-1 2-3 3C12 10 17 8 17 8z" />
    </svg>
  );
}

// ─── Particle Background ──────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  left: `${(i * 5.5 + 3) % 100}%`,
  size: 10 + (i % 4) * 5,
  duration: 12 + (i % 6) * 3,
  delay: -(i * 1.8),
  opacity: 0.3 + (i % 3) * 0.15,
  key: `leaf-${i}`,
}));

const DOTS = Array.from({ length: 12 }, (_, i) => ({
  left: `${(i * 8 + 5) % 95}%`,
  top: `${(i * 7 + 10) % 80}%`,
  size: 3 + (i % 3),
  duration: 6 + i * 0.8,
  delay: -i * 0.5,
  key: `dot-particle-${i}`,
}));

function ParticleBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {PARTICLES.map((p) => (
        <div
          key={p.key}
          className="absolute"
          style={{
            left: p.left,
            bottom: "-10%",
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animation: `float-up ${p.duration}s linear ${p.delay}s infinite`,
          }}
        >
          <LeafIcon />
        </div>
      ))}
      {DOTS.map((d) => (
        <div
          key={d.key}
          className="absolute rounded-full"
          style={{
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
            background: "rgba(100,245,154,0.5)",
            boxShadow: "0 0 6px rgba(100,245,154,0.8)",
            animation: `float-particle ${d.duration}s ease-in-out ${d.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Wave Divider ────────────────────────────────────────────────────────────
function WaveDivider() {
  return (
    <div className="w-full overflow-hidden leading-none" style={{ height: 60 }}>
      <svg
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        className="w-full h-full"
        role="img"
        aria-label="wave divider"
      >
        <title>Wave divider</title>
        <path
          d="M0,30 C200,60 400,0 600,30 C800,60 1000,0 1200,30 L1200,60 L0,60 Z"
          fill="rgba(10,31,42,0.6)"
        />
        <path
          d="M0,40 C300,10 600,60 900,30 C1050,15 1150,40 1200,35 L1200,60 L0,60 Z"
          fill="rgba(7,24,33,0.4)"
        />
      </svg>
    </div>
  );
}

// ─── Reveal wrapper ─────────────────────────────────────────────────────────────────
function Reveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
  className?: string;
}) {
  const { ref, visible } = useScrollReveal();
  const translateMap = {
    up: "translateY(40px)",
    left: "translateX(-40px)",
    right: "translateX(40px)",
    none: "none",
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : translateMap[direction],
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Navbar ────────────────────────────────────────────────────────────────────
const NAV_LINKS = ["Home", "About", "Skills", "Projects", "Contact"];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = NAV_LINKS.map((s) =>
        document.getElementById(s.toLowerCase()),
      );
      let current = "Home";
      for (const sec of sections) {
        if (sec && sec.getBoundingClientRect().top <= 120) {
          current = sec.id.charAt(0).toUpperCase() + sec.id.slice(1);
        }
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document
      .getElementById(id.toLowerCase())
      ?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl transition-all duration-300">
      <div
        className="glass-card rounded-full px-4 py-3 flex items-center justify-between transition-all duration-300"
        style={{
          boxShadow: scrolled ? "0 0 10px rgba(100,245,154,0.2)" : "none",
        }}
      >
        <button
          type="button"
          data-ocid="nav.link"
          onClick={() => scrollTo("home")}
          className="bg-navy-700 rounded-full px-4 py-1.5 text-sm font-bold tracking-wide text-white hover:text-neon transition-colors"
        >
          ahsansarwar<span className="text-neon">.</span>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <button
              type="button"
              key={link}
              data-ocid={`nav.${link.toLowerCase()}.link`}
              onClick={() => scrollTo(link.toLowerCase())}
              className="relative px-4 py-1.5 text-sm font-medium transition-colors duration-200 rounded-full"
              style={{ color: activeSection === link ? "#64F59A" : "#cbd5e1" }}
            >
              {link}
              {activeSection === link && (
                <span
                  className="absolute bottom-0.5 left-2 right-2 h-0.5 rounded-full"
                  style={{
                    background: "#64F59A",
                    boxShadow: "0 0 6px rgba(100,245,154,0.8)",
                  }}
                />
              )}
            </button>
          ))}
        </nav>

        <button
          type="button"
          data-ocid="nav.cta.button"
          onClick={() => scrollTo("contact")}
          className="hidden md:inline-flex items-center gap-1.5 text-sm font-bold px-4 py-1.5 rounded-full transition-all duration-200"
          style={{ background: "#64F59A", color: "#071821" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#2FEA7A";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#64F59A";
          }}
        >
          Get In Touch
        </button>

        <button
          type="button"
          data-ocid="nav.hamburger.button"
          className="md:hidden text-slate-300 hover:text-neon transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div
          className="mt-2 glass-card rounded-2xl p-4 flex flex-col gap-2 md:hidden"
          style={{ animation: "fade-in-down 0.2s ease" }}
        >
          {NAV_LINKS.map((link) => (
            <button
              type="button"
              key={link}
              data-ocid={`nav.mobile.${link.toLowerCase()}.link`}
              onClick={() => scrollTo(link.toLowerCase())}
              className="text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{
                background:
                  activeSection === link
                    ? "rgba(100,245,154,0.1)"
                    : "transparent",
                color: activeSection === link ? "#64F59A" : "#cbd5e1",
              }}
            >
              {link}
            </button>
          ))}
          <button
            type="button"
            data-ocid="nav.mobile.cta.button"
            onClick={() => scrollTo("contact")}
            className="mt-1 text-center text-sm font-bold px-4 py-2.5 rounded-xl transition-all"
            style={{ background: "#64F59A", color: "#071821" }}
          >
            Get In Touch
          </button>
        </div>
      )}
    </header>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
const TYPING_ROLES = [
  "Cloud DevOps Engineer",
  "Linux Enthusiast",
  "Docker & AWS Builder",
  "Automation Specialist",
];

function HeroSection() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fullText = TYPING_ROLES[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;
    if (!isDeleting && displayed.length < fullText.length) {
      timeout = setTimeout(
        () => setDisplayed(fullText.slice(0, displayed.length + 1)),
        80,
      );
    } else if (!isDeleting && displayed.length === fullText.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % TYPING_ROLES.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, roleIndex]);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-24 pb-0 overflow-hidden"
    >
      <ParticleBackground />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(100,245,154,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-10 md:gap-16">
          {/* Text */}
          <div
            className="flex-1 max-w-lg text-center md:text-left"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "none" : "translateX(40px)",
              transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
            }}
          >
            <p
              className="text-sm font-semibold tracking-widest uppercase mb-3"
              style={{ color: "#64F59A" }}
            >
              🌿 Welcome
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              Hi, I&apos;m{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #64F59A, #2FEA7A)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Ahsan Sarwar
              </span>
            </h1>

            <div className="flex items-center justify-center md:justify-start gap-2 mb-5 h-8">
              <span className="text-slate-300 text-lg">🌿</span>
              <span
                className="font-bold text-lg md:text-xl"
                style={{ color: "#64F59A" }}
              >
                {displayed}
              </span>
              <span
                className="text-xl font-bold cursor-blink"
                style={{ color: "#64F59A" }}
              >
                |
              </span>
            </div>

            <p className="text-slate-400 text-base leading-relaxed mb-8">
              Building scalable systems from Liaquatpur, Punjab. Mastering
              automation with a nature-inspired mindset of growth.
            </p>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <a
                href="/Ahsan_Sarwar_Resume.pdf"
                download
                data-ocid="hero.download_resume.button"
                className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-full transition-all duration-200 text-sm"
                style={{ background: "#64F59A", color: "#071821" }}
              >
                <Download size={16} />
                Download Resume
              </a>
              <button
                type="button"
                data-ocid="hero.contact.button"
                onClick={() =>
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="inline-flex items-center gap-2 glass-card text-white font-semibold px-6 py-3 rounded-full hover:neon-border transition-all duration-200 text-sm"
              >
                <Mail size={16} />
                Contact Me
              </button>
            </div>
          </div>

          {/* Profile image */}
          <div
            className="flex-shrink-0"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "none" : "translateX(-40px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            <div className="relative">
              <div
                className="absolute inset-[-12px] rounded-full profile-glow-ring"
                style={{ border: "2px solid rgba(100,245,154,0.5)" }}
              />
              <div
                className="absolute inset-[-24px] rounded-full opacity-40"
                style={{
                  border: "1px solid rgba(100,245,154,0.3)",
                  animation: "glow-pulse 3s ease-in-out 1s infinite",
                }}
              />
              <div
                className="w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden profile-glow-ring"
                style={{ border: "3px solid rgba(100,245,154,0.6)" }}
              >
                <img
                  src="/profile.jpg"
                  alt="Ahsan Sarwar - Cloud DevOps Engineer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <WaveDivider />
    </section>
  );
}

// ─── About Section ────────────────────────────────────────────────────────────
function AboutSection() {
  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="text-center mb-14">
            <p
              className="text-sm font-semibold tracking-widest uppercase mb-2"
              style={{ color: "#64F59A" }}
            >
              🌿 Who Am I
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              About Me
            </h2>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Reveal direction="left" delay={0.1}>
            <div className="glass-card rounded-2xl p-8 h-full flex flex-col gap-6">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                style={{
                  background: "rgba(100,245,154,0.1)",
                  border: "1px solid rgba(100,245,154,0.3)",
                }}
              >
                🌱
              </div>
              <p className="text-slate-300 leading-relaxed text-base">
                I&apos;m Ahsan Sarwar, a Computer Science graduate from
                Liaquatpur, RYK, Punjab. Currently diving deep into the DevOps
                universe. My journey started with mastering Linux (Ubuntu) and
                networking. Now I&apos;m building resilient pipelines using
                Docker and AWS.
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-400 mt-auto">
                <MapPin size={14} style={{ color: "#64F59A" }} />
                <span>Liaquatpur, RYK, Punjab, Pakistan</span>
              </div>
            </div>
          </Reveal>

          <div className="flex flex-col gap-4">
            {[
              {
                icon: "🐧",
                title: "Linux Power",
                sub: "Ubuntu, Bash, & SSH Mastery",
                delay: 0.2,
              },
              {
                icon: "☁️",
                title: "Cloud Infrastructure",
                sub: "AWS EC2, S3, VPC & IAM",
                delay: 0.3,
              },
              {
                icon: "🐳",
                title: "Container Specialist",
                sub: "Docker & Docker Compose",
                delay: 0.4,
              },
            ].map((item) => (
              <Reveal key={item.title} direction="right" delay={item.delay}>
                <div
                  className="glass-card rounded-2xl p-6 flex items-center gap-4 cursor-default transition-all duration-300"
                  style={{ transition: "box-shadow 0.3s" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 0 10px rgba(100,245,154,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "";
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                    style={{
                      background: "rgba(100,245,154,0.1)",
                      border: "1px solid rgba(100,245,154,0.4)",
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-base">
                      {item.title}
                    </p>
                    <p className="text-slate-400 text-sm">{item.sub}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Skills Section ───────────────────────────────────────────────────────────
const SKILLS = [
  { name: "Linux", icon: <SiLinux />, pct: 90 },
  { name: "Docker", icon: <SiDocker />, pct: 85 },
  { name: "AWS", icon: <SiAmazon />, pct: 80 },
  {
    name: "Bash",
    icon: <span className="font-mono font-bold text-sm">$_</span>,
    pct: 88,
  },
  {
    name: "SSH",
    icon: <span className="font-mono font-bold text-xs">SSH</span>,
    pct: 85,
  },
  { name: "Networking", icon: <span className="text-lg">🌐</span>, pct: 75 },
  { name: "Python", icon: <SiPython />, pct: 70 },
  { name: "Git", icon: <SiGit />, pct: 85 },
];

function SkillBar({
  name,
  pct,
  delay,
}: { name: string; pct: number; delay: number }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div ref={ref}>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-slate-300 text-sm font-medium">{name}</span>
        <span className="text-sm font-bold" style={{ color: "#64F59A" }}>
          {pct}%
        </span>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.05)" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, #2FEA7A, #64F59A)",
            width: visible ? `${pct}%` : "0%",
            transition: `width 1s ease ${delay + 0.2}s`,
          }}
        />
      </div>
    </div>
  );
}

function SkillsSection() {
  const { ref: badgeRef, visible: badgesVisible } = useScrollReveal();

  return (
    <section id="skills" className="py-24 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(100,245,154,0.04) 0%, transparent 70%)",
        }}
      />
      <div className="container mx-auto px-6 relative z-10">
        <Reveal>
          <div className="text-center mb-14">
            <p
              className="text-sm font-semibold tracking-widest uppercase mb-2"
              style={{ color: "#64F59A" }}
            >
              🌿 What I Know
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Skills &amp; Expertise
            </h2>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Badges */}
          <Reveal direction="left" delay={0.1}>
            <div className="glass-card rounded-2xl p-8">
              <h3 className="text-white font-semibold mb-6 text-lg">
                Tech Stack
              </h3>
              <div ref={badgeRef} className="grid grid-cols-4 gap-3">
                {SKILLS.map((skill, i) => (
                  <div
                    key={skill.name}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl cursor-default transition-all duration-300 badge-animate"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(100,245,154,0.1)",
                      animationDelay: `${i * 0.3}s`,
                      opacity: badgesVisible ? 1 : 0,
                      transform: badgesVisible ? "none" : "scale(0.8)",
                      transition: `opacity 0.4s ease ${i * 0.07}s, transform 0.4s ease ${i * 0.07}s`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(100,245,154,0.4)";
                      e.currentTarget.style.background =
                        "rgba(100,245,154,0.05)";
                      e.currentTarget.style.transform =
                        "scale(1.1) translateY(-3px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(100,245,154,0.1)";
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.05)";
                      e.currentTarget.style.transform = "none";
                    }}
                  >
                    <div className="text-2xl" style={{ color: "#64F59A" }}>
                      {skill.icon}
                    </div>
                    <span className="text-xs text-slate-400 font-medium text-center leading-tight">
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Bars */}
          <Reveal direction="right" delay={0.2}>
            <div className="glass-card rounded-2xl p-8">
              <h3 className="text-white font-semibold mb-6 text-lg">
                Proficiency
              </h3>
              <div className="flex flex-col gap-5">
                {SKILLS.map((skill, i) => (
                  <SkillBar
                    key={skill.name}
                    name={skill.name}
                    pct={skill.pct}
                    delay={i * 0.08}
                  />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── Projects Section ──────────────────────────────────────────────────────────
const PROJECTS = [
  {
    title: "CI/CD Pipeline Automation",
    desc: "Automated build/deploy pipeline using Jenkins, Docker, and GitHub Actions",
    tags: ["Jenkins", "Docker", "GitHub Actions", "CI/CD"],
    icon: "⚙️",
  },
  {
    title: "Docker Containerization Lab",
    desc: "Multi-container applications orchestrated with Docker Compose",
    tags: ["Docker", "Docker Compose", "Nginx", "Redis"],
    icon: "🐳",
  },
  {
    title: "AWS Infrastructure Setup",
    desc: "Cloud infrastructure provisioning using EC2, S3, VPC, and IAM",
    tags: ["AWS", "EC2", "S3", "VPC", "IAM"],
    icon: "☁️",
  },
  {
    title: "Linux Server Hardening",
    desc: "Secured Linux servers with firewall rules, SSH key auth, and monitoring",
    tags: ["Linux", "UFW", "Fail2ban", "SSH", "Bash"],
    icon: "🛡️",
  },
];

function ProjectCard({
  project,
  i,
}: { project: (typeof PROJECTS)[0]; i: number }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      data-ocid={`projects.item.${i + 1}`}
      className="glass-card rounded-2xl p-6 flex flex-col gap-4 group transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(40px)",
        transition: `opacity 0.55s ease ${i * 0.12}s, transform 0.55s ease ${i * 0.12}s, box-shadow 0.3s, border-color 0.3s`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow = "0 0 10px rgba(100,245,154,0.3)";
        e.currentTarget.style.borderColor = "rgba(100,245,154,0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "";
        e.currentTarget.style.borderColor = "";
      }}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{
            background: "rgba(100,245,154,0.1)",
            border: "1px solid rgba(100,245,154,0.2)",
          }}
        >
          {project.icon}
        </div>
        <ExternalLink
          size={16}
          className="text-slate-500 group-hover:text-neon transition-colors"
        />
      </div>
      <div>
        <h3 className="text-white font-bold text-base mb-2">{project.title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{project.desc}</p>
      </div>
      <div className="flex flex-wrap gap-2 mt-auto">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{
              background: "rgba(100,245,154,0.05)",
              border: "1px solid rgba(100,245,154,0.15)",
              color: "rgba(100,245,154,0.8)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function ProjectsSection() {
  return (
    <section id="projects" className="py-24 relative">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="text-center mb-14">
            <p
              className="text-sm font-semibold tracking-widest uppercase mb-2"
              style={{ color: "#64F59A" }}
            >
              🌿 What I&apos;ve Built
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Projects
            </h2>
          </div>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.title} project={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact Section ──────────────────────────────────────────────────────────
function ContactSection() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setTimeout(() => setSent(false), 3000);
      setFormState({ name: "", email: "", message: "" });
    }, 1500);
  };

  const contactCards = [
    {
      icon: <Phone size={20} style={{ color: "#64F59A" }} />,
      label: "Phone / WhatsApp",
      value: "0343-1258880",
      href: "https://wa.me/923431258880",
      ocid: "contact.phone.link",
    },
    {
      icon: <SiLinkedin size={20} style={{ color: "#64F59A" }} />,
      label: "LinkedIn",
      value: "Ahsan Sarwar",
      href: "https://www.linkedin.com/in/𝘼𝙝𝙨𝙖𝙣-𝙎𝙖𝙧𝙬𝙖𝙧-3232b4290",
      ocid: "contact.linkedin.link",
    },
    {
      icon: <SiWhatsapp size={20} style={{ color: "#64F59A" }} />,
      label: "WhatsApp",
      value: "+92 343 1258880",
      href: "https://wa.me/923431258880",
      ocid: "contact.whatsapp.link",
    },
  ];

  return (
    <section id="contact" className="py-24 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 80%, rgba(100,245,154,0.04) 0%, transparent 70%)",
        }}
      />
      <div className="container mx-auto px-6 relative z-10">
        <Reveal>
          <div className="text-center mb-14">
            <p
              className="text-sm font-semibold tracking-widest uppercase mb-2"
              style={{ color: "#64F59A" }}
            >
              🌿 Let&apos;s Connect
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Get In Touch
            </h2>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          <div className="flex flex-col gap-4">
            {contactCards.map((card, i) => (
              <Reveal key={card.label} direction="left" delay={i * 0.1}>
                <a
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid={card.ocid}
                  className="glass-card rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 group block"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(100,245,154,0.4)";
                    e.currentTarget.style.boxShadow =
                      "0 0 10px rgba(100,245,154,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "";
                    e.currentTarget.style.boxShadow = "";
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(100,245,154,0.1)",
                      border: "1px solid rgba(100,245,154,0.2)",
                    }}
                  >
                    {card.icon}
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs mb-0.5">
                      {card.label}
                    </p>
                    <p className="text-white text-sm font-medium">
                      {card.value}
                    </p>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-slate-500 ml-auto transition-colors group-hover:text-neon"
                  />
                </a>
              </Reveal>
            ))}

            <Reveal delay={0.4}>
              <div className="glass-card rounded-2xl p-5 flex items-center gap-3">
                <MapPin
                  size={16}
                  style={{ color: "#64F59A" }}
                  className="flex-shrink-0"
                />
                <p className="text-slate-300 text-sm">
                  Liaquatpur, RYK, Punjab, Pakistan
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal direction="right" delay={0.2}>
            <form
              onSubmit={handleSubmit}
              data-ocid="contact.form"
              className="glass-card rounded-2xl p-8 flex flex-col gap-5"
            >
              <div className="relative">
                <input
                  type="text"
                  id="contact-name"
                  data-ocid="contact.name.input"
                  value={formState.name}
                  onChange={(e) =>
                    setFormState((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder=" "
                  required
                  className="peer w-full bg-white/5 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white text-sm outline-none transition-all"
                  style={{ color: "white" }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(100,245,154,0.5)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                />
                <label
                  htmlFor="contact-name"
                  className="absolute left-4 top-4 text-slate-400 text-sm transition-all peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-neon peer-not-placeholder-shown:top-1.5 peer-not-placeholder-shown:text-xs"
                >
                  Your Name
                </label>
              </div>

              <div className="relative">
                <input
                  type="email"
                  id="contact-email"
                  data-ocid="contact.email.input"
                  value={formState.email}
                  onChange={(e) =>
                    setFormState((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder=" "
                  required
                  className="peer w-full bg-white/5 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white text-sm outline-none transition-all"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(100,245,154,0.5)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                />
                <label
                  htmlFor="contact-email"
                  className="absolute left-4 top-4 text-slate-400 text-sm transition-all peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-neon peer-not-placeholder-shown:top-1.5 peer-not-placeholder-shown:text-xs"
                >
                  Email Address
                </label>
              </div>

              <div className="relative">
                <textarea
                  id="contact-message"
                  data-ocid="contact.message.textarea"
                  value={formState.message}
                  onChange={(e) =>
                    setFormState((p) => ({ ...p, message: e.target.value }))
                  }
                  placeholder=" "
                  required
                  rows={4}
                  className="peer w-full bg-white/5 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white text-sm outline-none transition-all resize-none"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(100,245,154,0.5)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                />
                <label
                  htmlFor="contact-message"
                  className="absolute left-4 top-4 text-slate-400 text-sm transition-all peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-neon peer-not-placeholder-shown:top-1.5 peer-not-placeholder-shown:text-xs"
                >
                  Your Message
                </label>
              </div>

              <button
                type="submit"
                data-ocid="contact.submit.button"
                disabled={sending}
                className="w-full font-bold py-3 px-6 rounded-xl transition-all duration-200 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ background: "#64F59A", color: "#071821" }}
                onMouseEnter={(e) => {
                  if (!sending) e.currentTarget.style.background = "#2FEA7A";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#64F59A";
                }}
              >
                {sending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span
                      className="w-4 h-4 border-2 rounded-full animate-spin"
                      style={{
                        borderColor: "rgba(7,24,33,0.3)",
                        borderTopColor: "#071821",
                      }}
                    />
                    Sending...
                  </span>
                ) : sent ? (
                  <span data-ocid="contact.success_state">
                    ✅ Message Sent!
                  </span>
                ) : (
                  "Send Message →"
                )}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.hostname)
      : "";
  return (
    <footer className="relative border-t border-white/5 pt-10 pb-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-white font-bold text-lg">
              ahsansarwar<span style={{ color: "#64F59A" }}>.</span>
            </p>
            <p className="text-slate-400 text-sm">Cloud DevOps Engineer</p>
          </div>

          <div className="flex items-center gap-4">
            {[
              {
                href: "https://www.linkedin.com/in/𝘼𝙝𝙨𝙖𝙣-𝙎𝙖𝙧𝙬𝙖𝙧-3232b4290",
                label: "LinkedIn",
                icon: <SiLinkedin size={16} />,
                ocid: "footer.linkedin.link",
              },
              {
                href: "https://wa.me/923431258880",
                label: "WhatsApp",
                icon: <SiWhatsapp size={16} />,
                ocid: "footer.whatsapp.link",
              },
              {
                href: "https://github.com",
                label: "GitHub",
                icon: <Github size={16} />,
                ocid: "footer.github.link",
              },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                data-ocid={social.ocid}
                className="w-9 h-9 glass-card rounded-full flex items-center justify-center transition-all duration-200 text-slate-400"
                aria-label={social.label}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#64F59A";
                  e.currentTarget.style.boxShadow =
                    "0 0 10px rgba(100,245,154,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-3 text-slate-500 text-xs">
          <p>🌿 Built by Ahsan Sarwar | {year}</p>
          <p>
            Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "rgba(100,245,154,0.7)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#64F59A";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(100,245,154,0.7)";
              }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #071821 0%, #0A1F2A 60%, #071821 100%)",
      }}
    >
      <ScrollProgress />
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
