import sys

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
    currDate = "20.01.01"
    currSales = 0.0
    data = str(object='')

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
                    currDate = splitString[1].replace("\n", "")
                else:
                    state = 2
        elif state == 2:
            # Create file
            if line == f"[Dokument]\n":
                out = open("Data/"+fileName+".csv", "w")
                out.write("\"ds\",\"y\"\n")
                out.write("\"20"+currDate+"\",")
                state = 3
        else:
            # Fill out the file
            if line != f"[Dokument]\n" and line != "\n":
                splitString = line.split("=")
                match splitString[0]:
                    case "DataSprzed":
                        readDate = splitString[1].replace("\n", "")
                        # If another fiscal day started, save the previous day data and start another
                        if readDate != currDate:
                            out.write(str(currSales)+"\n\"20"+readDate+"\",")           
                            currSales = 0
                            currDate = readDate
                    case "Brutto":
                        currSales += float(splitString[1].replace("\n", ""))
                    # case "Godzina" | "Netto" | "Vat":
                    # case "Magazyny":
                    case default:
                        continue

    # Make sure to save the last day
    out.write(str(currSales)+"\n")

    # Close files
    f.close()
    out.close()

    return 0

if __name__ == '__main__':
    main(sys.argv)