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

    # plotek = StatsForecast.plot(df, engine='plotly')
    # plotek.show()

    models = [
        #AutoETS(season_length=365),
        HoltWinters(),
        Croston(),
        SeasonalNaive(season_length=365),
        # HistoricAverage(),
        DOT(season_length=365)
    ]

    sf = StatsForecast(
        df = df,
        models=models, #[DOT(season_length = 12)],
        freq='D',#'ME',
        fallback_model = SeasonalNaive(season_length=365),
        n_jobs=-1,
    )
    
    cross_vali_df = sf.cross_validation(
        df=df,
        h=30,
        step_size=30,
        n_windows=12
    )

    cross_vali_df.head()
    sf.fit(df)

    forecast_df = sf.forecast(df=df, h=365, level=[90])
    
    forecast_df.tail()

    cross_vali_df.rename(columns = {'y' : 'actual'}, inplace = True) # rename actual values 

    cutoff = cross_vali_df['cutoff'].unique()
    
    for k in range(len(cutoff)): 
        cv = cross_vali_df[cross_vali_df['cutoff'] == cutoff[k]]
        plot1 = sf.plot(df, cv.loc[:, cv.columns != 'cutoff'], engine='plotly')
        plot1.show()
    
    # holt, croston, seasonal naive, dot
    # holt best?

    plot1 = sf.plot(df, forecast_df, engine='plotly')
    plot1.show()
    
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