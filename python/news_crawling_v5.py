from bs4 import BeautifulSoup
import requests
import csv
import re
from konlpy.tag import Kkma
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk import pos_tag
from collections import Counter
import json
import os
import time 

# Paths for saving the files
crawling_path = "C:\\Users\\kathy\\OneDrive - SNU\\대학원 2-1학기\\시각화\\팀플\\webpage\\crawling"
wordcloud_path = "C:\\Users\\kathy\\OneDrive - SNU\\대학원 2-1학기\\시각화\\팀플\\webpage\\wordcloud"
companies_json_path = 'C:\\Users\\kathy\\OneDrive - SNU\\대학원 2-1학기\\시각화\\팀플\\webpage\\crawling\\companies.json'
kkma = Kkma()


def scrape_news(company_name, country, company):
    if country == "korea":
        return scrape_naver(company_name)
    elif country == "usa":
        symbol = company.get("symbol", "")
        return scrape_yahoo_finance(symbol, company_name)
    return []


def scrape_naver(company_name):
    news_data = []
    for page in range(1, 11):  # Collect titles from page 1 to 10
        start_param = (page - 1) * 10 + 1
        website = f"https://search.naver.com/search.naver?where=news&sm=tab_jum&query={company_name}+주가&office_category=3&office_type=3&pd=2&sort=1&start={start_param}"
        response = requests.get(website)
        time.sleep(1)  # Wait for 1 second before the next request

        if response.status_code == 200:
            html = response.text
            soup = BeautifulSoup(html, "html.parser")

            titles = soup.select("div > div > div.news_contents > a.news_tit")
            dates = soup.select("div.news_info > div.info_group > span.info")
            links = [title['href'] for title in titles]

            for title, date, link in zip(titles, dates, links):
                title_text = title.get("title")
                date_text = date.get_text()
                news_data.append([company_name, title_text, date_text, link])
    return news_data


def scrape_yahoo_finance(symbol, company_name):
    url = f"https://www.marketwatch.com/investing/stock/{symbol}"
    response = requests.get(url)
    time.sleep(1) 
    news_data = []

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, "html.parser")
        titles = soup.select("div.article__content > h3.article__headline > a.link")
        dates = soup.select("div.article__content > div > span.article__timestamp")
        
        for title, date in zip(titles, dates):
            title_text = title.get_text()
            date_text = date.get_text()
            link = title['href']
            news_data.append([company_name, title_text, date_text, link])
    else:
        print(f"Failed to fetch news for {symbol}")

    return news_data


def save_news_to_csv(news_data, company_name):
    csv_filename = os.path.join(crawling_path, f"{company_name}.csv")
    with open(csv_filename, "w", newline="", encoding="utf-8") as csvfile:
        csv_writer = csv.writer(csvfile)
        csv_writer.writerow(["company_name", "title", "date", "link"])
        for news in news_data:
            csv_writer.writerow(news)


def preprocess_and_generate_wordcloud(news_data, company_name, language):
    text = " ".join([news[1] for news in news_data])
    filtered_words = preprocess_text(text, company_name, language)
    word_count = Counter(filtered_words)
    save_wordcloud_data_to_csv(word_count, company_name)


def preprocess_text(text, company_name, language):
    text = re.sub(rf'\b{company_name}\b', '', text)
    if language == 'korean':
        text = re.sub(r'\b주가\b', '', text)
        return preprocess_korean(text)
    elif language == 'english':
        text = re.sub(r'\bstock\b', '', text)
        return preprocess_english(text)

def preprocess_korean(text):
    tagged_words = kkma.pos(text)
    processed_words = []
    for word, tag in tagged_words:
        if tag in ('NNG', 'NNP', 'MAG'):
            processed_words.append(word)
    return processed_words

def preprocess_english(text):
    text = text.lower()
    tokens = word_tokenize(text)
    tokens = [word for word in tokens if word not in stopwords.words('english')]
    tagged = pos_tag(tokens)
    return [word for word, tag in tagged if tag.startswith(('NN', 'JJ', 'RB'))]


def save_wordcloud_data_to_csv(word_count, company_name):
    wordcloud_csv_filename = os.path.join(wordcloud_path, f"{company_name}_wordcloud.csv")
    with open(wordcloud_csv_filename, "w", newline="", encoding="utf-8") as csvfile:
        csv_writer = csv.writer(csvfile)
        csv_writer.writerow(["word", "frequency"])  # Ensure column headers are as expected by D3
        for word, frequency in word_count.items():
            csv_writer.writerow([word, frequency])  # Write the word and its frequency


def main():
    with open(companies_json_path, 'r', encoding='utf-8') as file:
        companies = json.load(file)

    for company in companies:
        company_name = company['name']
        country = company['country']
        news_data = scrape_news(company_name, country, company)
        save_news_to_csv(news_data, company_name)
        preprocess_and_generate_wordcloud(news_data, company_name, 'korean' if country == "korea" else 'english')

if __name__ == "__main__":
    main()


if __name__ == "__main__":
    main()
