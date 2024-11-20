from dna_features_viewer import GraphicRecord, GraphicFeature
import logging
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from io import BytesIO
from flask import send_file

def reverse_complement(sequence):
    complement = str.maketrans("ATGC", "TACG")
    return sequence.translate(complement)[::-1]

def graph_sequence_with_primers(sequence, primers):
    features = []
    logging.debug("Adding features for primers")

    for primer in primers:
        start = sequence.find(primer)
        if start != -1:
            features.append(GraphicFeature(
                start=start,
                end=start + len(primer),
                strand=+1, 
                color="#ffcccc",
                label=f"Primer {primer}"
            ))
            continue

        
        rev_primer = reverse_complement(primer)
        start = sequence.find(rev_primer)
        if start != -1:
            features.append(GraphicFeature(
                start=start,
                end=start + len(rev_primer),
                strand=-1,  
                color="#ccccff",
                label=f"Primer {primer} (rev)"
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
