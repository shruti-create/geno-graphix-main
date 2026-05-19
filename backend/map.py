# Map Generating file

from dna_features_viewer import GraphicRecord, GraphicFeature
import logging
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from io import BytesIO

def reverse_complement(sequence):
    complement = str.maketrans("ATGC", "TACG")
    return sequence.translate(complement)[::-1]

def graph_sequence_with_primers(sequence, primers):
    """
    primers: list of {"name": str, "sequence": str}
             (also accepts plain strings for backwards compatibility)
    """
    features = []
    logging.debug("Adding features for primers")

    for item in primers:
        if isinstance(item, dict):
            name  = item.get('name', 'Primer')
            primer = item.get('sequence', '')
        else:
            name  = None
            primer = item

        if not primer:
            continue

        start = sequence.find(primer)
        if start != -1:
            label = name if name else f"{primer[:10]}…"
            features.append(GraphicFeature(
                start=start,
                end=start + len(primer),
                strand=+1,
                color="#ffcccc",
                label=label,
            ))
            continue

        rev_primer = reverse_complement(primer)
        start = sequence.find(rev_primer)
        if start != -1:
            label = f"{name}(-)" if name else f"{primer[:10]}…(-)"
            features.append(GraphicFeature(
                start=start,
                end=start + len(rev_primer),
                strand=-1,
                color="#ccccff",
                label=label,
            ))

    record = GraphicRecord(sequence=sequence, features=features)

    fig, ax = plt.subplots(figsize=(40, 3))
    record.plot(ax=ax, with_ruler=True, plot_sequence=True)

    img_stream = BytesIO()
    fig.savefig(img_stream, format='png', bbox_inches='tight')
    img_stream.seek(0)
    plt.close(fig)

    logging.debug("Figure generated successfully")
    return img_stream
