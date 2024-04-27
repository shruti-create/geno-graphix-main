def recommendation(primer):
    recs = []
    recs.append(gcContentCheck(primer))
    recs.append(temperatureCheck(primer))
    
    return recs

def gcContentCheck(primer):
        gc_count = 0
        for char in primer:
            if char == 'G' or char == 'C':
                gc_count = gc_count +1
        
        # finds the primers in the range for GC content
        if gc_count/len(primer) >= 0.3 and gc_count/len(primer) <= 0.7:
            return ""
        else:
            if gc_count/len(primer) <= 0.3:
                return ("GC content is below the optimal range: Add " )
            else:
                return ("GC content is above optimal range: Remove ")


def temperatureCheck(primer):
    Tm_list = []
    # variables to look for the primer with the melting temperature closest to the range
    # if there is none in the range..
    a_count = 0
    g_count = 0
    c_count = 0
    t_count = 0
    for char in primer: 
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
        return 1
    # if none were in the range
    else:
        if Tm <50:
            return ("Temperature is below the optimal range: Add")
        else:
            return ("Temperature is above the optimal range: Remove")
        