import pandas as pd
from prophet import Prophet
import matplotlib.pyplot as plt
import warnings
import sys

def main(argv):
    warnings.simplefilter("ignore", category=FutureWarning)

    try:
        df = pd.read_csv(argv[1])#"Data_24.02.01_24.02.29.csv")
    except:
        print("ERROR: Can't open "+argv[1]+"!")
        return 1
    
    df.head()
    df['ds'] = pd.to_datetime(df['ds'])

    m = Prophet()
    m.fit(df)

    future = m.make_future_dataframe(periods=100)
    future.tail()

    forecast = m.predict(future)
    forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail()

    # ax.plot(m.history['ds'].dt.to_pydatetime(), m.history['y'], 'k.')

    # plt.plot(forecast['ds'], forecast['yhat'])
    # plt.ylabel('some numbers')
    # plt.show()

    fig1 = m.plot(forecast)
    fig2 = m.plot_components(forecast)

    plt.show()

    return 0

if __name__ == '__main__':
    main(sys.argv)