# LAMP Algorithm testing file: this file is used as the backend to test if the primers 
# pass through a baseline LAMP simulation. Edit this file to test for specific conditions 
# and different primers. 

def complement(sequence):
    complement = {'A': 'T', 'C': 'G', 'G': 'C', 'T': 'A'}
    total_comp = ''.join(complement[nuc] for nuc in sequence)
    return total_comp

def reverse_complement(sequence):
    return complement(sequence)[::-1]

def fip_strand_invasion(F1c, F2, sequence):
    # use F2 primer with F1c overhang and create strand from target strand
    FIP = F1c + F2
    print("1", F2, flush = True)
    print(complement(F2), flush = True)
    F2c = complement(F2)
    print(F2c, flush = True)
    print("2" ,sequence.find(F2c), flush = True)
    # traverse string to find the starting point with F2c
    index = sequence.find(F2c)

    if index == -1: 
        print("F2 primer exact complement not found in sequence. LAMP fails.")
        return "F2 primer exact complement not found in sequence. LAMP fails."
    # creating the first strand with the first strand invasion
    # checking to add FIP to the start of F1 and accounting for additional spaces
    strand = FIP +  complement(sequence[sequence.find(F1c[::-1]):])
    print("Strand created with FIP: ", strand)
    return strand

def disassociate_strand(primer, sequence):
    # F3/B3 attaches to the original sequence to break the strand off by making a new stand 
    primer_c = complement(primer)
    index = sequence.find(primer_c)
    if index == None: 
        print("F3/B3 primer exact complement not found in sequence. LAMP fails.")
        return None
    break_strand = primer + complement(sequence[index + len(primer):])
    print("Strand that displaces the strand created: ", break_strand)

def bip_strand_invasion(B1c, B2, sequence):
    # Backward inner primer complementary to B2c attaches and synthesizes the rest of the strand
    BIP = B2[::-1]+ B1c[::-1]
    B2c = reverse_complement(B2)
    # traverse string to find the starting point with F2c
    index = sequence.find(B2c)
    print(index)
    if index == -1: 
        print("B2 primer exact complement not found in sequence. LAMP fails.")
        return "B2 primer exact complement not found in sequence. LAMP fails."
    # creating the first strand with the first strand invasion
    strand = complement(sequence[0:sequence.find(B1c)+len(B1c)])+  BIP
    print("Strand created with BIP: ", strand)
    return strand

def similar(a, b):
    if len(a) != len(b):
        print("Sequences are of different lengths!")
        return 0.0
    match_count = sum(1 for i in range(len(a)) if a[i] == b[i])
    similarity_ratio = match_count / len(a)
    return similarity_ratio

def extract_magnified_sequence(sequence, F1c, B1c):
    # +1 because need to start on the index AFTER the F1c Primer
    start = sequence.find(reverse_complement(F1c)) + len(F1c)
    end = sequence.find(B1c) 
    print(start, end)
    return sequence[start:end]

def extract_magnified_sequence_full(sequence, F1c, B1c):
    start = sequence.find(reverse_complement(F1c)) + len(F1c)
    end = sequence.find(B1c)
    print(start, end)
    return sequence[start:end]



def create_lamp_dumbell(sequence, F2, F1c, B2, B1c):
    print("Sequence: ", sequence, flush=True)
    print("primers", F2, F1c, B2, B1c,flush=True)
    bip_strand= bip_strand_invasion(B1c, B2, sequence)
    if bip_strand != "B2 primer exact complement not found in sequence. LAMP fails.":
        dumbell= fip_strand_invasion(F1c, F2, bip_strand)    
        print("lamp dumbell structure comes from strand: ", dumbell, flush=True)
        if dumbell != "F2 primer exact complement not found in sequence. LAMP fails.": 
            dumbell = extract_magnified_sequence(dumbell, F1c, B1c)
            index = sequence.find(dumbell)
            sequence = extract_magnified_sequence_full(sequence, F1c, B1c)
            ratio = similar(sequence, dumbell)
            print(index)
            print(sequence, dumbell)
            print("Resulting strand similarity with sequence: ", ratio)
            return ratio
        else: 
            return -1, " " + dumbell
    else: 
        return -1, " " + bip_strand


