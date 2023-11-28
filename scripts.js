document.addEventListener('DOMContentLoaded', () => {
    loadHeader()
        .then(loadFooter)
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
