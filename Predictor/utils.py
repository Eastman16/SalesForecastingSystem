import math

def exportToFile(data, df, predictionName, fileName):
    exportForecast = data
    exportForecast['y'] = df['y']

    bWzgl = []
    for iter, row in exportForecast.iterrows():
        if row['y'] != 0:
            result = abs(row[predictionName]-row['y'])/row['y']*100
            if math.isnan(result) == False:
                bWzgl.append(str(result) + "%")
            else:
                bWzgl.append("")
        else:
            bWzgl.append("0%")

    exportForecast['b. względny'] = bWzgl
    exportForecast.to_csv(fileName + "_" + predictionName + "_" + ".csv", index=False)