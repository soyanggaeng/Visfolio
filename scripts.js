document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('DOM fully loaded and parsed');
        loadHeader(); // This will initiate loading the header and then the footer
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});

// Header load with error handling
function loadHeader() {
    fetch('header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok for header.html');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            console.log('Header loaded');
            // Header is loaded, now load the footer
            loadFooter();
        })
        .catch(error => {
            console.error('Error loading header:', error);
        });
}

// Footer load with error handling
function loadFooter() {
    fetch('footer.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok for footer.html');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
            console.log('Footer loaded');
            // Footer is loaded, now initialize swipe features
            initSwipeFeatures();
        })
        .catch(error => {
            console.error('Error loading footer:', error);
        });
}

function setupDropdownToggle() {
    try {
        var menuIcon = document.getElementById('menu-icon');
        if (!menuIcon) {
            throw new Error('menu-icon not found');
        }
        menuIcon.addEventListener('click', function() {
            var dropdown = document.getElementById('dropdown');
            dropdown.classList.toggle('hidden');
        });
        console.log('Dropdown toggle set up');
    } catch (error) {
        console.error('Error setting up dropdown toggle:', error);
    }
}

// 스와이프 기능 및 화살표 가시성 초기화
// Call this function at the end of your loadFooter function
function initSwipeFeatures() {
    try {
        const featureScroll = document.querySelector('.feature-scroll');
        if (!featureScroll) {
            throw new Error('.feature-scroll element not found');
        }
        const prevArrow = document.querySelector('.feature-nav.prev');
        const nextArrow = document.querySelector('.feature-nav.next');

        function checkArrows() {
            const isScrollable = featureScroll.scrollWidth > featureScroll.clientWidth;
            prevArrow.style.display = isScrollable ? 'block' : 'none';
            nextArrow.style.display = isScrollable ? 'block' : 'none';
        }

        checkArrows();
        window.addEventListener('resize', checkArrows);

        prevArrow.addEventListener('click', () => scrollFeatures('prev'));
        nextArrow.addEventListener('click', () => scrollFeatures('next'));

        featureScroll.addEventListener('touchstart', handleTouchStart, false);
        featureScroll.addEventListener('touchmove', handleTouchMove, false);
        featureScroll.addEventListener('touchend', handleTouchEnd, false);
        console.log('Swipe features initialized');
    } catch (error) {
        console.error('Error initializing swipe features:', error);
    }
    populateSearchSuggestions(); // Populate search suggestions here
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
    // Add more companies and news items here...
];


// 자동 완성 데이터 채우기
function populateSearchSuggestions() {
    console.log('Populating search suggestions');
    let searchSuggestions = document.getElementById('search-suggestions');
    companies.forEach(company => {
        let option = document.createElement('option');
        option.value = company.name;
        searchSuggestions.appendChild(option);
    });
    console.log('Search suggestions populated');
    setupSearch();
}

// 검색 기능 설정
function setupSearch() {
    try {
        console.log('Setting up search');
        console.assert(document.getElementById('search-btn'), 'search-btn not found');
        console.assert(document.getElementById('search-input'), 'search-input not found');

        document.getElementById('search-btn').addEventListener('click', function() {
            console.log('Search button clicked');
            let searchQuery = document.getElementById('search-input').value.toLowerCase();
            let company = companies.find(c => c.name.toLowerCase() === searchQuery);

            if (company) {
                console.log('Company found:', company.name);
                displayWordCloud(company.wordCloud);
                displayNews(company.news);
            } else {
                console.log('Company not found');
                alert("Company not found");
            }
        });
        console.log('Search setup complete');
    } catch (error) {
        console.error('Error setting up search:', error);
    }
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
