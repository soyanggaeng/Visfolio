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
    populateSearchSuggestions();
    setupSearch();
}

let touchStartX = 0;
let touchEndX = 0;

function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
}

function handleTouchMove(e) {
    touchEndX = e.touches[0].clientX;
}

function handleTouchEnd() {
    if (touchStartX - touchEndX > 50) {
        scrollFeatures('next');
    } else if (touchStartX - touchEndX < -50) {
        scrollFeatures('prev');
    }
}

function scrollFeatures(direction) {
    var container = document.querySelector('.feature-scroll');
    var containerWidth = container.offsetWidth;
    var item = document.querySelector('#feature-list li');
    var itemWidth = item ? item.offsetWidth : 0;

    if (direction === 'prev') {
        container.scrollLeft -= itemWidth;
    } else {
        container.scrollLeft += itemWidth;
    }
}

// 더미 데이터
const companies = [
    { 
        name: "AlphaTech", 
        wordCloud: "wordcloud_alpha.jpg", 
        news: [
            { 
                outlet: "TechCrunch", 
                time: "2 hours ago", 
                title: "AlphaTech launches new product", 
                link: "https://techcrunch.com/alpha-tech-new-product" 
            },
            { 
                outlet: "The Verge", 
                time: "5 hours ago", 
                title: "AlphaTech reports record profits", 
                link: "https://theverge.com/alpha-tech-record-profits" 
            }
        ]
    },
    { 
        name: "BetaSolutions", 
        wordCloud: "wordcloud_beta.jpg", 
        news: [
            { 
                outlet: "Bloomberg", 
                time: "1 day ago", 
                title: "BetaSolutions poised to disrupt the market", 
                link: "https://bloomberg.com/betasolutions-market-disruption" 
            },
            { 
                outlet: "Forbes", 
                time: "2 days ago", 
                title: "BetaSolutions CEO on the future of tech innovation", 
                link: "https://forbes.com/betasolutions-ceo-interview" 
            }
        ]
    },
    { 
        name: "GammaCorp", 
        wordCloud: "wordcloud_gamma.jpg", 
        news: [
            { 
                outlet: "Reuters", 
                time: "3 hours ago", 
                title: "GammaCorp's groundbreaking approach to AI", 
                link: "https://reuters.com/gammacorp-ai-breakthrough" 
            },
            { 
                outlet: "CNBC", 
                time: "1 hour ago", 
                title: "GammaCorp stock surges after earnings beat", 
                link: "https://cnbc.com/gammacorp-earnings-surprise" 
            }
        ]
    },
    { 
        name: "DeltaElectronics", 
        wordCloud: "wordcloud_delta.jpg", 
        news: [
            { 
                outlet: "TechRadar", 
                time: "2 days ago", 
                title: "DeltaElectronics announces innovative battery tech", 
                link: "https://techradar.com/deltaelectronics-battery-tech" 
            },
            { 
                outlet: "Engadget", 
                time: "3 days ago", 
                title: "DeltaElectronics to partner with major car manufacturer", 
                link: "https://engadget.com/deltaelectronics-car-partnership" 
            }
        ]
    },
    // You can continue adding more companies and news items here
];

function populateSearchSuggestions() {
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
        const company = companies.find(c => c.name.toLowerCase() === searchQuery);
        if (company) {
            displayWordCloud(company.wordCloud);
            displayNews(company.news);
        } else {
            alert("Company not found");
        }
    });
    console.log('Search setup complete');
}

function displayWordCloud(imageFile) {
    let image = document.getElementById('wordcloud-image');
    image.src = imageFile;
    image.style.display = 'block';
}

function displayNews(newsItems) {
    let newsSection = document.querySelector('.news-section');
    newsSection.innerHTML = ''; // Clear existing news items

    newsItems.forEach(item => {
        let article = document.createElement('article');
        article.className = 'news-item';

        // Create and append the outlet element
        let outletElem = document.createElement('span');
        outletElem.className = 'news-outlet';
        outletElem.textContent = item.outlet + " | ";
        article.appendChild(outletElem);

        // Create and append the time element
        let timeElem = document.createElement('span');
        timeElem.className = 'news-time';
        timeElem.textContent = item.time + " | ";
        article.appendChild(timeElem);

        // Create and append the title element as a link
        let titleLink = document.createElement('a');
        titleLink.href = item.link;
        titleLink.textContent = item.title;
        titleLink.className = 'news-title';
        article.appendChild(titleLink);

        // Append the article to the news section
        newsSection.appendChild(article);
    });
}
