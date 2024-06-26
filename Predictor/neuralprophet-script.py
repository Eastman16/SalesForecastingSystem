import pandas as pd
from neuralprophet import NeuralProphet
import matplotlib.pyplot as plt
import warnings
import sys
import numpy as np
from datetime import datetime
import prophet_script as ps

def help():
    print('Commands:')
    print('-c\t\tSelect country of origin (eg. -c PL sets Poland as country of origin)')
    print('-e\t\tExports data to a file')
    print('-f\t\tFrequency of data collection (eg. -f W-SUN sets weekly frequency with Sunday as last day) - default daily')
    print('\t\tOptions: D - daily\n\t\tW-SUN - weekly (Sunday)\n\t\tM - monthly')
    print('-i\t\tDesired industry (eg. -i Biuro sets prediction events for office)')
    print('-l\t\tLoad .json pre-fitted model')
    print('-p\t\tPlot results')
    print('-s\t\tSaves model to a file')
    print('-t\t\tDesired prediction time (eg. -t 1000 predicts for 1000 days forward)')
    #TODO: print('-v\t\tEnable cross validation')
    print('-r\t\tEnabled, it defines the store as a stationary store')
    print('\nHOW TO USE\n')
    print('python3 prophet_script.py file.csv -t 100\tOpens file.csv and predicts for 100 days forward')

def testEvents():
    date_ranges = [
        (pd.date_range(start='2020-03-21', end='2020-06-06'), '2020-03-21', '2020-06-06'),
        (pd.date_range(start='2020-07-09', end='2020-10-27'), '2020-07-09', '2020-10-27'),
        (pd.date_range(start='2021-02-13', end='2021-02-17'), '2021-02-13', '2021-02-17'),
        (pd.date_range(start='2021-05-28', end='2021-06-10'), '2021-05-28', '2021-06-10')
    ]

    dates = [date for sublist in date_ranges for date in sublist]

    return pd.DataFrame(
        {
            "event":"Lockdown",
            "ds": dates
        }
    )


def main(argv):
    warnings.simplefilter("ignore", category=FutureWarning)

    fileName = argv[1]
    modelName = None
    country = None
    predictPeriod = 365
    industry = None
    frequency = 'D'
    export = False
    saveModel = False
    exportFileName = None
    modelFileName = None
    plot = False
    crossValidate = False
    isRetail = False
    compare = False
    cmpfilename = None

    '''
    Parser for argv
    '''
    state = None
    # if (len(argv) >= 2):
    for a in argv[1:]:
        match a:
            case '-c':
                state = 'Country'
                print(state, end=": ")
            case '-x':
                state = 'Check'
                compare = True
                print(state, end=": ")
            case '-e':
                export = True
                exportFileName = "Export_" + datetime.today().strftime('%Y-%m-%d_%H-%M-%S') + "_" + str(industry) + ".csv"
                print("Exporting dataframe to ", exportFileName)
            case '-f':
                state = 'Frequency'
                print(state, end=": ")
            case '--help':
                help()
                return 0
            case '-i':
                state = 'Industry'
                print(state, end=": ")
            case '-l':
                state = 'Loaded model'
                print(state, end=": ")
            case '-p':
                plot = True
            case '-s':
                saveModel = True
                modelFileName = "Model_" + datetime.today().strftime('%Y-%m-%d_%H-%M-%S') + ".json"
                print('Saving model to ', modelFileName)
            case '-t':
                state = 'Time'
                print(state, end=": ")
            case '-v':
                crossValidate = True
                print('Cross validation enabled')
            case '-r':
                isRetail = True
            case _:
                match state:
                    case 'Time':
                        predictPeriod = int(a)
                    case 'Country':
                        country = a
                    case 'Industry':
                        industry = a
                    case 'Loaded model':
                        modelName = a
                    case 'Frequency':
                        frequency = a
                    case 'Check':
                        cmpfilename = a
                    case _:
                        fileName = a
                state = None
                print(a)

    try:
        df = pd.read_csv(fileName)
    except Exception as e:
        print("ERROR: Can't open " + fileName + ":", e)
        return 1

    df['ds'] = pd.to_datetime(df['ds'])

    if (modelName != None):
        try:
            with open(modelName, 'r') as fin:
                m = model_from_json(fin.read())
        except:
            print("ERROR: Can't open "+modelName+"!")
            return 1
    else:
        #events = testEvents()
        m = NeuralProphet()
        #m.add_events("Lockdown")

        #if (country != None):
        #    m.add_country_holidays(country_name=country)
        #print(df)
        metrics = m.fit(df)


    # Specify the forecast horizon
    future = m.make_future_dataframe(df, n_historic_predictions=True, periods=predictPeriod)  # Forecasting 30 days into the future

    #print(future)

    forecast = m.predict(future)

    if export and exportFileName:
        forecast.to_csv(exportFileName, index=False)

    if compare:
        try:
            cdf = pd.read_csv(cmpfilename)
        except Exception as e:
            print("ERROR: Can't open " + cmpfilename + ":", e)
            return 1
        cmp = cdf.tail(predictPeriod)
        #   print(cmp)
        a = forecast[['ds', 'yhat1']].tail(365)
        #print(a)
        cnct = pd.concat([cmp.ds, cmp.y, a.yhat1], axis=1)
        print(cnct)
        print("RSME: ", ((cnct.y - cnct.yhat1) ** 2).mean() ** .5)
        print("MAE: ", (abs(cnct.y - cnct.yhat1)).mean())
        cnct['APE'] = abs((cnct.y - cnct.yhat1) / cnct.y) * 100
        print("MDAPE:", cnct.APE.median())
        print("SDAPE:", cnct.APE.mean())

    if saveModel:
        with open(modelFileName, 'w') as fout:
            fout.write(model_to_json(m))

    if plot:
        fig1 = m.plot(forecast)
        plt.title('COVID lockdowns + school year start')
        fig2 = m.plot_components(forecast)

        plt.show()

    return 0


if __name__ == '__main__':
    main(sys.argv)