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

function initializePage() {
    fetchCompanies().then(populateSearchSuggestions);
    setupSearch();
}

async function fetchCompanies() {
    const response = await fetch('crawling/companies.json');
    if (!response.ok) {
        throw new Error('Failed to load company data');
    }
    return await response.json();
}

function populateSearchSuggestions(companies) {
    const searchSuggestions = document.getElementById('search-suggestions');
    companies.forEach(company => {
        const option = document.createElement('option');
        option.value = company.name;
        searchSuggestions.appendChild(option);
    });
    console.log('Search suggestions populated');
}

function setupSearch() {
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    if (!searchBtn || !searchInput) {
        throw new Error('Search elements not found');
    }

    searchBtn.addEventListener('click', () => {
        const searchQuery = searchInput.value.toLowerCase();
        displayWordCloud(searchQuery);
        displayNews(searchQuery);
    });
    console.log('Search setup complete');
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
        if (index === 0 || row === '') return;

        const columns = row.split(',');
        const outlet = columns[0];
        const time = columns[1];
        const title = columns[2];
        const link = columns[3];

        let article = document.createElement('article');
        article.className = 'news-item';

        let titleLink = document.createElement('a');
        titleLink.href = link;
        titleLink.textContent = `${outlet} - ${time} - ${title}`;
        titleLink.className = 'news-title';
        article.appendChild(titleLink);

        newsSection.appendChild(article);
    });
}
