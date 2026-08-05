import { useState, useEffect, useRef } from "react";
import {
  Github, Linkedin, Mail, Phone, ExternalLink,
  ChevronDown, Menu, X, Award, BookOpen,
  Briefcase, Code2, MapPin, Calendar, ArrowUpRight
} from "lucide-react";

/* ── Design tokens ─────────────────────────────────────── */
const C = {
  navy:    "#0B1929",
  navyMid: "#112240",
  slate:   "#1E3A5F",
  accent:  "#4F8EF7",        // electric blue
  gold:    "#D4A843",
  white:   "#F8FAFC",
  gray50:  "#F1F5F9",
  gray100: "#E2E8F0",
  gray300: "#94A3B8",
  gray500: "#64748B",
  gray700: "#334155",
  text:    "#0F172A",
};

/* ── Data ──────────────────────────────────────────────── */
const skills = [
  { category: "Software Engineering",        items: ["Java", "Spring Boot", "Python", "FastAPI", "Node.js", "REST APIs", "Microservices", "PostgreSQL", "MongoDB"] },
  { category: "Full Stack & Web",            items: ["React", "JavaScript", "TypeScript", "HTML / CSS", "Git", "Agile / Scrum", "Postman", "VS Code"] },
  { category: "Data Analytics",             items: ["SQL", "Tableau", "Power BI", "Looker Studio", "R", "Excel", "Pandas", "Matplotlib / Seaborn"] },
  { category: "AI & Machine Learning",       items: ["PyTorch", "scikit-learn", "XGBoost", "HuggingFace Transformers", "LangChain", "FAISS", "MLflow"] },
  { category: "Data Engineering",            items: ["PySpark", "Airflow", "dbt", "ETL Pipelines", "Snowflake", "BigQuery", "Kafka", "NumPy"] },
  { category: "Cloud & DevOps",              items: ["AWS (Certified)", "Azure (Certified)", "GCP", "Docker", "Kubernetes", "GitHub Actions", "CI/CD"] },
];

const experience = [
  {
    role: "Software Engineer",
    company: "St. Jude Children's Research Hospital",
    period: "Sep 2025 – May 2026",
    location: "Memphis, TN · Hybrid",
    bullets: [
      "Built deep learning pipelines for pediatric EEG biomedical signal analysis, reducing inference latency by 38% and improving model reliability by 27%.",
      "Collaborated with clinical teams to develop and evaluate AI models across 3 active research studies, bridging the gap between ML research and clinical deployment.",
      "Designed reproducible model evaluation frameworks on sensitive pediatric clinical datasets, enabling consistent benchmarking across research cycles.",
    ],
  },
  {
    role: "Software Engineer",
    company: "Biomedical Sensors & Systems Lab",
    period: "Jun 2025 – Aug 2025",
    location: "Memphis, TN",
    bullets: [
      "Developed Rhamba — a Region-Aware Hybrid Attention-Mamba framework for self-supervised fMRI learning — achieving a 14.3% improvement in downstream classification accuracy.",
      "Conducted systematic ablation studies across Transformer and Mamba architectures, reducing compute overhead by 22% while maintaining performance.",
      "Published research to arXiv (arXiv:2605.01240, May 2026) following successful peer evaluation and recognition by the neuroimaging community.",
    ],
  },
  {
    role: "Graduate Research Assistant",
    company: "University of Memphis",
    period: "Mar 2025 – May 2025",
    location: "Memphis, TN",
    bullets: [
      "Engineered ETL pipelines processing 50+ GB of research datasets, improving ingestion efficiency by 41% through parallel batch processing.",
      "Implemented MLflow-based experiment tracking infrastructure, reducing environment setup time by 35% and enabling team-wide reproducibility.",
    ],
  },
  {
    role: "Full Stack Engineer",
    company: "Cognizant",
    period: "Jan 2022 – Nov 2023",
    location: "Hyderabad, India",
    bullets: [
      "Architected 12+ Spring Boot microservices handling 100,000+ daily transactions at 99.9% uptime, with a 43% improvement in API response time.",
      "Optimized CI/CD pipelines cutting deployment time from 45 to 12 minutes and reducing production rollbacks by 60%.",
      "Led migration of legacy monolith services to a distributed microservice architecture, improving system scalability across cross-functional teams.",
    ],
  },
];

const projects = [
  {
    name: "Attention-Based RAG Academic QA System",
    tag: "AI/ML",
    tools: ["Python", "FAISS", "Mistral-7B", "LangChain", "Gradio", "bitsandbytes"],
    bullets: [
      "Built a local RAG system with a 4-route smart router (document RAG, math/direct, web-grounded via DuckDuckGo, fallback LLM) — improved BLEU-1 from 0.22 → 0.24 and ROUGE-1 from 0.33 → 0.35 over base Mistral generation.",
      "Implemented PDF/TXT/MD ingestion, chunking, FAISS vector indexing, and live re-indexing via Gradio UI with 4-bit quantized inference.",
    ],
  },
  {
    name: "Air Quality Level Prediction & Clustering",
    tag: "Data",
    tools: ["Python", "scikit-learn", "XGBoost", "K-Means", "t-SNE", "Pandas", "Matplotlib"],
    bullets: [
      "Trained an end-to-end ML pipeline on 1.2M+ hourly pollution records from 200+ global cities, achieving 99.9% AQI category prediction accuracy with Random Forest.",
      "Applied K-Means clustering (k=5) and t-SNE visualizations to surface distinct pollution regimes — findings presented as an interactive dashboard.",
    ],
  },
  {
    name: "Bank Marketing Campaign Response Prediction",
    tag: "Data",
    tools: ["R", "Logistic Regression", "Cross-validation", "ROC / AUC", "ggplot2"],
    bullets: [
      "Built a logistic regression model on the UCI Bank Marketing dataset to predict customer subscription likelihood for term deposits, with full statistical evaluation via ROC/AUC.",
      "Cleaned and engineered features across 45,000+ records; model achieved strong AUC enabling targeted campaign prioritization.",
    ],
  },
  {
    name: "Movie Popularity Prediction & Recommendation",
    tag: "Data",
    tools: ["Python", "R", "KNN", "Random Forest", "TMDB API", "Pandas"],
    bullets: [
      "Built classification models (KNN and Random Forest) to predict movie success and popularity using the TMDB dataset spanning 1980–present.",
      "Integrated TMDB API for live data ingestion; performed genre/decade trend analysis to surface actionable content insights.",
    ],
  },
  {
    name: "Attention-Based Stock Price Forecasting",
    tag: "AI/ML",
    tools: ["PyTorch", "LSTM", "GRU", "Transformer", "yfinance API"],
    bullets: [
      "Compared LSTM, GRU, and Transformer architectures for next-day closing price prediction on Walmart stock (1970–2018) using a 60-day lookback sliding window.",
      "Transformer attention outperformed both LSTM and GRU baselines on long-horizon pattern recognition as measured by MAE and RMSE on a held-out test set.",
    ],
  },
  {
    name: "YOLOv8 Object Detection — Autonomous Driving",
    tag: "AI/ML",
    tools: ["YOLOv8", "PyTorch", "KITTI Dataset", "Python"],
    bullets: [
      "Trained YOLOv8s on the KITTI autonomous driving dataset for multi-class detection (cars, pedestrians, cyclists) with a custom KITTI→YOLO annotation preprocessing pipeline.",
      "Extracted per-class mAP@0.5, mAP@0.5:0.95, Precision, Recall, and F1 metrics from best checkpoint for comprehensive benchmarking.",
    ],
  },
];

/* ── Helpers ───────────────────────────────────────────── */
function useScrolled(threshold = 60) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, [threshold]);
  return scrolled;
}

function useInView(ref) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return visible;
}

function FadeIn({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const visible = useInView(ref);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

/* ── Components ────────────────────────────────────────── */
function Navbar({ menuOpen, setMenuOpen }) {
  const scrolled = useScrolled();
  const links = ["About", "Skills", "Experience", "Projects", "Publications"];
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      background: scrolled ? "rgba(11,25,41,0.97)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.slate}` : "none",
      transition: "all 0.35s ease",
    }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 2rem", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: `linear-gradient(135deg, ${C.accent}, #7B61FF)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: "0.9rem" }}>PE</span>
          </div>
          <span style={{ color: C.white, fontWeight: 700, fontSize: "1rem", letterSpacing: "-0.01em" }}>Pratheek Eranki</span>
        </div>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }} className="desk-nav">
          {links.map(l => (
            <button key={l} onClick={() => scrollTo(l.toLowerCase())} style={{
              background: "none", border: "none", cursor: "pointer",
              color: C.gray300, fontSize: "0.9rem", fontWeight: 500,
              transition: "color 0.2s", letterSpacing: "0.01em", padding: 0,
            }}
              onMouseEnter={e => e.currentTarget.style.color = C.white}
              onMouseLeave={e => e.currentTarget.style.color = C.gray300}
            >{l}</button>
          ))}
          <a href="mailto:pratheek.eranki@gmail.com" style={{
            background: C.accent, color: "#fff", padding: "9px 22px",
            borderRadius: 8, fontWeight: 600, fontSize: "0.88rem",
            textDecoration: "none", letterSpacing: "0.02em",
            transition: "opacity 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            Contact
          </a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="mob-nav" style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: C.white }}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: C.navyMid, padding: "1.25rem 2rem 1.75rem", borderTop: `1px solid ${C.slate}`, display: "flex", flexDirection: "column", gap: "1.1rem" }}>
          {links.map(l => (
            <button key={l} onClick={() => { scrollTo(l.toLowerCase()); setMenuOpen(false); }} style={{
              background: "none", border: "none", cursor: "pointer", color: C.gray300,
              fontSize: "1rem", fontWeight: 500, textAlign: "left", padding: 0,
            }}>{l}</button>
          ))}
        </div>
      )}
    </nav>
  );
}

function Hero() {
  return (
    <section id="about" style={{
      minHeight: "100vh", background: C.navy,
      display: "flex", alignItems: "center",
      padding: "7rem 2rem 5rem",
      position: "relative", overflow: "hidden",
    }}>
      {/* Subtle grid background */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.04,
        backgroundImage: `linear-gradient(${C.accent} 1px, transparent 1px), linear-gradient(90deg, ${C.accent} 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />
      {/* Radial glow */}
      <div style={{ position: "absolute", top: "20%", right: "10%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${C.accent}18 0%, transparent 65%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", left: "5%", width: 350, height: 350, borderRadius: "50%", background: `radial-gradient(circle, #7B61FF18 0%, transparent 65%)`, pointerEvents: "none" }} />

      <div style={{ maxWidth: 860, margin: "0 auto", position: "relative" }}>
        {/* Badge */}
        <FadeIn>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, border: `1px solid ${C.accent}55`, borderRadius: 100, padding: "6px 16px", marginBottom: "1.75rem" }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.accent, boxShadow: `0 0 6px ${C.accent}` }} />
            <span style={{ color: C.accent, fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>Available for Opportunities</span>
          </div>
        </FadeIn>

        {/* Headline */}
        <FadeIn delay={0.1}>
          <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 4.5rem)", fontWeight: 800, color: C.white, lineHeight: 1.1, margin: "0 0 1rem", letterSpacing: "-0.03em" }}>
            Pratheek Eranki
          </h1>
          <h2 style={{ fontSize: "clamp(1.1rem, 3vw, 1.5rem)", fontWeight: 400, color: C.accent, margin: "0 0 1.5rem", letterSpacing: "-0.01em" }}>
            Software Engineer · Data Analyst · AI/ML Engineer
          </h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p style={{ fontSize: "1.05rem", color: C.gray300, lineHeight: 1.85, maxWidth: 680, margin: "0 0 2.5rem" }}>
            MS Data Science candidate at the University of Memphis (GPA 3.87) with 2+ years of
            enterprise software engineering at Cognizant, hands-on AI/ML research at St. Jude
            Children's Research Hospital, and a published arXiv paper. Comfortable across the full
            stack — from backend APIs and databases to data pipelines, dashboards, and ML systems.
          </p>
        </FadeIn>

        {/* CTA row */}
        <FadeIn delay={0.3}>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "3.5rem" }}>
            <a href="mailto:pratheek.eranki@gmail.com" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: C.accent, color: "#fff", padding: "13px 28px",
              borderRadius: 9, fontWeight: 600, textDecoration: "none", fontSize: "0.95rem",
              boxShadow: `0 0 28px ${C.accent}44`,
              transition: "opacity 0.2s, box-shadow 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
            >
              <Mail size={16} /> Get in Touch
            </a>
            <a href="https://github.com/PratheekEranki" target="_blank" rel="noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "transparent", color: C.white, padding: "13px 28px",
              borderRadius: 9, fontWeight: 600, textDecoration: "none", fontSize: "0.95rem",
              border: `1px solid ${C.slate}`,
              transition: "border-color 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.accent}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.slate}
            >
              <Github size={16} /> GitHub
            </a>
            <a href="https://www.linkedin.com/in/pratheek-eranki-84657b424" target="_blank" rel="noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "transparent", color: C.white, padding: "13px 28px",
              borderRadius: 9, fontWeight: 600, textDecoration: "none", fontSize: "0.95rem",
              border: `1px solid ${C.slate}`,
              transition: "border-color 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.accent}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.slate}
            >
              <Linkedin size={16} /> LinkedIn
            </a>
          </div>
        </FadeIn>

        {/* Stats row */}
        <FadeIn delay={0.4}>
          <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap", borderTop: `1px solid ${C.slate}`, paddingTop: "2rem" }}>
            {[
              { value: "3.87 GPA", label: "University of Memphis" },
              { value: "2+ Years", label: "Industry Experience" },
              { value: "3 Certs", label: "AWS · Azure · DL Spec." },
              { value: "6+ Projects", label: "Full Stack · Data · AI" },
            ].map(s => (
              <div key={s.label}>
                <div style={{ color: C.white, fontWeight: 700, fontSize: "1.05rem" }}>{s.value}</div>
                <div style={{ color: C.gray500, fontSize: "0.8rem", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>

      {/* Scroll cue */}
      <button onClick={() => scrollTo("skills")} style={{
        position: "absolute", bottom: "2.5rem", left: "50%", transform: "translateX(-50%)",
        background: "none", border: "none", cursor: "pointer", color: C.slate,
        animation: "bob 2.2s ease-in-out infinite",
      }}>
        <ChevronDown size={26} />
      </button>
    </section>
  );
}

function SectionLabel({ icon, text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "0.75rem" }}>
      <span style={{ color: C.accent }}>{icon}</span>
      <span style={{ color: C.accent, fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>{text}</span>
    </div>
  );
}

function SectionHeading({ icon, label, title, subtitle }) {
  return (
    <FadeIn>
      <SectionLabel icon={icon} text={label} />
      <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.4rem)", fontWeight: 800, color: C.text, margin: "0 0 0.75rem", letterSpacing: "-0.025em" }}>{title}</h2>
      {subtitle && <p style={{ color: C.gray500, fontSize: "1rem", margin: 0, maxWidth: 560 }}>{subtitle}</p>}
      <div style={{ width: 48, height: 3, background: C.accent, borderRadius: 99, marginTop: "1.25rem" }} />
    </FadeIn>
  );
}

function Skills() {
  return (
    <section id="skills" style={{ padding: "7rem 2rem", background: C.white }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <SectionHeading icon={<Code2 size={16} />} label="Capabilities" title="Technical Skills" subtitle="A versatile toolkit spanning software development, data analytics, AI/ML, and cloud infrastructure." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: "1.25rem", marginTop: "3rem" }}>
          {skills.map((s, i) => (
            <FadeIn key={s.category} delay={i * 0.07}>
              <div style={{
                background: "#fff", borderRadius: 14, padding: "1.5rem",
                border: `1px solid ${C.gray100}`,
                boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${C.accent}66`; e.currentTarget.style.boxShadow = `0 4px 20px ${C.accent}12`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.gray100; e.currentTarget.style.boxShadow = "0 1px 8px rgba(0,0,0,0.05)"; }}
              >
                <div style={{ color: C.gray700, fontWeight: 700, fontSize: "0.88rem", marginBottom: "1rem", paddingBottom: "0.75rem", borderBottom: `1px solid ${C.gray100}` }}>
                  {s.category}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {s.items.map(item => (
                    <span key={item} style={{
                      background: C.gray50, color: C.gray700,
                      padding: "4px 12px", borderRadius: 6,
                      fontSize: "0.8rem", fontWeight: 500,
                      border: `1px solid ${C.gray100}`,
                    }}>{item}</span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function Experience() {
  const [active, setActive] = useState(0);
  const job = experience[active];
  return (
    <section id="experience" style={{ padding: "7rem 2rem", background: C.gray50 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <SectionHeading icon={<Briefcase size={16} />} label="Career" title="Work Experience" subtitle="Enterprise software engineering, data pipelines, AI research, and clinical systems — across multiple domains." />
        <div style={{ display: "grid", gridTemplateColumns: "270px 1fr", gap: "2rem", marginTop: "3rem" }} className="exp-grid">
          {/* Tab list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {experience.map((j, i) => (
              <button key={i} onClick={() => setActive(i)} style={{
                background: active === i ? "#fff" : "transparent",
                border: active === i ? `1px solid ${C.gray100}` : "1px solid transparent",
                borderLeft: active === i ? `3px solid ${C.accent}` : `3px solid transparent`,
                borderRadius: 10, padding: "0.9rem 1rem",
                cursor: "pointer", textAlign: "left",
                boxShadow: active === i ? "0 2px 12px rgba(0,0,0,0.06)" : "none",
                transition: "all 0.2s",
              }}>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: active === i ? C.text : C.gray500, marginBottom: 2 }}>{j.company}</div>
                <div style={{ fontSize: "0.78rem", color: active === i ? C.accent : C.gray300 }}>{j.period}</div>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div style={{ background: "#fff", borderRadius: 14, padding: "2rem", border: `1px solid ${C.gray100}`, boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: C.text }}>{job.role}</h3>
                <div style={{ color: C.accent, fontWeight: 600, fontSize: "0.95rem", marginTop: 4 }}>{job.company}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, color: C.gray500, fontSize: "0.85rem", justifyContent: "flex-end" }}>
                  <Calendar size={13} /> {job.period}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, color: C.gray300, fontSize: "0.82rem", marginTop: 3, justifyContent: "flex-end" }}>
                  <MapPin size={12} /> {job.location}
                </div>
              </div>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {job.bullets.map((b, bi) => (
                <li key={bi} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                  <span style={{ flexShrink: 0, width: 6, height: 6, borderRadius: "50%", background: C.accent, marginTop: 8 }} />
                  <span style={{ color: C.gray700, lineHeight: 1.7, fontSize: "0.93rem" }}>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

const TAG_COLORS = {
  "AI/ML": { bg: `${C.accent}15`, color: C.accent },
  "Data":  { bg: "#10B98115", color: "#059669" },
};

function Projects() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "AI/ML", "Data"];
  const visible = filter === "All" ? projects : projects.filter(p => p.tag === filter);

  return (
    <section id="projects" style={{ padding: "7rem 2rem", background: C.white }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <SectionHeading icon={<Code2 size={16} />} label="Portfolio" title="Selected Projects" subtitle="Web apps, data pipelines, analytics dashboards, and AI/ML systems — across multiple domains." />

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: "0.6rem", marginTop: "2.5rem", flexWrap: "wrap" }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "8px 20px", borderRadius: 100,
              fontWeight: 600, fontSize: "0.85rem", cursor: "pointer",
              border: `1px solid ${filter === f ? C.accent : C.gray100}`,
              background: filter === f ? C.accent : "#fff",
              color: filter === f ? "#fff" : C.gray500,
              transition: "all 0.18s",
            }}>
              {f === "All" ? `All (${projects.length})` : `${f} (${projects.filter(p => p.tag === f).length})`}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))", gap: "1.5rem", marginTop: "1.5rem" }}>
          {visible.map((p, i) => (
            <FadeIn key={p.name} delay={i * 0.06}>
              <div style={{
                background: "#fff", borderRadius: 14, padding: "1.75rem",
                border: `1px solid ${C.gray100}`,
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                height: "100%", boxSizing: "border-box",
                transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
                display: "flex", flexDirection: "column",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${C.accent}55`; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 8px 32px ${C.accent}14`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.gray100; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <h3 style={{ margin: 0, fontSize: "0.97rem", fontWeight: 700, color: C.text, lineHeight: 1.45, flex: 1, paddingRight: "0.5rem" }}>{p.name}</h3>
                  <span style={{
                    flexShrink: 0, fontSize: "0.7rem", fontWeight: 700,
                    padding: "3px 10px", borderRadius: 100,
                    background: TAG_COLORS[p.tag]?.bg, color: TAG_COLORS[p.tag]?.color,
                  }}>{p.tag}</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.25rem" }}>
                  {p.tools.map(t => (
                    <span key={t} style={{
                      background: C.gray50, color: C.gray700,
                      border: `1px solid ${C.gray100}`,
                      padding: "3px 10px", borderRadius: 5,
                      fontSize: "0.74rem", fontWeight: 500,
                    }}>{t}</span>
                  ))}
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem", flex: 1 }}>
                  {p.bullets.map((b, bi) => (
                    <li key={bi} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                      <span style={{ flexShrink: 0, width: 5, height: 5, borderRadius: "50%", background: C.accent, marginTop: 8 }} />
                      <span style={{ color: C.gray500, lineHeight: 1.65, fontSize: "0.85rem" }}>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function Publications() {
  return (
    <section id="publications" style={{ padding: "7rem 2rem", background: C.navy }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <FadeIn>
          <SectionLabel icon={<BookOpen size={16} />} text="Achievements" />
          <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.4rem)", fontWeight: 800, color: C.white, margin: "0 0 0.75rem", letterSpacing: "-0.025em" }}>Publications & Credentials</h2>
          <div style={{ width: 48, height: 3, background: C.accent, borderRadius: 99, marginBottom: "3rem" }} />
        </FadeIn>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Research paper */}
          <FadeIn delay={0.05}>
            <div style={{ background: C.navyMid, borderRadius: 14, padding: "2rem", border: `1px solid ${C.slate}` }}>
              <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
                <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 10, background: `${C.accent}22`, border: `1px solid ${C.accent}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BookOpen size={20} color={C.accent} />
                </div>
                <div>
                  <div style={{ color: C.accent, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Research Publication · May 2026</div>
                  <h3 style={{ margin: "0 0 0.5rem", color: C.white, fontWeight: 700, fontSize: "1rem", lineHeight: 1.55 }}>
                    Rhamba: Region-Aware Hybrid Attention-Mamba Framework for Self-Supervised Learning in Resting-State fMRI
                  </h3>
                  <p style={{ margin: "0 0 0.75rem", color: C.gray300, fontSize: "0.87rem" }}>P. Eranki, et al. · <strong style={{ color: C.gray300 }}>arXiv:2605.01240</strong></p>
                  <a href="https://arxiv.org/abs/2605.01240" target="_blank" rel="noreferrer" style={{
                    display: "inline-flex", alignItems: "center", gap: 6, color: C.accent,
                    fontWeight: 600, fontSize: "0.85rem", textDecoration: "none",
                  }}>
                    View paper <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Certifications */}
          <FadeIn delay={0.1}>
            <div style={{ background: C.navyMid, borderRadius: 14, padding: "2rem", border: `1px solid ${C.slate}` }}>
              <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
                <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 10, background: `${C.gold}22`, border: `1px solid ${C.gold}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Award size={20} color={C.gold} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: C.gold, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>Professional Certifications</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                    {[
                      "AWS Certified Cloud Practitioner",
                      "Microsoft Azure Fundamentals (AZ-900)",
                      "Deep Learning Specialization — Andrew Ng (Coursera)",
                    ].map(cert => (
                      <div key={cert} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.gold, flexShrink: 0 }} />
                        <span style={{ color: C.gray300, fontSize: "0.9rem" }}>{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Education */}
          <FadeIn delay={0.15}>
            <div style={{ background: C.navyMid, borderRadius: 14, padding: "2rem", border: `1px solid ${C.slate}` }}>
              <div style={{ color: C.accent, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.25rem" }}>Education</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {[
                  { school: "University of Memphis", degree: "MS in Data Science", period: "Aug 2024 – May 2026", note: "GPA 3.87 / 4.0" },
                  { school: "Gayatri Vidya Parishad College of Engineering", degree: "B.E. Electronics & Communication Engineering", period: "Jul 2017 – Aug 2021", note: "GPA 8.63 / 10.0 · Top 10%" },
                ].map(ed => (
                  <div key={ed.school} style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", paddingBottom: "1.25rem", borderBottom: `1px solid ${C.slate}`, lastChild: { borderBottom: "none" } }}>
                    <div>
                      <div style={{ color: C.white, fontWeight: 700, fontSize: "0.95rem" }}>{ed.school}</div>
                      <div style={{ color: C.gray300, fontSize: "0.87rem", marginTop: 3 }}>{ed.degree}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: C.gray500, fontSize: "0.82rem" }}>{ed.period}</div>
                      <div style={{ color: C.accent, fontSize: "0.82rem", fontWeight: 600, marginTop: 3 }}>{ed.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: C.navy, borderTop: `1px solid ${C.slate}`, padding: "3rem 2rem", textAlign: "center" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginBottom: "1.5rem" }}>
          {[
            { href: "mailto:pratheek.eranki@gmail.com", icon: <Mail size={18} /> },
            { href: "https://github.com/PratheekEranki", icon: <Github size={18} /> },
            { href: "https://www.linkedin.com/in/pratheek-eranki-84657b424", icon: <Linkedin size={18} /> },
            { href: "tel:+19019028689", icon: <Phone size={18} /> },
          ].map(({ href, icon }) => (
            <a key={href} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" style={{ color: C.gray500, transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = C.accent}
              onMouseLeave={e => e.currentTarget.style.color = C.gray500}
            >{icon}</a>
          ))}
        </div>
        <p style={{ color: C.gray500, fontSize: "0.85rem", margin: "0 0 0.4rem" }}>Memphis, TN · pratheek.eranki@gmail.com · +1 901-902-8689</p>
        <p style={{ color: C.slate, fontSize: "0.78rem", margin: 0 }}>© 2026 Pratheek Eranki</p>
      </div>
    </footer>
  );
}

/* ── App ───────────────────────────────────────────────── */
export default function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", color: C.text }}>
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Hero />
      <Skills />
      <Experience />
      <Projects />
      <Publications />
      <Footer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        @keyframes bob {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(10px); }
        }
        @media (max-width: 680px) {
          .desk-nav { display: none !important; }
          .mob-nav  { display: block !important; }
          .exp-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
