import os
import sys
import pandas as pd
import matplotlib.pyplot as plt
import plotly.graph_objects as go
from statsforecast import StatsForecast
from statsforecast.models import (
    HoltWinters,
    CrostonClassic as Croston,
    HistoricAverage,
    SeasonalNaive,
    AutoARIMA,
    AutoETS,
    DynamicOptimizedTheta as DOT,
)
from datasetsforecast.losses import rmse

from mlforecast import MLForecast
from mlforecast.target_transforms import Differences
from mlforecast.utils import PredictionIntervals
from window_ops.expanding import expanding_mean
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
    
    df.head()
    df['ds'] = pd.to_datetime(df['ds'])

    models = [
        AutoETS(season_length=365),
        HoltWinters(),
        Croston(),
        SeasonalNaive(season_length=365),
        HistoricAverage(),
        DOT(season_length=365)
    ]

    # Standard stats forecast
    sf = StatsForecast(
        df = df,
        models=models, #[DOT(season_length = 12)],
        freq='D',#'ME',
        fallback_model = SeasonalNaive(season_length=365),
        n_jobs=-1,
    )

    # Instantiate the MLForecast object
    mlf = MLForecast(
        models=[LGBMRegressor(), XGBRegressor(), LinearRegression()],  # List of models for forecasting: LightGBM, XGBoost and Linear Regression
        freq='D',  # Frequency of the data - 'D' for daily frequency
        lags=list(range(1, 7)),  # Specific lags to use as regressors: 1 to 6 days
        lag_transforms = {
            1:  [expanding_mean],  # Apply expanding mean transformation to the lag of 1 day
        },
        date_features=['year', 'month', 'day', 'dayofweek', 'quarter', 'week'],  # Date features to use as regressors
    )
    
    cross_vali_df = sf.cross_validation(
        df=df,
        h=30,
        step_size=30,
        n_windows=12
    )

    cv_mlf_df = mlf.cross_validation(
        df=df,
        h=30,
        #window_size=horizon, 
        n_windows=12, 
        step_size=30, 
        level=[90],
    )

    cross_vali_df.head()
    sf.fit(df)

    # ML fit
    mlf.fit(df, prediction_intervals=PredictionIntervals(n_windows=12, h=28)) # czy predict interv poprawne?

    fcst_mlf_df = mlf.predict(28, level=[90])

    forecast_df = sf.forecast(df=df, h=365, level=[90])
    
    forecast_df.tail()

    cross_vali_df.rename(columns = {'y' : 'actual'}, inplace = True) # rename actual values 

    cross_vali_df = cross_vali_df.merge(cv_mlf_df.drop(columns=['y']), how='left', on=['unique_id', 'ds', 'cutoff'])

    cutoff = cross_vali_df['cutoff'].unique()
    
    for k in range(len(cutoff)): 
        cv = cross_vali_df[cross_vali_df['cutoff'] == cutoff[k]]
        plot1 = sf.plot(df, cv.loc[:, cv.columns != 'cutoff'], engine='plotly')
        plot1.show()

    # holt, croston, seasonal naive, dot
    # holt best?

    plot1 = sf.plot(df, forecast_df, engine='plotly')
    plot1.show()

    plot2 = mlf.plot(df, fcst_mlf_df, engine='plotly')
    plot2.show()
    
    rmseLoss = rmse(cross_vali_df['actual'], cross_vali_df['HoltWinters'])
    print("RMSE using cross-validation (HoltWinters): ", rmseLoss)
    rmseLoss = rmse(cross_vali_df['actual'], cross_vali_df['CrostonClassic'])
    print("RMSE using cross-validation (Croston): ", rmseLoss)
    rmseLoss = rmse(cross_vali_df['actual'], cross_vali_df['SeasonalNaive'])
    print("RMSE using cross-validation (SeasonalNaive): ", rmseLoss)
    rmseLoss = rmse(cross_vali_df['actual'], cross_vali_df['DynamicOptimizedTheta'])
    print("RMSE using cross-validation (DOT): ", rmseLoss)

    '''
    plot1 = sf.plot(df, forecast_df, level=[90], engine='plotly')#engine='matplotlib')

    plot1.show()
    # plt.show()
    '''
    return 0

if __name__ == '__main__':
    main(sys.argv)