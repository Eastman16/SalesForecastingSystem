import sys
from datetime import datetime

def main(argv):
    try:
        f = open(argv[1],"r", encoding='cp1250')
    except:
        print("ERROR: Can't open "+argv[1]+"!")
        return 1

    out = None
    # utf8 = data.encode('utf-8')
    state = 0
    fileName = str(object='Data_')
    tempSales = 0.0
    dateFormat = '%y.%m.%d'
    dateFormatEnd = "%Y-%m-%d"
    data = {}
    keyList = []

    for line in f:
        if state == 0:
            # [Info]
            if line == f"[Okres]\n":
                state = 1
        elif state == 1:
            # [Okres]
            # Poczatek=24.02.01
            # Koniec=24.02.29
            if line != "\n":
                splitString = line.split("=")
                # Create file name
                fileName += splitString[1].replace("\n", "")
                if splitString[0] == "Poczatek":
                    fileName += "_"
                else:
                    fileName += "_" + argv[2]
                    state = 2
        elif state == 2:
            # Create file
            if line == f"[Dokument]\n":
                state = 3
        else:
            # Fill out the file
            if line != f"[Dokument]\n" and line != "\n":
                splitString = line.split("=")
                match splitString[0]:
                    case "DataSprzed":
                        readDate = datetime.strptime(splitString[1].replace("\n", ""), dateFormat). \
                            strftime(dateFormatEnd)
                        # If another fiscal day started, save the previous day data and start another
                        if readDate not in data:
                            data[readDate] = 0.0
                            keyList.append(readDate)
                    case "Brutto":
                        tempSales = float(splitString[1].replace("\n", ""))
                    # case "Godzina" | "Netto" | "Vat":
                    case "Magazyny":
                        productTypes = splitString[1].replace("\n", "").split(",")[:-1] 
                        for mag in productTypes:
                            if int(mag) == int(argv[2]):
                                data[readDate] += tempSales
                                break
                    case default:
                        continue

    # Close data file
    f.close()

    out = open(fileName+"_abc.csv", "w")
    out.write("\"ds\",\"y\"\n") 

    data = dict(sorted(data.items(), key=lambda item: item[1]))
    keyList.sort()
    
    for date in keyList:
        out.write(date+","+str(data[date])+"\n")

    out.close()

    return 0

if __name__ == '__main__':
    main(sys.argv)