from flask import Flask, request, jsonify, Response
from primer_design import manipulate_sequence
from flask_cors import CORS


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
    response = jsonify({'manipulatedSequence': manipulated_sequence})
    return response

if __name__ == '__main__':
    app.run(debug=True)
