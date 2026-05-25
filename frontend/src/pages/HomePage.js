import React from "react";
import backImage from '../components/genographix-back.png';
import './HomePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDna, faCogs, faChartBar, faUsers } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";

const ADVANTAGES = [
    {
        icon: faDna,
        title: "Comprehensive Analysis",
        desc: "Run an 11-step mechanistic LAMP simulation covering primer geometry, NN thermodynamics, target secondary structure, and no-template dumbbell risk.",
    },
    {
        icon: faCogs,
        title: "Easy Primer Design",
        desc: "Input FIP, BIP, F3, and B3 sequences, then drag primer segments along the target to reposition them — the sequence updates instantly.",
    },
    {
        icon: faChartBar,
        title: "Efficient Visualization",
        desc: "View each primer component on an interactive map, inspect binding sites with alignment coloring, and explore RNA secondary structure with a forna diagram.",
    },
    {
        icon: faUsers,
        title: "Accessible for All",
        desc: "Free, browser-based, and designed for researchers, educators, and at-home users — no installs or lab equipment required.",
    },
];

function HomePage() {
    function scrollToSection() {
        const section = document.querySelector('.hp-why-section');
        section.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <div className="hp-page">

            {/* ── Hero ── */}
            <div className="hp-hero" style={{ backgroundImage: `url(${backImage})` }}>
                <div className="hp-hero-overlay" />
                <div className="hp-hero-content">
                    <div className="hp-hero-badge">LAMP Primer Design Tool</div>
                    <h1 className="hp-hero-title">GenoGraphix</h1>
                    <p className="hp-hero-sub">
                        A free interactive tool to design, visualize, simulate, and optimize LAMP primers — all in the browser.
                    </p>
                    <div className="hp-hero-btns">
                        <Link to="/primer-edit-page">
                            <button className="hp-btn-primary">Open Primer Editor</button>
                        </Link>
                        <Link to="/about-page">
                            <button className="hp-btn-secondary">Learn More</button>
                        </Link>
                    </div>
                </div>
                <div className="hp-scroll-arrow" onClick={scrollToSection}>&#x2193;</div>
            </div>

            {/* ── Why section ── */}
            <section className="hp-why-section">
                <div className="hp-section-kicker">Why GenoGraphix</div>
                <h2 className="hp-section-heading">Built for real LAMP primer work</h2>
                <div className="hp-advantages-grid">
                    {ADVANTAGES.map(a => (
                        <div key={a.title} className="hp-advantage-card">
                            <div className="hp-adv-icon-wrap">
                                <FontAwesomeIcon icon={a.icon} className="hp-adv-icon" />
                            </div>
                            <h3 className="hp-adv-title">{a.title}</h3>
                            <p className="hp-adv-desc">{a.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Explore section ── */}
            <section className="hp-explore-section">
                <div className="hp-section-kicker">Get started</div>
                <h2 className="hp-section-heading">Explore GenoGraphix</h2>
                <div className="hp-explore-grid">
                    <div className="hp-explore-card">
                        <div className="hp-explore-icon">01</div>
                        <h3 className="hp-explore-title">Primer Editor</h3>
                        <p className="hp-explore-desc">
                            Input your target sequence and LAMP primers, run the LAMP simulation, drag segments to reposition, and edit individual nucleotides with live quality scoring.
                        </p>
                        <Link to="/primer-edit-page">
                            <button className="hp-explore-btn hp-explore-btn-primary">Open Editor</button>
                        </Link>
                    </div>
                    <div className="hp-explore-card">
                        <div className="hp-explore-icon hp-explore-icon-light">02</div>
                        <h3 className="hp-explore-title">About GenoGraphix</h3>
                        <p className="hp-explore-desc">
                            Learn how LAMP works, what each feature does, how the simulation is scored, and why primer design matters for accurate diagnostics.
                        </p>
                        <Link to="/about-page">
                            <button className="hp-explore-btn hp-explore-btn-secondary">Read More</button>
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}

export default HomePage;
