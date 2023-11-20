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

        // Find the first matching company based on the search criteria
        const selectedCompany = companies.find(company => 
            company.name.toLowerCase().includes(searchQuery) &&
            company.country === selectedCountry &&
            company.sector === selectedSector
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
    const imageFilePath = `wordcloud/${companyName}_wordcloud.jpg`;
    let image = document.getElementById('wordcloud-image');
    image.src = imageFilePath;
    image.style.display = 'block';
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