forward_sequence_list= []
reverse_sequence_list =[]

def manipulate_sequence(sequence):
    forward_primers = []
    reverse_primers = []
    # getting sequences of the correct length first for the forward and reverse primers
    forward_sequence_list.clear()
    reverse_sequence_list.clear()
    get_sequences(sequence['input'])
    # getting the complementary sequence to be the basis of the primers
    complementarySequences(forward_sequence_list, forward_primers)
    complementarySequences(reverse_sequence_list, reverse_primers)
    # checking the gc content and ruling out more options for primers
    gcContentCheck(forward_primers, "forward")
    gcContentCheck(reverse_primers, "reverse")
    # checking the melting temperature and ruling out more options for primers
    # if nothing matched the gcContentCheck:
    if len(forward_primers) == 0: 
        forward_primers = ["No good primers found."]
    else: 
        temperatureCheck(forward_primers)
    if len(reverse_primers) == 0: 
        reverse_primers = ["No good primers found."]
    else: 
        temperatureCheck(reverse_primers)    
    all_primers = [forward_primers, reverse_primers]
    return all_primers

# this is to get the sequences of length 18-25 from the front and back
def get_sequences(sequence):
    for i in range(18,26):
        forward_sequence_list.append(sequence[:i])
        reverse_sequence_list.append(sequence[-i:])

# finds complementary sequences for sequences in a list
def complementarySequences(list, endlist):
    for item in list: 
        temp_sequence = ""
        for char in item: 
            if char == 'A':
                temp_sequence = temp_sequence + 'T'
            if char == 'T':
                temp_sequence = temp_sequence + 'A'
            if char == 'C':
                temp_sequence = temp_sequence + 'G'
            if char == 'G':
                temp_sequence = temp_sequence + 'C'
        endlist.append(temp_sequence)

# checking for GC content and sequences that are not eligible
def gcContentCheck(primer_list, type):
    temp_list = []
    gc_content_percent_list = []
    gc_count = 0
    closest_to_range_percent = 1
    best_primer = None
    for item in primer_list: 
        gc_count = 0
        for char in item:
            if char == 'G' or char == 'C':
                gc_count = gc_count +1
        # finds the primers in the range for GC content
        if gc_count/len(item) >= 0.3 and gc_count/len(item) <= 0.7:
            temp_list.append(item)
        gc_content_percent_list.append(gc_count/len(item))
    # if none were found, finds one primer thats closest to the range to try at the user's risk
    if len(temp_list) == 0:
        for i in range(len(gc_content_percent_list)): 
            if abs(gc_content_percent_list[i]-0.4) < closest_to_range_percent: 
                closest_to_range_percent = abs(gc_content_percent_list[i]-0.4)
                best_primer = i
            if abs(gc_content_percent_list[i]-0.6) < closest_to_range_percent:
                closest_to_range_percent = abs(gc_content_percent_list[i]-0.6)
                best_primer = i
        # adding the one found if it's the only one
        temp_list.append(primer_list[best_primer])
    # checks for GC content at 3' side based on forward/reverse primer
    for item in temp_list: 
        # location of 3' side is different
        if type == "forward": 
            temp = item[-5:]
        if type == "reverse": 
            temp = item[:5]
        # getting their counts and dropping them if they have more than 3 repeats
        temp_g_count = 0
        temp_c_count = 0
        for char in temp:
            if char == 'G':
                temp_g_count = temp_g_count +1
            if char == 'C': 
                temp_c_count = temp_c_count +1
        if temp_g_count >=3 or temp_c_count >=3:
            temp_list.remove(item)
    # send back the list of primers that we found with the food GC content
    primer_list.clear()
    primer_list[:] = temp_list

# checks the melting temperature of the primer and if it's in range
def temperatureCheck(list):
    temp_list = []
    Tm_list = []
    # variables to look for the primer with the melting temperature closest to the range
    # if there is none in the range..
    best_dist = 500
    best_index = 0
    for item in list: 
        a_count = 0
        g_count = 0
        c_count = 0
        t_count = 0
        for char in item: 
            if char == 'A':
                a_count = a_count + 1
            if char == 'T':
                t_count = t_count + 1
            if char == 'C':
                c_count = c_count + 1
            if char == 'G':
                g_count = g_count + 1
        Tm = 4*(g_count + c_count) + 2*(a_count + t_count)
        Tm_list.append(Tm)
        # take the ones with the good melting temp
        if Tm>50 and Tm <64: 
            temp_list.append(item)
    # if none were in the range
    if len(temp_list) == 0:
        for i in range(len(Tm_list)):
            if abs(Tm_list[i]-55) < best_dist: 
                best_dist = abs(Tm_list[i]-55)
                best_index = i
        temp_list.append(list[best_index])
    
    # send back the primers that are good
    list.clear()
    list[:] = temp_list



    

        
        

