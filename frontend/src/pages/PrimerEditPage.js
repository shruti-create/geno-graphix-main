import PrimerChosenForm from "../forms/PrimerEditorForm";
import PrimerInput from "../forms/PrimerInputForm";
import React, { useState, useCallback, useEffect, useRef } from "react";
import axios from 'axios';
import './PrimerEdit.css';
import BACKEND_URL from '../config';

// ── Helpers ────────────────────────────────────────────────────────
function revComp(seq) {
    const comp = { A: 'T', T: 'A', G: 'C', C: 'G' };
    return seq.toUpperCase().split('').reverse().map(c => comp[c] || c).join('');
}
function findPos(fullSeq, primerSeq) {
    const s = fullSeq.toUpperCase();
    const p = primerSeq.toUpperCase();
    if (!p || p.length > s.length) return null;
    let idx = s.indexOf(p);
    if (idx !== -1) return { start: idx, end: idx + p.length, strand: '+' };
    const rc = revComp(p);
    idx = s.indexOf(rc);
    if (idx !== -1) return { start: idx, end: idx + p.length, strand: '-' };
    let best = -1, bestScore = 0;
    for (let i = 0; i <= s.length - p.length; i++) {
        let m = 0;
        for (let j = 0; j < p.length; j++) if (s[i + j] === p[j]) m++;
        const sc = m / p.length;
        if (sc >= 0.6 && sc > bestScore) { bestScore = sc; best = i; }
    }
    if (best !== -1) return { start: best, end: best + p.length, strand: '~' };
    return null;
}
function calcGC(seq) {
    if (!seq.length) return 0;
    return Math.round(seq.toUpperCase().split('').filter(c => c === 'G' || c === 'C').length / seq.length * 100);
}
function calcTm(seq) {
    const s = seq.toUpperCase();
    const g = (s.match(/G/g) || []).length, c = (s.match(/C/g) || []).length;
    const a = (s.match(/A/g) || []).length, t = (s.match(/T/g) || []).length;
    return 4 * (g + c) + 2 * (a + t);
}

const PRIMER_COLORS = { FIP: '#2563eb', BIP: '#dc2626', F3: '#16a34a', B3: '#ea580c' };

// ── Inline Primer Map with drag ────────────────────────────────────
function InlinePrimerMap({ fullSequence, primers, onPrimerUpdate }) {
    const seqLen = fullSequence.length;
    const trackRef = useRef(null);
    const [dragging, setDragging] = useState(null);
    const [dragPreview, setDragPreview] = useState(null);

    const onMouseMove = useCallback((e) => {
        if (!dragging) return;
        const dx = e.clientX - dragging.startX;
        const bpPerPx = seqLen / dragging.trackWidth;
        const bpShift = Math.round(dx * bpPerPx);
        const newStart = Math.max(0, Math.min(seqLen - dragging.halfLen, dragging.initialStart + bpShift));
        setDragPreview({ label: dragging.label, start: newStart });
    }, [dragging, seqLen]);

    const onMouseUp = useCallback(() => {
        if (dragging && dragPreview && onPrimerUpdate) {
            const currentPrimer = primers.find(p => p.name === dragging.name);
            if (currentPrimer) {
                const rawSlice = fullSequence.slice(dragPreview.start, dragPreview.start + dragging.halfLen);
                // Segments found via RC match must be stored as RC(slice), not the slice directly
                const newHalfSeq = dragging.strand === '-' ? revComp(rawSlice) : rawSlice;
                let newFullSeq;
                if (dragging.halfIndex === -1) {
                    newFullSeq = newHalfSeq;
                } else if (dragging.halfIndex === 0) {
                    newFullSeq = newHalfSeq + currentPrimer.sequence.slice(dragging.firstHalfLen);
                } else {
                    newFullSeq = currentPrimer.sequence.slice(0, dragging.firstHalfLen) + newHalfSeq;
                }
                onPrimerUpdate(dragging.name, newFullSeq);
            }
        }
        setDragging(null);
        setDragPreview(null);
    }, [dragging, dragPreview, onPrimerUpdate, primers, fullSequence]);

    useEffect(() => {
        if (dragging) {
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
            return () => { window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('mouseup', onMouseUp); };
        }
    }, [dragging, onMouseMove, onMouseUp]);

    if (!seqLen) return null;

    const getSegments = (labelOverrides = {}) => {
        const segs = [];
        primers.forEach(primer => {
            const seq = primer.sequence.toUpperCase();
            const color = PRIMER_COLORS[primer.name] || '#64748b';
            if (primer.name === 'FIP' || primer.name === 'BIP') {
                const mid = Math.floor(seq.length / 2);
                const labels = primer.name === 'FIP' ? ['F1c', 'F2'] : ['B1c', 'B2'];
                [seq.slice(0, mid), seq.slice(mid)].forEach((half, i) => {
                    const label = labels[i];
                    const override = labelOverrides[label];
                    const halfLen = half.length;
                    if (override) {
                        segs.push({ label, fullName: primer.name, pos: { start: override.start, end: override.start + halfLen, strand: '+' }, color, opacity: i === 0 ? 0.5 : 1.0, halfLen, halfIndex: i, firstHalfLen: mid });
                    } else {
                        const pos = findPos(fullSequence, half);
                        if (pos) segs.push({ label, fullName: primer.name, pos, color, opacity: i === 0 ? 0.5 : 1.0, halfLen, halfIndex: i, firstHalfLen: mid });
                    }
                });
            } else {
                const override = labelOverrides[primer.name];
                if (override) {
                    segs.push({ label: primer.name, fullName: primer.name, pos: { start: override.start, end: override.start + seq.length, strand: '+' }, color, opacity: 1.0, halfLen: seq.length, halfIndex: -1, firstHalfLen: 0 });
                } else {
                    const pos = findPos(fullSequence, seq);
                    if (pos) segs.push({ label: primer.name, fullName: primer.name, pos, color, opacity: 1.0, halfLen: seq.length, halfIndex: -1, firstHalfLen: 0 });
                }
            }
        });
        return segs;
    };

    const segments = getSegments(dragPreview ? { [dragPreview.label]: dragPreview } : {});

    const onMouseDown = (e, seg) => {
        e.preventDefault();
        if (!trackRef.current) return;
        const trackRect = trackRef.current.getBoundingClientRect();
        setDragging({ name: seg.fullName, label: seg.label, halfIndex: seg.halfIndex, halfLen: seg.halfLen, firstHalfLen: seg.firstHalfLen, strand: seg.pos.strand, startX: e.clientX, initialStart: seg.pos.start, trackWidth: trackRect.width });
    };

    return (
        <div className="inline-map">
            <div className="inline-map-header">
                Primer Positions — {seqLen} bp
                <span className="drag-hint">Drag any segment to reposition it independently along the sequence</span>
            </div>
            <div className="inline-map-track" ref={trackRef} style={{ cursor: dragging ? 'grabbing' : 'default' }}>
                {[0.25, 0.5, 0.75].map(f => (
                    <div key={f} className="map-tick" style={{ left: `${f * 100}%` }} />
                ))}
                {segments.map((seg, i) => {
                    const left  = (seg.pos.start / seqLen) * 100;
                    const width = Math.max(1, ((seg.pos.end - seg.pos.start) / seqLen) * 100);
                    const dir = seg.pos.strand === '+' ? '→' : seg.pos.strand === '-' ? '←' : '≈';
                    return (
                        <div key={i} className="map-segment"
                            title={`${seg.label}: pos ${seg.pos.start}–${seg.pos.end} ${dir} — drag to reposition`}
                            onMouseDown={(e) => onMouseDown(e, seg)}
                            style={{ left: `${left}%`, width: `${width}%`, background: seg.color, opacity: seg.opacity, cursor: 'grab' }}
                        />
                    );
                })}
                {dragPreview && (
                    <div className="drag-preview-label" style={{ left: `${(dragPreview.start / seqLen) * 100}%` }}>
                        {dragPreview.label} pos {dragPreview.start}
                    </div>
                )}
            </div>
            <div className="inline-map-scale">
                <span>0</span><span>{Math.round(seqLen * 0.25)}</span>
                <span>{Math.round(seqLen * 0.5)}</span><span>{Math.round(seqLen * 0.75)}</span>
                <span>{seqLen}</span>
            </div>
            <div className="inline-map-legend">
                {primers.map(p => (
                    <div key={p.name} className="legend-item">
                        <div className="legend-swatch" style={{ background: PRIMER_COLORS[p.name] || '#64748b' }} />
                        <span className="legend-name">{p.name}</span>
                        <span className="legend-bp">{p.sequence.length} bp</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Detailed Map Modal ─────────────────────────────────────────────
function DetailedMapModal({ mapImage, onClose }) {
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);
    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <span className="modal-title">Detailed Primer Map</span>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="modal-body">
                    {mapImage
                        ? <img src={mapImage} alt="Detailed Primer Map" style={{ width: '100%', height: 'auto' }} />
                        : <div className="map-spinner-container"><div className="spinner" /><span>Generating map…</span></div>
                    }
                </div>
            </div>
        </div>
    );
}


// ── Main Page ──────────────────────────────────────────────────────
function PrimerEditPage() {
    const [submitted,        setSubmitted]        = useState(0);
    const [back,             setBack]             = useState(false);
    const [inputtedSequence, setInputtedSequence] = useState({ fullSequence: '', primers: [] });
    const [editingPrimer,    setEditingPrimer]    = useState(null);
    const [editedPrimer,     setEditedPrimer]     = useState({ name: '', sequence: '' });
    const [simulationOutput, setSimulationOutput] = useState(null);
    const [error,            setError]            = useState('');
    const [simTab,           setSimTab]           = useState('steps');
    const [expandedSteps,    setExpandedSteps]    = useState(new Set());
    const [warnOnly,         setWarnOnly]         = useState(true);

    const handleInputtedSequence = (fullSequence, primers) => setInputtedSequence({ fullSequence, primers });

    const runSimulation = useCallback(async () => {
        let sequence = inputtedSequence.fullSequence;
        let F2 = '', F1c = '', B2 = '', B1c = '';
        inputtedSequence.primers.forEach(primer => {
            const seq = primer.sequence, mid = Math.floor(seq.length / 2);
            switch (primer.name) {
                case 'FIP': F1c = seq.slice(0, mid); F2 = seq.slice(mid); break;
                case 'BIP': B1c = seq.slice(0, mid); B2 = seq.slice(mid); break;
                case 'F2':  F2 = seq;  break;
                case 'F1c': F1c = seq; break;
                case 'B2':  B2 = seq;  break;
                case 'B1c': B1c = seq; break;
                default: break;
            }
        });
        try {
            setError('');
            setSimulationOutput(null);
            setExpandedSteps(new Set());
            setSimTab('steps');
            const response = await axios.post(`${BACKEND_URL}/run-simulation`, { sequence, F2, F1c, B2, B1c });
            setSimulationOutput(response.data);
        } catch (err) {
            console.error('Error running simulation', err);
            setError('Could not reach the simulation server. Make sure the backend is running.');
        }
    }, [inputtedSequence]);

    const handleButtonClick  = () => { setBack(!back); setSubmitted(0); };
    const handleBackFromEdit = () => { setEditingPrimer(null); updateEditedPrimer(); };
    const handleValueChange  = (val) => setSubmitted(val ? 2 : 0);
    const handleEditPrimer   = (primer) => { setEditingPrimer(primer); setEditedPrimer({ name: '', sequence: '' }); };
    const handlePrimerChange = (name, seq) => setEditedPrimer({ name, sequence: seq });

    const updateEditedPrimer = () => setInputtedSequence(prev => ({
        ...prev,
        primers: prev.primers.map(p => p.name === editedPrimer.name ? { ...p, sequence: editedPrimer.sequence } : p),
    }));

    const handlePrimerDragUpdate = useCallback((name, newSeq) => {
        setInputtedSequence(prev => ({
            ...prev,
            primers: prev.primers.map(p => p.name === name ? { ...p, sequence: newSeq } : p),
        }));
    }, []);

    // Apply a suggested component (F2/F1c/B2/B1c) back into FIP or BIP
    const handleApplySuggestion = useCallback((componentName, componentOf, suggestedSeq) => {
        setInputtedSequence(prev => ({
            ...prev,
            primers: prev.primers.map(p => {
                if (p.name !== componentOf) return p;
                const mid = Math.floor(p.sequence.length / 2);
                const first = p.sequence.slice(0, mid);
                const second = p.sequence.slice(mid);
                const isFirst = (componentOf === 'FIP' && componentName === 'F1c') ||
                                (componentOf === 'BIP' && componentName === 'B1c');
                return { ...p, sequence: isFirst ? suggestedSeq + second : first + suggestedSeq };
            }),
        }));
        setSimulationOutput(null); // prompt user to re-run
    }, []);

    const saveToFile = () => {
        let text = `Full Sequence:\n${inputtedSequence.fullSequence}\n\nPrimers:\n`;
        inputtedSequence.primers.forEach(p => { text += `${p.name}: ${p.sequence}\n`; });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
        a.download = 'primers_and_sequence.txt';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
    };

    function ChooseForm() {
        if (editingPrimer) {
            return (
                <div>
                    <PrimerChosenForm
                        sequence={inputtedSequence.fullSequence}
                        inputtedSequence={editingPrimer.sequence}
                        onPrimerChange={(newSeq) => handlePrimerChange(editingPrimer.name, newSeq)}
                    />
                    <button className="action-btn secondary" style={{ marginTop: '16px' }}
                        onClick={() => { localStorage.clear(); handleBackFromEdit(); }}>
                        ← Back
                    </button>
                </div>
            );
        }

        if (submitted === 0 || (back && submitted === 0)) {
            return <PrimerInput onValueChange={handleValueChange} handleSequence={handleInputtedSequence} />;
        }

        if (submitted === 2) {
            return (
                <div>
                    {/* Primer position map */}
                    <InlinePrimerMap
                        fullSequence={inputtedSequence.fullSequence}
                        primers={inputtedSequence.primers}
                        onPrimerUpdate={handlePrimerDragUpdate}
                    />

                    {/* Two-column layout */}
                    <div className="results-layout">

                        {/* Left: primer list */}
                        <div className="results-main">
                            <p className="drag-instruction">
                                Drag the colored bars above to reposition a primer along the target sequence.
                                Click any primer card below to open the sequence editor.
                            </p>
                            <div className="primer-stack">
                                {inputtedSequence.primers.map(primer => {
                                    const seq = primer.sequence.toUpperCase();
                                    let posSpans;
                                    if (primer.name === 'FIP' || primer.name === 'BIP') {
                                        const mid = Math.floor(seq.length / 2);
                                        const [labelA, labelB] = primer.name === 'FIP' ? ['F1c', 'F2'] : ['B1c', 'B2'];
                                        const posA = findPos(inputtedSequence.fullSequence, seq.slice(0, mid));
                                        const posB = findPos(inputtedSequence.fullSequence, seq.slice(mid));
                                        posSpans = (
                                            <>
                                                {posA && <span>{labelA}: {posA.start}–{posA.end}</span>}
                                                {posB && <span>{labelB}: {posB.start}–{posB.end}</span>}
                                            </>
                                        );
                                    } else {
                                        const pos = findPos(inputtedSequence.fullSequence, seq);
                                        posSpans = pos ? <span>pos {pos.start}–{pos.end}</span> : null;
                                    }
                                    return (
                                        <button key={primer.name} className="primer-row-card" onClick={() => handleEditPrimer(primer)}>
                                            <div className="primer-row-left">
                                                <div className="primer-row-badge"
                                                    style={{ background: PRIMER_COLORS[primer.name] || '#64748b' }}>
                                                    {primer.name}
                                                </div>
                                                <div className="primer-row-stats">
                                                    <span>{primer.sequence.length} bp</span>
                                                    <span>GC {calcGC(primer.sequence)}%</span>
                                                    <span>Tm {calcTm(primer.sequence)}°C</span>
                                                    {posSpans}
                                                </div>
                                            </div>
                                            <div className="primer-row-seq">{primer.sequence}</div>
                                            <div className="primer-row-edit-hint">Edit →</div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right: LAMP simulation panel */}
                        <div className="results-side">
                            <div className="side-card">
                                <div className="side-card-title">LAMP Simulation</div>
                                <p className="side-card-desc">
                                    Validates primer positions on the target sequence through each step of the LAMP amplification mechanism.
                                    Expected order on sense strand: F2 → F1 → B1c → RC(B2).
                                </p>
                                <button className="action-btn full-width" onClick={runSimulation}>
                                    Run Simulation
                                </button>
                                {error && <div className="sim-error">{error}</div>}

                                {simulationOutput && (
                                    <div className="sim-output">
                                        <div className={`sim-overall ${simulationOutput.passed ? 'sim-pass' : 'sim-fail'}`}>
                                            {simulationOutput.passed ? '✓ All LAMP checks passed' : '✗ LAMP simulation failed'}
                                        </div>
                                        <div className="sim-summary">{simulationOutput.summary}</div>

                                        <div className="sim-tabs">
                                            <button className={`sim-tab ${simTab === 'steps' ? 'sim-tab-active' : ''}`} onClick={() => setSimTab('steps')}>
                                                Steps ({simulationOutput.steps.length})
                                            </button>
                                            <button className={`sim-tab ${simTab === 'insights' ? 'sim-tab-active' : ''}`} onClick={() => setSimTab('insights')}>
                                                Insights ({(simulationOutput.insights || []).filter(x => x.level === 'warning').length} warnings)
                                            </button>
                                            <button className={`sim-tab ${simTab === 'suggestions' ? 'sim-tab-active' : ''}`} onClick={() => setSimTab('suggestions')}>
                                                Suggestions ({(simulationOutput.suggestions || []).length})
                                            </button>
                                        </div>

                                        {simTab === 'steps' && (
                                            <div className="sim-steps">
                                                {simulationOutput.steps.map((step, i) => (
                                                    <div key={i}
                                                        className={`sim-step ${step.passed ? 'sim-step-pass' : 'sim-step-fail'}`}
                                                        onClick={() => setExpandedSteps(prev => { const s = new Set(prev); s.has(i) ? s.delete(i) : s.add(i); return s; })}>
                                                        <div className="sim-step-header">
                                                            <span className="sim-step-icon">{step.passed ? '✓' : '✗'}</span>
                                                            <span className="sim-step-name">Step {i + 1}: {step.step}</span>
                                                            {step.score != null && <span className="sim-step-score">{step.score}%</span>}
                                                            <span className="sim-step-toggle">{expandedSteps.has(i) ? '▲' : '▼'}</span>
                                                        </div>
                                                        {expandedSteps.has(i) && <div className="sim-step-detail">{step.detail}</div>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {simTab === 'insights' && (
                                            <div className="sim-insights">
                                                <div className="sim-insights-filter">
                                                    <button className={`filter-btn ${warnOnly ? 'filter-active' : ''}`} onClick={() => setWarnOnly(w => !w)}>
                                                        {warnOnly ? 'Show all' : 'Warnings only'}
                                                    </button>
                                                </div>
                                                {(simulationOutput.insights || [])
                                                    .filter(x => !warnOnly || x.level === 'warning')
                                                    .map((ins, i) => (
                                                    <div key={i} className={`sim-insight sim-insight-${ins.level}`}>
                                                        <div className="sim-insight-header">
                                                            <span className="sim-insight-icon">{ins.level === 'pass' ? '✓' : '⚠'}</span>
                                                            <span className="sim-insight-cat">{ins.category}</span>
                                                            <span className="sim-insight-primer">{ins.primer}</span>
                                                        </div>
                                                        <div className="sim-insight-msg">{ins.message}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {simTab === 'suggestions' && (
                                            <div className="sim-suggestions">
                                                {(simulationOutput.suggestions || []).length === 0 ? (
                                                    <div className="suggestion-none">
                                                        All primers already score at or near optimum — no improvements found nearby.
                                                    </div>
                                                ) : (simulationOutput.suggestions || []).map((s, i) => (
                                                    <div key={i} className="suggestion-card">
                                                        <div className="suggestion-header">
                                                            <span className="suggestion-badge" style={{ background: PRIMER_COLORS[s.componentOf] || '#64748b' }}>
                                                                {s.primer}
                                                            </span>
                                                            <span className="suggestion-score">
                                                                Score {s.scoreBefore} → <strong>{s.scoreAfter}</strong>
                                                                <span className="suggestion-delta">+{s.improvement}</span>
                                                            </span>
                                                        </div>
                                                        <div className="suggestion-reasons">
                                                            {s.reasons.map((r, j) => <span key={j} className="suggestion-reason">{r}</span>)}
                                                        </div>
                                                        <div className="suggestion-seqs">
                                                            <div className="suggestion-seq-row">
                                                                <span className="suggestion-seq-label">Current</span>
                                                                <code className="suggestion-seq suggestion-seq-old">{s.original}</code>
                                                            </div>
                                                            <div className="suggestion-seq-row">
                                                                <span className="suggestion-seq-label">Suggested</span>
                                                                <code className="suggestion-seq suggestion-seq-new">
                                                                    {s.suggested.split('').map((ch, ci) => {
                                                                        const changed = ci >= s.original.length || ch !== s.original[ci];
                                                                        return <span key={ci} className={changed ? 'seq-diff' : ''}>{ch}</span>;
                                                                    })}
                                                                </code>
                                                            </div>
                                                        </div>
                                                        <button className="action-btn small suggestion-apply"
                                                            onClick={() => handleApplySuggestion(s.primer, s.componentOf, s.suggested)}>
                                                            Apply — update {s.componentOf}
                                                        </button>
                                                    </div>
                                                ))}
                                                <p className="suggestion-note">
                                                    Suggestions are generated by scanning ±6 bp around each primer's current binding site
                                                    and optimising for GC content, nearest-neighbour Tm, 3' clamp, and structural complexity.
                                                    Re-run the simulation after applying.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <p className="disclaimer">
                                    Models positional ordering, NN thermodynamics (Tm, GC), strand displacement junction GC,
                                    amplification geometry, target secondary structure (seqfold), and no-template dumbbell risk.
                                    Does not model concentration-dependent kinetics, salt adjustments, or polymerase processivity.
                                    Experimental validation is required before use.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="results-footer">
                        <button className="action-btn secondary" onClick={() => { localStorage.clear(); handleButtonClick(); }}>← Back</button>
                        <button className="action-btn" onClick={saveToFile}>Save &amp; Download</button>
                    </div>
                </div>
            );
        }
    }

    return (
        <div className="page-wrapper">
            <div className="page-card">
                <ChooseForm />
            </div>
        </div>
    );
}

export default PrimerEditPage;
