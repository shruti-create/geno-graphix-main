import React, { useState } from "react";
import "./AboutPage.css";

const FEATURES = [
    {
        icon: "IN",
        title: "Sequence & Primer Input",
        desc: "Enter a full genomic target sequence and four LAMP primer sets — FIP (F1c+F2), BIP (B1c+B2), F3, and B3. Load sample primers to explore instantly.",
    },
    {
        icon: "MAP",
        title: "Interactive Primer Map",
        desc: "Drag any primer segment directly along the target sequence to reposition it. The primer sequence updates in real time based on where you drop it.",
    },
    {
        icon: "SIM",
        title: "LAMP Simulation",
        desc: "Run an 11-step mechanistic simulation validating primer geometry, nearest-neighbour Tm, strand displacement junctions, target secondary structure, and no-template dumbbell risk.",
    },
    {
        icon: "EDI",
        title: "Primer Sequence Editor",
        desc: "Click any nucleotide to select it, cycle bases A-T-G-C with a double-click, insert or delete bases, and see GC%, NN Tm, and a quality score update live.",
    },
    {
        icon: "BND",
        title: "Binding Sites & RNA Structure",
        desc: "View all fuzzy-match binding sites (>=65%) for each primer component on the target, with alignment coloring. Predict RNA secondary structure with an interactive forna diagram.",
    },
    {
        icon: "INS",
        title: "Insights & Suggestions",
        desc: "Get per-primer quality insights — GC content, Tm, 3' GC clamp, hairpin risk, complexity — plus an auto-suggested alternative primer with one-click apply.",
    },
];

const STEPS = [
    {
        num: "01",
        title: "Input Your Sequences",
        detail: "Paste a target DNA sequence and your LAMP primer sequences (FIP, BIP, F3, B3). Not sure where to start? Hit Load Sample Primers to populate example sequences from a real LAMP assay.",
    },
    {
        num: "02",
        title: "Visualize Primer Layout",
        detail: "The interactive primer map renders each primer component (F1c, F2, B1c, B2, F3, B3) as a color-coded bar positioned along the full sequence. Drag any bar to slide the primer window along the template.",
    },
    {
        num: "03",
        title: "Run the LAMP Simulation",
        detail: "Click Run Simulation to validate all 11 mechanistic LAMP steps — from F2 binding the sense strand through no-template dumbbell risk. Each step is scored and collapsible for detail.",
    },
    {
        num: "04",
        title: "Edit & Optimize",
        detail: "Click any primer card to open the editor. Adjust individual bases, review binding sites with alignment views, inspect RNA secondary structure, and apply AI-suggested primer alternatives.",
    },
    {
        num: "05",
        title: "Save & Download",
        detail: "Once satisfied, export all primer sequences as a plain-text file, or generate a detailed matplotlib primer map image for your records.",
    },
];

const FAQ = [
    {
        q: "What is LAMP and why does primer design matter?",
        a: "Loop-Mediated Isothermal Amplification (LAMP) amplifies DNA at a constant temperature — no thermal cycler needed. It requires six primers working in concert. Poor primer design causes self-amplification, primer dimers, or failed reactions, so careful optimization is essential.",
    },
    {
        q: "How does the LAMP simulation work?",
        a: "The simulation runs 11 ordered checks: F2 binding (fuzzy ≥80%), F1 downstream placement, FIP stem-loop, B1c placement, RC(B2) placement, BIP stem-loop, geometry (inner loop 40–60 bp, amplicon 120–300 bp), strand displacement junction GC, target secondary structure (seqfold), no-template dumbbell risk, and primer dimer detection.",
    },
    {
        q: "What is the primer quality score?",
        a: "Each primer is scored 0–100 based on: GC content (40–65% ideal, 25 pts), nearest-neighbour Tm in target range (25 pts), 3′ GC clamp (20 pts), no hairpin (15 pts), and no mono-nucleotide run ≥4 (15 pts).",
    },
    {
        q: "Why do FIP and BIP show two binding sites?",
        a: "FIP is a chimeric primer: F1c (reverse complement of F1) concatenated with F2. BIP similarly combines B1c and B2. Because they are not contiguous on the template, GenoGraphix splits each into its two components and finds binding sites for each half independently.",
    },
    {
        q: "What does dragging a primer segment do?",
        a: "Dragging shifts the primer window along the template sequence and extracts the new slice of DNA as the updated primer sequence. For FIP/BIP halves, only the dragged component is updated; the other half stays fixed.",
    },
];

function AccordionItem({ q, a }) {
    const [open, setOpen] = useState(false);
    return (
        <div className={`ab-faq-item ${open ? 'ab-faq-open' : ''}`} onClick={() => setOpen(o => !o)}>
            <div className="ab-faq-q">
                <span>{q}</span>
                <span className="ab-faq-chevron">{open ? '▲' : '▼'}</span>
            </div>
            {open && <div className="ab-faq-a">{a}</div>}
        </div>
    );
}

function AboutPage() {
    const [activeStep, setActiveStep] = useState(0);

    return (
        <div className="ab-page">

            {/* ── Hero ── */}
            <header className="ab-hero">
                <div className="ab-hero-inner">
                    <div className="ab-hero-badge">LAMP Primer Design Tool</div>
                    <h1 className="ab-hero-title">GenoGraphix</h1>
                    <p className="ab-hero-sub">
                        Design, visualize, simulate, and optimize LAMP primers — all in the browser.
                        No installs, no thermal cyclers, no guesswork.
                    </p>
                    <button className="ab-cta-btn" onClick={() => window.history.back()}>
                        Open the Tool
                    </button>
                </div>
            </header>

            {/* ── Background ── */}
            <section className="ab-section ab-two-col">
                <div className="ab-section-text">
                    <div className="ab-section-kicker">Background</div>
                    <h2>Why LAMP?</h2>
                    <p>
                        PCR has long been the gold standard for genetic amplification, but its dependence on precise temperature cycling makes it resource-intensive and lab-bound. <strong>Loop-Mediated Isothermal Amplification (LAMP)</strong> achieves the same goal at a single constant temperature, making it ideal for rapid field diagnostics, low-resource settings, and at-home testing.
                    </p>
                    <p>
                        LAMP requires six primers (F3, B3, FIP, BIP, and optionally LF/LB) to work in a carefully choreographed sequence. Getting primer design right is the difference between a clean result and a failed assay.
                    </p>
                </div>
                <div className="ab-stat-grid">
                    {[
                        { val: '6', label: 'Primers per assay' },
                        { val: '~60°C', label: 'Isothermal temp' },
                        { val: '30 min', label: 'Typical run time' },
                        { val: '11', label: 'Simulation steps' },
                    ].map(s => (
                        <div key={s.label} className="ab-stat-card">
                            <div className="ab-stat-val">{s.val}</div>
                            <div className="ab-stat-label">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Features ── */}
            <section className="ab-section ab-features-section">
                <div className="ab-section-kicker">What's inside</div>
                <h2>Features</h2>
                <div className="ab-feature-grid">
                    {FEATURES.map(f => (
                        <div key={f.title} className="ab-feature-card">
                            <div className="ab-feature-icon">{f.icon}</div>
                            <h3 className="ab-feature-title">{f.title}</h3>
                            <p className="ab-feature-desc">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── How It Works ── */}
            <section className="ab-section ab-how-section">
                <div className="ab-section-kicker">Workflow</div>
                <h2>How It Works</h2>
                <div className="ab-steps-layout">
                    <div className="ab-steps-nav">
                        {STEPS.map((s, i) => (
                            <button
                                key={i}
                                className={`ab-step-btn ${activeStep === i ? 'ab-step-active' : ''}`}
                                onClick={() => setActiveStep(i)}>
                                <span className="ab-step-num">{s.num}</span>
                                <span className="ab-step-label">{s.title}</span>
                            </button>
                        ))}
                    </div>
                    <div className="ab-step-detail-box">
                        <div className="ab-step-detail-num">{STEPS[activeStep].num}</div>
                        <h3 className="ab-step-detail-title">{STEPS[activeStep].title}</h3>
                        <p className="ab-step-detail-text">{STEPS[activeStep].detail}</p>
                    </div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section className="ab-section">
                <div className="ab-section-kicker">FAQ</div>
                <h2>Common Questions</h2>
                <div className="ab-faq-list">
                    {FAQ.map((item, i) => <AccordionItem key={i} {...item} />)}
                </div>
            </section>

            {/* ── Team ── */}
            <section className="ab-section">
                <div className="ab-section-kicker">The Team</div>
                <h2>About the Creators</h2>
                <p className="ab-team-intro">
                    GenoGraphix was built by undergraduate researchers from UC San Diego's 2024 Early Research Scholars Program.
                </p>
                <div className="ab-team-grid">
                    {[
                        { name: 'Shruti Bhamidipati', email: 'shruti.bhamidipati@gmail.com' },
                        { name: 'Vinuthna Maradana',  email: 'vinu.maradana@gmail.com' },
                        { name: 'Uliyaah Dionisio',   email: null },
                    ].map(m => (
                        <div key={m.name} className="ab-team-card">
                            <div className="ab-team-avatar">{m.name[0]}</div>
                            <div className="ab-team-name">{m.name}</div>
                            <div className="ab-team-school">UC San Diego · ERSP 2024</div>
                            {m.email && <a className="ab-team-email" href={`mailto:${m.email}`}>{m.email}</a>}
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="ab-footer">
                <button className="ab-back-btn" onClick={() => window.history.back()}>
                    ← Back to Home
                </button>
            </footer>
        </div>
    );
}

export default AboutPage;
