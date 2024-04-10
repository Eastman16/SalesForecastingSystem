import os
import sys
import numpy as np
import pandas as pd
import itertools

# Plot
import matplotlib.pyplot as plt
import plotly.graph_objects as go

# MLForecast
from mlforecast import MLForecast
from mlforecast.target_transforms import Differences
from mlforecast.utils import PredictionIntervals
from mlforecast.lag_transforms import ExpandingMean, RollingMean

# StatsForecast
from statsforecast import StatsForecast

from datasetsforecast.losses import rmse, mae, smape

# Models
from lightgbm import LGBMRegressor
from xgboost import XGBRegressor
from sklearn.linear_model import LinearRegression

def main(argv):
    fileName = argv[1]

    # this makes it so that the outputs of the predict methods have the id as a column 
    # instead of as the index
    os.environ['NIXTLA_ID_AS_COL'] = '1'
    
    try:
        df = pd.read_csv(fileName)
    except:
        print("ERROR: Can't open "+fileName+"!")
        return 1
    
    df['ds'] = pd.to_datetime(df['ds'])

    # 1706 RMSE @ 128;1024;511;dart;0.05;any;
    # probably best would be 64;2048;128;gbdt;0.05
    lgb_params = {
        'num_leaves': [64, 128],
        #'n_estimators': [1024, 2048],
        #'max_bin': [128, 255, 511],
        'boosting': ['gbdt'], #'dart'], more accurate, but not good for Biuro 
        #'learning_rate': [0.025, 0.05],
        # 'subsample_freq': [0, 1, 2],
    }

    all_params = [dict(zip(lgb_params.keys(), v)) for v in itertools.product(*lgb_params.values())]
    rmses = []
    maes = []
    smapes = []

    # LGBMRegressor
    for params in all_params:
        # Instantiate the MLForecast object
        mlf = MLForecast(
            models=[LGBMRegressor(**params, verbosity=0)],# XGBRegressor(**params, verbosity=0)],#, LinearRegression()],  # List of models for forecasting: LightGBM, XGBoost and Linear Regression
            freq='D',  # Frequency of the data - 'D' for daily frequency
            lags=[365],  # Specific lags to use as regressors: 1 to 6 days
            date_features=['year', 'month', 'day', 'dayofweek', 'quarter', 'week'], # Date features to use as regressors
            num_threads=8,
        )

        cv_mlf_df = mlf.cross_validation(
            df=df,
            h=30,
            n_windows=12,
            step_size=30,
            level=[90],
        )

        mlf.fit(df)

        rmses.append(rmse(cv_mlf_df['y'], cv_mlf_df['LGBMRegressor']))
        maes.append(mae(cv_mlf_df['y'], cv_mlf_df['LGBMRegressor']))
        smapes.append(smape(cv_mlf_df['y'], cv_mlf_df['LGBMRegressor']))

    tuning_results_lgbm = pd.DataFrame(all_params)
    tuning_results_lgbm['rmse'] = rmses
    tuning_results_lgbm['mae'] = maes
    tuning_results_lgbm['smape'] = smapes
    tuning_results_lgbm = tuning_results_lgbm.sort_values(by=['rmse'])

    # Show best params
    best_params_lgbm = all_params[np.argmin(rmses)]
    mlf = MLForecast(
            models=[LGBMRegressor(**best_params_lgbm)], #, XGBRegressor(**params), LinearRegression()],  # List of models for forecasting: LightGBM, XGBoost and Linear Regression
            freq='D',  # Frequency of the data - 'D' for daily frequency
            lags=[365],  # Specific lags to use as regressors: 1 to 6 days
            date_features=['year', 'month', 'day', 'dayofweek', 'quarter', 'week'], # Date features to use as regressors
            num_threads=8,
    )
    mlf.fit(df, prediction_intervals=PredictionIntervals(n_windows=2, h=180))

    fcst_mlf_df = mlf.predict(180, level=[90])

    plot2 = StatsForecast.plot(df, fcst_mlf_df, engine='plotly')
    plot2.show()
    
###############################################################
    
    xgb_params = {
        'booster': ['gbtree', 'dart'],
        'subsample': [0.5, 1.0],
        'max_depth': [6, 12],
        'max_bin': [128, 256, 512],
        'eta': [0.15, 0.3, 0.5, 0.75],
        'gamma': [0.0, 0.1, 0.25],
    }
    '''
    xgb_params = {
        'booster': ['dart'],
        'subsample': [0.5],
        'max_depth': [12],
        'max_bin': [128],
        'eta': [0.3],
        'gamma': [0.1],
    }
    '''
    all_params = [dict(zip(xgb_params.keys(), v)) for v in itertools.product(*xgb_params.values())]
    rmses = []
    maes = []
    smapes = []

    # XGBRegressor
    for params in all_params:
        # Instantiate the MLForecast object
        mlf = MLForecast(
            models=[XGBRegressor(**params, verbosity=0)],   #, LinearRegression()],  # List of models for forecasting: LightGBM, XGBoost and Linear Regression
            freq='D',  # Frequency of the data - 'D' for daily frequency
            lags=[365],  # Specific lags to use as regressors: 1 to 6 days
            date_features=['year', 'month', 'day', 'dayofweek', 'quarter', 'week'], # Date features to use as regressors
            num_threads=8,
        )

        cv_mlf_df = mlf.cross_validation(
            df=df,
            h=30,
            n_windows=12,
            # step_size=180,
            level=[90],
            prediction_intervals=PredictionIntervals(n_windows=12, h=30)
        )

        rmses.append(rmse(cv_mlf_df['y'], cv_mlf_df['XGBRegressor']))
        maes.append(mae(cv_mlf_df['y'], cv_mlf_df['XGBRegressor']))
        smapes.append(smape(cv_mlf_df['y'], cv_mlf_df['XGBRegressor']))

    tuning_results_xgb = pd.DataFrame(all_params)
    tuning_results_xgb['rmse'] = rmses
    tuning_results_xgb['mae'] = maes
    tuning_results_xgb['smape'] = smapes
    tuning_results_xgb = tuning_results_xgb.sort_values(by=['rmse'])

    # Show best params
    best_params_xgb = all_params[np.argmin(rmses)]
    mlf = MLForecast(
            models=[XGBRegressor(**best_params_xgb)], # LinearRegression()],  # List of models for forecasting: LightGBM, XGBoost and Linear Regression
            freq='D',  # Frequency of the data - 'D' for daily frequency
            lags=[365],  # Specific lags to use as regressors: 1 to 6 days
            date_features=['year', 'month', 'day', 'dayofweek', 'quarter', 'week'], # Date features to use as regressors
            num_threads=8,
    )
    mlf.fit(df)

    fcst_mlf_df = mlf.predict(365, level=[90])

    plot2 = StatsForecast.plot(df, fcst_mlf_df, engine='plotly')
    plot2.show()

    print('Results LGBM:\n', tuning_results_lgbm.head(10))
    print('Results XGB:\n', tuning_results_xgb.head(10))

    return 0

if __name__ == '__main__':
    main(sys.argv)