sequence = "CATACAATGTAACACAAGCTTTCGGCAGACGTGGTCCAGAACAAACCCAAGGAAATTTTGGGGACCAGGAACTAATCAGACAAGGAACTGATTACAAACATTGGCCGCAAATTGCACAATTTGCCCCCAGCGCTTCAGCGTTCTTCGGAATGTCGCGCATTGGCATGGAAGTCACACCTTCGGGAACGTGGTTGACCTACACAGGTGCCATCAAATTGGATGACAAAGATCCAAATTTCAAAGATCAAGTCATTTTGCTGAATAAGCATATTGACGCATACAAAACATTCCCACCAACAGA"
F3 = "CAGAACAAACCCAAGGAAAT"
B3 = "TCTTTGTCATCCAATTTGATGG"
F2 = "GGGACCAGGAACTAATCAGA"
F1c = "ATTGTGCAATTTGCGGCCAA"
B2 = "CCTGTGTAGGTCAACCAC"
B1c = "CGCTTCAGCGTTCTTCGGAA"

def complement(sequence):
    complement = {'A': 'T', 'C': 'G', 'G': 'C', 'T': 'A'}
    total_comp = ''.join(complement[nuc] for nuc in sequence)
    return total_comp

def reverse_complement(sequence):
    return complement(sequence)[::-1]

def fip_strand_invasion(F1c, F2, sequence):
    # use F2 primer with F1c overhang and create strand from target strand
    FIP = F1c + F2
    F2c = complement(F2)
    # traverse string to find the starting point with F2c
    index = sequence.find(F2c)
    print(index)
    if index == None: 
        print("F2 primer exact complement not found in sequence. LAMP fails.")
        return None
    # creating the first strand with the first strand invasion
    strand = FIP +  complement(sequence[index+len(F2):])
    print("Strand created with FIP: ", strand)
    return strand,index

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
    BIP = reverse_complement(B1c) + B2[::-1] 
    B2c = reverse_complement(B2)
    # traverse string to find the starting point with F2c
    index = sequence.find(B2c)
    print(index)
    if index == None: 
        print("B2 primer exact complement not found in sequence. LAMP fails.")
        return None
    # creating the first strand with the first strand invasion
    strand = complement(sequence[0:index])+  BIP
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
    start = sequence.find(F1c)
    end = sequence.find(B1c) + len(B1c)
    print(start, end)
    return sequence[start:end]

def extract_magnified_sequence_full(sequence, F1c, dumbell):
    start = sequence.find(reverse_complement(F1c))
    end = start + len(dumbell)
    print(start, end)
    return sequence[start:end]



def create_lamp_dumbell(sequence, F3, B3, F2, F1c, B2, B1c):
    print("Sequence: ", sequence)
    bip_strand= bip_strand_invasion(B1c, B2, sequence)
    disassociate_strand(F3, sequence)
    dumbell,_ = fip_strand_invasion(F1c, F2, bip_strand)
    disassociate_strand(B3, sequence)
    
    print("lamp dumbell structure comes from strand: ", dumbell)

    dumbell = extract_magnified_sequence(dumbell, F1c, B1c)

    sequence = extract_magnified_sequence_full(sequence, F1c, dumbell)
    ratio = similar(sequence, dumbell)
    print(sequence, dumbell)
    print("Resulting strand similarity with sequence: ", ratio)

create_lamp_dumbell(sequence, F3, B3, F2, F1c, B2, B1c)

