import sys
from datetime import datetime, timedelta

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
    dateFormat = '%y.%m.%d'
    dateFormatEnd = "%Y-%m-%d"
    data = {}
    keyList = []

    toDay = True
    toWeek = False
    toMonth = False

    for a in argv[1:]:
        if '-d' in a:
            toDay = True
            toWeek = False
            toMonth = False
        elif '-w' in a:
            toDay = False
            toWeek = True
            toMonth = False
        elif '-m' in a:
            toDay = False
            toWeek = False
            toMonth = True

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
                    if toWeek:
                        fileName += "_w"
                    elif toMonth:
                        fileName += "_m"
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
                        readDate = datetime.strptime(splitString[1].replace("\n", ""), dateFormat).\
                            strftime(dateFormatEnd)
                        
                        # If another fiscal day started, save the previous day data and start another
                        if readDate not in data:
                            data[readDate] = 0.0
                            keyList.append(readDate)
                    case "Brutto":
                        data[readDate] += float(splitString[1].replace("\n", "")) 
                    # case "Godzina" | "Netto" | "Vat":
                    # case "Magazyny":
                    case default:
                        continue

    # Close data file
    f.close()

    out = open(fileName+"_abc.csv", "w")
    out.write("\"ds\",\"y\"\n")
    if toDay:
        for date in keyList:
            out.write(date + "," + str(data[date]) + "\n")
    elif toWeek:
        weekly_sales = {}

        for date in keyList:
            week_start = datetime.strptime(date, dateFormatEnd) - timedelta(
                days=datetime.strptime(date, dateFormatEnd).weekday())
            if week_start not in weekly_sales:
                weekly_sales[week_start] = 0.0
            weekly_sales[week_start] += data[date]

        for week_start, sales in weekly_sales.items():
            week_end = week_start + timedelta(days=6)
            out.write(week_end.strftime(dateFormatEnd) + "," + str(sales) + "\n")
    elif toMonth:
        monthly_sales = {}

        for date in keyList:
            month_start = datetime.strptime(date, dateFormatEnd).replace(day=1)
            if month_start not in monthly_sales:
                monthly_sales[month_start] = 0.0
            monthly_sales[month_start] += data[date]

        for month_start, sales in monthly_sales.items():
            if month_start.month == 12:
                month_end = month_start.replace(day=1, month=1, year=month_start.year + 1) - timedelta(days=1)
            else:
                month_end = month_start.replace(day=1, month=month_start.month + 1) - timedelta(days=1)
            out.write(month_end.strftime(dateFormatEnd) + "," + str(sales) + "\n")

    out.close()

    return 0

if __name__ == '__main__':
    main(sys.argv)