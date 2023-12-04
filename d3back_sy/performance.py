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
import sys

sys.path.append("/Users/sunyoungpark/시각화_practice/d3backend/backtest_processing")
import backtest_processing as backtest
sys.path.append("/Users/sunyoungpark/시각화_practice/d3backend/port_statistics")
import port_statistics as stat


#input 받아오는걸로 바꾸기
start_year = "2020" #01-01
end_year = "2021" # 12-31
initial_amount = "10000"

allocation1 = {"allocation1_1":50, "allocation2_1": 20, "allocation3_1":30}
market1 = {"market1_1":"US Stock Market", "market2_1":"Korea Stock Market","market3_1":"Korea Stock Market",}
item1 = {"item1_1":"Apple Inc_AAPL","item2_1":"삼성전자","item3_1":"ASA Gold And Precious Metals Limited_ASA"}


names = list(item1.values())
weights = [allocation1[key] for key in sorted(allocation1.keys())]
portfolio_returns = backtest.port_returns(names, weights, start_year, end_year)

captured_returns_longonly = portfolio_returns['next_day_returns_port']
js_data = backtest.convert_to_js_format(captured_returns_longonly, initial_amount)
annaul_ret = backtest.annual_returns(captured_returns_longonly, initial_amount)

# print(js_data)




close = backtest.read_close_prices(['ASA Gold And Precious Metals Limited_ASA'])
pct_chg = backtest.percent_chg(close)
print(pct_chg)