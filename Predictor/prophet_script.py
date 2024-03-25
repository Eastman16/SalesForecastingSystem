import pandas as pd
from prophet import Prophet
import matplotlib.pyplot as plt
import warnings
import sys
import numpy as np
from datetime import datetime

def includeEvents(startDate, endDate, industry):
    events = None

    #Check if COVID applies
    if startDate <= pd.to_datetime('2021-06-10'):
        lockdowns = pd.DataFrame([
            {'holiday': 'lockdown_1', 'ds': '2020-03-21', 'lower_window': 0, 'ds_upper': '2020-06-06'},
            {'holiday': 'lockdown_2', 'ds': '2020-07-09', 'lower_window': 0, 'ds_upper': '2020-10-27'},
            {'holiday': 'lockdown_3', 'ds': '2021-02-13', 'lower_window': 0, 'ds_upper': '2021-02-17'},
            {'holiday': 'lockdown_4', 'ds': '2021-05-28', 'lower_window': 0, 'ds_upper': '2021-06-10'},
        ])
        for t_col in ['ds', 'ds_upper']:
            lockdowns[t_col] = pd.to_datetime(lockdowns[t_col])
        lockdowns['upper_window'] = (lockdowns['ds_upper'] - lockdowns['ds']).dt.days

        events = pd.concat((events, lockdowns))

    match industry:
    #case 'Ksiazki' | 'Books':
    #case 'Chemia':
    #case 'Spozywcze':
    #case 'Zabawki':
        case 'Biuro':
            szkola = pd.DataFrame({
                    'holiday': 'start-rok-szkolny',
                    'ds': pd.to_datetime(['2018-09-01', '2019-09-01', '2020-09-01', '2021-09-01',
                                        '2022-09-01', '2023-09-01', '2024-09-01', '2025-09-01',]),
                    'lower_window': -15,
                    'upper_window': 25,
                })
            events = pd.concat((events, szkola))
        case _:
            pass

    return events

def main(argv):
    warnings.simplefilter("ignore", category=FutureWarning)

    fileName = argv[1]
    country = None
    predictPeriod = 365
    industry = None
    export = False
    exportFileName = None
    #out = open("Data/"+fileName+".csv", "w")
    #datetime.today().strftime('%Y-%m-%d')
    '''
    Parser for argv
    '''
    state = None
    if (len(argv) >= 2):
        for a in argv[2:]:
            match a:
                case '-t':
                    state = 'Time'
                    print(state, end=": ")
                case '-c':
                    state = 'Country'
                    print(state, end=": ")
                case '-i':
                    state = 'Industry'
                    print(state, end=": ")
                case '-e':
                    export = True
                    exportFileName = "Export_"+datetime.today().strftime('%Y-%m-%d_%H-%M-%S')+".csv"
                    print("Exporting dataframe to ", exportFileName)
                case _:
                    match state:
                        case 'Time':
                            predictPeriod = int(a)
                        case 'Country':
                            country = a
                        case 'Industry':
                            industry = a
                    state = None
                    print(a)

    try:
        df = pd.read_csv(fileName)
    except:
        print("ERROR: Can't open "+fileName+"!")
        return 1
    
    df.head()
    df['ds'] = pd.to_datetime(df['ds'])
    #print(df['ds'].iloc[-1] < pd.to_datetime('2024-01-01'))
    
    events = includeEvents(df['ds'].iloc[0], df['ds'].iloc[-1], industry)

    m = Prophet(holidays=events)
    if (country != None):
        m.add_country_holidays(country_name=country)
    m.fit(df)

    future = m.make_future_dataframe(periods=predictPeriod) #, freq='W-SUN')

    future.tail()

    forecast = m.predict(future)
    forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail()
    maxVal = max(np.float32(forecast[['yhat_upper']]))
    forecast[['yhat', 'yhat_lower']] = np.clip(forecast[['yhat', 'yhat_lower']], 0.0, maxVal[0])

    # ax.plot(m.history['ds'].dt.to_pydatetime(), m.history['y'], 'k.')

    # plt.plot(forecast['ds'], forecast['yhat'])
    # plt.ylabel('some numbers')
    # plt.show()
    #print(forecast[(forecast['start-rok-szkolny']).abs() > 0][
    #    ['ds', 'start-rok-szkolny']][-10:])
    if export == True:
        forecast.to_csv(exportFileName, index=False)
    fig1 = m.plot(forecast)
    plt.title('COVID lockdowns + school year start');
    fig2 = m.plot_components(forecast)

    plt.show()

    return 0

if __name__ == '__main__':
    main(sys.argv)