document.addEventListener('DOMContentLoaded', () => {
    initializePage()
        .catch(console.error);
});

const colorScale = d3.scaleOrdinal(d3.schemeSet3);

async function initializePage() {
    const companies = await fetchCompanies();
    setupCountrySelection(companies);
    setupSearch(companies);
}

async function fetchCompanies() {
    const response = await fetch('crawling/companies.json');
    if (!response.ok) {
        throw new Error('Failed to load company data');
    }
    return await response.json();
}

function populateSectorDropdown(companies, country) {
    const sectorSelect = document.getElementById('sector-select');
    sectorSelect.innerHTML = ''; // Clear existing options

    // Add an option for 'All' sectors
    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = 'All';
    sectorSelect.appendChild(allOption);

    if (country !== 'all') {
        const sectors = new Set(companies.filter(company => company.country === country).map(company => company.sector));
        sectors.forEach(sector => {
            const option = document.createElement('option');
            option.value = sector;
            option.textContent = sector;
            sectorSelect.appendChild(option);
        });
    }

    // Update the search suggestions based on the initial sector selection
    populateSearchSuggestions(companies, country, sectorSelect.value);
}

function setupCountrySelection(companies) {
    const countrySelect = document.getElementById('country-select');
    const sectorSelect = document.getElementById('sector-select');

    countrySelect.addEventListener('change', () => {
        const selectedCountry = countrySelect.value;
        populateSectorDropdown(companies, selectedCountry);
    });

    sectorSelect.addEventListener('change', () => {
        const selectedCountry = countrySelect.value;
        const selectedSector = sectorSelect.value;
        populateSearchSuggestions(companies, selectedCountry, selectedSector);
    });

    // Initially populate sectors for the default selected country
    populateSectorDropdown(companies, countrySelect.value);
}

function populateSearchSuggestions(companies, country, sector) {
    const searchSuggestions = document.getElementById('search-suggestions');
    searchSuggestions.innerHTML = ''; // Clear existing suggestions

    let filteredCompanies = companies;

    if (country !== 'all') {
        filteredCompanies = filteredCompanies.filter(company => company.country === country);
    }
    if (sector !== 'all') {
        filteredCompanies = filteredCompanies.filter(company => company.sector === sector);
    }

    filteredCompanies.forEach(company => {
        const option = document.createElement('option');
        option.value = company.name;
        searchSuggestions.appendChild(option);
    });
}

function setupSearch(companies) {
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    const countrySelect = document.getElementById('country-select');
    const sectorSelect = document.getElementById('sector-select');

    searchBtn.addEventListener('click', () => {
        const searchQuery = searchInput.value.toLowerCase();
        const selectedCountry = countrySelect.value;
        const selectedSector = sectorSelect.value;

        const selectedCompany = companies.find(company =>
            company.name.toLowerCase() === searchQuery &&
            company.country === selectedCountry &&
            (company.sector === selectedSector || selectedSector === 'all')
        );

        if (selectedCompany) {
            displayNews(selectedCompany.name, selectedCountry);
        } else {
            console.log("No company found matching the search criteria");
        }
    });
}

function createWordCloudData(newsData, companyName) {
    let wordCounts = new Map();

    // Load the stopwords from external files (assuming you have them as arrays)
    const koreanStopwords = ["우리", "저희", "따라", "의해", "뿐이다", "저희", "물론", "또한", "그리고", "그러나", "그런데", "하지만", "비록", "제외하고", "따라서", "그리하여", "하지만", "각각", "그래서", "그러므로", "결국"]; // Load Korean stopwords here
    const englishStopwords = [
        "about",
        "above",
        "after",
        "again",
        "against",
        "all",
        "am",
        "an",
        "and",
        "any",
        "are",
        "aren't",
        "as",
        "at",
        "be",
        "because",
        "been",
        "before",
        "being",
        "below",
        "between",
        "both",
        "but",
        "by",
        "can't",
        "cannot",
        "could",
        "couldn't",
        "did",
        "didn't",
        "do",
        "does",
        "doesn't",
        "doing",
        "don't",
        "down",
        "during",
        "each",
        "few",
        "for",
        "from",
        "further",
        "had",
        "hadn't",
        "has",
        "hasn't",
        "have",
        "haven't",
        "having",
        "he",
        "he'd",
        "he'll",
        "he's",
        "her",
        "here",
        "here's",
        "hers",
        "herself",
        "him",
        "himself",
        "his",
        "how",
        "how's",
        "i",
        "i'd",
        "i'll",
        "i'm",
        "i've",
        "if",
        "in",
        "into",
        "is",
        "isn't",
        "it",
        "it's",
        "its",
        "itself",
        "let's",
        "me",
        "more",
        "most",
        "mustn't",
        "my",
        "myself",
        "no",
        "nor",
        "not",
        "of",
        "off",
        "on",
        "once",
        "only",
        "or",
        "other",
        "ought",
        "our",
        "ourselves",
        "out",
        "over",
        "own",
        "same",
        "shan't",
        "she",
        "she'd",
        "she'll",
        "she's",
        "should",
        "shouldn't",
        "so",
        "some",
        "such",
        "than",
        "that",
        "that's",
        "the",
        "their",
        "theirs",
        "them",
        "themselves",
        "then",
        "there",
        "there's",
        "these",
        "they",
        "they'd",
        "they'll",
        "they're",
        "they've",
        "this",
        "those",
        "through",
        "to",
        "too",
        "under",
        "until",
        "up",
        "very",
        "was",
        "wasn't",
        "we",
        "we'd",
        "we'll",
        "we're",
        "we've",
        "were",
        "weren't",
        "what",
        "what's",
        "when",
        "when's",
        "where",
        "where's",
        "which",
        "while",
        "who",
        "who's",
        "whom",
        "why",
        "why's",
        "with",
        "won't",
        "would",
        "wouldn't",
        "you",
        "you'd",
        "you'll",
        "you're",
        "you've",
        "your",
        "yours",
        "yourself",
        "yourselves"
      ];
       // Load English stopwords here

    // Combine the loaded stopwords with existing ones
    const stopwords = new Set([
        '주가', 
        companyName,
        ...koreanStopwords,
        ...englishStopwords
        // 추가적인 불용어를 여기에 넣을 수 있습니다.
    ]);
    
    // 한 글자 단어와 불용어를 제외하는 필터링 함수입니다.
    const filterStopwordsAndShortWords = word => 
        word.length > 1 && !stopwords.has(word) && isNaN(word);

    newsData.forEach(newsItem => {
        let words = newsItem[1].match(/[가-힣A-Za-z0-9_]+/g);
        if (words) {
            words = words
                .map(word => word.toLowerCase()) // 모든 영문자를 소문자로 변환합니다.
                .filter(filterStopwordsAndShortWords);

            // 한글 조사와 영어 불필요 단어를 제거합니다.
            words = words.map(word => word.replace(/(은|는|이|가|을|를|와|과|의|에|로|으로|만|도|로써|까지|등|등등|으로써|에서|에게|에게서|부터)$/, ''));

            words.forEach(word => {
                wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
            });
        }
    });

    // 콘솔 로그로 워드 카운트 데이터를 확인합니다.
    console.log('Word Counts:', wordCounts);

    // 워드 카운트를 내림차순으로 정렬하고 상위 100개 단어만 포함합니다.
    return Array.from(wordCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 100)
        .map(([text, size]) => ({text, size}));
}

// 이 함수를 호출할 때, companyName으로 회사 이름을 전달하세요.
// 예: createWordCloudData(newsData, 'AJ네트웍스');

async function displayWordCloud(wordcloudData) {
    // 워드클라우드 생성 로직
    // Remove existing word cloud SVG elements from the DOM
    d3.select(".wordcloud-section").selectAll("svg").remove();
    generateWordCloud(wordcloudData);
}

function generateWordCloud(words) {
    // Set up the dimensions and margins of the graph
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
        // Increase the width and height as desired
        width = 900 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    var svg = d3.select(".wordcloud-section").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // Find the maximum frequency to normalize word sizes
    const maxSize = d3.max(words, function(d) { return +d.size; });

    // Scales the size of each word
    const sizeScale = d3.scaleLinear()
        .domain([0, maxSize])
        .range([10, 100]);  // Adjust the range for minimum and maximum font sizes

    // Constructs a new cloud layout instance and run the word cloud algorithm
    var layout = d3.layout.cloud()
        .size([width, height])
        .words(words.map(function(d) { return {text: d.text, size: sizeScale(+d.size)}; }))
        .padding(5)        // Space between words
        .rotate(0)         // Rotate every word by 0 degrees
        .fontSize(function(d) { return d.size; })      // Font size of words
        .on("end", draw);
    layout.start();

    // Draw the words
    function draw(words) {
      svg
        .append("g")
          .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
          .selectAll("text")
            .data(words)
          .enter().append("text")
            .style("font-size", function(d) { return d.size + "px"; })
            .style("fill", function(d) { return colorScale(d.text); })
            .attr("text-anchor", "middle")
            .style("font-family", "'Nanum Myeongjo', serif")
            .attr("transform", function(d) {
              return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; });
    }

    // Define the drag behavior
    var drag = d3.drag()
        .on("start", function(event, d) {
            d3.select(this).raise().classed("active", true);
        })
        .on("drag", function(event, d) {
            d3.select(this).attr("x", d.x = event.x).attr("y", d.y = event.y);
        })
        .on("end", function(event, d) {
            d3.select(this).classed("active", false);
        });
    
    // Apply the drag behavior to each word
    svg.selectAll("text")
        .call(drag);
}

async function displayNews(companyName, country) {
    try {
        const response = await fetch(`http://34.71.84.47:5000/scrape?company_name=${encodeURIComponent(companyName)}&country=${country}`);
        const responseData = await response.json();
        console.log(responseData); // 서버 응답의 구조를 콘솔에서 확인

        if (!response.ok) {
            throw new Error(responseData.message || 'Network response was not ok');
        }

        const newsData = responseData.newsData || [];
        const newsSection = document.querySelector('.news-section');
        newsSection.innerHTML = '';
    
        newsData.forEach(newsItem => {
            const article = document.createElement('article');
            article.className = 'news-item';
    
            const title = document.createElement('h2');
            title.className = 'news-title';
            title.textContent = newsItem[1]; // Access title with array indexing
    
            const date = document.createElement('p');
            date.className = 'news-date';
            date.textContent = newsItem[2]; // Access date with array indexing
    
            const link = document.createElement('a');
            link.className = 'news-link';
            link.href = newsItem[3]; // Access link with array indexing
            link.textContent = 'Read more';
            link.target = '_blank';
    
            article.appendChild(title);
            article.appendChild(date);
            article.appendChild(link);
    
            newsSection.appendChild(article);
        });
    
        const wordcloudData = createWordCloudData(newsData, companyName);
        generateWordCloud(wordcloudData);
    } catch (error) {
        console.error('Failed to fetch news:', error);
    }
}


function parseAndDisplayNews(csvText) {
    let newsSection = document.querySelector('.news-section');
    newsSection.innerHTML = '';

    const rows = csvText.split('\n');
    rows.forEach((row, index) => {
        if (index === 0 || row === '') return; // Skip the header or empty rows

        // Correctly mapping the columns based on your CSV structure
        const columns = row.split(',');
        // Assuming the CSV columns are: company_name, title, date, link
        const title = columns[1]; // Title is the second column
        const time = columns[2];  // Date is the third column
        const link = columns[3];  // Link is the fourth column

        // Create and append the article element for each news item
        let article = document.createElement('article');
        article.className = 'news-item';

        let titleLink = document.createElement('a');
        titleLink.href = link;
        titleLink.textContent = `${title} - ${time}`;
        titleLink.className = 'news-title';
        article.appendChild(titleLink);

        newsSection.appendChild(article);
    });
}
