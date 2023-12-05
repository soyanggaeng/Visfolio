import json
import os
import datetime
import pandas as pd
import yfinance as yf
import FinanceDataReader as fdr
from pandas_datareader import data as pdr
from tqdm import tqdm
import matplotlib.pyplot as plt
import numpy as np   
import warnings
import ssl
import datetime
from scipy.optimize import Bounds
from scipy.optimize import LinearConstraint
from scipy.optimize import minimize
from google.cloud import storage

def download_blob(bucket_name, source_blob_name, destination_dir):
    """Downloads a blob from the bucket to a local directory."""
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(source_blob_name)

    local_file_path = os.path.join(destination_dir, os.path.basename(source_blob_name))

    if not os.path.exists(destination_dir):
        os.makedirs(destination_dir)

    try:
        blob.download_to_filename(local_file_path)
        print(f"Downloaded {source_blob_name} to {local_file_path}")
        return local_file_path
    except Exception as e:
        print(f"Failed to download {source_blob_name}: {e}")
        return None


with open('korea_stock_names.json', 'r') as file:
    korea_stock_names = json.load(file)


with open('us_stock_names.json', 'r',) as file:
    us_stock_names = json.load(file)


with open('korea_paths.json', 'r') as file:
    korea_paths = json.load(file)
    
with open('us_paths.json', 'r',newline='') as file:
    us_paths = json.load(file)

def find_market_for_item(item, us_stock_names, korea_stock_names):
    for market, names in us_stock_names.items():
        for name in names:
            if item == name:
                return "US Stock Market", market
    for market, names in korea_stock_names.items():
        for name in names:
            if item == name:
                return "Korea Stock Market", market
    return None, None


def read_stock_prices(item, market, gcs_path, start, end):
    gcs_file_path = os.path.join(gcs_path, f"{item}.csv")
    local_file_path = download_blob('data_bucket_visfolio', gcs_file_path, 'temp_data')

    if not local_file_path:
        return None

    try:
        price = pd.read_csv(local_file_path)
        price.set_index('Date', inplace=True)
        price = price[start:end]
        price.drop(price[price.Close.isna() | price.Close.isnull() | (price.Close < 1e-8)].index, inplace=True)
        os.remove(local_file_path)  # Remove the temporary file
        return price
    except Exception as e:
        print(f"Error reading file '{local_file_path}': {e}")
        return None

def calc_returns(srs, offset=1):
    returns = srs / srs.shift(offset) - 1.0
    return returns
    
def port_returns(names, weights, start, end=None):
    port = pd.DataFrame()
    for i in range(len(names)):
        item = names[i]
        weight = weights[i] / 100.0  # Convert percentage to decimal

        # Find the market and GCS path for each item
        market, market_key = find_market_for_item(item, us_stock_names, korea_stock_names)
        if market == "US Stock Market":
            gcs_path = us_paths[market_key]
        elif market == "Korea Stock Market":
            gcs_path = korea_paths[market_key]
        else:
            print(f"Market not found for {item}")
            continue

        # Read stock prices from GCS
        data = read_stock_prices(item, market, gcs_path, start, end)
        if data is not None:
            port[f"daily_returns_{item}"] = calc_returns(data['Close']) * weight
            port[f"next_day_returns_{item}"] = port[f"daily_returns_{item}"].shift(-1)

    port["daily_returns_port"] = port.filter(like="daily_returns").sum(axis=1)
    port["next_day_returns_port"] = port["daily_returns_port"].shift(-1)

    return port


#Long-only strategy
# Rescale volatility for comparison
def rescale_to_target_volatility(srs,vol=0.15):
    return srs *  vol / srs.std() / np.sqrt(252)


# cumulative return data 받아오는 곳!

def convert_to_js_format(series, initial_amount, plot_with_equal_vol=None):
    if plot_with_equal_vol is not None:
        series = rescale_to_target_volatility(series.copy(), vol=plot_with_equal_vol)
    else:
        series = series.copy()

    cumulative_returns = ((series.shift(1) + 1).cumprod()) * float(initial_amount)
    cumulative_returns.iloc[0] = float(initial_amount)

    js_format_data = [{"date": str(date), "return": ret} for date, ret in cumulative_returns.iteritems()]
    return js_format_data



def annual_returns(series, initial_amount, plot_with_equal_vol=None):
    if not isinstance(series.index, pd.DatetimeIndex):
        series.index = pd.to_datetime(series.index)
    if not isinstance(series.index, pd.DatetimeIndex):
        series.index = pd.to_datetime(series.index)
    if plot_with_equal_vol is not None:
        series = rescale_to_target_volatility(series.copy(), vol=plot_with_equal_vol)
    else:
        series = series.copy()

    # Convert daily returns to cumulative balance
    cumulative_balance = ((series.shift(1) + 1).cumprod()) * float(initial_amount)
    cumulative_balance.iloc[0] = float(initial_amount)

    # Resample to get year-start and year-end values
    annual_start = cumulative_balance.resample('YS').first()
    annual_end = cumulative_balance.resample('Y').last()

    # Calculate annual returns
    annual_returns = (annual_end.values - annual_start.values) / annual_start.values

    # Convert to JavaScript-friendly format
    js_format_data = [{"year": str(year.year), "return": ret} for year, ret in zip(annual_end.index, annual_returns)]
    return js_format_data






def read_first_price(names):
    first_dates ={}
    for i in range(len(names)):
        item = names[i]

        # Find the market and path for each item
        market, market_key = find_market_for_item(item, us_stock_names, korea_stock_names)
        if market == "US Stock Market":
            path = us_paths[market_key]
        elif market == "Korea Stock Market":
            path = korea_paths[market_key]
        else:
            print(f"Market not found for {item}")
            continue
        print(path)
        
        path = os.path.join(path, f"{item}.csv")
        try:
            price = pd.read_csv(path)
            price.set_index('Date', inplace=True)
            price.index = pd.to_datetime(price.index)  # Ensure the index is in datetime format

            null_or_nan_rows = price[
                price.Close.isna() |
                price.Close.isnull() |
                (price.Close < 1e-8)
            ]
            price = price.drop(null_or_nan_rows.index)
            first_date = price.index[0].strftime('%Y-%m-%d')
            first_dates[item] = first_date
            # Return the first date in the index
        except Exception as e:
            print(f"Error reading file '{path}': {e}")
            return None # Return None or an appropriate default value if there is an error

    return first_dates

def read_close_prices(names, start, end):
    port = pd.DataFrame()
    for i in range(len(names)):
        item = names[i]

        # Find the market and GCS path for each item
        market, market_key = find_market_for_item(item, us_stock_names, korea_stock_names)
        if market == "US Stock Market":
            gcs_path = us_paths[market_key]
        elif market == "Korea Stock Market":
            gcs_path = korea_paths[market_key]
        else:
            print(f"Market not found for {item}")
            continue
        
        # Read stock prices from GCS
        data = read_stock_prices(item, market, gcs_path, start, end)
        if data is not None:
            port[f"{item}"] = data['Close']

    return port


def ret(r,w):
    return r.dot(w)
# Risk level - or volatility

def vol(w,covar):
    return np.sqrt(np.dot(w,np.dot(w,covar)))

def sharpe (ret,vol):
    return ret/vol

