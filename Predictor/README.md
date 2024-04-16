# Predictor

---

## How to install:

```
pip install -r /path/to/requirements.txt
```

requirements.txt 
Installs:
- [Prophet](https://github.com/facebook/prophet)
- [plotly](https://github.com/plotly/plotly.py)

requirements_forecast.txt
Installs:
- [statsforecast](https://github.com/Nixtla/statsforecast)
- [datasetsforecast](https://github.com/Nixtla/datasetsforecast)
- [mlforecast](https://github.com/Nixtla/mlforecast)
- [lightgbm](https://github.com/microsoft/LightGBM)
- [xgboost](https://github.com/dmlc/xgboost)
- [sklearn](https://github.com/scikit-learn/scikit-learn)
- [neuralforecast](https://github.com/Nixtla/neuralforecast)
- [plotly](https://github.com/plotly/plotly.py)

## How to use:
### prophet_script.py
Script takes in one or more arguments:
- path to your desired csv format file
Extra arguments
- -c name - include national holidays of 'name' country (eg. US)
- -e - exports data to a file
- -f 'frequency' - frequency of data collection (eg. -f W-SUN sets weekly frequency with Sunday as last day) - default daily')
- -i industry_name - name of the industry
- -l fileName - load .json pre-fitted model with name 'fileName'
- -p - plot results
- -r - define data as for stationary store
- -s - saves .json model to a file
- -t length - desired prediction 'length' - default 365 (days - default in -f)
- -v - enable cross validation

Example:
```
python3 .\prophet_script.py your_own_csv_file.csv
```

### parser-basic.py
Own file parser from EDI format to csv

Script takes in one arguments:
- path to your data in EDI format

Optional second (only one):
- -d - exports data day by day (default)
- -w - exports data weekly
- -m - exports data monthly

Example:
```
python3 .\parser-basic.py your_own_data_file.extension
```

### parser-filter.py
Own file parser from EDI format to csv

Script takes in two or three arguments:
- path to your data in EDI format
- number of the distribution center 

Optional third:
- -stats - exports csv file in Forecast libs friendly format 

Optional fourth (only one):
- -d - exports data day by day (default)
- -w - exports data weekly
- -m - exports data monthly
Example:
```
python3 .\parser-filter.py your_own_data_file.extension 9
```