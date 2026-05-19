# LAMP Algorithm — Comprehensive simulation
#
# Models:
#   1. Positional ordering  (F2 → F1 → B1c → RC(B2)) with ≥80% fuzzy match
#   2. Strand displacement junction GC content
#   3. Amplification region geometry (inner loop, full amplicon)
#   4. Target secondary structure accessibility (seqfold)
#   5. No-template dumbbell risk (self-amplification without target)
#   6. Primer quality insights: NN Tm, GC%, length, hairpin, dimer, 3' clamp

import math

# ── Nearest-neighbor parameters (SantaLucia 1998, 1 M NaCl) ────────
# ΔH in kcal/mol, ΔS in cal/mol·K
NN = {
    'AA': (-7.9, -22.2), 'AT': (-7.2, -20.4), 'AC': (-8.4, -22.4), 'AG': (-7.8, -21.0),
    'TA': (-7.2, -21.3), 'TT': (-7.9, -22.2), 'TC': (-8.2, -22.2), 'TG': (-8.5, -22.7),
    'CA': (-8.5, -22.7), 'CT': (-7.8, -21.0), 'CC': (-8.0, -19.9), 'CG': (-10.6, -27.2),
    'GA': (-8.2, -22.2), 'GT': (-8.4, -22.4), 'GC': (-9.8, -24.4), 'GG': (-8.0, -19.9),
}
# Initiation correction (terminal base pair)
INIT_GC = (0.1, -2.8)   # ΔH kcal/mol, ΔS cal/mol·K
INIT_AT = (2.3,  4.1)
R       = 1.987          # cal/mol·K
Ct      = 250e-9         # typical primer concentration (250 nM)

# ── Sequence utilities ──────────────────────────────────────────────

def complement(seq):
    return seq.translate(str.maketrans('ATGCNatgcn', 'TACGNtacgn'))

def reverse_complement(seq):
    return complement(seq)[::-1]

def fuzzy_find(seq, primer, min_score=0.80):
    """Sliding-window search. Returns (best_idx, best_score, strand)."""
    if not primer or len(seq) < len(primer):
        return -1, 0.0, '?'
    n = len(primer)
    best = (-1, 0.0, '?')
    for strand, p in [('+', primer), ('-', reverse_complement(primer))]:
        for i in range(len(seq) - n + 1):
            score = sum(seq[i + j] == p[j] for j in range(n)) / n
            if score > best[1] and score >= min_score:
                best = (i, score, strand)
    return best

def calc_gc(seq):
    return sum(1 for b in seq if b in 'GC') / len(seq) if seq else 0.0

def calc_tm_nn(seq):
    """Nearest-neighbor Tm (SantaLucia 1998) at 1 M NaCl, 250 nM primer.
    More accurate than the simple 4GC+2AT formula for primers >15 bp."""
    seq = seq.upper()
    if len(seq) < 2:
        return 0.0
    dH = (INIT_GC[0] if seq[0]  in 'GC' else INIT_AT[0]) + \
         (INIT_GC[0] if seq[-1] in 'GC' else INIT_AT[0])
    dS = (INIT_GC[1] if seq[0]  in 'GC' else INIT_AT[1]) + \
         (INIT_GC[1] if seq[-1] in 'GC' else INIT_AT[1])
    for i in range(len(seq) - 1):
        h, s = NN.get(seq[i:i+2], (0, 0))
        dH += h; dS += s
    tm = (dH * 1000) / (dS + R * math.log(Ct / 4)) - 273.15
    return round(tm, 1)

def has_run(seq, n=4):
    return any(b * n in seq for b in 'ATGC')

def check_hairpin(seq, stem=4):
    return len(seq) >= stem * 2 + 4 and reverse_complement(seq[-stem:]) in seq[:-stem]

def check_dimer(s1, s2, min_len=4):
    for n in range(min(8, min(len(s1), len(s2))), min_len - 1, -1):
        if reverse_complement(s1[-n:]) in s2:
            return True, n
    return False, 0

# ── Strand displacement junction check ─────────────────────────────

def displacement_junction_gc(seq, primer_end, window=8):
    """GC% of `window` bases immediately downstream of primer.
    High GC (>65%) makes strand displacement harder for Bst polymerase."""
    region = seq[primer_end: primer_end + window]
    if len(region) < 4:
        return None, region
    return calc_gc(region), region

# ── Target secondary structure ─────────────────────────────────────

def site_accessibility(full_seq, start, end, context=35):
    """Use seqfold to estimate how accessible the primer binding site is.
    Returns (fraction_accessible, structure_string) or (None, None) if unavailable."""
    try:
        from seqfold import fold, dot_bracket
        w_start = max(0, start - context)
        w_end   = min(len(full_seq), end + context)
        window  = full_seq[w_start:w_end]
        struct  = dot_bracket(window, fold(window))
        s_start = start - w_start
        s_end   = end   - w_start
        site    = struct[s_start:s_end]
        paired  = sum(1 for c in site if c != '.')
        access  = round(1.0 - paired / len(site), 2) if site else 1.0
        return access, site
    except Exception:
        return None, None

# ── No-template dumbbell risk ──────────────────────────────────────

def no_template_risk(f2, f1c, b2, b1c, threshold=0.70):
    """Check if primer regions are complementary enough to form
    dumbbell structures without a template (false-positive LAMP)."""
    issues = []
    pairs = [
        (f1c, b1c, 'F1c and B1c',
         'Both form the inner loop — high similarity means templates can form without target'),
        (f2, b2, 'F2 and B2',
         'Outer primer complementarity can drive non-specific extension without target'),
        (f2, b1c, 'F2 and B1c',
         'Cross-primer complementarity can produce background dumbbell structures'),
    ]
    for s1, s2, label, explanation in pairs:
        n = min(len(s1), len(s2))
        rc_s1 = reverse_complement(s1)[:n]
        score = sum(a == b for a, b in zip(rc_s1, s2[:n])) / n if n else 0
        if score >= threshold:
            issues.append(f'{label} are {round(score*100)}% complementary — {explanation}')
    return issues

# ── Insight generation ─────────────────────────────────────────────

def ins(category, level, primer, message):
    return {'category': category, 'level': level, 'primer': primer, 'message': message}

def generate_insights(f2, f1c, b2, b1c,
                      geometry=None, struct=None, no_tmpl=None):
    out = []
    full_fip = f1c + f2
    full_bip = b1c + b2

    # ── Length ──────────────────────────────────────────────────────
    for name, seq, lo, hi in [('F2',f2,15,28),('F1c',f1c,15,28),('B2',b2,15,28),('B1c',b1c,15,28)]:
        n = len(seq)
        if n < lo:
            out.append(ins('Length','warning',name,
                f'{name} is {n} bp — below minimum {lo} bp. Shorter primers bind less specifically and have lower Tm.'))
        elif n > hi:
            out.append(ins('Length','warning',name,
                f'{name} is {n} bp — above typical {lo}–{hi} bp. Longer primers can slow annealing kinetics.'))
        else:
            out.append(ins('Length','pass',name, f'{name} length {n} bp is within range.'))

    for name, seq, lo, hi in [('FIP',full_fip,35,50),('BIP',full_bip,35,50)]:
        n = len(seq)
        if n < lo:
            out.append(ins('Length','warning',name,f'{name} ({n} bp) is shorter than recommended {lo}–{hi} bp.'))
        elif n > hi:
            out.append(ins('Length','warning',name,f'{name} ({n} bp) is longer than recommended {lo}–{hi} bp.'))
        else:
            out.append(ins('Length','pass',name,f'{name} total length {n} bp is within range.'))

    # ── GC content ──────────────────────────────────────────────────
    for name, seq in [('F2',f2),('F1c',f1c),('B2',b2),('B1c',b1c)]:
        gc = calc_gc(seq); pct = round(gc * 100)
        if gc < 0.40:
            out.append(ins('GC Content','warning',name,
                f'{name} GC is {pct}% — below optimal 40–65%. Low GC reduces Tm and duplex stability.'))
        elif gc > 0.65:
            out.append(ins('GC Content','warning',name,
                f'{name} GC is {pct}% — above optimal 40–65%. High GC promotes secondary structures.'))
        else:
            out.append(ins('GC Content','pass',name,f'{name} GC {pct}% is within optimal range.'))

    # ── Nearest-neighbor Tm ─────────────────────────────────────────
    # Ranges calibrated for NN Tm at 1 M NaCl / 250 nM (LAMP typical design targets)
    for name, seq, lo, hi in [('F2',f2,68,76),('F1c',f1c,70,78),('B2',b2,68,76),('B1c',b1c,70,78)]:
        tm = calc_tm_nn(seq)
        if tm < lo:
            out.append(ins('Melting Temp (NN)','warning',name,
                f'{name} Tm ≈ {tm}°C (NN, 1M NaCl ref) — below {lo}–{hi}°C target. '
                f'Increase GC content or extend the primer.'))
        elif tm > hi:
            out.append(ins('Melting Temp (NN)','warning',name,
                f'{name} Tm ≈ {tm}°C (NN, 1M NaCl ref) — above {lo}–{hi}°C target. '
                f'Reduce GC content or shorten the primer.'))
        else:
            out.append(ins('Melting Temp (NN)','pass',name,
                f'{name} Tm ≈ {tm}°C (NN formula) is within recommended range.'))

    # ── Tm balance F2 vs B2 ─────────────────────────────────────────
    f2_tm = calc_tm_nn(f2); b2_tm = calc_tm_nn(b2); diff = abs(f2_tm - b2_tm)
    if diff > 4:
        out.append(ins('Tm Balance','warning','F2/B2',
            f'F2 Tm ({f2_tm}°C) and B2 Tm ({b2_tm}°C) differ by {diff}°C. '
            f'Keep within 4°C for balanced simultaneous binding.'))
    else:
        out.append(ins('Tm Balance','pass','F2/B2',
            f'F2 ({f2_tm}°C) and B2 ({b2_tm}°C) Tm values are balanced (Δ{diff}°C).'))

    # ── 3' GC clamp ─────────────────────────────────────────────────
    for name, seq in [('F2',f2),('F1c',f1c),('B2',b2),('B1c',b1c)]:
        last2 = seq[-2:]; gc = sum(1 for b in last2 if b in 'GC')
        if gc == 0:
            out.append(ins("3' GC Clamp",'warning',name,
                f"{name} ends in '{last2}' — no G/C in last 2 bases. "
                f"A 3' GC clamp improves polymerase grip and reduces mispriming."))
        else:
            out.append(ins("3' GC Clamp",'pass',name,
                f"{name} has {gc} G/C base(s) in last 2 positions — good 3' stability."))

    # ── Low-complexity runs ─────────────────────────────────────────
    for name, seq in [('F2',f2),('F1c',f1c),('B2',b2),('B1c',b1c)]:
        if has_run(seq, 4):
            out.append(ins('Complexity','warning',name,
                f'{name} contains 4+ identical consecutive bases — '
                f'risk of polymerase slippage, stalling, or non-specific binding.'))

    # ── Hairpin ─────────────────────────────────────────────────────
    for name, seq in [('F2',f2),('F1c',f1c),('B2',b2),('B1c',b1c)]:
        if check_hairpin(seq, stem=4):
            out.append(ins('Hairpin','warning',name,
                f"{name}: 3' end (4 bp) can fold back onto an internal region — "
                f"potential hairpin blocks polymerase extension."))
        else:
            out.append(ins('Hairpin','pass',name,
                f"{name}: no significant 3' hairpin detected."))

    # ── Primer dimers ───────────────────────────────────────────────
    fip_bip, n = check_dimer(full_fip, full_bip)
    if fip_bip:
        out.append(ins('Primer Dimer','warning','FIP/BIP',
            f"FIP 3' end has {n} bp complementarity with BIP — "
            f"primer dimer reduces effective primer concentration."))
    else:
        out.append(ins('Primer Dimer','pass','FIP/BIP','No significant FIP–BIP primer dimer.'))

    f1c_f2, n = check_dimer(f1c, f2)
    if f1c_f2:
        out.append(ins('Intra-FIP Dimer','warning','FIP',
            f"F1c 3' end has {n} bp complementarity with F2 — intra-FIP self-priming risk."))
    else:
        out.append(ins('Intra-FIP Dimer','pass','FIP','No significant F1c–F2 dimer.'))

    b1c_b2, n = check_dimer(b1c, b2)
    if b1c_b2:
        out.append(ins('Intra-BIP Dimer','warning','BIP',
            f"B1c 3' end has {n} bp complementarity with B2 — intra-BIP self-priming risk."))
    else:
        out.append(ins('Intra-BIP Dimer','pass','BIP','No significant B1c–B2 dimer.'))

    # ── Geometry insights ───────────────────────────────────────────
    if geometry:
        inner = geometry.get('inner_loop')
        amplicon = geometry.get('amplicon')
        if inner is not None:
            if inner < 40:
                out.append(ins('Geometry','warning','Inner loop',
                    f'Inner loop (F1–B1c) is {inner} bp — below recommended 40–60 bp. '
                    f'Very short loops may not form the stem-loop dumbbell efficiently.'))
            elif inner > 60:
                out.append(ins('Geometry','warning','Inner loop',
                    f'Inner loop (F1–B1c) is {inner} bp — above recommended 40–60 bp. '
                    f'Longer loops slow exponential amplification.'))
            else:
                out.append(ins('Geometry','pass','Inner loop',
                    f'Inner loop {inner} bp is within the recommended 40–60 bp range.'))
        if amplicon is not None:
            if amplicon < 120:
                out.append(ins('Geometry','warning','Amplicon',
                    f'Amplified region ({amplicon} bp) is shorter than the typical minimum of 120 bp.'))
            elif amplicon > 300:
                out.append(ins('Geometry','warning','Amplicon',
                    f'Amplified region ({amplicon} bp) exceeds 300 bp — LAMP efficiency decreases for long amplicons.'))
            else:
                out.append(ins('Geometry','pass','Amplicon',
                    f'Amplified region {amplicon} bp is within the recommended 120–300 bp range.'))

    # ── Target structure insights ───────────────────────────────────
    if struct:
        for name, access in struct.items():
            if access is None:
                continue
            pct = round(access * 100)
            if access < 0.60:
                out.append(ins('Target Structure','warning',name,
                    f'{name} binding site is {pct}% accessible in predicted target structure — '
                    f'secondary structure may block primer binding. Consider targeting a more open region.'))
            elif access < 0.80:
                out.append(ins('Target Structure','warning',name,
                    f'{name} binding site is {pct}% accessible — partial secondary structure at binding site. '
                    f'May reduce primer binding efficiency.'))
            else:
                out.append(ins('Target Structure','pass',name,
                    f'{name} binding site is {pct}% single-stranded — good accessibility.'))

    # ── No-template dumbbell ────────────────────────────────────────
    if no_tmpl:
        for issue in no_tmpl:
            out.append(ins('No-Template Risk','warning','Primers', issue))
        if not no_tmpl:
            out.append(ins('No-Template Risk','pass','Primers',
                'No significant no-template dumbbell risk detected.'))
    else:
        out.append(ins('No-Template Risk','pass','Primers',
            'No significant no-template dumbbell risk detected.'))

    return out


# ── Primer scoring & suggestion engine ─────────────────────────────

def score_primer(seq, name):
    """Score a primer 0–100 across quality criteria."""
    if not seq:
        return 0
    score = 0
    gc = calc_gc(seq)
    tm = calc_tm_nn(seq)

    # GC content 40–65% (25 pts)
    if 0.40 <= gc <= 0.65:
        score += 25
    else:
        penalty = abs(gc - (0.525)) * 100   # distance from centre of range
        score += max(0, 25 - int(penalty))

    # NN Tm in target range (25 pts)
    lo, hi = (68, 76) if name in ('F2', 'B2') else (70, 78)
    if lo <= tm <= hi:
        score += 25
    else:
        miss = min(abs(tm - lo), abs(tm - hi))
        score += max(0, 25 - int(miss * 4))

    # 3' GC clamp — last 2 bases (20 pts, 10 each)
    last2 = seq[-2:].upper()
    score += sum(10 for b in last2 if b in 'GC')

    # No hairpin (15 pts)
    if not check_hairpin(seq, stem=4):
        score += 15

    # No mono-nucleotide run of 4+ (15 pts)
    if not has_run(seq, 4):
        score += 15

    return score


def _why_better(orig, cand, name):
    """Return list of improvement reasons between two primer sequences."""
    reasons = []
    gc_o = round(calc_gc(orig) * 100); gc_c = round(calc_gc(cand) * 100)
    tm_o = calc_tm_nn(orig); tm_c = calc_tm_nn(cand)
    lo, hi = (68, 76) if name in ('F2', 'B2') else (70, 78)

    if abs(gc_c - 52) < abs(gc_o - 52):
        reasons.append(f'GC {gc_o}%→{gc_c}% (closer to 40–65% target)')
    if (lo <= tm_c <= hi) and not (lo <= tm_o <= hi):
        reasons.append(f'Tm {tm_o}°C→{tm_c}°C (now in {lo}–{hi}°C target)')
    elif abs((tm_c - (lo+hi)/2)) < abs((tm_o - (lo+hi)/2)):
        reasons.append(f'Tm {tm_o}°C→{tm_c}°C (closer to centre)')

    clamp_o = sum(1 for b in orig[-2:].upper() if b in 'GC')
    clamp_c = sum(1 for b in cand[-2:].upper() if b in 'GC')
    if clamp_c > clamp_o:
        reasons.append(f"3' GC clamp improved ({clamp_o}→{clamp_c} G/C in last 2 bases)")

    if check_hairpin(orig) and not check_hairpin(cand):
        reasons.append("3' hairpin resolved")
    if has_run(orig) and not has_run(cand):
        reasons.append('Low-complexity run removed')

    return reasons if reasons else ['Overall quality score improved']


def suggest_improvements(full_seq, primer_positions):
    """Generate improved primer alternatives near each binding site.

    primer_positions: dict  name → (abs_start, abs_end, strand, cur_seq)
      strand '+' → primer seq == sense slice
      strand '-' → primer seq == RC(sense slice)  (e.g. F1c, B2)
    """
    suggestions = []
    DELTA_POS = 6   # shift window ±6 bp
    DELTA_LEN = 3   # length ±3 bp

    for name, (start, end, strand, cur_seq) in primer_positions.items():
        cur_len   = len(cur_seq)
        cur_score = score_primer(cur_seq, name)
        best_score = cur_score
        best_seq   = None

        for s_off in range(-DELTA_POS, DELTA_POS + 1):
            new_start = start + s_off
            if new_start < 0:
                continue
            for new_len in range(max(15, cur_len - DELTA_LEN),
                                 min(28, cur_len + DELTA_LEN) + 1):
                if new_start + new_len > len(full_seq):
                    continue
                sense_slice = full_seq[new_start: new_start + new_len]
                candidate   = reverse_complement(sense_slice) if strand == '-' else sense_slice
                sc = score_primer(candidate, name)
                if sc > best_score:
                    best_score = sc
                    best_seq   = candidate

        if best_seq:
            component_of = 'FIP' if name in ('F1c', 'F2') else 'BIP'
            suggestions.append({
                'primer':       name,
                'componentOf':  component_of,
                'original':     cur_seq,
                'suggested':    best_seq,
                'scoreBefore':  cur_score,
                'scoreAfter':   best_score,
                'improvement':  best_score - cur_score,
                'reasons':      _why_better(cur_seq, best_seq, name),
            })

    return sorted(suggestions, key=lambda x: -x['improvement'])


# ── Main simulation ─────────────────────────────────────────────────

def create_lamp_dumbell(sequence, F2, F1c, B2, B1c):
    seq = sequence.upper() if sequence else ''
    f2  = F2.upper()  if F2  else ''
    f1c = F1c.upper() if F1c else ''
    b2  = B2.upper()  if B2  else ''
    b1c = B1c.upper() if B1c else ''

    if not all([seq, f2, f1c, b2, b1c]):
        missing = [n for n, v in [('sequence',seq),('F2',f2),('F1c',f1c),('B2',b2),('B1c',b1c)] if not v]
        return {'passed': False,
                'steps': [{'step':'Input validation','passed':False,'score':None,
                           'detail':f'Missing: {", ".join(missing)}'}],
                'summary': 'Cannot run — missing primer sequences.',
                'insights': []}

    THRESH = 0.80
    steps  = []
    pct    = lambda sc: round(sc * 100)
    ml     = lambda sc: f'{pct(sc)}% match'

    # ── Step 1: F2 on sense strand ──────────────────────────────────
    f2_idx, f2_sc, _ = fuzzy_find(seq, f2, THRESH)
    if f2_idx != -1:
        steps.append({'step':'F2 binds antisense strand','passed':True,'score':pct(f2_sc),
                      'detail':f'F2 ({len(f2)} bp) at positions {f2_idx}–{f2_idx+len(f2)} ({ml(f2_sc)})'})
    else:
        steps.append({'step':'F2 binds antisense strand','passed':False,'score':0,
                      'detail':'F2 not found on sense strand with ≥80% match — FIP cannot initiate'})
        return {'passed':False,'steps':steps,
                'summary':'LAMP fails at Step 1: F2 binding site absent.',
                'insights':generate_insights(f2,f1c,b2,b1c)}

    # ── Step 2: RC(F1c)=F1 downstream of F2 ─────────────────────────
    f1 = reverse_complement(f1c)
    f1_rel, f1_sc, _ = fuzzy_find(seq[f2_idx+len(f2):], f1, THRESH)
    if f1_rel != -1:
        f1_abs = f2_idx + len(f2) + f1_rel
        f1_end = f1_abs + len(f1)
        steps.append({'step':'F1 region downstream of F2 (FIP stem-loop target)','passed':True,'score':pct(f1_sc),
                      'detail':f'RC(F1c)=F1 ({len(f1)} bp) at {f1_abs}–{f1_end} ({ml(f1_sc)}), '
                               f'downstream of F2 end ({f2_idx+len(f2)})'})
    else:
        f1_any, f1_any_sc, _ = fuzzy_find(seq, f1, THRESH)
        detail = (f'RC(F1c)=F1 found at {f1_any} ({ml(f1_any_sc)}) but upstream of F2 — wrong order'
                  if f1_any != -1 else 'RC(F1c)=F1 not found downstream of F2 with ≥80% match')
        steps.append({'step':'F1 region downstream of F2 (FIP stem-loop target)','passed':False,'score':0,'detail':detail})
        return {'passed':False,'steps':steps,
                'summary':'LAMP fails at Step 2: F1 not correctly positioned.',
                'insights':generate_insights(f2,f1c,b2,b1c)}

    # ── Step 3: FIP stem-loop ───────────────────────────────────────
    steps.append({'step':'FIP strand invasion — F1c folds onto F1','passed':True,'score':None,
                  'detail':f'F1c overhang ({len(f1c)} bp) self-primes onto F1 → stem-loop initiated'})

    # ── Step 4: B1c downstream of F1 ───────────────────────────────
    b1c_rel, b1c_sc, _ = fuzzy_find(seq[f1_end:], b1c, THRESH)
    if b1c_rel != -1:
        b1c_abs = f1_end + b1c_rel
        b1c_end = b1c_abs + len(b1c)
        steps.append({'step':'B1c region downstream of F1 (BIP overhang target)','passed':True,'score':pct(b1c_sc),
                      'detail':f'B1c ({len(b1c)} bp) at {b1c_abs}–{b1c_end} ({ml(b1c_sc)})'})
    else:
        b1c_any, b1c_any_sc, _ = fuzzy_find(seq, b1c, THRESH)
        detail = (f'B1c found at {b1c_any} ({ml(b1c_any_sc)}) but not downstream of F1 end ({f1_end})'
                  if b1c_any != -1 else 'B1c not found in target with ≥80% match')
        steps.append({'step':'B1c region downstream of F1 (BIP overhang target)','passed':False,'score':0,'detail':detail})
        return {'passed':False,'steps':steps,
                'summary':'LAMP fails at Step 4: B1c not correctly positioned.',
                'insights':generate_insights(f2,f1c,b2,b1c)}

    # ── Step 5: RC(B2) downstream of B1c ───────────────────────────
    b2_rc = reverse_complement(b2)
    b2rc_rel, b2rc_sc, _ = fuzzy_find(seq[b1c_end:], b2_rc, THRESH)
    if b2rc_rel != -1:
        b2rc_abs = b1c_end + b2rc_rel
        b2rc_end = b2rc_abs + len(b2_rc)
        steps.append({'step':'B2 binds sense strand — RC(B2) downstream of B1c','passed':True,'score':pct(b2rc_sc),
                      'detail':f'RC(B2) ({len(b2_rc)} bp) at {b2rc_abs}–{b2rc_end} ({ml(b2rc_sc)})'})
    else:
        b2rc_any, b2rc_any_sc, _ = fuzzy_find(seq, b2_rc, THRESH)
        detail = (f'RC(B2) found at {b2rc_any} ({ml(b2rc_any_sc)}) but not downstream of B1c end ({b1c_end})'
                  if b2rc_any != -1 else 'RC(B2) not found in target with ≥80% match')
        steps.append({'step':'B2 binds sense strand — RC(B2) downstream of B1c','passed':False,'score':0,'detail':detail})
        return {'passed':False,'steps':steps,
                'summary':'LAMP fails at Step 5: B2 not correctly positioned.',
                'insights':generate_insights(f2,f1c,b2,b1c)}

    # ── Step 6: BIP stem-loop ───────────────────────────────────────
    steps.append({'step':'BIP strand invasion — B1c folds onto B1','passed':True,'score':None,
                  'detail':f'B1c overhang ({len(b1c)} bp) self-primes onto B1 region → dumbbell completed'})

    # ── Step 7: Geometry ────────────────────────────────────────────
    inner_loop   = b1c_abs - f1_end
    amplicon_len = b2rc_end - f2_idx
    geo_passed   = 40 <= inner_loop <= 60 and 120 <= amplicon_len <= 300
    geo_warns    = []
    if not (40 <= inner_loop <= 60):
        geo_warns.append(f'inner loop {inner_loop} bp (recommended 40–60 bp)')
    if not (120 <= amplicon_len <= 300):
        geo_warns.append(f'amplicon {amplicon_len} bp (recommended 120–300 bp)')
    steps.append({'step':'Amplification region geometry','passed':geo_passed,'score':None,
                  'detail':(f'Inner loop (F1→B1c): {inner_loop} bp. '
                            f'Full amplicon (F2→B2c): {amplicon_len} bp. '
                            + (f'Warnings: {"; ".join(geo_warns)}.' if geo_warns else 'Both within recommended ranges.'))})

    # ── Step 8: Strand displacement junction GC ─────────────────────
    disp_issues = []
    for name, end in [('F2', f2_idx+len(f2)), ('F1c', f1_end),
                      ('B1c', b1c_end), ('B2', b2rc_end)]:
        gc, region = displacement_junction_gc(seq, end)
        if gc is not None and gc > 0.65:
            disp_issues.append(
                f"{name} junction: next 8 bases ({region}) are {round(gc*100)}% GC — "
                f"high GC downstream may slow Bst strand displacement")
    if disp_issues:
        steps.append({'step':'Strand displacement junctions (GC content)','passed':False,'score':None,
                      'detail':' | '.join(disp_issues)})
    else:
        steps.append({'step':'Strand displacement junctions (GC content)','passed':True,'score':None,
                      'detail':'All primer junction regions have ≤65% GC — favourable for Bst strand displacement'})

    # ── Step 9: Target secondary structure ──────────────────────────
    struct_results = {}
    for name, start, end in [('F2',f2_idx,f2_idx+len(f2)),
                              ('F1',f1_abs,f1_end),
                              ('B1c',b1c_abs,b1c_end),
                              ('B2',b2rc_abs,b2rc_end)]:
        access, site_struct = site_accessibility(seq, start, end)
        struct_results[name] = access
        if access is not None:
            pct_acc = round(access * 100)
            passed  = access >= 0.70
            steps.append({'step':f'Target structure accessibility — {name}','passed':passed,'score':None,
                          'detail':(f'{name} binding site ({start}–{end}): {pct_acc}% of bases are unpaired '
                                    f'(structure: {site_struct}). '
                                    + ('Good accessibility.' if passed
                                       else 'Secondary structure may block primer binding.'))})
        else:
            steps.append({'step':f'Target structure accessibility — {name}','passed':True,'score':None,
                          'detail':f'{name}: seqfold unavailable — skipped structure check'})

    # ── Step 10: No-template dumbbell risk ──────────────────────────
    nt_issues = no_template_risk(f2, f1c, b2, b1c)
    if nt_issues:
        steps.append({'step':'No-template amplification risk','passed':False,'score':None,
                      'detail':' | '.join(nt_issues)})
    else:
        steps.append({'step':'No-template amplification risk','passed':True,'score':None,
                      'detail':'Primer regions have low inter-complementarity — no-template dumbbell risk is low'})

    # ── Step 11: Self-amplification / dimer ─────────────────────────
    sa_issues = []
    f1c_f2, n = check_dimer(f1c, f2, 4)
    if f1c_f2: sa_issues.append(f"F1c 3' has {n} bp complementarity with F2 (intra-FIP)")
    b1c_b2, n = check_dimer(b1c, b2, 4)
    if b1c_b2: sa_issues.append(f"B1c 3' has {n} bp complementarity with B2 (intra-BIP)")
    fip_bip, n = check_dimer(f1c+f2, b1c+b2, 4)
    if fip_bip: sa_issues.append(f"FIP 3' has {n} bp complementarity with BIP (cross-dimer)")
    steps.append({'step':'Self-amplification & primer dimer check',
                  'passed': not sa_issues,'score':None,
                  'detail':(' | '.join(sa_issues) + ' — may cause non-specific amplification.'
                            if sa_issues else "No significant 3' self-priming or primer dimer overlap.")})

    all_passed  = all(s['passed'] for s in steps)
    pass_count  = sum(1 for s in steps if s['passed'])
    geometry    = {'inner_loop': inner_loop, 'amplicon': amplicon_len}
    insights    = generate_insights(f2, f1c, b2, b1c,
                                    geometry=geometry,
                                    struct={k: v for k, v in struct_results.items() if v is not None},
                                    no_tmpl=nt_issues)

    # ── Primer improvement suggestions ─────────────────────────────
    primer_positions = {
        'F2':  (f2_idx,  f2_idx + len(f2),  '+', f2),
        'F1c': (f1_abs,  f1_end,             '-', f1c),
        'B1c': (b1c_abs, b1c_end,            '+', b1c),
        'B2':  (b2rc_abs, b2rc_end,          '-', b2),
    }
    suggestions = suggest_improvements(seq, primer_positions)

    return {
        'passed':      all_passed,
        'steps':       steps,
        'summary':     (f'{pass_count}/{len(steps)} checks passed. '
                        f'Amplified region: {amplicon_len} bp '
                        f'(pos {f2_idx}–{b2rc_end}). '
                        f'Inner loop: {inner_loop} bp.'),
        'insights':    insights,
        'suggestions': suggestions,
    }
