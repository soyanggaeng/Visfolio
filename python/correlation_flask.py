from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd

# Flask 애플리케이션의 인스턴스를 생성함. __name__은 현재 실행 중인 파일을 나타냄.
app = Flask(__name__)
CORS(app) # 다른 도메인에서 실행되는 웹 애플리케이션이 이 서버로 요청을 보낼 수 있도록 허용


@app.route('/get_csv_data', methods=['GET'])
def get_csv_data():
    # Get market and item from query params
    market = request.args.get('market')
    item = request.args.get('item')

    if not market or not item:
        return jsonify({'error': 'Missing market or item parameter'}), 400

    file_path = f'data/{market}/{item}.csv'
    try:
        df = pd.read_csv(file_path)
        # Convert the DataFrame to JSON
        return df.to_json(orient='split')
    except FileNotFoundError:
        return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 참고
# @app.route('/data/search_items')
# def search_items():
#     # 클라이언트에서 전송된 쿼리 매개변수를 추출함. query는 검색어, market은 시장을 나타냄.
#     query = request.args.get('query', '').lower()
#     market = request.args.get('market', '')
#     if len(query) < 2:
#         return jsonify([])  # No need to search for less than 3 characters

#     # Select the CSV file based on the market
#     file_name = 'file_names_us.csv' if market == 'US Stock Market' else 'file_names_kor.csv'
#     df = pd.read_csv(file_name, encoding='utf-8')

#     # Get the values in the second column (index 1) into a list
#     all_items = df.iloc[:, 0].tolist() # 데이터프레임의 첫 번째 열을 리스트로 변환
#     matching_items = [item for item in all_items if query in item.lower()] # 리스트에서 검색어가 포함된 항목만 필터링함
    
#     # 필터링된 항목을 JSON 형식으로 클라이언트에 반환함
#     return jsonify(matching_items)


@app.after_request
def after_request(response):
    header = response.headers
    header['Access-Control-Allow-Origin'] = '*'
    header['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    header['Access-Control-Allow-Methods'] = 'OPTIONS, HEAD, GET, POST, DELETE, PUT'
    return response

if __name__ == '__main__':
    #app.run(host="35.209.80.221", port=8080)
    # app.run(port=8080, debug=True)
    app.run(port=8080)
