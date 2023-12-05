from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from news_crawling_v5 import scrape_news, preprocess_and_generate_wordcloud
import os
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/scrape', methods=['GET'])
def scrape_endpoint():
    company_name = request.args.get('company_name')
    country = request.args.get('country')

    # companies.json 파일 로드
    companies_json_path = 'crawling/companies.json'
    with open(companies_json_path, 'r', encoding='utf-8') as file:
        companies = json.load(file)
    
    # 해당 회사 정보 찾기
    company = next((c for c in companies if c['name'] == company_name and c['country'] == country), None)

    if not company:
        return jsonify({'error': 'Company not found'}), 404

    # 뉴스 스크래핑 실행
    news_data = scrape_news(company_name, country, company)
    
    # 데이터를 CSV와 워드클라우드로 저장
    preprocess_and_generate_wordcloud(news_data, company_name, 'korean' if country == "korea" else 'english')

    # JSON 형태로 결과 반환
    return jsonify(news_data)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))  # Use the PORT environment variable if it exists, otherwise default to 8080
    app.run(host='0.0.0.0', port=port, debug=True)

