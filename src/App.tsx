import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import {
  ArrowUpRight,
  ArrowDown,
  Code2,
  Cpu,
  Download,
  Mail,
  Linkedin,
  Sparkles,
  Globe2,
  Timer,
  Wallet,
  Dumbbell,
  MapPin,
  ArrowUp,
} from "lucide-react";

const projects = [
  {
    name: "Nabungin",
    type: "FINANCE × ARTIFICIAL INTELLIGENCE",
    label: "Aplikasi web",
    theme: "finance",
    icon: Wallet,
    headline: "Small steps.\nBigger dreams.",
    description:
      "Tabungan personal dan kolaboratif yang lebih terstruktur. Dari input bahasa sehari-hari menjadi transaksi, dengan fallback Groq, Gemini, dan parser NLP lokal.",
    tags: ["Next.js", "TypeScript", "Supabase", "Groq & Gemini"],
    features: [
      "Target tabungan",
      "Workspace kolaboratif",
      "Pencatatan AI / NLP",
    ],
    mark: "SAVE / TOGETHER",
    repo: "https://github.com/DickyAndrean07/nabungin",
    demo: "https://nabungin-drab.vercel.app/",
    image: "./projects/nabungin.webp",
    imageCaption: "Tampilan landing page · live demo Nabungin",
  },
  {
    name: "ZliritDO",
    type: "PRODUCTIVITY × DAILY DISCIPLINE",
    label: "Aplikasi web",
    theme: "focus",
    icon: Timer,
    headline: "Less noise.\nMore focus.",
    description:
      "Pelacak disiplin berbasis target waktu dengan dashboard progres, sesi fokus, timer, dan statistik harian. Mendukung penyimpanan aktivitas lokal, ekspor/impor JSON, serta suara timer sintetis melalui Web Audio API.",
    tags: ["JavaScript", "LocalStorage", "Web Audio API", "PWA"],
    features: ["Timer interaktif", "Pelacak kebiasaan", "Ekspor & impor JSON"],
    mark: "FOCUS / REPEAT",
    repo: "https://github.com/DickyAndrean07/ZliritDO",
    demo: "https://dickyandrean07.github.io/ZliritDO/",
    image: "./projects/zliritdo.webp",
    imageCaption: "Tampilan dashboard · live demo ZliritDO",
  },
  {
    name: "Desa Bendung",
    type: "COMMUNITY × DIGITAL EXPERIENCE",
    label: "Proyek KKN",
    theme: "village",
    icon: Globe2,
    headline: "Local stories.\nConnected people.",
    description:
      "Portal informasi desa yang menyatukan profil, UMKM, fasilitas, agenda, dan pengumuman. Dilengkapi peta interaktif, admin berbasis hak akses, serta asisten AI untuk draf konten.",
    tags: ["Laravel", "PHP", "MariaDB", "Leaflet & GSAP"],
    features: ["Peta interaktif", "Admin & Super Admin", "Asisten AI konten"],
    mark: "LOCAL / CONNECTED",
    repo: "https://github.com/DickyAndrean07/proker-kkn",
    demo: null,
    image: "./projects/bendung.webp",
    imageCaption: "Tampilan portal publik · dokumentasi repo Desa Bendung",
  },
  {
    name: "PancoKuy",
    type: "SPORT × COMMUNITY PLATFORM",
    label: "Dalam pengembangan",
    theme: "sport",
    icon: Dumbbell,
    headline: "Find your match.\nBuild your strength.",
    description:
      "Proyek skripsi komunitas arm wrestling yang sedang dikembangkan. Repo sudah memuat autentikasi Supabase, direktori basecamp, jadwal/event, dan form profil atlet. Challenge Mode, inbox sparing, serta rekomendasi Weighted Product masih tahap berikutnya.",
    tags: ["Next.js", "TypeScript", "Supabase Auth", "Tailwind CSS"],
    features: [
      "Direktori komunitas",
      "Jadwal & profil atlet",
      "Rencana: Matcher WP",
    ],
    mark: "STRONGER / TOGETHER",
    repo: "https://github.com/DickyAndrean07/pancokuy",
    demo: null,
    image: null,
    imageCaption: "Ringkasan progres repo · bukan screenshot aplikasi",
  },
];
const skills = [
  [
    "Web Development",
    "Membangun pengalaman web yang fungsional, responsif, dan mudah digunakan.",
    "React / Next.js / Laravel",
    Code2,
  ],
  [
    "AI Integration",
    "Menghubungkan kemampuan AI dengan kebutuhan aplikasi, termasuk pencatatan bahasa alami dan asisten konten.",
    "Groq / Gemini / NLP",
    Cpu,
  ],
  [
    "Data & Authentication",
    "Mengintegrasikan penyimpanan data dan autentikasi untuk mendukung alur aplikasi.",
    "Supabase / PostgreSQL / MariaDB",
    Globe2,
  ],
  [
    "Problem Solving",
    "Memahami proses, menyusun kebutuhan, dan merancang solusi digital yang relevan.",
    "Analisis / Perancangan sistem",
    Sparkles,
  ],
  [
    "Continuous Learning",
    "Terus belajar melalui proyek, eksplorasi teknologi, dan kesempatan berkolaborasi.",
    "Curiosity / Iteration / Growth",
    ArrowUpRight,
  ],
] as const;

function FadeIn({
  children,
  delay = 0,
  y = 30,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}
function ContactButton() {
  return (
    <a className="contact-button" href="#contact">
      Let's talk <ArrowUpRight size={19} />
    </a>
  );
}
function Magnet({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced || !matchMedia("(pointer:fine)").matches) return;
    const move = (e: MouseEvent) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const x = e.clientX - r.left - r.width / 2,
        y = e.clientY - r.top - r.height / 2;
      setPos(
        Math.abs(x) < r.width / 2 + 150 && Math.abs(y) < r.height / 2 + 150
          ? { x: x / 10, y: y / 10 }
          : { x: 0, y: 0 },
      );
    };
    const reset = () => setPos({ x: 0, y: 0 });
    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseleave", reset);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", reset);
    };
  }, [reduced]);
  return (
    <div
      ref={ref}
      className="magnet"
      style={{ transform: `translate3d(${pos.x}px,${pos.y}px,0)` }}
    >
      {children}
    </div>
  );
}
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const reduced = useReducedMotion();
  const y = useTransform(scrollYProgress, [0, 1], [0, 110]);
  return (
    <section ref={ref} className="hero" id="top">
      <FadeIn y={-20}>
        <nav aria-label="Navigasi utama">
          <a className="wordmark" href="#top">
            DA<span>®</span>
          </a>
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#projects">Projects</a>
            <a href="#contact">
              Contact <ArrowUpRight size={14} />
            </a>
          </div>
          <span className="nav-location">GRESIK, ID</span>
        </nav>
      </FadeIn>
      <FadeIn delay={0.15} className="hero-title">
        <div className="eyebrow hero-kicker">
          <span>WEB DEVELOPMENT & AI AUTOMATION</span>
          <span>PORTFOLIO / 2026</span>
        </div>
        <h1 className="hero-heading">HI, I'M DICKY</h1>
      </FadeIn>
      <motion.div className="portrait-wrap" style={{ y: reduced ? 0 : y }}>
        <FadeIn delay={0.4}>
          <div className="portrait-glow" />
          <Magnet>
            <img
              className="portrait"
              src="./portrait-transparent.png"
              alt="Avatar 3D pilihan M. Dicky Andrean"
              fetchPriority="high"
              width="850"
              height="850"
            />
          </Magnet>
        </FadeIn>
        <span className="portrait-label">A CURIOUS MIND, ALWAYS BUILDING.</span>
      </motion.div>
      <div className="hero-bottom">
        <FadeIn delay={0.3}>
          <span className="availability">
            <i /> OPEN TO INTERNSHIP
          </span>
          <p>
            Turning curiosity into
            <br />
            meaningful digital
            <br />
            <span>experiences.</span>
          </p>
          <a className="scroll-link" href="#projects">
            <ArrowDown size={16} /> SCROLL TO EXPLORE
          </a>
        </FadeIn>
        <FadeIn delay={0.5}>
          <ContactButton />
          <p className="hero-note">
            Mahasiswa Teknik Informatika.
            <br />
            Builder. Lifelong learner.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
function Marquee() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const right = useTransform(scrollYProgress, [0, 1], [-250, 0]);
  const left = useTransform(scrollYProgress, [0, 1], [0, -250]);
  return (
    <section
      ref={ref}
      className="marquee"
      aria-label="Eksplorasi visual proyek"
    >
      <div className="eyebrow marquee-label">
        IDEAS INTO INTERFACES <span>↓ SELECTED EXPLORATIONS</span>
      </div>
      {[0, 1].map((row) => (
        <motion.div
          key={row}
          className="marquee-row"
          style={{ x: reduced ? 0 : row ? left : right }}
          aria-hidden="true"
        >
          {[...projects, ...projects, ...projects].map((p, i) => (
            <div
              key={i}
              className={`mini-tile ${p.theme} ${p.image ? "has-preview" : ""}`}
            >
              {p.image && (
                <img
                  src={p.image}
                  alt=""
                  loading="lazy"
                  width="340"
                  height="210"
                />
              )}
              <p>{p.mark}</p>
              <p className="mini-name">
                {p.name}
                <p.icon size={34} />
              </p>
              <div className="mini-lines">
                <span />
                <span />
                <span />
              </div>
            </div>
          ))}
        </motion.div>
      ))}
      <p className="visual-note">
        Cuplikan demo & dokumentasi proyek asli · PancoKuy masih dalam
        pengembangan.
      </p>
    </section>
  );
}
function Character({
  char,
  index,
  length,
  progress,
}: {
  char: string;
  index: number;
  length: number;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(
    progress,
    [index / length, (index + 1) / length],
    [0.2, 1],
  );
  return <motion.span style={{ opacity }}>{char}</motion.span>;
}
function AnimatedText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"],
  });
  const reduced = useReducedMotion();
  let index = 0;
  return (
    <p ref={ref} className="about-copy" aria-label={text}>
      {reduced
        ? text
        : text.split(" ").map((word, i) => (
            <span className="word" aria-hidden="true" key={i}>
              {[...(word + " ")].map((char) => (
                <Character
                  key={index}
                  char={char}
                  index={index++}
                  length={text.length}
                  progress={scrollYProgress}
                />
              ))}
            </span>
          ))}
    </p>
  );
}
function About() {
  return (
    <section id="about" className="about section-pad">
      <div className="orb orb-one" aria-hidden="true" />
      <div className="orb orb-two" aria-hidden="true" />
      <span className="star star-one" aria-hidden="true">
        ✳
      </span>
      <span className="star star-two" aria-hidden="true">
        ✳
      </span>
      <FadeIn>
        <span className="eyebrow">01 / THE PERSON BEHIND THE PIXELS</span>
        <h2 className="section-heading hero-heading">ABOUT ME</h2>
      </FadeIn>
      <AnimatedText text="Saya Dicky, mahasiswa Teknik Informatika yang senang mengubah ide menjadi pengalaman digital. Melalui web development dan eksplorasi AI automation, saya belajar membangun solusi yang fungsional, mudah digunakan, dan punya tujuan. Kini, saya mencari kesempatan magang untuk belajar lebih jauh dan berkontribusi bersama tim." />
      <FadeIn>
        <p className="education">
          S1 Teknik Informatika · Universitas Muhammadiyah Gresik
          <br />
          <span>2023 — Sekarang · Gresik, Indonesia</span>
        </p>
        <a className="outline-button" href="./M-Dicky-Andrean-CV.pdf" download>
          Download CV <Download size={17} />
        </a>
      </FadeIn>
    </section>
  );
}
function Skills() {
  return (
    <section className="skills section-pad" id="skills">
      <FadeIn>
        <div className="section-meta">
          <span className="eyebrow">02 / WHAT I BRING</span>
          <span>LEARNING BY BUILDING.</span>
        </div>
        <h2 className="section-heading">MY TOOLKIT</h2>
      </FadeIn>
      <div className="skill-list">
        {skills.map(([name, description, tech, Icon], i) => (
          <FadeIn key={name} delay={i * 0.04}>
            <article className="skill">
              <span className="skill-number">0{i + 1}</span>
              <div>
                <h3>{name}</h3>
                <p>{description}</p>
                <span className="skill-tech">{tech}</span>
              </div>
              <Icon className="skill-icon" size={30} strokeWidth={1} />
            </article>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
function ProjectCard({
  project: p,
  index,
  progress,
}: {
  project: (typeof projects)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  const reduced = useReducedMotion();
  const scale = useTransform(
    progress,
    [index / projects.length, 1],
    [1, 1 - (projects.length - 1 - index) * 0.03],
  );
  return (
    <div className="project-slot">
      <motion.article
        className={`project-card ${p.theme}`}
        style={{
          scale: reduced ? 1 : scale,
          top: `calc(var(--stack-top) + ${index * 14}px)`,
        }}
      >
        <div className="project-top">
          <span className="project-number">0{index + 1}</span>
          <div>
            <p className="eyebrow">{p.type}</p>
            <h3>{p.name}</h3>
          </div>
          <span className="project-status">{p.label}</span>
        </div>
        <div className="project-visual">
          <div className="visual-side">
            <div className="visual-logo">
              <p.icon strokeWidth={1} size={50} />
              <span>
                {p.name}
                <small>{p.mark}</small>
              </span>
            </div>
            <div className="feature-panel">
              <span className="eyebrow">THE IDEA</span>
              {p.features.map((f, i) => (
                <div key={f}>
                  <span>0{i + 1}</span>
                  {f}
                  <ArrowUpRight size={15} />
                </div>
              ))}
            </div>
          </div>
          <figure
            className={`project-preview ${p.image ? "" : "development-preview"}`}
          >
            {p.image ? (
              <img
                src={p.image}
                alt={p.imageCaption}
                loading="lazy"
                width="1280"
                height="800"
              />
            ) : (
              <div className="development-board">
                <span className="eyebrow">PANCOKUY / BUILD LOG</span>
                <h4>
                  Community first.
                  <br />
                  Built step by step.
                </h4>
                <ul>
                  <li>
                    <span>01 / IMPLEMENTED</span>Auth, basecamp & events
                  </li>
                  <li>
                    <span>02 / IMPLEMENTED</span>Form profil atlet
                  </li>
                  <li>
                    <span>03 / PLANNED</span>Challenge & Sparing Matcher (WP)
                  </li>
                </ul>
              </div>
            )}
            <figcaption>{p.imageCaption}</figcaption>
          </figure>
        </div>
        <div className="project-description">
          <p>{p.description}</p>
          <div className="tags">
            {p.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
        <div className="project-links">
          <a
            href={p.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="outline-button"
            aria-label={`Lihat repo ${p.name}`}
          >
            Source code <Code2 size={15} />
          </a>
          {p.demo && (
            <a
              href={p.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="outline-button live-button"
              aria-label={`Buka live demo ${p.name}`}
            >
              Live demo <ArrowUpRight size={16} />
            </a>
          )}
        </div>
      </motion.article>
    </div>
  );
}
function Projects() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  return (
    <section className="projects section-pad" id="projects">
      <FadeIn>
        <div className="section-meta">
          <span className="eyebrow">03 / SELECTED WORK</span>
          <span>FOUR IDEAS. DIFFERENT POSSIBILITIES.</span>
        </div>
        <h2 className="section-heading hero-heading">
          PROJECTS<span className="project-count">(04)</span>
        </h2>
        <p className="projects-intro">
          Proyek yang membentuk cara saya berpikir, belajar, dan membangun.
          <br />
          <span>
            Screenshot dari demo dan dokumentasi repo asli. PancoKuy menampilkan
            ringkasan pengembangan.
          </span>
        </p>
      </FadeIn>
      <div className="project-stack" ref={ref}>
        {projects.map((p, i) => (
          <ProjectCard
            key={p.name}
            project={p}
            index={i}
            progress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  );
}
function Contact() {
  return (
    <footer id="contact" className="contact section-pad">
      <FadeIn>
        <span className="availability">
          <i /> OPEN TO INTERNSHIP & COLLABORATION
        </span>
        <h2>
          HAVE SOMETHING
          <br />
          <span className="hero-heading">IN MIND?</span>
          <a
            href="mailto:karangsawo123@gmail.com"
            className="contact-arrow"
            aria-label="Kirim email ke Dicky"
          >
            <ArrowUpRight />
          </a>
        </h2>
        <div className="contact-links">
          <a href="mailto:karangsawo123@gmail.com">
            <Mail size={19} />
            karangsawo123@gmail.com
            <ArrowUpRight size={18} />
          </a>
          <a
            href="https://www.linkedin.com/in/dickyandrean"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin size={19} />
            LinkedIn
            <ArrowUpRight size={18} />
          </a>
          <a
            href="https://wa.me/6283159384810"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
            <ArrowUpRight size={18} />
          </a>
        </div>
        <div className="footer-bottom">
          <span>© M. DICKY ANDREAN · BUILT WITH CURIOSITY</span>
          <span>
            <MapPin size={12} /> GRESIK, INDONESIA
          </span>
          <a href="#top">
            BACK TO TOP <ArrowUp size={14} />
          </a>
        </div>
      </FadeIn>
    </footer>
  );
}
export default function App() {
  const { scrollYProgress } = useScroll();
  return (
    <>
      <a className="skip-link" href="#about">
        Lewati navigasi
      </a>
      <motion.div
        className="scroll-progress"
        style={{ scaleX: scrollYProgress }}
      />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
    </>
  );
}
