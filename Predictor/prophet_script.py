import pandas as pd
from prophet import Prophet
import matplotlib.pyplot as plt
import warnings
import sys
import numpy as np

def main(argv):
    warnings.simplefilter("ignore", category=FutureWarning)

    fileName = argv[1]
    country = None
    predictPeriod = 365
    industry = None

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
    '''
    szkola = pd.DataFrame({
        'holiday': 'start-rok-szkolny',
        'ds': pd.to_datetime(['2018-09-01', '2019-09-01', '2020-09-01', '2021-09-01']),
        'lower_window': -15,
        'upper_window': 25,
    })
    '''
    m = Prophet() #holidays=szkola)
    if (country != None):
        m.add_country_holidays(country_name=country)
    m.fit(df)

    future = m.make_future_dataframe(periods=predictPeriod)

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

    fig1 = m.plot(forecast)
    fig2 = m.plot_components(forecast)

    plt.show()

    return 0

if __name__ == '__main__':
    main(sys.argv)