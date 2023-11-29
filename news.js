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

// This function is correct as is and should work with your data structure.
function createWordCloudData(newsData) {
    let wordCounts = new Map();
    newsData.forEach(newsItem => {
        if (!newsItem[1]) { // Check if the title exists
            return;
        }
        let words = newsItem[1].toLowerCase().match(/\b(\w+)\b/g);
        if (words) {
            words.forEach(word => {
                wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
            });
        }
    });
    return Array.from(wordCounts).map(([text, size]) => ({text, size}));
}

async function displayWordCloud(wordcloudData) {
    // 워드클라우드 생성 로직
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
        const response = await fetch(`http://34.41.31.204:5000/scrape?company_name=${encodeURIComponent(companyName)}&country=${country}`);
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
    
        const wordcloudData = createWordCloudData(newsData);
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
