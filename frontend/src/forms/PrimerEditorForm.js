import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import axios from 'axios';
import './PrimerEditorForm.css';
import BACKEND_URL from '../config';
import { FornaContainer } from 'fornac';

// ── Nearest-neighbour Tm (SantaLucia 1998, 1 M NaCl, 250 nM primer) ──
const NN = {
    AA:[-7.9,-22.2], AT:[-7.2,-20.4], AC:[-8.4,-22.4], AG:[-7.8,-21.0],
    TA:[-7.2,-21.3], TT:[-7.9,-22.2], TC:[-8.2,-22.2], TG:[-8.5,-22.7],
    CA:[-8.5,-22.7], CT:[-7.8,-21.0], CC:[-8.0,-19.9], CG:[-10.6,-27.2],
    GA:[-8.2,-22.2], GT:[-8.4,-22.4], GC:[-9.8,-24.4], GG:[-8.0,-19.9],
};
const INIT_GC = [0.1, -2.8], INIT_AT = [2.3, 4.1];
const R_GAS = 1.987, CT = 250e-9;

function calcTmNN(seq) {
    seq = seq.toUpperCase();
    if (seq.length < 2) return 0;
    let dH = ('GC'.includes(seq[0]) ? INIT_GC[0] : INIT_AT[0]) +
             ('GC'.includes(seq[seq.length - 1]) ? INIT_GC[0] : INIT_AT[0]);
    let dS = ('GC'.includes(seq[0]) ? INIT_GC[1] : INIT_AT[1]) +
             ('GC'.includes(seq[seq.length - 1]) ? INIT_GC[1] : INIT_AT[1]);
    for (let i = 0; i < seq.length - 1; i++) {
        const p = seq[i] + seq[i + 1];
        if (NN[p]) { dH += NN[p][0]; dS += NN[p][1]; }
    }
    return Math.round(((dH * 1000) / (dS + R_GAS * Math.log(CT / 4)) - 273.15) * 10) / 10;
}

function calcGC(seq) {
    if (!seq.length) return 0;
    return Math.round(seq.toUpperCase().split('').filter(c => 'GC'.includes(c)).length / seq.length * 100);
}

function revComp(seq) {
    const m = { A: 'T', T: 'A', G: 'C', C: 'G' };
    return seq.toUpperCase().split('').reverse().map(c => m[c] || 'N').join('');
}

function hasRun(seq) { return /(.)\1{3,}/.test(seq.toUpperCase()); }

function checkHairpin(seq, stem = 4) {
    const s = seq.toUpperCase();
    if (s.length < stem * 2 + 4) return false;
    return s.slice(0, -stem).includes(revComp(s.slice(-stem)));
}

function findAllMappings(fullSeq, primer, minScore = 0.65) {
    const s = fullSeq.toUpperCase(), p = primer.toUpperCase();
    const n = p.length;
    if (!s || !p || n > s.length) return [];
    const raw = [];
    for (const [strand, query] of [['+', p], ['-', revComp(p)]]) {
        for (let i = 0; i <= s.length - n; i++) {
            let m = 0;
            for (let j = 0; j < n; j++) if (s[i + j] === query[j]) m++;
            const score = m / n;
            if (score >= minScore) raw.push({ start: i, end: i + n, score, strand, slice: s.slice(i, i + n) });
        }
    }
    raw.sort((a, b) => b.score - a.score || a.start - b.start);
    const out = [];
    for (const r of raw) {
        if (!out.some(d => Math.abs(d.start - r.start) < n / 2)) out.push(r);
        if (out.length >= 5) break;
    }
    return out;
}

function scorePrimer(seq, name) {
    let score = 0;
    const gc = calcGC(seq) / 100, tm = calcTmNN(seq);
    const outer = ['F2', 'B2', 'F3', 'B3'].includes(name);
    const [lo, hi] = outer ? [68, 76] : [70, 78];
    score += (gc >= 0.40 && gc <= 0.65) ? 25 : Math.max(0, 25 - Math.abs(gc - 0.525) * 100);
    score += (tm >= lo && tm <= hi) ? 25 : Math.max(0, 25 - Math.min(Math.abs(tm - lo), Math.abs(tm - hi)) * 4);
    const last2 = seq.slice(-2).toUpperCase();
    score += last2.split('').filter(b => 'GC'.includes(b)).length * 10;
    if (!checkHairpin(seq)) score += 15;
    if (!hasRun(seq)) score += 15;
    return Math.round(score);
}

function computeInsights(seq, name) {
    const s = seq.toUpperCase(), gc = calcGC(s), tm = calcTmNN(s), n = s.length;
    const outer = ['F2', 'B2', 'F3', 'B3'].includes(name);
    const [lo, hi] = outer ? [68, 76] : [70, 78];
    const ins = (cat, level, msg) => ({ cat, level, msg });
    return [
        n < 15  ? ins('Length', 'warning', `${n} bp — below minimum 15 bp. Too short for specific binding.`)
        : n > 28 ? ins('Length', 'warning', `${n} bp — above recommended 28 bp. May form secondary structures.`)
        :           ins('Length', 'pass', `${n} bp is within the recommended 15–28 bp range.`),

        gc < 40  ? ins('GC Content', 'warning', `${gc}% GC — below optimal 40–65%. Low GC reduces binding stability.`)
        : gc > 65 ? ins('GC Content', 'warning', `${gc}% GC — above optimal 40–65%. High GC promotes secondary structures.`)
        :            ins('GC Content', 'pass', `${gc}% GC is within the optimal 40–65% range.`),

        tm < lo  ? ins('Melting Temp', 'warning', `Tm ≈ ${tm}°C — below target ${lo}–${hi}°C. Increase GC content or extend the primer.`)
        : tm > hi ? ins('Melting Temp', 'warning', `Tm ≈ ${tm}°C — above target ${lo}–${hi}°C. Reduce GC content or shorten the primer.`)
        :            ins('Melting Temp', 'pass', `Tm ≈ ${tm}°C (nearest-neighbour, 1M NaCl) is within the ${lo}–${hi}°C target.`),

        (() => {
            const last2 = s.slice(-2), clamp = last2.split('').filter(b => 'GC'.includes(b)).length;
            return clamp === 0
                ? ins("3' GC Clamp", 'warning', `Ends in '${last2}' — no G/C in last 2 bases. A 3' clamp improves polymerase grip and reduces mispriming.`)
                : ins("3' GC Clamp", 'pass', `${clamp} G/C in last 2 bases ('${last2}') — good 3' stability.`);
        })(),

        checkHairpin(s)
            ? ins('Hairpin', 'warning', `3' end can fold onto an internal region — may block polymerase extension.`)
            : ins('Hairpin', 'pass', `No significant 3' hairpin detected.`),

        hasRun(s)
            ? ins('Complexity', 'warning', `Contains 4+ identical consecutive bases — risk of polymerase slippage or non-specific binding.`)
            : ins('Complexity', 'pass', `No low-complexity mono-nucleotide runs detected.`),
    ];
}

function findSuggestion(fullSeq, primer, primaryMapping, name) {
    if (!primaryMapping) return null;
    const { start, strand } = primaryMapping;
    const s = fullSeq.toUpperCase(), n = primer.length;
    const cur = scorePrimer(primer, name);
    let best = cur, bestSeq = null;
    for (let off = -6; off <= 6; off++) {
        const ns = start + off;
        if (ns < 0) continue;
        for (let len = Math.max(15, n - 3); len <= Math.min(28, n + 3); len++) {
            if (ns + len > s.length) continue;
            const slice = s.slice(ns, ns + len);
            const cand = strand === '-' ? revComp(slice) : slice;
            const sc = scorePrimer(cand, name);
            if (sc > best) { best = sc; bestSeq = cand; }
        }
    }
    if (!bestSeq) return null;
    const ogGC = calcGC(primer), sugGC = calcGC(bestSeq);
    const ogTm = calcTmNN(primer), sugTm = calcTmNN(bestSeq);
    const outer = ['F2', 'B2', 'F3', 'B3'].includes(name);
    const [lo, hi] = outer ? [68, 76] : [70, 78];
    const reasons = [];
    if (Math.abs(sugGC - 52) < Math.abs(ogGC - 52)) reasons.push(`GC ${ogGC}%→${sugGC}%`);
    if ((sugTm >= lo && sugTm <= hi) && !(ogTm >= lo && ogTm <= hi)) reasons.push(`Tm ${ogTm}°C→${sugTm}°C (in range)`);
    if (bestSeq.length !== n) reasons.push(`Length ${n}→${bestSeq.length} bp`);
    if (!reasons.length) reasons.push('Overall quality improved');
    return { seq: bestSeq, scoreBefore: cur, scoreAfter: best, improvement: best - cur, reasons };
}

// ── Base colour for nucleotide grid ───────────────────────────────
const BASE_COLORS = { A: '#ef4444', T: '#3b82f6', G: '#f59e0b', C: '#22c55e' };
const PRIMER_LABEL_COLORS = { FIP: '#2563eb', BIP: '#dc2626', F3: '#16a34a', B3: '#ea580c', F2: '#2563eb', F1c: '#2563eb', B2: '#dc2626', B1c: '#dc2626' };

// ── Main component ─────────────────────────────────────────────────
function PrimerEditorForm({ sequence, inputtedSequence, onPrimerChange, primerName }) {
    const [seq,              setSeq]              = useState(inputtedSequence || '');
    const [tab,              setTab]              = useState('edit');
    const [selectedIdx,      setSelectedIdx]      = useState(null);
    const [expandedInsights, setExpandedInsights] = useState(new Set());
    const [structure,        setStructure]        = useState('');
    const [structureLoading, setStructureLoading] = useState(false);
    const fornaRef    = useRef(null);
    const didMountRef = useRef(false);

    useEffect(() => { if (inputtedSequence) setSeq(inputtedSequence); }, [inputtedSequence]);

    // FIP/BIP are chimeric (F1c+F2 or B1c+B2) — split for mapping
    const isComposite = primerName === 'FIP' || primerName === 'BIP';
    const componentLabels = primerName === 'FIP' ? ['F1c', 'F2'] : ['B1c', 'B2'];
    const mid = Math.floor(seq.length / 2);

    // Live derived values
    const gc       = calcGC(seq);
    const tm       = calcTmNN(seq);
    const score    = useMemo(() => scorePrimer(seq, primerName), [seq, primerName]);
    const mappings = useMemo(() => {
        if (!sequence || !seq) return [];
        if (isComposite) {
            const firstHalf  = seq.slice(0, mid);
            const secondHalf = seq.slice(mid);
            const [labelA, labelB] = componentLabels;
            return [
                ...findAllMappings(sequence, firstHalf).map(m => ({ ...m, component: labelA, componentSeq: firstHalf })),
                ...findAllMappings(sequence, secondHalf).map(m => ({ ...m, component: labelB, componentSeq: secondHalf })),
            ];
        }
        return findAllMappings(sequence, seq);
    }, [sequence, seq, isComposite, mid, componentLabels]);
    const insights = useMemo(() => computeInsights(seq, primerName), [seq, primerName]);
    const suggestion = useMemo(() => {
        if (isComposite) return null;
        return findSuggestion(sequence, seq, mappings[0], primerName);
    }, [sequence, seq, mappings, primerName, isComposite]);

    const name     = primerName || 'Primer';
    const color    = PRIMER_LABEL_COLORS[name] || '#64748b';

    // ── Sequence editing ─────────────────────────────────────────
    const cycleBase = (i) => {
        const order = ['A', 'T', 'G', 'C'];
        const cur   = seq[i].toUpperCase();
        const next  = order[(order.indexOf(cur) + 1) % 4];
        const updated = seq.slice(0, i) + next + seq.slice(i + 1);
        setSeq(updated);
        setSelectedIdx(i);
    };

    const setBase = (i, base) => {
        const updated = seq.slice(0, i) + base + seq.slice(i + 1);
        setSeq(updated); setSelectedIdx(i);
    };

    const deleteBase = (i) => {
        const updated = seq.slice(0, i) + seq.slice(i + 1);
        setSeq(updated); setSelectedIdx(Math.min(i, updated.length - 1));
    };

    const insertBefore = (i, base) => {
        const updated = seq.slice(0, i) + base + seq.slice(i);
        setSeq(updated); setSelectedIdx(i);
    };

    // ── RNA structure (forna) — auto-loads and reloads on seq change ─
    const loadStructure = useCallback(async (s) => {
        const target = s || seq;
        if (!target) return;
        setStructureLoading(true);
        try {
            const res = await axios.post(`${BACKEND_URL}/update-sequence`, { sequence: target });
            setStructure(res.data.structure);
        } catch { setStructure(''); }
        setStructureLoading(false);
    }, [seq]);

    // Load on mount
    useEffect(() => { loadStructure(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Debounced reload when sequence changes — skip the initial mount run
    // didMountRef starts false; the first time this effect fires (mount) we mark it and skip;
    // every subsequent run (actual seq change) schedules the debounce.
    useEffect(() => {
        if (!didMountRef.current) { didMountRef.current = true; return; }
        const t = setTimeout(() => loadStructure(seq), 1200);
        return () => clearTimeout(t);
    }, [seq]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (tab !== 'edit') return;
        if (!fornaRef.current || !seq || !structure || structure.length !== seq.length) return;
        fornaRef.current.innerHTML = '';
        try {
            const fc = new FornaContainer(fornaRef.current, { allowPanningAndZooming: true, zoomOnScroll: false });
            fc.addRNA(structure, {
                sequence: seq,
                name: 'primer',
                charHeight: 13, charWidth: 9,
                color: ({ base }) => BASE_COLORS[base] || '#94a3b8',
            });
        } catch (e) { console.error('Forna error:', e); }
    }, [seq, structure, tab]); // eslint-disable-line react-hooks/exhaustive-deps

    const save = () => { localStorage.setItem('primerInput', seq); onPrimerChange(seq); };

    // ── Score colour ─────────────────────────────────────────────
    const scoreColor = score >= 80 ? '#16a34a' : score >= 60 ? '#d97706' : '#dc2626';
    const scoreBg    = score >= 80 ? '#f0fdf4' : score >= 60 ? '#fffbeb' : '#fef2f2';
    const scoreBorder = score >= 80 ? '#bbf7d0' : score >= 60 ? '#fde68a' : '#fecaca';

    return (
        <div className="pe-wrap">
            {/* Header */}
            <div className="pe-header">
                <span className="pe-name-badge" style={{ background: color }}>{name}</span>
                <div className="pe-stats">
                    <span>{seq.length} bp</span>
                    <span>GC {gc}%</span>
                    <span>Tm {tm}°C</span>
                    <span style={{ color: scoreColor, fontWeight: 700 }}>Score {score}/100</span>
                </div>
                <button className="pe-save-btn" onClick={save}>Save Changes</button>
            </div>

            {/* Tab bar */}
            <div className="pe-tabs">
                <button className={`pe-tab ${tab === 'edit' ? 'pe-tab-active' : ''}`} onClick={() => setTab('edit')}>
                    Edit Sequence
                </button>
                <button className={`pe-tab ${tab === 'mappings' ? 'pe-tab-active' : ''}`} onClick={() => setTab('mappings')}>
                    Binding Sites ({mappings.length})
                </button>
                <button className={`pe-tab ${tab === 'insights' ? 'pe-tab-active' : ''}`} onClick={() => setTab('insights')}>
                    Insights ({insights.filter(i => i.level === 'warning').length} warnings)
                </button>
            </div>

            {/* ── Edit tab (two-column) ─────────────────────────── */}
            {tab === 'edit' && (
                <div className="pe-edit-layout">

                    {/* Left column: sequence editor */}
                    <div className="pe-edit-left">
                        <div className="pe-section-label">Click any base to select, double-click to cycle A→T→G→C</div>

                        <div className="pe-nuc-grid">
                            {seq.split('').map((base, i) => (
                                <button key={i}
                                    className={`pe-nuc ${selectedIdx === i ? 'pe-nuc-selected' : ''}`}
                                    style={{ '--base-color': BASE_COLORS[base.toUpperCase()] || '#94a3b8' }}
                                    onClick={() => { if (selectedIdx === i) cycleBase(i); else setSelectedIdx(i); }}
                                    title={`Position ${i + 1}: ${base}`}
                                    onDoubleClick={() => cycleBase(i)}>
                                    <span className="pe-nuc-base">{base}</span>
                                    <span className="pe-nuc-idx">{i + 1}</span>
                                </button>
                            ))}
                        </div>

                        {selectedIdx !== null && selectedIdx < seq.length && (
                            <div className="pe-base-controls">
                                <span className="pe-base-controls-label">
                                    Position {selectedIdx + 1} · <strong>{seq[selectedIdx]}</strong>
                                </span>
                                <div className="pe-base-btns">
                                    <span className="pe-ctrl-hint">Change to:</span>
                                    {['A', 'T', 'G', 'C'].map(b => (
                                        <button key={b} className="pe-base-btn"
                                            style={{ background: BASE_COLORS[b], opacity: seq[selectedIdx].toUpperCase() === b ? 0.4 : 1 }}
                                            disabled={seq[selectedIdx].toUpperCase() === b}
                                            onClick={() => setBase(selectedIdx, b)}>{b}
                                        </button>
                                    ))}
                                </div>
                                <div className="pe-base-btns" style={{ marginTop: 6 }}>
                                    <span className="pe-ctrl-hint">Insert before:</span>
                                    {['A', 'T', 'G', 'C'].map(b => (
                                        <button key={b} className="pe-base-btn pe-insert-btn"
                                            style={{ borderColor: BASE_COLORS[b], color: BASE_COLORS[b] }}
                                            onClick={() => insertBefore(selectedIdx, b)}>+{b}
                                        </button>
                                    ))}
                                    <button className="pe-delete-btn" onClick={() => deleteBase(selectedIdx)}>Delete</button>
                                </div>
                            </div>
                        )}

                        <div className="pe-section-label" style={{ marginTop: 14 }}>Or edit directly:</div>
                        <textarea className="pe-textarea" value={seq} spellCheck={false}
                            onChange={e => { setSeq(e.target.value.toUpperCase().replace(/[^ATGC]/g, '')); setSelectedIdx(null); }}
                            rows={3} placeholder="Enter primer sequence (A/T/G/C only)" />

                        {mappings.length > 0 && (
                            <div className="pe-flanking">
                                <span className="pe-section-label">Flanking context</span>
                                {isComposite
                                    ? componentLabels.map(label => {
                                        const m = mappings.find(x => x.component === label);
                                        if (!m) return null;
                                        return (
                                            <div key={label} className="pe-flank-row">
                                                <span className="pe-flank-comp-label">{label}</span>
                                                <code className="pe-flank-seq">
                                                    <span className="flank-side">{sequence.slice(Math.max(0, m.start - 5), m.start)}</span>
                                                    <span className="flank-primer" style={{ background: color + '33', outline: `2px solid ${color}`, borderRadius: 3 }}>
                                                        {sequence.slice(m.start, m.end)}
                                                    </span>
                                                    <span className="flank-side">{sequence.slice(m.end, m.end + 5)}</span>
                                                </code>
                                            </div>
                                        );
                                    })
                                    : (
                                        <code className="pe-flank-seq">
                                            <span className="flank-side">{sequence.slice(Math.max(0, mappings[0].start - 5), mappings[0].start)}</span>
                                            <span className="flank-primer" style={{ background: color + '33', outline: `2px solid ${color}`, borderRadius: 3 }}>
                                                {sequence.slice(mappings[0].start, mappings[0].end)}
                                            </span>
                                            <span className="flank-side">{sequence.slice(mappings[0].end, mappings[0].end + 5)}</span>
                                        </code>
                                    )
                                }
                            </div>
                        )}
                    </div>

                    {/* Right column: RNA structure */}
                    <div className="pe-edit-right">
                        <div className="pe-section-label">RNA Secondary Structure</div>
                        <div className="pe-structure-card">
                            {!structure && !structureLoading && (
                                <button className="pe-structure-btn" onClick={loadStructure}>Load Structure Prediction</button>
                            )}
                            {structureLoading && <div className="pe-structure-loading"><div className="pe-spinner" />Predicting…</div>}
                            {structure && !structureLoading && <div ref={fornaRef} className="pe-forna" />}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Mappings tab ─────────────────────────────────── */}
            {tab === 'mappings' && (
                <div className="pe-mappings">
                    <div className="pe-section-label" style={{ marginBottom: 10 }}>
                        Binding sites on target (fuzzy ≥65%){isComposite && ' — split by component'}
                    </div>
                    {mappings.length === 0 ? (
                        <div className="pe-no-mappings">
                            {isComposite
                                ? 'No binding sites found for either component (≥65% match).'
                                : 'No binding sites found with ≥65% match.'}
                        </div>
                    ) : mappings.map((m, i) => {
                        const isPrimary = i === 0;
                        const leftPct  = (m.start / sequence.length) * 100;
                        const widthPct = Math.max(1, ((m.end - m.start) / sequence.length) * 100);
                        const primerSlice = m.componentSeq ? m.componentSeq.toUpperCase() : seq.toUpperCase();
                        const query  = m.strand === '-' ? revComp(primerSlice) : primerSlice;
                        const target = m.slice;
                        const localSelected = isComposite
                            ? (m.component === componentLabels[0]
                                ? selectedIdx
                                : selectedIdx != null ? selectedIdx - mid : null)
                            : selectedIdx;
                        return (
                            <div key={i} className={`pe-mapping-card ${isPrimary ? 'pe-mapping-primary' : ''}`}>
                                <div className="pe-mapping-header">
                                    {m.component
                                        ? <span className={isPrimary ? 'pe-mapping-primary-badge' : 'pe-mapping-component-badge'}>{m.component}</span>
                                        : isPrimary && <span className="pe-mapping-primary-badge">Primary</span>}
                                    <span className="pe-mapping-pos">pos {m.start}–{m.end}</span>
                                    <span className="pe-mapping-strand">{m.strand === '+' ? '5′→3′' : '3′←5′'}</span>
                                    <span className="pe-mapping-score-badge" style={{ background: m.score >= 0.9 ? '#f0fdf4' : m.score >= 0.75 ? '#fffbeb' : '#fff7ed', color: m.score >= 0.9 ? '#16a34a' : m.score >= 0.75 ? '#d97706' : '#ea580c', border: `1px solid ${m.score >= 0.9 ? '#bbf7d0' : m.score >= 0.75 ? '#fde68a' : '#fed7aa'}` }}>
                                        {Math.round(m.score * 100)}%
                                    </span>
                                </div>
                                <div className="pe-mini-map">
                                    <div className="pe-mini-track">
                                        <div className="pe-mini-segment" style={{ left: `${leftPct}%`, width: `${widthPct}%`, background: color }} />
                                    </div>
                                    <div className="pe-mini-scale"><span>1</span><span>{sequence.length}</span></div>
                                </div>
                                <div className="pe-alignment">
                                    <div className="pe-align-row">
                                        <span className="pe-align-label">Target</span>
                                        <code className="pe-align-seq">
                                            {target.split('').map((b, j) => (
                                                <span key={j} className={b === query[j] ? 'align-match' : 'align-mismatch'}>{b}</span>
                                            ))}
                                        </code>
                                    </div>
                                    <div className="pe-align-row">
                                        <span className="pe-align-label">Primer</span>
                                        <code className="pe-align-seq">
                                            {query.split('').map((b, j) => (
                                                <span key={j} className={`${b === target[j] ? 'align-match' : 'align-mismatch'}${j === localSelected ? ' align-active' : ''}`}>{b}</span>
                                            ))}
                                        </code>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── Insights tab ─────────────────────────────────── */}
            {tab === 'insights' && (
                <div className="pe-insights">
                    {/* Score meter */}
                    <div className="pe-score-card" style={{ background: scoreBg, border: `1.5px solid ${scoreBorder}` }}>
                        <div className="pe-score-header">
                            <span className="pe-score-label">Overall Quality Score</span>
                            <span className="pe-score-value" style={{ color: scoreColor }}>{score}/100</span>
                        </div>
                        <div className="pe-score-bar-bg">
                            <div className="pe-score-bar-fill" style={{ width: `${score}%`, background: scoreColor }} />
                        </div>
                        <div className="pe-score-caption" style={{ color: scoreColor }}>
                            {score >= 80 ? 'Excellent — primer meets all quality criteria'
                             : score >= 60 ? 'Good — minor improvements possible'
                             : score >= 40 ? 'Fair — several criteria need attention'
                             : 'Poor — significant quality issues detected'}
                        </div>
                    </div>

                    {/* Suggested primer */}
                    {suggestion && (
                        <div className="pe-suggestion-card">
                            <div className="pe-suggestion-header">
                                <span className="pe-suggestion-title">Suggested Alternative</span>
                                <span className="pe-suggestion-delta">Score {suggestion.scoreBefore} → <strong>{suggestion.scoreAfter}</strong>
                                    <span className="pe-suggestion-plus">+{suggestion.improvement}</span>
                                </span>
                            </div>
                            <div className="pe-suggestion-reasons">
                                {suggestion.reasons.map((r, i) => <span key={i} className="pe-suggestion-reason">{r}</span>)}
                            </div>
                            <div className="pe-suggestion-seqs">
                                <div className="pe-suggestion-row">
                                    <span className="pe-suggestion-label">Current</span>
                                    <code className="pe-suggestion-seq pe-suggestion-old">{seq}</code>
                                </div>
                                <div className="pe-suggestion-row">
                                    <span className="pe-suggestion-label">Suggested</span>
                                    <code className="pe-suggestion-seq pe-suggestion-new">
                                        {suggestion.seq.split('').map((ch, ci) => {
                                            const changed = ci >= seq.length || ch !== seq[ci];
                                            return <span key={ci} className={changed ? 'seq-diff' : ''}>{ch}</span>;
                                        })}
                                    </code>
                                </div>
                            </div>
                            <button className="pe-apply-btn" onClick={() => { setSeq(suggestion.seq); setTab('edit'); }}>
                                Apply Suggestion
                            </button>
                        </div>
                    )}

                    {/* Insight cards */}
                    <div className="pe-insight-list">
                        {insights.map((ins, i) => (
                            <div key={i}
                                className={`pe-insight-card ${ins.level === 'warning' ? 'pe-insight-warn' : 'pe-insight-pass'}`}
                                onClick={() => setExpandedInsights(prev => { const s = new Set(prev); s.has(i) ? s.delete(i) : s.add(i); return s; })}>
                                <div className="pe-insight-row">
                                    <span className="pe-insight-icon">{ins.level === 'pass' ? '✓' : '⚠'}</span>
                                    <span className="pe-insight-cat">{ins.cat}</span>
                                    <span className="pe-insight-toggle">{expandedInsights.has(i) ? '▲' : '▼'}</span>
                                </div>
                                {expandedInsights.has(i) && (
                                    <div className="pe-insight-detail">{ins.msg}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default PrimerEditorForm;
