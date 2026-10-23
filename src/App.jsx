import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Code2,
  Download,
  Github,
  Linkedin,
  Mail,
  Menu,
  Moon,
  Search,
  Sun,
  X,
} from 'lucide-react';
import content from './portfolio.json';
import './styles.css';

const { profile, projects, experience, skills, education, certifications } = content;
const asset = (path) => `${import.meta.env.BASE_URL}${path}`;
const projectById = Object.fromEntries(projects.map((project) => [project.id, project]));
const projectFromHash = () =>
  window.location.hash.startsWith('#project/')
    ? (projectById[window.location.hash.slice(9)] ?? null)
    : null;
const isExternal = (url) => /^https?:/.test(url);
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function ThemeToggle() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme ?? 'dark');
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('theme', theme);
    } catch {
      // Storage can be unavailable (private mode); the theme still applies for this visit.
    }
  }, [theme]);
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={`Switch to ${next} theme`}
      onClick={() => setTheme(next)}
    >
      {theme === 'dark' ? (
        <Sun size={18} aria-hidden="true" />
      ) : (
        <Moon size={18} aria-hidden="true" />
      )}
    </button>
  );
}

// Counts a highlight's leading number up once it scrolls into view; the suffix stays fixed.
function CountUp({ value }) {
  const [, number, suffix] = value.match(/^([\d.]+)(.*)$/) ?? [null, null, value];
  const decimals = number?.split('.')[1]?.length ?? 0;
  const ref = useRef(null);
  const [shown, setShown] = useState(number ? (0).toFixed(decimals) : value);
  useEffect(() => {
    if (!number) return;
    if (prefersReducedMotion()) return setShown(number);
    let frame;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / 1400, 1);
        setShown((Number(number) * (1 - (1 - t) ** 3)).toFixed(decimals));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [number, decimals]);
  return (
    <strong ref={ref}>
      <span aria-hidden="true">{number ? `${shown}${suffix}` : value}</span>
      <span className="sr-only">{value}</span>
    </strong>
  );
}

function EvidenceLink({ link, className = '' }) {
  return (
    <a className={className} href={isExternal(link.url) ? link.url : asset(link.url)}>
      {link.label}
      <ArrowUpRight size={15} aria-hidden="true" />
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 941px)');
    const reset = () => setOpen(false);
    media.addEventListener('change', reset);
    return () => media.removeEventListener('change', reset);
  }, []);
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [open]);
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <a className="brand" href="#about" aria-label="Pratheek Eranki, home">
          <span className="monogram" aria-hidden="true">
            PE
          </span>
          <span>
            Pratheek Eranki<span className="brand-role">SOFTWARE · AI · DATA</span>
          </span>
        </a>
        <div className="header-actions">
          <ThemeToggle />
          <button
            ref={toggleRef}
            className="menu-toggle"
            type="button"
            aria-controls="main-navigation"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
        <nav
          id="main-navigation"
          aria-label="Main navigation"
          className={`main-nav ${open ? 'is-open' : ''}`}
        >
          {[
            ['work', 'Featured work'],
            ['experience', 'Experience'],
            ['projects', 'Projects'],
            ['research', 'Research'],
          ].map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
          <a className="nav-resume" href={asset('Pratheek-Eranki-Resume.pdf')}>
            Résumé
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
          <a className="nav-contact" href="#contact" onClick={() => setOpen(false)}>
            Let's talk
            <ArrowRight size={15} aria-hidden="true" />
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  const previewIds = ['fieldverify', 'homesearch', 'fixbot'];
  const [previewId, setPreviewId] = useState(previewIds[0]);
  const preview = projectById[previewId];
  return (
    <section
      id="about"
      className="hero"
      onPointerMove={(event) => {
        const box = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty('--spot-x', `${event.clientX - box.left}px`);
        event.currentTarget.style.setProperty('--spot-y', `${event.clientY - box.top}px`);
      }}
    >
      <div className="hero-backdrop" aria-hidden="true">
        <svg viewBox="0 0 2400 600" preserveAspectRatio="none">
          <path d="M0 300 C150 180 250 420 400 300 S650 180 800 300 S1050 420 1200 300 S1450 180 1600 300 S1850 420 2000 300 S2250 180 2400 300" />
          <path d="M0 380 C120 330 230 440 360 380 S600 320 720 380 S960 440 1080 380 S1320 320 1440 380 S1680 440 1800 380 S2040 320 2160 380 S2400 440 2400 380" />
          <path d="M0 220 C200 160 300 280 480 220 S800 160 960 220 S1280 280 1440 220 S1760 160 1920 220 S2240 280 2400 220" />
        </svg>
      </div>
      <div className="shell hero-grid">
        <div className="hero-copy">
          <p className="availability">
            <span aria-hidden="true" />
            Open to software, AI & data roles
          </p>
          <h1>
            Building software.
            <em>
              Making data useful.
              <span className="caret" aria-hidden="true" />
            </em>
          </h1>
          <p className="hero-intro">{profile.intro}</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#work">
              Explore my work
              <ArrowDown size={17} aria-hidden="true" />
            </a>
            <a className="button button-outline" href={asset('Pratheek-Eranki-Resume.pdf')}>
              <Download size={17} aria-hidden="true" />
              View résumé
            </a>
          </div>
        </div>
        <aside className="hero-showcase" aria-label="Interactive project preview">
          <div className="showcase-bar">
            <span className="mono">A LOOK INSIDE THE WORK</span>
            <span className="showcase-dot" aria-hidden="true" />
          </div>
          <fieldset className="preview-tabs">
            <legend className="sr-only">Choose a featured project preview</legend>
            {previewIds.map((id) => (
              <button
                key={id}
                type="button"
                aria-pressed={previewId === id}
                onClick={() => setPreviewId(id)}
              >
                {projectById[id].title}
              </button>
            ))}
          </fieldset>
          <a
            className="showcase-image"
            href={`#project/${preview.id}`}
            aria-label={`Explore ${preview.title} case study`}
          >
            <img
              key={preview.id}
              src={asset(preview.image)}
              alt={preview.imageAlt}
              width="960"
              height="560"
            />
          </a>
          <div className="showcase-caption">
            <div>
              <p className="project-eyebrow">{preview.eyebrow}</p>
              <h2>{preview.title}</h2>
              <p>
                {preview.id === 'fieldverify'
                  ? 'Application screenshot · Synthetic demo data'
                  : preview.signal}
              </p>
            </div>
            <a
              className="showcase-open"
              href={`#project/${preview.id}`}
              aria-label={`Open ${preview.title} case study`}
            >
              <ArrowUpRight size={23} aria-hidden="true" />
            </a>
          </div>
        </aside>
      </div>
      <ul className="shell hero-stats" aria-label="Highlights">
        {profile.highlights.map((item) => (
          <li key={item.label}>
            <CountUp value={item.value} />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
      <div className="shell hero-footer">
        <div className="hero-socials">
          <a href={profile.github}>
            <Github size={15} aria-hidden="true" />
            GitHub
          </a>
          <a href={profile.linkedin}>
            <Linkedin size={15} aria-hidden="true" />
            LinkedIn
          </a>
          <a href={`mailto:${profile.email}`}>
            <Mail size={15} aria-hidden="true" />
            Email
          </a>
        </div>
        <a href="#projects">
          {projects.length} project case studies
          <ArrowDown size={15} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

function SectionIntro({ eyebrow, title, children, id }) {
  return (
    <div className="section-intro">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id}>{title}</h2>
      </div>
      {children && <p>{children}</p>}
    </div>
  );
}

function ProjectActions({ project }) {
  const primaryLink =
    project.links.find((link) => /demo|dashboard/i.test(link.label)) ?? project.links[0];
  return (
    <div className="project-actions">
      <a
        className="case-link"
        href={`#project/${project.id}`}
        aria-label={`Read ${project.title} case study`}
      >
        Case study
        <ArrowRight size={16} aria-hidden="true" />
      </a>
      <EvidenceLink link={primaryLink} />
    </div>
  );
}

const focusAreas = [
  {
    title: 'Applied AI',
    text: 'Retrieval-augmented systems, agent workflows, and evaluation.',
    image: 'images/focus/applied-ai.svg',
  },
  {
    title: 'Research data',
    text: 'EEG and fMRI data preparation, clinical data pipelines, and statistical analysis.',
    image: 'images/focus/research-data.svg',
  },
  {
    title: 'Software engineering',
    text: 'Full-stack applications and enterprise delivery, built to be maintained.',
    image: 'images/focus/software.svg',
  },
];

function FocusAreas() {
  return (
    <section className="section focus-section" aria-labelledby="focus-title">
      <div className="shell">
        <SectionIntro eyebrow="Focus areas" title="Where the work sits" id="focus-title">
          Three areas, one through-line: software that makes data useful.
        </SectionIntro>
        <div className="focus-grid">
          {focusAreas.map((area) => (
            <article className="focus-card" key={area.title}>
              <img src={asset(area.image)} alt="" width="800" height="500" loading="lazy" />
              <div className="focus-text">
                <h3>{area.title}</h3>
                <p>{area.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedWork() {
  return (
    <section id="work" className="section featured-section" aria-labelledby="featured-title">
      <div className="shell">
        <SectionIntro
          eyebrow="FEATURED WORK"
          title="Selected work, built to explore."
          id="featured-title"
        >
          Research, agent systems, and application engineering—with the decisions and artifacts
          behind each.
        </SectionIntro>
        <div className="featured-grid">
          {projects
            .filter((p) => p.featured)
            .map((project) => (
              <article className="featured-card" key={project.id}>
                <a
                  className="project-image-link"
                  href={`#project/${project.id}`}
                  aria-label={`Explore ${project.title}`}
                >
                  <img
                    src={asset(project.image)}
                    alt={project.imageAlt}
                    width="800"
                    height="440"
                    loading="lazy"
                    decoding="async"
                  />
                </a>
                <div className="featured-card-body">
                  <p className="project-eyebrow">{project.eyebrow}</p>
                  <h3>{project.title}</h3>
                  <p className="project-summary">{project.summary}</p>
                  <p className="project-signal">
                    <span aria-hidden="true" />
                    {project.signal}
                  </p>
                  <ul className="tags" aria-label={`${project.title} technologies`}>
                    {project.tags.slice(0, 4).map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  <ProjectActions project={project} />
                </div>
              </article>
            ))}
        </div>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section
      id="experience"
      className="section experience-section"
      aria-labelledby="experience-title"
    >
      <div className="shell experience-layout">
        <div className="experience-intro">
          <p className="eyebrow">EXPERIENCE</p>
          <h2 id="experience-title">
            Software delivery.
            <br />
            Research workflows.
          </h2>
          <p>
            Enterprise application delivery, clinical research preparation, and legislative data
            analysis.
          </p>
          <a className="text-link" href={asset('Pratheek-Eranki-Resume.pdf')}>
            Read the résumé
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
        <div className="timeline">
          {experience.map((job) => (
            <article key={job.id} className="experience-item">
              <img
                className="experience-visual"
                src={asset(job.image)}
                alt={job.imageAlt}
                width="1200"
                height="340"
                loading="lazy"
              />
              <div className="experience-meta">
                <p className="mono">{job.period}</p>
                <span>{job.location}</span>
              </div>
              <h3>{job.role}</h3>
              <p className="company">{job.company}</p>
              <p className="experience-summary">{job.summary}</p>
              <ul className="tags experience-tags" aria-label={`${job.company} tools`}>
                {job.stack.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
              <ul>
                {job.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectLibrary() {
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const library = projects;
  const filters = ['All', 'Software', 'AI / ML', 'Data', 'Research'];
  const visible = library.filter(
    (p) =>
      (filter === 'All' || p.category === filter) &&
      `${p.title} ${p.summary} ${p.tags.join(' ')}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const clear = () => {
    setFilter('All');
    setQuery('');
  };
  return (
    <section id="projects" className="section project-section" aria-labelledby="projects-title">
      <div className="shell">
        <SectionIntro
          eyebrow="PROJECT CATALOGUE"
          title="Find the work that interests you."
          id="projects-title"
        >
          Browse software, AI experiments, analytics, and research. Each case study connects the
          approach to its evidence and limits.
        </SectionIntro>
        <div className="project-toolbar">
          <fieldset className="filters">
            <legend className="sr-only">Filter projects by discipline</legend>
            {filters.map((label) => (
              <button
                type="button"
                key={label}
                aria-pressed={filter === label}
                onClick={() => setFilter(label)}
              >
                {label}
                <span>
                  {label === 'All'
                    ? library.length
                    : library.filter((p) => p.category === label).length}
                </span>
              </button>
            ))}
          </fieldset>
          <label className="project-search">
            <Search size={17} aria-hidden="true" />
            <span className="sr-only">Search projects</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects or tools"
            />
          </label>
        </div>
        <div className="results-line">
          <p role="status" aria-live="polite">
            {visible.length} {visible.length === 1 ? 'project' : 'projects'}
            {query ? ` matching “${query}”` : filter !== 'All' ? ` in ${filter}` : ' to explore'}
          </p>
          {(query || filter !== 'All') && (
            <button type="button" onClick={clear}>
              Clear filters
              <X size={13} aria-hidden="true" />
            </button>
          )}
        </div>
        <div className="project-grid">
          {visible.map((project) => (
            <article className="project-card" key={project.id}>
              {project.image ? (
                <a
                  className="library-preview"
                  href={`#project/${project.id}`}
                  aria-label={`Preview ${project.title}`}
                >
                  <img
                    src={asset(project.image)}
                    alt={project.imageAlt}
                    width="800"
                    height="440"
                    loading="lazy"
                  />
                </a>
              ) : (
                <div
                  className={`library-diagram visual-${project.category.toLowerCase().replace(/[^a-z]/g, '')}`}
                  aria-hidden="true"
                >
                  <span className="diagram-label">{project.eyebrow}</span>
                  <div className="mini-flow">
                    {project.flow.slice(0, 3).map((step, i) => (
                      <span key={step}>
                        <i>{String(i + 1).padStart(2, '0')}</i>
                        {step}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="library-card-body">
                <div className="card-top">
                  <span className="category">{project.category}</span>
                  <Code2 size={17} aria-hidden="true" />
                </div>
                <h3>{project.title}</h3>
                <p className="project-summary">{project.summary}</p>
                <p className="project-signal">{project.signal}</p>
                <ul className="tags" aria-label={`${project.title} technologies`}>
                  {project.tags.slice(0, 4).map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                <ProjectActions project={project} />
              </div>
            </article>
          ))}
        </div>
        {visible.length === 0 && (
          <div className="empty-projects">
            <Search size={26} aria-hidden="true" />
            <h3>No matching projects</h3>
            <p>Try another tool, topic, or discipline.</p>
            <button className="button button-primary" type="button" onClick={clear}>
              Show all projects
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function Research() {
  const paper = projectById.rhamba.publication;
  return (
    <section id="research" className="section research-section" aria-labelledby="research-title">
      <div className="shell research-layout">
        <div>
          <p className="eyebrow">RESEARCH</p>
          <h2 id="research-title">
            A closer look
            <br />
            at Rhamba.
          </h2>
          <p className="research-intro">
            Collaborative work on representations for biomedical data.
          </p>
          <a className="text-link" href="#project/rhamba">
            My contribution & context
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
        <article className="publication">
          <p className="publication-status">
            <BookOpen size={16} aria-hidden="true" />
            Accepted · Computers in Biology and Medicine
          </p>
          <h3>{paper.title}</h3>
          <p className="publication-authors">
            {paper.authors.split('Pratheek Eranki')[0]}
            <strong>Pratheek Eranki</strong>
            {paper.authors.split('Pratheek Eranki')[1]}
          </p>
          <p className="publication-version">{paper.version}</p>
          <p className="publication-note">Acceptance status is reported on the arXiv record.</p>
          <a className="button button-light" href="https://arxiv.org/abs/2605.01240">
            Read the paper
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </article>
      </div>
    </section>
  );
}

function SkillsAndCredentials() {
  return (
    <>
      <section id="skills" className="section skills-section" aria-labelledby="skills-title">
        <div className="shell">
          <SectionIntro
            eyebrow="CAPABILITIES"
            title="Skills, connected to the work."
            id="skills-title"
          >
            A practical toolkit across modeling, applications, data, and delivery.
          </SectionIntro>
          <div className="skills-grid">
            {skills.map((group) => (
              <article className="skill-card" key={group.title}>
                <h3>{group.title}</h3>
                <ul className="tags">
                  {group.items.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
                <div className="skill-proof">
                  <span className="mono">IN PRACTICE</span>
                  {group.projectIds.slice(0, 2).map((id) => (
                    <a key={id} href={`#project/${id}`}>
                      {projectById[id].title}
                      <ArrowUpRight size={13} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section
        id="credentials"
        className="section credentials-section"
        aria-labelledby="credentials-title"
      >
        <div className="shell">
          <SectionIntro
            eyebrow="FOUNDATIONS"
            title="Education & credentials."
            id="credentials-title"
          />
          <div className="credentials-layout">
            <div className="education-list">
              {education
                .filter((item) => item.includeInPortfolio !== false)
                .map((item) => (
                  <article key={item.school}>
                    <p className="mono">{item.period}</p>
                    <h3>{item.degree}</h3>
                    <p>{item.school}</p>
                    <p className="education-note">{item.note}</p>
                  </article>
                ))}
            </div>
            <div className="certifications">
              <h3>Professional learning</h3>
              <ul>
                {certifications.map((cert) => (
                  <li key={cert.title}>
                    <Check size={15} aria-hidden="true" />
                    <div>
                      <strong>{cert.title}</strong>
                      <span>
                        {cert.issuer} · {cert.date}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <a className="text-link" href={profile.credentialsUrl}>
                View credentials on LinkedIn
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Contact() {
  return (
    <section id="contact" className="contact-section" aria-labelledby="contact-title">
      <div className="shell">
        <div className="contact-grid">
          <div>
            <p className="eyebrow">LET'S CONNECT</p>
            <h2 id="contact-title">
              Have something
              <br />
              worth building?
            </h2>
            <p>
              I'm interested in AI/ML and software engineering opportunities where I can bring
              research and implementation together.
            </p>
          </div>
          <div className="contact-actions">
            <a className="button button-primary" href={`mailto:${profile.email}`}>
              <Mail size={18} aria-hidden="true" />
              {profile.email}
            </a>
            <a
              className="button button-outline"
              href={asset('Pratheek-Eranki-Resume.pdf')}
              download
            >
              <Download size={17} aria-hidden="true" />
              Download résumé
            </a>
            <a className="resume-source-link" href={asset('Pratheek-Eranki-Resume.tex')} download>
              Download LaTeX source
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
            <span className="contact-location">{profile.location}</span>
          </div>
        </div>
        <footer>
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <div>
            <a href={profile.github}>
              <Github size={16} aria-hidden="true" />
              GitHub
            </a>
            <a href={profile.linkedin}>
              <Linkedin size={16} aria-hidden="true" />
              LinkedIn
            </a>
            <a href="#about">
              Back to top
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </footer>
      </div>
    </section>
  );
}

function ProjectDialog({ project, onClose }) {
  const dialogRef = useRef(null);
  const titleRef = useRef(null);
  useEffect(() => {
    if (!project) return;
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
    document.body.style.overflow = 'hidden';
    titleRef.current?.focus({ preventScroll: true });
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected && previousFocus !== document.body)
        previousFocus.focus({ preventScroll: true });
    };
  }, [project]);
  if (!project) return null;
  return (
    <dialog
      ref={dialogRef}
      className="project-dialog"
      aria-labelledby="case-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="dialog-content">
        <div className="dialog-top">
          <p className="eyebrow">{project.eyebrow} / CASE STUDY</p>
          <button className="dialog-close" type="button" onClick={onClose}>
            <X size={18} aria-hidden="true" />
            Close
          </button>
        </div>
        <h2 id="case-title" ref={titleRef} tabIndex={-1}>
          {project.title}
        </h2>
        <p className="case-summary">{project.summary}</p>
        <p className="case-role">
          <strong>My role</strong>
          {project.role}
        </p>
        <div className="case-links">
          {project.links.map((link) => (
            <EvidenceLink className="button button-small" link={link} key={link.url} />
          ))}
        </div>
        {project.image && (
          <figure className="case-image">
            <img
              src={asset(project.image)}
              alt={project.imageAlt}
              width="800"
              height="440"
              loading="lazy"
            />
            <figcaption>
              {project.id === 'rhamba'
                ? 'Explanatory workflow schematic.'
                : 'Screenshot from the project.'}
            </figcaption>
          </figure>
        )}
        <section>
          <h3>The problem</h3>
          <p>{project.problem}</p>
        </section>
        <section>
          <h3>My contribution</h3>
          <p>{project.contribution}</p>
        </section>
        <section>
          <h3>How it works</h3>
          <ol className="case-flow">
            {project.flow.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <ul className="case-list">
            {project.approach.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </section>
        <section>
          <h3>Evaluation & evidence</h3>
          <p>{project.evaluation.text}</p>
          {project.evaluation.rows && (
            <div
              className="table-scroll"
              tabIndex={0}
              role="region"
              aria-label={`${project.title} evaluation table; scroll horizontally if needed`}
            >
              <table>
                <caption className="sr-only">{project.title} saved evaluation results</caption>
                <thead>
                  <tr>
                    {project.evaluation.columns.map((col) => (
                      <th key={col} scope="col">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {project.evaluation.rows.map((row) => (
                    <tr key={row[0]}>
                      {row.map((value, index) =>
                        index === 0 ? (
                          <th key={index} scope="row">
                            {value}
                          </th>
                        ) : (
                          <td key={index}>{value}</td>
                        ),
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        <section className="limitations">
          <h3>Limitations & next steps</h3>
          <ul>
            {project.limitations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <div className="dialog-bottom">
          <span className="mono">{project.category}</span>
          <button className="button button-small" type="button" onClick={onClose}>
            Back to the portfolio
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default function App() {
  const [activeProject, setActiveProject] = useState(projectFromHash);
  useEffect(() => {
    const update = () => setActiveProject(projectFromHash());
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  // Cards tilt slightly toward the pointer; skipped for reduced motion and touch input.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const selector = '.featured-card, .project-card, .focus-card';
    const move = (event) => {
      const card = event.target.closest?.(selector);
      if (!card || event.pointerType !== 'mouse') return;
      const box = card.getBoundingClientRect();
      card.style.setProperty(
        '--tilt-x',
        `${((event.clientY - box.top) / box.height - 0.5) * -5}deg`,
      );
      card.style.setProperty(
        '--tilt-y',
        `${((event.clientX - box.left) / box.width - 0.5) * 5}deg`,
      );
    };
    const leave = (event) => {
      const card = event.target.closest?.(selector);
      if (card && !card.contains(event.relatedTarget)) {
        card.style.removeProperty('--tilt-x');
        card.style.removeProperty('--tilt-y');
      }
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerout', leave);
    return () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerout', leave);
    };
  }, []);
  const closeProject = () => {
    const anchor = activeProject?.featured ? 'work' : 'projects';
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${window.location.search}#${anchor}`,
    );
    setActiveProject(null);
  };
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <FocusAreas />
        <FeaturedWork />
        <Experience />
        <ProjectLibrary />
        <Research />
        <SkillsAndCredentials />
        <Contact />
      </main>
      <ProjectDialog project={activeProject} onClose={closeProject} />
    </>
  );
}
