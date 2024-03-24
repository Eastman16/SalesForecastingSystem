# Predictor

---

## How to install:

```
pip install -r /path/to/requirements.txt
```

Installs:
- [Prophet](https://github.com/facebook/prophet)
- [plotly](https://github.com/plotly/plotly.py)

## How to use:
### prophet_script.py
Script takes in one or more arguments:
- path to your desired csv format file - **has to be first**!
Extra arguments
- -t length - desired prediction 'length' in days - default 365
- -c name - include national holidays of 'name' country (eg. US)
- -i industry_name - name of the industry

Example:
```
python3 .\prophet_script.py your_own_csv_file.csv
```

### parser-basic.py
Own file parser from EDI format to csv

Script takes in one arguments:
- path to your data in EDI format

Example:
```
python3 .\parser-basic.py your_own_data_file.extension
```

### parser-filter.py
Own file parser from EDI format to csv

Script takes in two arguments:
- path to your data in EDI format
- number of the distribution center

Example:
```
python3 .\parser-basic.py your_own_data_file.extension 9
```