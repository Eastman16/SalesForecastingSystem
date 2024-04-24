import os
import sys
import numpy as np
import pandas as pd
import itertools
from datetime import datetime

# Plot
import matplotlib.pyplot as plt
import plotly.graph_objects as go

# MLForecast
from mlforecast import MLForecast
from mlforecast.utils import PredictionIntervals

# StatsForecast
from statsforecast import StatsForecast

from datasetsforecast.losses import rmse, mae, smape

# Models
from lightgbm import LGBMRegressor
from xgboost import XGBRegressor
from sklearn.linear_model import LinearRegression

# Our
from utils import exportToFile

modelName = ""
exportFileName = ""

frequency = "D"
n_windows=12
step_size=30
predictPeriod = 360
threads=8
date_features=['year', 'month', 'quarter']

plot = False
export = False
saveModel = False
crossValidate = False
optimise = False

def lgbm(df):
    rmses = []
    maes = []
    smapes = []
    tuning_results = None

    global export
    global date_features
    global threads
    global exportFileName
    mlf = MLForecast(
            models=[LGBMRegressor()], # List of models for forecasting: LightGBM, XGBoost and Linear Regression
            freq=frequency,  # Frequency of the data - 'D' for daily frequency
            lags=[365],  # Specific lags to use as regressors: 1 to 6 days
            date_features=date_features,  # Date features to use as regressors
            num_threads=threads,
    )

    if crossValidate == True:
        if optimise == True:
            global n_windows
            global step_size
            # 1706 RMSE @ 128;1024;511;dart;0.05;any;
            # probably best would be 64;2048;128;gbdt;0.05
            lgb_params = {
                'num_leaves': [8, 16, 32],
                'n_estimators': [100, 200, 400],
                'max_bin': [32, 64, 128],
                'boosting': ['gbdt', 'dart'], #more accurate, but not good for Biuro 
                'learning_rate': [0.1, 0.25, 0.5],
                # 'min_child_weight': [0.001, 0.01, 0.1, 1, 10],
                # 'subsample': [0.25, 0.5, 1.0],
            }

            all_params = [dict(zip(lgb_params.keys(), v)) for v in itertools.product(*lgb_params.values())]
            
            # LGBMRegressor
            for params in all_params:
                # Instantiate the MLForecast object
                mlf = MLForecast(
                    models=[LGBMRegressor(**params, verbosity=0)], # List of models for forecasting: LightGBM, XGBoost and Linear Regression
                    freq=frequency,  # Frequency of the data - 'D' for daily frequency
                    lags=[365],  # Specific lags to use as regressors: 1 to 6 days
                    date_features=date_features, # Date features to use as regressors
                    num_threads=threads,
                )
                
                cv_mlf_df = mlf.cross_validation(
                    df=df,
                    h=step_size,
                    n_windows=n_windows,
                    step_size=step_size,
                    level=[90],
                )

                mlf.fit(df)

                rmses.append(rmse(cv_mlf_df['y'], cv_mlf_df['LGBMRegressor']))
                maes.append(mae(cv_mlf_df['y'], cv_mlf_df['LGBMRegressor']))
                smapes.append(smape(cv_mlf_df['y'], cv_mlf_df['LGBMRegressor']))

            tuning_results = pd.DataFrame(all_params)
            tuning_results['rmse'] = rmses
            tuning_results['mae'] = maes
            tuning_results['smape'] = smapes
            tuning_results = tuning_results.sort_values(by=['rmse'])

            if export == True:
                global exportFileName
                tuning_results.to_csv(exportFileName + "_tuning_lgbm.csv", index=False)

            # Show best params
            best_params_lgbm = all_params[np.argmin(rmses)]
            mlf = MLForecast(
                    models=[LGBMRegressor(**best_params_lgbm)], # List of models for forecasting: LightGBM, XGBoost and Linear Regression
                    freq=frequency,  # Frequency of the data - 'D' for daily frequency
                    lags=[365],  # Specific lags to use as regressors: 1 to 6 days
                    date_features=date_features, # Date features to use as regressors
                    num_threads=threads,
            )

            cv_mlf_df = mlf.cross_validation(
                df=df,
                h=step_size,
                n_windows=n_windows,
                step_size=step_size,
                level=[90],
            )

            mlf.fit(df)

            if export == True:
                # global exportFileName
                exportToFile(cv_mlf_df, df, 'LGBMRegressor', exportFileName)

        else:
            mlf = MLForecast(
                models=[LGBMRegressor(verbosity=0)], # List of models for forecasting: LightGBM, XGBoost and Linear Regression
                freq=frequency,  # Frequency of the data - 'D' for daily frequency
                lags=[365],  # Specific lags to use as regressors: 1 to 6 days
                date_features=date_features, # Date features to use as regressors
                num_threads=threads,
            )

            cv_mlf_df = mlf.cross_validation(
                df=df,
                h=step_size,
                n_windows=n_windows,
                step_size=step_size,
                level=[90],
            )

            mlf.fit(df)
            
            rmses.append(rmse(cv_mlf_df['y'], cv_mlf_df['LGBMRegressor']))
            maes.append(mae(cv_mlf_df['y'], cv_mlf_df['LGBMRegressor']))
            smapes.append(smape(cv_mlf_df['y'], cv_mlf_df['LGBMRegressor']))

            tuning_results = pd.DataFrame()
            tuning_results['rmse'] = rmses
            tuning_results['mae'] = maes
            tuning_results['smape'] = smapes
            tuning_results = tuning_results.sort_values(by=['rmse'])
            
            if export == True:
                # global exportFileName
                exportToFile(cv_mlf_df, df, 'LGBMRegressor', exportFileName)

    else:
        mlf = MLForecast(
                models=[LGBMRegressor()], # List of models for forecasting: LightGBM, XGBoost and Linear Regression
                freq=frequency,  # Frequency of the data - 'D' for daily frequency
                lags=[365],  # Specific lags to use as regressors: 1 to 6 days
                date_features=date_features, # Date features to use as regressors
                num_threads=threads,
        )
        mlf.fit(df)
        # mlf.fit(df, prediction_intervals=PredictionIntervals(n_windows=2, h=180))

    fcst_mlf_df = mlf.predict(predictPeriod, level=[90])
    '''
    if export == True:
        exportForecast = fcst_mlf_df
        exportForecast['y'] = df['y']

        rmses.append(rmse(exportForecast['y'], exportForecast['LGBMRegressor']))
        maes.append(mae(exportForecast['y'], exportForecast['LGBMRegressor']))
        smapes.append(smape(exportForecast['y'], exportForecast['LGBMRegressor']))

        tuning_results_lgbm = pd.DataFrame()
        tuning_results_lgbm['rmse'] = rmses
        tuning_results_lgbm['mae'] = maes
        tuning_results_lgbm['smape'] = smapes
        tuning_results_lgbm = tuning_results_lgbm.sort_values(by=['rmse'])

        bWzgl = []
        for iter, row in exportForecast.iterrows():
            if row['y'] != 0:
                result = abs(row['LGBMRegressor']-row['y'])/row['y']*100
                if math.isnan(result) == False:
                    bWzgl.append(str(result) + "%")
                else:
                    bWzgl.append("")
            else:
                bWzgl.append("0%")

        exportForecast['b. względny'] = bWzgl
        exportForecast.to_csv(exportFileName+"_lbgm.csv", index=False)
    '''
    if plot == True:
        plot2 = StatsForecast.plot(df, fcst_mlf_df, engine='plotly')
        plot2.show()

    return tuning_results

def xgb(df):
    rmses = []
    maes = []
    smapes = []
    tuning_results = None
    
    global export
    global date_features
    global threads
    global exportFileName
    mlf = MLForecast(
        models=[XGBRegressor(verbosity=0)], # List of models for forecasting: LightGBM, XGBoost and Linear Regression
        freq=frequency,  # Frequency of the data - 'D' for daily frequency
        lags=[365],  # Specific lags to use as regressors: 1 to 6 days
        date_features=date_features, # Date features to use as regressors
        num_threads=threads,
    )

    if crossValidate == True:
        if optimise == True:
            xgb_params = {
                'booster': ['gbtree'], #'dart'],
                'subsample': [0.25, 0.5, 1.0],
                'max_depth': [3, 5, 7, 9],
                'max_bin': [64, 128, 256],
                'eta': [0.1, 0.15, 0.3],
                # 'gamma': [0.5, 1.0, 2.5],
                'n_estimators': [25, 50],# 100],
                'min_child_weight': [1, 2, 4],
            }
            '''
            xgb_params = {
                # 'booster': ['dart'],
                #'subsample': [0.1, 0.25, 0.33, 0.5, 0.75, 1.0],
                #'max_depth': [12],
                #'max_bin': [128],
                #'eta': [0.3],
                #'gamma': [0.1],
            }
            '''
            all_params = [dict(zip(xgb_params.keys(), v)) for v in itertools.product(*xgb_params.values())]     

            # XGBRegressor
            for params in all_params:
                # Instantiate the MLForecast object
                mlf = MLForecast(
                    models=[XGBRegressor(**params, verbosity=0)], # List of models for forecasting: LightGBM, XGBoost and Linear Regression
                    freq=frequency,  # Frequency of the data - 'D' for daily frequency
                    lags=[365],  # Specific lags to use as regressors: 1 to 6 days
                    date_features=date_features, # Date features to use as regressors
                    num_threads=threads,
                )

                cv_mlf_df = mlf.cross_validation(
                    df=df,
                    h=step_size,
                    n_windows=n_windows,
                    # step_size=180,
                    level=[90],
                    prediction_intervals=PredictionIntervals(n_windows=n_windows, h=step_size)
                )

                rmses.append(rmse(cv_mlf_df['y'], cv_mlf_df['XGBRegressor']))
                maes.append(mae(cv_mlf_df['y'], cv_mlf_df['XGBRegressor']))
                smapes.append(smape(cv_mlf_df['y'], cv_mlf_df['XGBRegressor']))

            tuning_results_xgb = pd.DataFrame(all_params)
            tuning_results_xgb['rmse'] = rmses
            tuning_results_xgb['mae'] = maes
            tuning_results_xgb['smape'] = smapes
            tuning_results_xgb = tuning_results_xgb.sort_values(by=['rmse'])

            if export == True:
                tuning_results_xgb.to_csv(exportFileName + "_tuning_xgb.csv", index=False)

            # Show best params
            best_params_xgb = all_params[np.argmin(rmses)]
            mlf = MLForecast(
                    models=[XGBRegressor(**best_params_xgb)], # List of models for forecasting: LightGBM, XGBoost and Linear Regression
                    freq=frequency,  # Frequency of the data - 'D' for daily frequency
                    lags=[365],  # Specific lags to use as regressors: 1 to 6 days
                    date_features=date_features, # Date features to use as regressors
                    num_threads=threads,
            )
            mlf.fit(df)

            cv_mlf_df = mlf.cross_validation(
                df=df,
                h=step_size,
                n_windows=n_windows,
                # step_size=180,
                level=[90],
                prediction_intervals=PredictionIntervals(n_windows=n_windows, h=step_size)
            )

            if export == True:
                exportToFile(cv_mlf_df, df, 'XGBRegressor', exportFileName)

        else:
            mlf = MLForecast(
                models=[XGBRegressor(verbosity=0)], # List of models for forecasting: LightGBM, XGBoost and Linear Regression
                freq=frequency,  # Frequency of the data - 'D' for daily frequency
                lags=[365],  # Specific lags to use as regressors: 1 to 6 days
                date_features=date_features, # Date features to use as regressors
                num_threads=threads,
            )

            cv_mlf_df = mlf.cross_validation(
                df=df,
                h=step_size,
                n_windows=n_windows,
                # step_size=180,
                level=[90],
                prediction_intervals=PredictionIntervals(n_windows=n_windows, h=step_size)
            )

            mlf.fit(df)

            rmses.append(rmse(cv_mlf_df['y'], cv_mlf_df['XGBRegressor']))
            maes.append(mae(cv_mlf_df['y'], cv_mlf_df['XGBRegressor']))
            smapes.append(smape(cv_mlf_df['y'], cv_mlf_df['XGBRegressor']))

            tuning_results_xgb = pd.DataFrame()
            tuning_results_xgb['rmse'] = rmses
            tuning_results_xgb['mae'] = maes
            tuning_results_xgb['smape'] = smapes
            tuning_results_xgb = tuning_results_xgb.sort_values(by=['rmse'])
            
            if export == True:
                exportToFile(cv_mlf_df, df, 'XGBRegressor', exportFileName)

    mlf.fit(df)
    fcst_mlf_df = mlf.predict(predictPeriod, level=[90])

    if plot == True:
        plot2 = StatsForecast.plot(df, fcst_mlf_df, engine='plotly')
        plot2.show()

    return tuning_results_xgb

def main(argv):
    fileName = argv[1]

    # this makes it so that the outputs of the predict methods have the id as a column 
    # instead of as the index
    os.environ['NIXTLA_ID_AS_COL'] = '1'
    
    state = None
    for a in argv[1:]:
        match a:
            case '-e':
                global export
                global exportFileName
                export = True
                exportFileName = "Export_"+datetime.today().strftime('%Y-%m-%d_%H-%M-%S')
                print("Exporting dataframe to ", exportFileName)
            case '-f':
                state = 'Frequency'
                print(state, end=": ")
            case '--help':
                # help()
                return 0
            case '-l':
                state = 'Loaded model'
                print(state, end=": ")
            case '-o':
                global optimise
                optimise = True
                print('Hyperparameter optimisation enabled')
            case '-p':
                global plot
                plot = True
            case '-s':
                global saveModel
                saveModel = True
                modelFileName = "Model_"+datetime.today().strftime('%Y-%m-%d_%H-%M-%S')+".json"
                print('Saving model to ', modelFileName)
            case '-t':
                state = 'Time'
                print(state, end=": ")
            case '-threads':
                state = 'Threads'
                print(state, end=": ")
            case '-v':
                global crossValidate 
                crossValidate = True
                print('Cross validation enabled')
            case _:
                match state:
                    case 'Time':
                        global predictPeriod 
                        predictPeriod = int(a)
                    case 'Threads':
                        global threads
                        threads = int(a)
                    case 'Loaded model':
                        global modelName 
                        modelName = a
                    case 'Frequency':
                        global frequency 
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

    # global frequency
    match frequency:
        case 'D':
            # global date_features
            date_features.extend(['day', 'dayofweek', 'week'])
        case 'W' | 'WE':
            # global date_features
            date_features.extend(['week'])
            
            # global step_size
            step_size=4
        case 'M':
            # global step_size
            step_size=1
        case _:
            pass

    tuning_results_lgbm = None
    tuning_results_lgbm = lgbm(df)
    
###############################################################
    tuning_results_xgb = None
    tuning_results_xgb = xgb(df)

    print('Results LGBM:\n', tuning_results_lgbm.head(10))
    print('Results XGB:\n', tuning_results_xgb.head(10))

    return 0

if __name__ == '__main__':
    main(sys.argv)