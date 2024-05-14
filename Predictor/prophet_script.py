import pandas as pd

from prophet import Prophet
from prophet.serialize import model_to_json, model_from_json
from prophet.diagnostics import cross_validation, performance_metrics
from prophet.plot import plot_cross_validation_metric

import matplotlib.pyplot as plt

import warnings
import sys
import numpy as np
import itertools
from datetime import datetime

# Our
from utils import exportToFile

from io import StringIO

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
    print('-v\t\tEnable cross validation')
    print('-r\t\tEnabled, it defines the store as a stationary store')
    print('\nHOW TO USE\n')
    print('python3 prophet_script.py file.csv -t 100\tOpens file.csv and predicts for 100 days forward')

# TODO: Automatic dates calculation or saving the adjusted model and using it later on
def includeEvents(startDate, endDate, industry, isRetail, country):
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

        if country == 'PL' and isRetail:
            trading_sundays = [
                # 2018
                '2018-01-07', '2018-01-14', '2018-01-21', '2018-01-28',
                '2018-02-04', '2018-02-11', '2018-02-18', '2018-02-25',
                '2018-03-04',
                '2018-03-25',
                '2018-04-29',
                '2018-05-06', '2018-05-27',
                '2018-06-03', '2018-06-24',
                '2018-07-01', '2018-07-29',
                '2018-08-05', '2018-08-26',
                '2018-09-02', '2018-09-30',
                '2018-10-07', '2018-10-28',
                '2018-11-04', '2018-11-25',
                '2018-12-02', '2018-12-16', '2018-12-23', '2018-12-30',

                # 2019
                '2019-01-27',
                '2019-02-24',
                '2019-03-31',
                '2019-04-14', '2019-04-28',
                '2019-05-26',
                '2019-06-30',
                '2019-07-28',
                '2019-08-25',
                '2019-09-29',
                '2019-10-27',
                '2019-11-24',
                '2019-12-15', '2019-12-22', '2019-12-29',

                # 2020
                '2020-01-26',
                '2020-04-05', '2020-04-26',
                '2020-06-28',
                '2020-08-30',
                '2020-12-13', '2020-12-20',

                # 2021
                '2021-01-31',
                '2021-03-28',
                '2021-04-25',
                '2021-06-27',
                '2021-08-29',
                '2021-12-12', '2021-12-19',

                # 2022
                '2022-01-30',
                '2022-04-10', '2022-04-24',
                '2022-06-26',
                '2022-08-28',
                '2022-12-11', '2022-12-18',

                # 2023
                '2023-01-29',
                '2023-04-02', '2023-04-30',
                '2023-06-25',
                '2023-08-27',
                '2023-12-17', '2023-12-24',

                # 2024
                '2024-01-28',
                '2024-03-24', '2024-04-28',
                '2024-06-30',
                '2024-08-25',
                '2024-12-15', '2024-12-22',
            ]

            if startDate < pd.to_datetime('2018-01-01'):
                all_sundays = pd.date_range(start=pd.to_datetime('2018-01-01'), end=endDate, freq='W-SUN').strftime('%Y-%m-%d').tolist()
            else:
                all_sundays = pd.date_range(start=startDate, end=endDate, freq='W-SUN').strftime('%Y-%m-%d').tolist()

            non_trading_sundays = list(set(all_sundays) - set(trading_sundays))

            non_trading_sundays_df = pd.DataFrame({
                'holiday': 'non_trading_sunday',
                'ds': pd.to_datetime(non_trading_sundays),
                'lower_window': 0,
                'upper_window': 0,
            })
            events = pd.concat((events, non_trading_sundays_df))

    match industry:
        case 'Chemia':
            wielkanoc = pd.DataFrame({
                    'holiday': 'wielkanoc',
                    'ds': pd.to_datetime(['2018-04-01', '2019-04-21', '2020-04-12', '2021-04-04',
                                        '2022-04-17', '2023-04-09', '2024-03-31', '2025-04-20',]),
                    'lower_window': -14,
                    'upper_window': 0,
                })
            events = pd.concat((events, wielkanoc))

            swieta = pd.DataFrame({
                    'holiday': 'swieta',
                    'ds': pd.to_datetime(['2018-12-25', '2019-12-25', '2020-12-25', '2021-12-25',
                                        '2022-12-25', '2023-12-25', '2024-12-25', '2025-12-25',]),
                    'lower_window': -14,
                    'upper_window': 0,
                })
            events = pd.concat((events, swieta))

        case 'Spozywcze':
            post_swieta_nowy = pd.DataFrame({
                    'holiday': 'post-swieta-nowy',
                    'ds': pd.to_datetime(['2018-01-01', '2019-01-01', '2020-01-01', '2021-01-01',
                                        '2022-01-01', '2023-01-01', '2024-01-01', '2025-01-01',]),
                    'lower_window': 0,
                    'upper_window': 14,
                })
            events = pd.concat((events, post_swieta_nowy))

        case 'Zabawki':
            dzien_dziecka = pd.DataFrame({
                    'holiday': 'dzien-dziecka',
                    'ds': pd.to_datetime(['2018-06-01', '2019-06-01', '2020-06-01', '2021-06-01',
                                        '2022-06-01', '2023-06-01', '2024-06-01', '2025-06-01',]),
                    'lower_window': -14,
                    'upper_window': 0,
                })
            events = pd.concat((events, dzien_dziecka))

            mikolajki = pd.DataFrame({
                    'holiday': 'Mikolajki',
                    'ds': pd.to_datetime(['2018-12-06', '2019-12-06', '2020-12-06', '2021-12-06',
                                        '2022-12-06', '2023-12-06', '2024-12-06', '2025-12-06',]),
                    'lower_window': -14,
                    'upper_window': 0,
                })
            events = pd.concat((events, mikolajki))

        case 'Biuro' | 'Ksiazki':
            szkola = pd.DataFrame({
                    'holiday': 'start-rok-szkolny',
                    'ds': pd.to_datetime(['2018-09-01', '2019-09-01', '2020-09-01', '2021-09-01',
                                        '2022-09-01', '2023-09-01', '2024-09-01', '2025-09-01',]),
                    'lower_window': -15, #-7,
                    'upper_window': 25,
                })
            events = pd.concat((events, szkola))
        case _:
            pass

    return events

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

    #out = open("Data/"+fileName+".csv", "w")
    #datetime.today().strftime('%Y-%m-%d')
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
            case '-e':
                export = True
                exportFileName = "Export_"+datetime.today().strftime('%Y-%m-%d_%H-%M-%S')+".csv"
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
                modelFileName = "Model_"+datetime.today().strftime('%Y-%m-%d_%H-%M-%S')+".json"
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
                    case _:
                        fileName = a
                state = None
                print(a)

    try:
        df = pd.read_csv(fileName)
    except:
        print("ERROR: Can't open "+fileName+"!")
        return 1
    
    df['ds'] = pd.to_datetime(df['ds'])
    
    events = includeEvents(df['ds'].iloc[0], df['ds'].iloc[-1], industry, isRetail, country)

    m = None
    if (modelName != None):
        try:
            with open(modelName, 'r') as fin:
                m = model_from_json(fin.read())
        except:
            print("ERROR: Can't open "+modelName+"!")
            return 1
    else:
        m = Prophet(holidays=events) # changepoint do testów
        if (country != None):
            m.add_country_holidays(country_name=country)
    
        m.fit(df)

    future = m.make_future_dataframe(periods=predictPeriod, freq=frequency) #'W-SUN')

    # Best results:
    # {'changepoint_prior_scale': 0.001, 'seasonality_prior_scale': 0.1, 'holidays_prior_scale': 0.01, 'seasonality_mode': 'additive', 'changepoint_range': 0.95}
    if crossValidate == True:
        param_grid = {
            'changepoint_prior_scale': [0.001, 0.01, 0.1, 0.5],
            'seasonality_prior_scale': [0.01, 0.1, 1.0, 10.0],
            'holidays_prior_scale': [0.01, 0.1, 1.0, 10.0],
            'seasonality_mode': ['additive', 'multiplicative'],
            'changepoint_range': [0.8, 0.9, 0.95],
            # 'holidays': [None, events],
        }

        all_params = [dict(zip(param_grid.keys(), v)) for v in itertools.product(*param_grid.values())]
        rmses = []

        for params in all_params:
            m = Prophet(**params, holidays=events)
            
            if (country != None):
                m.add_country_holidays(country_name=country)

            m.fit(df) 
            
            df_cv = cross_validation(m, initial='730 days', period='30 days', horizon='365 days',
                                 parallel='processes')
            df_p = performance_metrics(df_cv, rolling_window=1)
            rmses.append(df_p['rmse'].values[0])
        
        tuning_results = pd.DataFrame(all_params)
        tuning_results['rmse'] = rmses
        print('Results:\n', tuning_results.sort_values(by=['rmse']).head(10))

        if export == True:
            tuning_results.sort_values(by=['rmse']).to_csv("tune_results.csv", index=False)
        
        best_params = all_params[np.argmin(rmses)]
        print('Best results:\n', best_params)

        # Apply best params
        m = Prophet(**best_params)
        if (country != None):
                m.add_country_holidays(country_name=country)

        m.fit(df)
        # df_cv = cross_validation(m, initial='730 days', period='30 days', horizon='365 days',
                                # parallel='processes')

        if plot == True:
            fig = plot_cross_validation_metric(df_cv, metric='rmse')

    forecast = m.predict(future)
    maxVal = max(np.float32(forecast[['yhat_upper']]))
    forecast[['yhat', 'yhat_lower']] = np.clip(forecast[['yhat', 'yhat_lower']], 0.0, maxVal[0])

    if export == True:
        exportToFile(forecast, df, "Prophet", 
            "Export_"+datetime.today().strftime('%Y-%m-%d_%H-%M-%S'))
        
    if saveModel == True:
        with open(modelFileName, 'w') as fout:
            fout.write(model_to_json(m))

    if plot == True:
        plt.plot(df['ds'], df['y'])
        plt.plot(df['ds'], df['y'], '.k')
        plt.grid(alpha=.5)
        plt.xlabel('Data')
        plt.ylabel('Sprzedaż')
        fig1 = m.plot(forecast)
        plt.title('COVID lockdowns + school year start');
        fig2 = m.plot_components(forecast)

        plt.show()

    df_cv = cross_validation(m, initial='730 days', period='30 days', horizon='365 days',
                                 parallel='processes')
    df_p = performance_metrics(df_cv, metrics=['mse', 'rmse', 'mae', 'mape', 'mdape', 'smape'], rolling_window=1)
    print(df_p)

def useProphet(country, industry, isRetail, periods, freq, df):
    df['ds'] = pd.to_datetime(df['ds'])
    events = includeEvents(df['ds'].iloc[0], df['ds'].iloc[-1], industry, isRetail, country)
    m = Prophet(holidays=events)  # changepoint do testów

    if (country != None):
        m.add_country_holidays(country_name=country)
    m.fit(df)
    future = m.make_future_dataframe(periods=periods, freq=freq)  # 'W-SUN')

    forecast = m.predict(future)
    forecast[['yhat', 'yhat_lower']] = np.clip(forecast[['yhat', 'yhat_lower']], 0.0, 99999999)

    forecast['ds'] = forecast['ds'].dt.strftime("%Y-%m-%d")
    return forecast[['ds', 'yhat']].transpose().to_json()

if __name__ == '__main__':
    main(sys.argv)