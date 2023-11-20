from bs4 import BeautifulSoup
import requests
import csv
import pandas as pd
import time
import re
from wordcloud import WordCloud
from konlpy.tag import Kkma
from collections import Counter
import matplotlib.pyplot as plt
import os

# Read company names from the CSV file
company_data = pd.read_csv("kospi업종분류.csv", encoding="cp949")
company_names = company_data["종목명"].tolist()

# Paths for saving the files
crawling_path = "C:\\Users\\kathy\\OneDrive - SNU\\대학원 2-1학기\\시각화\\팀플\\webpage\\crawling"
wordcloud_path = "C:\\Users\\kathy\\OneDrive - SNU\\대학원 2-1학기\\시각화\\팀플\\webpage\\wordcloud"

# Initialize Kkma
kkma = Kkma()

# Iterate through the company names and scrape data for each company
for company_name in company_names:
    csv_filename = os.path.join(crawling_path, f"{company_name}.csv")
    with open(csv_filename, "w", newline="", encoding="utf-8") as csvfile:
        csv_writer = csv.writer(csvfile)
        csv_writer.writerow(["company_name", "title", "date", "link"])

        for page in range(1, 11):  # Collect titles from page 1 to 10
            start_param = (page - 1) * 10 + 1
            website = f"https://search.naver.com/search.naver?where=news&sm=tab_jum&query={company_name}+주가&office_category=3&office_type=3&pd=2&start={start_param}"

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
                    csv_writer.writerow([company_name, title_text, date_text, link])
                    # print(f"{company_name}의 title: {title_text}")

    # Read the collected titles from the CSV file
    df = pd.read_csv(csv_filename)

    # Combine all titles into a single text
    text = " ".join(df["title"])

    # Remove company name and 주가 using regular expressions
    text = re.sub(rf'\b{company_name}\b', '', text)
    text = re.sub(r'\b주가\b', '', text)

    # Extract nouns, adjectives, and adverbs
    tagged_words = kkma.pos(text)
    filtered_words = [word for word, tag in tagged_words if tag in ('NNG', 'NNP', 'VA', 'MAG')]

    # Create a word frequency count
    word_count = Counter(filtered_words)

    if word_count:
        # Convert the count to a dictionary
        word_dict = dict(word_count)

        # Create WordCloud
        wordcloud = WordCloud(
            font_path="C:\\Users\\kathy\\AppData\\Local\\Microsoft\\Windows\\Fonts\\조선일보명조.ttf",  
            background_color="white",
            width=800,
            height=800
        ).generate_from_frequencies(word_dict)

        # Save the word cloud image
        wordcloud_filename = os.path.join(wordcloud_path, f"{company_name}_wordcloud.jpg")
        wordcloud.to_file(wordcloud_filename)

        print(f"Completed processing for {company_name}")
    else:
        print(f"No sufficient data to create word cloud for {company_name}")
