from flask import Flask, request, jsonify, Response, send_file
from primer_design import manipulate_sequence
from map import graph_sequence_with_primers
from lamp import create_lamp_dumbell
from dash import Dash, html, Input, Output, State
import dash_bio as dashbio
from seqfold import fold,  dot_bracket
from flask_cors import CORS
import logging
import os
import requests

logging.basicConfig(level=logging.DEBUG)


# routing 

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

dash_app = Dash(__name__, server=app, url_base_pathname='/forna/')

# This is the function that takes the sequence, folds it, and returns the dot-bracket structure
def get_dot_bracket_structure(sequence):
    return dot_bracket(sequence, fold(sequence))

# Dash app layout
dash_app.layout = html.Div([
    html.H2(""),
    dashbio.FornaContainer(
        id='forna',
        sequences=[],  # Initial empty sequence
        height=500,
        width=900
    ),
    # Hidden div for passing the updated sequence
    html.Div(id='hidden-sequence', style={'display': 'none'})
])

# Flask route to receive sequence changes
@app.route('/update-sequence', methods=['POST'])
def update_sequence():
    sequence = request.json.get('sequence', '')
    if not sequence:
        return jsonify({'error': 'No sequence provided'}), 400
    
    # Call the sequence folding function to get the dot-bracket structure
    structure = get_dot_bracket_structure(sequence)
    
    return jsonify({'structure': structure})

# Dash callback to update the FornaContainer with the new sequence and structure
@dash_app.callback(
    Output('forna', 'sequences'),
    Output('hidden-sequence', 'children'),
    Input('hidden-sequence', 'children'),
    State('hidden-sequence', 'children')
)
def update_forna_structure(sequence, current_sequence):
    # If no new sequence is provided, return the current structure
    if sequence != current_sequence:
        structure = get_dot_bracket_structure(sequence)
        return [{'sequence': sequence, 'structure': structure}], sequence
    return [], current_sequence

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/primer', methods=['POST'])
def design_sequence():
    data = request.json 
    sequence = data.get('sequence', '')
    if not sequence:
        return jsonify({'error': 'No sequence provided!'}), 400
    manipulated_sequence = manipulate_sequence(sequence)
    response = jsonify({'allPrimers': manipulated_sequence})
    return response

@app.route('/quickfold', methods=['POST'])
def get_sequence_map():
    # Get the sequence from the request
    sequence = request.json['sequence']

    results_img = sequenceMap(sequence)
    response = jsonify({'results_img': results_img})
    return response

@app.route('/primer-map', methods=['POST'])
def get_primer_map():
    sequence = request.json['sequence']
    primers = request.json['primers']

    img_stream = graph_sequence_with_primers(sequence, primers)

    return send_file(
        img_stream,
        mimetype='image/png',
        as_attachment=False,
        download_name="primer_map.png"
    )

@app.route('/run-simulation', methods=['POST']) 
def run_simulation():
    data = request.get_json()
    logging.debug(f"Received data: {data}")

    sequence = data.get('sequence', '').strip()
    F2 = data.get('F2', '').strip()
    F1c = data.get('F1c', '').strip()
    B2 = data.get('B2', '').strip()
    B1c = data.get('B1c', '').strip()
    
    logging.debug(f"going in function")
    result = create_lamp_dumbell(sequence, F2, F1c, B2, B1c)
    return jsonify({'output': result})
   

if __name__ == '__main__':
    app.run(debug=True)
