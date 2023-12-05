from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import pandas as pd
import logging
import json
import sys
sys.path.append("/home/kathy1028/Visfolio/python/backtest_processing")
import backtest_processing as backtest
sys.path.append("/home/kathy1028/Visfolio/python/port_statistics")
import port_statistics as stats
import numpy as np   
from scipy.optimize import Bounds
from scipy.optimize import minimize
from scipy.optimize import LinearConstraint




app = Flask(__name__)
CORS(app)


@app.route('/data/efficient_frontier')
@cross_origin("*")
def hello_world():  # put application's code here
    asset1_rate01 = request.args.get("asset1_rate01")
    asset1_rate02 = request.args.get("asset1_rate02")
    asset1_rate03 = request.args.get("asset1_rate03")

    if asset1_rate03 == "":
        # return only 2 graphs
        pass
    # print(code)
    # print(date)

    df = pd.read_csv("all_month.csv", encoding="utf-8")
    df = df.fillna("null")
    return df.to_dict('records')

# @app.route("/data/market_list")
# def market_list():
#     market = request.args.get("market")
#     print("market ", market)

#     return [{"code": "001", "text" : "Hello"}, {"code" : "002", "text" : "abc"}]


@app.route('/data/market_list')
def market_list():
    # Example data, this could come from a database or any other source
    markets = [
        {"code": "US Stock Market", "text": "US Stock Market"},
        {"code": "Korea Stock Market", "text": "Korea Stock Market"},
        # more options...
    ]
    return jsonify(markets)


logging.basicConfig(level=logging.DEBUG)

@app.route('/data/search_items')
def search_items():
    query = request.args.get('query', '').lower()
    market = request.args.get('market', '')
    if len(query) < 2:
        return jsonify([])  # No need to search for less than 3 characters

    # Select the CSV file based on the market
    file_name = 'file_names_us.csv' if market == 'US Stock Market' else 'file_names_kor.csv'
    df = pd.read_csv(file_name, encoding='utf-8')

    # Get the values in the second column (index 1) into a list
    all_items = df.iloc[:, 0].tolist()
    matching_items = [item for item in all_items if query in item.lower()]
    
    return jsonify(matching_items)



def generate_portfolios(allocation, market, item, num_portfolios=10):
    portfolios = []

    for i in range(1, num_portfolios + 1):
        portfolio = {}
        for key in allocation:
            if key.endswith(f'_{i}'):  # Check if the allocation key ends with the portfolio number
                alloc_number = key.split('_')[0]  # Extract the allocation number (e.g., 'allocation1')
                market_number = 'market' + alloc_number[-1]  # Corresponding market number (e.g., 'market1')
                item_number = 'item' + alloc_number[-1]  # Corresponding item number (e.g., 'item1')

                portfolio[alloc_number] = allocation[key]
                portfolio[market_number] = market.get(market_number, '')
                portfolio[item_number] = item.get(item_number, '')

        # Only add the portfolio to the list if it is not empty
        if portfolio:
            portfolios.append(portfolio)

    return portfolios



@app.route('/data/analyze', methods=['POST'])
@cross_origin()
def analyze_portfolio():

    form_data = request.form

    # Extract and format data
    start_year = form_data.get('startYear', '')
    end_year = form_data.get('endYear', '')
    initial_amount = form_data.get('initialAmount', '')

    # Extract allocations, markets, and items
    allocation = {}
    market = {}
    item = {}


    for key, value in form_data.items():
        if key.startswith('allocation') and value:
            allocation[key] = int(value)
        elif key.startswith('market') and value:
            market[key] = value
        elif key.startswith('item') and value:
            item[key] = value

    # Construct response data
    response_data = {
        'start_year': start_year,
        'end_year': end_year,
        'initial_amount': initial_amount,
        'allocation': allocation,
        'market': market,
        'item': item
    }
    start_year = response_data['start_year']+"-01-01"
    end_year = response_data['end_year']+"-12-31"
    initial_amount = response_data['initial_amount']
    allocation1 = response_data['allocation'] #나중에 바꿔야함
    market1 = response_data ['market']
    item1 = response_data['item']


    num_portfolios = 10
    portfolios = generate_portfolios(allocation, market, item, num_portfolios)

    final_response = {}
    portfolio_index = 1  # Start with portfolio 1

    for portfolio in portfolios:
        # Extract names and weights for the current portfolio
        names = []
        weights = []

        for key, value in portfolio.items():
            if key.startswith('item'):
                names.append(value)
            elif key.startswith('allocation'):
                weights.append(value)

        # Ensure that we have names and weights to process
        if not names or not weights or len(names) != len(weights):
            continue
        
        print(names)
        print(weights)

        # Calculate portfolio returns
        try:
            first_date = backtest.read_first_price(names)
            for k,v in first_date.items():
                if v > start_year:
                    raise ValueError(f"First trading date for {k} is later than start year: {v}")
        # Attempt to calculate portfolio returns
            portfolio_returns = backtest.port_returns(names, weights, start_year, end_year)

            captured_returns_longonly = portfolio_returns['next_day_returns_port']
            js_data = backtest.convert_to_js_format(captured_returns_longonly, initial_amount)

            stats_longonly = stats.calculate_statistics(js_data, captured_returns_longonly)
            annual_ret = backtest.annual_returns(captured_returns_longonly, float(initial_amount))


            key = f'portfolio{portfolio_index}'
            response = {
                key: {
                    'js_data': js_data,
                    'stats_longonly': stats_longonly,
                    'annual_ret' : annual_ret
                }
            }

            final_response.update(response)
            portfolio_index += 1  # Increment the index for the next portfolio

        except Exception as e:
            print(f"Error calculating portfolio returns: {e}")
            first_date = backtest.read_first_price(names)
            final_response['error'] = {'first_date': str(first_date)}
            continue  # Skip further processing for this portfolio

    # Send back the processed data
    return jsonify(final_response)





@app.route('/data/efficient_frontier', methods=['POST'])
@cross_origin()
def efficient_frontier():

    form_data = request.form

    # Extract and format data
    start_year = form_data.get('startYear', '')
    end_year = form_data.get('endYear', '')
    initial_amount = form_data.get('initialAmount', '')

    # Extract allocations, markets, and items
    allocation = {}
    market = {}
    item = {}

    print(market)

    for key, value in form_data.items():
        if key.startswith('allocation') and value:
            allocation[key] = int(value)
        elif key.startswith('market') and value:
            market[key] = value
        elif key.startswith('item') and value:
            item[key] = value

    # Construct response data
    response_data = {
        'start_year': start_year,
        'end_year': end_year,
        'initial_amount': initial_amount,
        'allocation': allocation,
        'market': market,
        'item': item
    }
    start_year = response_data['start_year']+"-01-01"
    end_year = response_data['end_year']+"-12-31"
    initial_amount = response_data['initial_amount']
    allocation1 = response_data['allocation'] #나중에 바꿔야함
    market1 = response_data ['market']
    item1 = response_data['item']


    num_portfolios = 10
    portfolios = generate_portfolios(allocation, market, item, num_portfolios)

    final_response = {}
    portfolio_index = 1  # Start with portfolio 1
    test = {}
    for portfolio in portfolios:
        # Extract names and weights for the current portfolio
        names = []
        weights = []

        for key, value in portfolio.items():
            if key.startswith('item'):
                names.append(value)
            elif key.startswith('allocation'):
                weights.append(float(value)/100)

        # Ensure that we have names and weights to process
        if not names or not weights or len(names) != len(weights):
            continue
        
        print(names)
        print(weights)

        # Calculate portfolio returns
        try:
            first_date = backtest.read_first_price(names)
            for k,v in first_date.items():
                if v > start_year:
                    raise ValueError(f"First trading date for {k} is later than start year: {v}")
        # Attempt to calculate portfolio returns
            close = backtest.read_close_prices(names,start_year,end_year)
            # print(close)
            # close = close.dropna()  # This will remove any row where any NaN value is present
            pct_chg = close.pct_change()


            df=pct_chg.iloc[1:len(pct_chg.index),:]
            df = df.dropna()

            r = np.mean(df,axis=0)*252
            covar = df.cov()
            annual_covar = covar*252 #연간리스크
            # print(covar)


            bounds = Bounds(0, 1)
            linear_constraint = LinearConstraint(np.ones((pct_chg.shape[1],), dtype=int),1,1)
            weights_min = np.ones(pct_chg.shape[1])
            x0 = weights_min/np.sum(weights_min)
            #Define a function to calculate volatility
            fun1 = lambda w: np.sqrt(np.dot(w,np.dot(w,covar)))
            res = minimize(fun1,x0,method='trust-constr',constraints = linear_constraint,bounds = bounds)

            w_min = res.x

            np.set_printoptions(suppress = True, precision=2)
            w_min_ratio = {}
            for i in range(len(names)):
                w_min_ratio[names[i]] = w_min[i]
            # print(w_min_ratio)
            # print('return: % .2f'% (backtest.ret(r,w_min)*100), 'risk: % .3f'% backtest.vol(w_min,covar))

            #max sharpe
            #Define 1/Sharpe_ratio
            fun2 = lambda w: np.sqrt(np.dot(w,np.dot(w,annual_covar)))/r.dot(w)
            res_sharpe = minimize(fun2,x0,method='trust-constr',constraints = linear_constraint,bounds = bounds)

            #These are the weights of the stocks in the portfolio with the highest Sharpe ratio.
            w_sharpe = res_sharpe.x
            w_sharpe_ratio = {}
            for i in range(len(names)):
                w_sharpe_ratio[names[i]] = w_sharpe[i]
            print(w_sharpe_ratio)
            print('return: % .2f'% (backtest.ret(r,w_sharpe)*100), 'risk: % .3f'% backtest.vol(w_sharpe,annual_covar))
            test["vol"] = backtest.vol(w_sharpe,annual_covar)
            test["ret"] = backtest.ret(r,w_sharpe)
            test["sharpe"] =  backtest.vol(w_sharpe,annual_covar) / backtest.ret(r,w_sharpe)
            print(test)
            
            #provided portfolio
            fun2 = lambda w: np.sqrt(np.dot(w,np.dot(w,annual_covar)))/r.dot(w)
            res_sharpe = minimize(fun2,x0,method='trust-constr',constraints = linear_constraint,bounds = bounds)

            w_port = weights
            print(w_port)
            print('return: % .2f'% (backtest.ret(r,w_port)*100), 'risk: % .3f'% backtest.vol(w_port,annual_covar))

            portfolio_returns = backtest.port_returns(names, weights, start_year, end_year)
            portfolio_returns_max = backtest.port_returns(names, w_sharpe, start_year, end_year)

            captured_returns_longonly = portfolio_returns['next_day_returns_port']
            captured_returns_longonly_max = portfolio_returns_max['next_day_returns_port']

            js_data = backtest.convert_to_js_format(captured_returns_longonly, initial_amount)
            js_data_max = backtest.convert_to_js_format(captured_returns_longonly_max, initial_amount)

            stats_longonly = stats.provided_calculate_statistics(names, start_year, end_year, weights, js_data, captured_returns_longonly)
            stats_longonly_max = stats.max_calculate_statistics(names, start_year, end_year, weights, js_data_max, captured_returns_longonly_max)
            
            annual_ret = backtest.annual_returns(captured_returns_longonly, float(initial_amount))
            annual_ret_max = backtest.annual_returns(captured_returns_longonly_max, float(initial_amount))


            #graph
            w = w_min
            num_ports = 100
            gap = (np.amax(r) - backtest.ret(r,w_min))/num_ports


            all_weights = np.zeros((num_ports, len(df.columns)))
            all_weights[0],all_weights[1]=w_min,w_sharpe
            ret_arr = np.zeros(num_ports)
            ret_arr[0],ret_arr[1]= backtest.ret(r,w_min),backtest.ret(r,w_sharpe)
            vol_arr = np.zeros(num_ports)
            vol_arr[0],vol_arr[1]= backtest.vol(w_min,annual_covar),backtest.vol(w_sharpe,annual_covar)

            for i in range(num_ports):
                port_ret = backtest.ret(r,w) + i*gap
                double_constraint = LinearConstraint([np.ones(pct_chg.shape[1]),r],[1,port_ret],[1,port_ret])
                
                #Create x0: initial guesses for weights.
                x0 = w_min
                #Define a function for portfolio volatility.
                fun = lambda w: np.sqrt(np.dot(w,np.dot(w,annual_covar)))
                a = minimize(fun,x0,method='trust-constr',constraints = double_constraint,bounds = bounds)
                
                all_weights[i,:]=a.x
                ret_arr[i]=port_ret
                vol_arr[i]=backtest.vol(a.x,annual_covar)
                
            sharpe_arr = ret_arr/vol_arr  

            # Find the index of the portfolio with the maximum Sharpe ratio
            max_sharpe_idx = np.argmax(sharpe_arr)
            # Find the index of the portfolio with the minimum risk
            min_risk_idx = np.argmin(vol_arr)
            # Calculate risk and return of the provided portfolio
            provided_portfolio_return = backtest.ret(r, w_port)
            provided_portfolio_risk = backtest.vol(w_port, annual_covar)    
                 

            # Create an empty DataFrame to store the risk and return of each stock
            stock_risk_return_df = pd.DataFrame(index=names, columns=['Risk', 'Return'])

            # Loop through each stock in the portfolio
            for stock in names:
                # Create a weight vector for the current stock (all others are set to 0)
                stock_weights = np.zeros(len(df.columns))
                stock_weights[df.columns.get_loc(stock)] = 1.0
                
                # Calculate the risk and return for the current stock
                stock_return = backtest.ret(r, stock_weights)
                stock_risk = backtest.vol(stock_weights, annual_covar)
                
                # Store the results in the DataFrame
                stock_risk_return_df.loc[stock] = [stock_risk, stock_return]

            plot_data = [
                {"volatility": vol, "return": ret, "sharpe": sharpe} 
                for vol, ret, sharpe in zip(vol_arr, ret_arr, sharpe_arr)
            ]

            plot_max_sharpe = [
                {"volatility": vol_arr[max_sharpe_idx], "return":  ret_arr[max_sharpe_idx], "sharpe":ret_arr[max_sharpe_idx]/vol_arr[max_sharpe_idx]} 
            ]

            plot_provided_sharpe =[
                {"volatility":provided_portfolio_risk , "return":  provided_portfolio_return, "sharpe":provided_portfolio_return/provided_portfolio_risk} 

            ]
            
            print(plot_provided_sharpe)
            print(plot_max_sharpe)

            # final_response = covar
            response = {
                'max_sharpe_ratio': w_sharpe_ratio,
                'js_data': js_data,
                'js_data_max': js_data_max,
                'stats_longonly': stats_longonly,
                'stats_longonly_max': stats_longonly_max,
                'annual_ret' : annual_ret,
                'annual_ret_max' : annual_ret_max,
                'plot_data': plot_data,
                'plot_max_sharpe' : plot_max_sharpe,
                'plot_provided_sharpe' : plot_provided_sharpe,
            }

            final_response.update(response)
       
        except Exception as e:
            print(f"Error calculating portfolio returns: {e}")
            first_date = backtest.read_first_price(names)
            final_response['error'] = {'first_date': str(first_date)}
            continue
            # continue  # Skip further processing for this portfolio
    # Send back the processed data
    # print(final_response)
    return jsonify(final_response)






@app.after_request
def after_request(response):
    header = response.headers
    header['Access-Control-Allow-Origin'] = '*'
    header['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    header['Access-Control-Allow-Methods'] = 'OPTIONS, HEAD, GET, POST, DELETE, PUT'
    return response

if __name__ == '__main__':
    app.run(host='127.0.0.1',port=5001, debug=True)
