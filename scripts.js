// Load header and footer
document.addEventListener('DOMContentLoaded', function() {
    loadHeader();
    loadFooter();
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

function scrollFeatures(direction) {
    var container = document.querySelector('.feature-scroll');
    var containerWidth = container.offsetWidth;
    var item = document.querySelector('#feature-list li');
    var itemWidth = item ? item.offsetWidth : 0; // Fallback in case there is no item

    if (direction === 'prev') {
        container.scrollLeft -= itemWidth;
    } else {
        container.scrollLeft += itemWidth;
    }
}

