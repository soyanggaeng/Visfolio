import pandas as pd
import json

def process_csv(file_path, country, name_col, sector_col):
    if country == "korea":
        data = pd.read_csv(file_path, encoding="cp949")
    else:
        data = pd.read_csv(file_path)
    companies = [{"name": row[name_col], "sector": row[sector_col], "country": country} for index, row in data.iterrows()]
    return companies

# Process each CSV file
korean_companies = process_csv("kospi업종분류.csv", "korea", "종목명", "업종명")
korean_companies += process_csv("Kosdaq업종분류.csv", "korea", "종목명", "업종명")

usa_companies = process_csv("C:\\Users\\kathy\\OneDrive - SNU\\대학원 2-1학기\\시각화\\팀플\\AMEX업종분류.csv", "usa", "Name", "Industry")
usa_companies += process_csv("C:\\Users\\kathy\\OneDrive - SNU\\대학원 2-1학기\\시각화\\팀플\\NASDAQ업종분류.csv", "usa", "Name", "Industry")
usa_companies += process_csv("C:\\Users\\kathy\\OneDrive - SNU\\대학원 2-1학기\\시각화\\팀플\\NYSE업종분류.csv", "usa", "Name", "Industry")

# Combine all companies into one list
all_companies = korean_companies + usa_companies

# Write to a JSON file
with open("C:/Users/kathy/OneDrive - SNU/대학원 2-1학기/시각화/팀플/webpage/crawling/companies.json", "w", encoding="utf-8") as file:
    json.dump(all_companies, file, ensure_ascii=False, indent=4)
