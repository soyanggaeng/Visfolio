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
import backtest_processing as backtest
from scipy.optimize import Bounds
from scipy.optimize import minimize
from scipy.optimize import LinearConstraint




with open('korea_stock_names.json', 'r') as file:
    korea_stock_names = json.load(file)


with open('us_stock_names.json', 'r',) as file:
    us_stock_names = json.load(file)


with open('korea_paths.json', 'r') as file:
    korea_paths = json.load(file)
    
with open('us_paths.json', 'r',newline='') as file:
    us_paths = json.load(file)



def calc_downside_deviation(srs):
    """ Parameters:
            srs: pandas time-series
        Return:
            Downside Deviation (defined above) """
    negative_returns = srs.apply(lambda x: x if x < 0 else np.nan).dropna() * np.sqrt(252)
    return negative_returns.std()

def calc_max_drawdown(srs):
    """ Parameters:
            srs: pandas time-series
        Return:
            MDD (defined above) """
    cumulative_max = srs.cummax()
    drawdown = cumulative_max - srs
    return drawdown.max()

def calc_profit_and_loss_ratio(srs):
    """ Parameters:
            srs: pandas time-series
        Return:
            PnL ratio (defined above) """
    return np.mean(srs[srs>0])/np.mean(np.abs(srs[srs<0]))




def calculate_statistics(cum_data,next_day_captured, print_results=True):
    """ Parameters:
            srs: pandas time-series
            print_results: bool to print statistics
        Return:
            Metrics and risk adjusted performance metrics (defined above) """
    
    
    srs = next_day_captured.shift(1)
    mean = srs.mean()
    vol = srs.std()
    
    # Calculate annualised metrics:
    returns_annualised =  mean*252
    vol_annualised = vol*np.sqrt(252)
    downside_devs_annualised = calc_downside_deviation(srs)
    max_drawdown = calc_max_drawdown(srs)
    pnl_ratio = calc_profit_and_loss_ratio(srs)
    perc_positive_return = len(srs[srs>0])/len(srs)
    initial_amount = cum_data[0]['return']
    final_amount = cum_data[-1]['return']
    """
        Exercise: complete the following ratio definitions
    """
    # Calculate risk-adjusted performance metrics:
    
    ### Enter code here:
    sharpe = mean/vol*np.sqrt(252)   
    sortino = mean / downside_devs_annualised * 252



    
   
    # Return performance metrics
    return [{
        "initial_amount" : initial_amount,
        "final_amount" : final_amount,
        "returns_annualised":  returns_annualised,
        "vol_annualised": vol_annualised,
        # "downside_deviation_annualised": downside_devs_annualised,
        "max_drawdown": max_drawdown,
        "sharpe": sharpe,
        "sortino": sortino,
        # "calmar": calmar,
        "pnl_ratio": pnl_ratio,
      }]



def provided_sharpe(names, start_year,end_year,w,annual_covar):

    close = backtest.read_close_prices(names,start_year,end_year)
    pct_chg = close.pct_change()

    df=pct_chg.iloc[1:len(pct_chg.index),:]
    df = df.dropna()

    r = np.mean(df,axis=0)*252
    covar = df.cov() * 252

    bounds = Bounds(0, 1)
    linear_constraint = LinearConstraint(np.ones((pct_chg.shape[1],), dtype=int),1,1)
    weights = np.ones(pct_chg.shape[1])
    x0 = weights/np.sum(weights)
    #max sharpe
    fun2 = lambda w: np.sqrt(np.dot(w,np.dot(w,annual_covar)))/r.dot(w)
    res_sharpe = minimize(fun2,x0,method='trust-constr',constraints = linear_constraint,bounds = bounds)

    #These are the weights of the stocks in the portfolio with the highest Sharpe ratio.
    w_port = w.copy()
    for i in range(len(w_port)):
        w_port[i] = w_port[i]/100
    print(w_port)

    np.set_printoptions(suppress = True, precision=2)

    w_ratio = {}
    for i in range(len(names)):
        w_ratio[names[i]] = w[i]
    w_return = backtest.ret(r,w)
    w_vol = backtest.vol(w,annual_covar)
    w_sharpe = w_return / w_vol

    # print(w_port)
    # print('return: % .2f'% (ret(r,w_port)), 'risk: % .3f'% vol(w_port,annual_covar))
    return {'return': w_return, 'risk': w_vol, 'sharpe':  w_sharpe }



def provided_calculate_statistics(names, start_year, end_year, weights, cum_data, next_day_captured):
    srs = next_day_captured.shift(1)

    close = backtest.read_close_prices(names,start_year,end_year)
    pct_chg = close.pct_change()

    df=pct_chg.iloc[1:len(pct_chg.index),:]
    df = df.dropna()

    r = np.mean(df,axis=0)*252
    covar = df.cov() * 252
      
    provided_port = provided_sharpe(names, start_year,end_year, weights, covar)
    returns_annualised = provided_port['return']
    vol_annualised = provided_port['risk']
    sharpe = provided_port['sharpe']

    downside_devs_annualised = calc_downside_deviation(srs)
    max_drawdown = calc_max_drawdown(srs)*100
    pnl_ratio = calc_profit_and_loss_ratio(srs)
    perc_positive_return = len(srs[srs>0])/len(srs)
    initial_amount = cum_data[0]['return']
    final_amount = cum_data[-1]['return']

    sortino = returns_annualised / downside_devs_annualised /100

   
    # Return performance metrics
    return [{
        "initial_amount" : initial_amount,
        "final_amount" : final_amount,
        "returns_annualised":  returns_annualised,
        "vol_annualised": vol_annualised,
        # "downside_deviation_annualised": downside_devs_annualised,
        "max_drawdown": max_drawdown,
        "sharpe": sharpe,
        "sortino": sortino,
        # "calmar": calmar,
        "pnl_ratio": pnl_ratio,
      }]


def max_sharpe(names, start_year,end_year,w,annual_covar):

    close = backtest.read_close_prices(names,start_year,end_year)
    pct_chg = close.pct_change()

    df=pct_chg.iloc[1:len(pct_chg.index),:]
    df = df.dropna()

    r = np.mean(df,axis=0)*252
    covar = df.cov() * 252

    bounds = Bounds(0, 1)
    linear_constraint = LinearConstraint(np.ones((pct_chg.shape[1],), dtype=int),1,1)
    weights_max = np.ones(pct_chg.shape[1])
    x0 = weights_max/np.sum(weights_max)
    #max sharpe
    fun2 = lambda w: np.sqrt(np.dot(w,np.dot(w,annual_covar)))/r.dot(w)
    res_sharpe = minimize(fun2,x0,method='trust-constr',constraints = linear_constraint,bounds = bounds)

    #These are the weights of the stocks in the portfolio with the highest Sharpe ratio.
    w_max = res_sharpe.x

    np.set_printoptions(suppress = True, precision=2)

    w_max_ratio = {}
    for i in range(len(names)):
        w_max_ratio[names[i]] = w_max[i]
    w_max_return = backtest.ret(r,w_max)
    w_max_vol = backtest.vol(w_max,annual_covar)
    w_max_sharpe = w_max_return / w_max_vol


    # print(w_sharpe)
    # print('return: % .2f'% (ret(r,w_sharpe)), 'risk: % .3f'% vol(w_sharpe,annual_covar))
    return {'return': w_max_return, 'risk': w_max_vol, 'sharpe':  w_max_sharpe }




def max_calculate_statistics(names, start_year, end_year, weights, cum_data, next_day_captured):
    srs = next_day_captured.shift(1)

    close = backtest.read_close_prices(names,start_year,end_year)
    pct_chg = close.pct_change()

    df=pct_chg.iloc[1:len(pct_chg.index),:]
    df = df.dropna()

    r = np.mean(df,axis=0)*252
    covar = df.cov() * 252

      
    provided_port = max_sharpe(names, start_year,end_year, weights, covar)
    returns_annualised = provided_port['return']
    vol_annualised = provided_port['risk']
    sharpe = provided_port['sharpe']

    downside_devs_annualised = calc_downside_deviation(srs)
    max_drawdown = calc_max_drawdown(srs)*100
    pnl_ratio = calc_profit_and_loss_ratio(srs)
    perc_positive_return = len(srs[srs>0])/len(srs)
    initial_amount = cum_data[0]['return']
    final_amount = cum_data[-1]['return']
    
    sortino = returns_annualised / downside_devs_annualised / 100

   
    # Return performance metrics
    return [{
        "initial_amount" : initial_amount,
        "final_amount" : final_amount,
        "returns_annualised":  returns_annualised,
        "vol_annualised": vol_annualised,
        # "downside_deviation_annualised": downside_devs_annualised,
        "max_drawdown": max_drawdown,
        "sharpe": sharpe,
        "sortino": sortino,
        # "calmar": calmar,
        "pnl_ratio": pnl_ratio,
      }]


