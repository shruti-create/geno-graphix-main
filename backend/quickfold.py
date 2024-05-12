import requests

# URL of the Quickfold CGI script
url = 'http://www.unafold.org/cgi-bin/DINAMelt/quikfold.cgi'

# Sequence to be folded (in FASTA format)
sequence = 'ACTGATAAAATGGTCCAGTGTAAC'

# Parameters for the folding calculation
params = {
    'seq': sequence,
    'name': '',
    'NA': 'DNA',
    'temp': '37',
    'Sodium': '1',
    'Magnesium': '0',
    'saltunit': 'M',
    'polymer': 'off',
    'type': 'linear',
    'p': '5',
    'w': 'default',
    'max': '50',
    'maxbp': 'no limit'
}

# Submit the form
response = requests.post(url, data=params)

# Check if the submission was successful
if response.status_code == 200:
    # Extract the URL of the results page
    results_url = response.url.replace('quikfold.cgi', 'results2/quikfold')
    results_img = results_url.replace('/results2/quikfold/', '/cgi-bin/DINAMelt/quikfold-structure.cgi?tag=')
    results_img = results_img[:-1]
    results_img = results_img + "&which=1&type=png"
    print(f"Results URL: {results_url}\n Image URL: {results_img}")
else:
    print(f"Error: {response.status_code}")
