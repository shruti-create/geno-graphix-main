from flask import Flask, request, jsonify, Response
from primer_design import manipulate_sequence
from quickfold import sequenceMap
from flask_cors import CORS

import requests


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

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

if __name__ == '__main__':
    app.run(debug=True)
