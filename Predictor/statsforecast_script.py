import os
import sys
import numpy as np
import pandas as pd
from datetime import datetime

# Plot
import matplotlib.pyplot as plt
import plotly.graph_objects as go

# StatsForecast
from statsforecast import StatsForecast
from statsforecast.utils import ConformalIntervals
from statsforecast.models import (
    HoltWinters,
    SeasonalNaive,
    AutoTheta,
    AutoCES,
    DynamicOptimizedTheta as DOT,
)
from datasetsforecast.losses import rmse, mae, smape

# Our
from utils import exportToFile

def main(argv):
    fileName = argv[1]
    
    exportFileName = "Export_"+datetime.today().strftime('%Y-%m-%d_%H-%M-%S')
    
    predictPeriod = 365
    # TODO: properly implement weeks and months
    frequency = 'D'

    export = False
    plot = False
    crossValidate = False

    # this makes it so that the outputs of the predict methods have the id as a column 
    # instead of as the index
    os.environ['NIXTLA_ID_AS_COL'] = '1'
    
    state = None
    for a in argv[1:]:
        match a:
            case '-e':
                export = True
                crossValidate = True
                exportFileName = "Export_"+datetime.today().strftime('%Y-%m-%d_%H-%M-%S')
                print("Exporting dataframe to ", exportFileName)
            case '-f':
                state = 'Frequency'
                print(state, end=": ")
            case '--help':
                # help()
                return 0
            case '-p':
                plot = True
            case '-t':
                state = 'Time'
                print(state, end=": ")
            case '-v':
                crossValidate = True
                print('Cross validation enabled')
            case _:
                match state:
                    case 'Time':
                        predictPeriod = int(a)
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
    
    df['ds'] = pd.to_datetime(df['ds'], format="%Y-%m-%d")

    models = [
        AutoTheta(season_length=365),
        AutoCES(season_length=365, alias='AutoCES'),
        HoltWinters(season_length=365),
        SeasonalNaive(season_length=365),
        DOT(season_length=365),
    ]
    modelNames = ['AutoTheta', 'AutoCES', 'HoltWinters', 'SeasonalNaive', 'DynamicOptimizedTheta']

    # Standard stats forecast
    sf = StatsForecast(
        df = df,
        models=models,
        freq=frequency,#'ME',
        # fallback_model = SeasonalNaive(season_length=365),
        n_jobs=-1,
    )

    rmses = []
    maes = []
    smapes = []

    if crossValidate == True:
        cross_vali_df = sf.cross_validation(
            df=df,
            h=30,
            step_size=30,
            n_windows=12
        )

        print(cross_vali_df)

        for name in modelNames:
            rmses.append(rmse(cross_vali_df['y'], cross_vali_df[name]))
            maes.append(mae(cross_vali_df['y'], cross_vali_df[name]))
            smapes.append(smape(cross_vali_df['y'], cross_vali_df[name]))

            print("RMSE using cross-validation (" + name + "): ", rmses[-1])
            print("MAE: ", maes[-1])
            print("SMAPE: ", smapes[-1])
    
    sf.fit(df)
    # sf.fit(df, prediction_intervals=ConformalIntervals(n_windows=12, h=30))

    forecast_df = sf.forecast(df=df, h=predictPeriod, level=[90])

    if plot == True:
        plot1 = sf.plot(df, forecast_df, engine='plotly')
        plot1.show()

    if export == True:
        tuning_results = pd.DataFrame(modelNames)
        tuning_results['rmse'] = rmses
        tuning_results['mae'] = maes
        tuning_results['smape'] = smapes
        tuning_results = tuning_results.sort_values(by=['rmse'])

        tuning_results.to_csv(exportFileName + "_cv_stats.csv", index=False)

        for name in modelNames:
            exportToFile(cross_vali_df, df, name, exportFileName)
    
    return 0

if __name__ == '__main__':
    main(sys.argv)