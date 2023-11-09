// Load header and footer
document.addEventListener('DOMContentLoaded', function() {
    loadHeader();
    loadFooter();
    initSwipeFeatures(); // Initialize swipe features after the DOM is loaded
});

function loadHeader() {
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
        });
}

function loadFooter() {
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        });
}

// Dropdown menu toggle
document.getElementById('menu-icon').addEventListener('click', function() {
    var dropdown = document.getElementById('dropdown');
    dropdown.classList.toggle('hidden');
});

// Initialize swipe features and arrow visibility
function initSwipeFeatures() {
    const featureScroll = document.querySelector('.feature-scroll');
    const prevArrow = document.querySelector('.feature-nav.prev');
    const nextArrow = document.querySelector('.feature-nav.next');

    function checkArrows() {
        const isScrollable = featureScroll.scrollWidth > featureScroll.clientWidth;
        prevArrow.style.display = isScrollable ? 'block' : 'none';
        nextArrow.style.display = isScrollable ? 'block' : 'none';
    }

    checkArrows(); // Check arrows on page load
    window.addEventListener('resize', checkArrows); // Check arrows on window resize

    // Add event listeners for arrows
    prevArrow.addEventListener('click', () => scrollFeatures('prev'));
    nextArrow.addEventListener('click', () => scrollFeatures('next'));

    // Add event listeners for touch events
    featureScroll.addEventListener('touchstart', handleTouchStart, false);
    featureScroll.addEventListener('touchmove', handleTouchMove, false);
    featureScroll.addEventListener('touchend', handleTouchEnd, false);
}

// Swipe functionality
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
