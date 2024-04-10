import os
import sys
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import plotly.graph_objects as go
import itertools

# Plot
import matplotlib.pyplot as plt
import plotly.graph_objects as go

# NeuralForecast
from neuralforecast import NeuralForecast
from neuralforecast.models import LSTM, NHITS, RNN

# StatsForecast
from statsforecast import StatsForecast

from datasetsforecast.losses import rmse, mae, smape

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

    # Try different hyperparmeters to improve accuracy.
    models = [LSTM(h=365,                    # Forecast horizon
                max_steps=100,                # Number of steps to train
                scaler_type='standard',       # Type of scaler to normalize data
                encoder_hidden_size=64,       # Defines the size of the hidden state of the LSTM
                decoder_hidden_size=64,),     # Defines the number of hidden units of each layer of the MLP decoder
                
            NHITS(h=365,                   # Forecast horizon
                    input_size=2 * 365,      # Length of input sequence
                    max_steps=500,               # Number of steps to train
                    n_freq_downsample=[2, 1, 1]) # Downsampling factors for each stack output
    ]
    nf = NeuralForecast(models=models, freq='D')
    nf.fit(df=df)

    Y_hat_df = nf.predict()
    Y_hat_df = Y_hat_df.reset_index()

    fig, ax = plt.subplots(1, 1, figsize = (20, 7))
    plot_df = pd.concat([df, Y_hat_df]).set_index('ds') # Concatenate the train and forecast dataframes
    plot_df[['y', 'LSTM']].plot(ax=ax, linewidth=2)
    plot_df[['NHITS']].plot(ax=ax, linewidth=2)
    plt.show()

    return 0

if __name__ == '__main__':
    main(sys.argv)