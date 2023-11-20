document.addEventListener('DOMContentLoaded', () => {
    loadHeader()
        .then(loadFooter)
        .then(initializePage)
        .catch(console.error);
});

async function loadHeader() {
    const response = await fetch('header.html');
    if (!response.ok) {
        throw new Error('Network response was not ok for header.html');
    }
    const data = await response.text();
    document.getElementById('header-placeholder').innerHTML = data;
    console.log('Header loaded');
}

async function loadFooter() {
    const response = await fetch('footer.html');
    if (!response.ok) {
        throw new Error('Network response was not ok for footer.html');
    }
    const data = await response.text();
    document.getElementById('footer-placeholder').innerHTML = data;
    console.log('Footer loaded');
}

const colorScale = d3.scaleOrdinal(d3.schemeSet3); // You can use a color scheme of your choice

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

        // Find the first matching company based on the search criteria, ensuring case-insensitive comparison
        const selectedCompany = companies.find(company => 
            company.name.toLowerCase() === searchQuery &&
            company.country === selectedCountry &&
            (company.sector === selectedSector || selectedSector === 'all')
        );

        // If a company is found, display its word cloud and news
        if (selectedCompany) {
            displayWordCloud(selectedCompany.name);
            displayNews(selectedCompany.name);
        } else {
            console.log("No company found matching the search criteria");
        }
    });
}

async function displayWordCloud(companyName) {
    console.log("displayWordCloud called for", companyName);

    const csvFilePath = `wordcloud/${companyName}_wordcloud.csv`;
    console.log("Fetching data from", csvFilePath);

    const response = await fetch(csvFilePath);
    if (!response.ok) {
        console.error('Failed to load word cloud data');
        return;
    }
    const csvText = await response.text();

    console.log("CSV data fetched:", csvText.substring(0, 100)); // Log first 100 chars

    // Remove existing word cloud SVG elements from the DOM
    d3.select(".wordcloud-section").selectAll("svg").remove();

    // Parse the CSV data
    const parsedData = d3.csvParse(csvText, d => {
        // Make sure to parse the frequency to a number if it's not already
        return { text: d.word, size: +d.frequency };
    });

    // Now, use the parsed data to generate the word cloud
    generateWordCloud(parsedData);
}

function generateWordCloud(words) {
    // Set up the dimensions and margins of the graph
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = 450 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

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
}

async function displayNews(companyName) {
    const csvFilePath = `crawling/${companyName}.csv`;

    const response = await fetch(csvFilePath);
    if (!response.ok) {
        console.error('Failed to load news data');
        return;
    }
    const csvText = await response.text();

    parseAndDisplayNews(csvText);
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
