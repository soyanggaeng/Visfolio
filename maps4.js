const latelyDate = "2023-11-09"; 

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector("h2").textContent = `Global Financial Market on ${latelyDate}`;
});

document.querySelector("h2").textContent = `Global Financial Market on ${latelyDate}`;

// Tooltip setup
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden");


const svg = d3.select("svg"),
    width = 3000, 
    height = 800; 


const path = d3.geoPath();
const projection = d3.geoMercator()
    .scale(180)
    .center([180, 20])
    .translate([1000, 500]); 


const data = new Map();
const colorScale = d3.scaleThreshold()
    .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
    .range(d3.schemeBlues[7]);

    function getAdjCloseValues(country) {
        if (!jsonData[country]) {
            return `${country} Data not available`;
        }
    
        const marketData = jsonData[country].Market;
        let tooltipContent = '';
        let isContentAdded = false; // Flag to track if any content is added
    
        // Handle Market Data
        for (let market in marketData) {
            let marketEntry = marketData[market].find(entry => entry.Date.startsWith(latelyDate));
            if (marketEntry && marketEntry['Adj Close']) {
                let adjCloseRounded = parseFloat(marketEntry['Adj Close']).toFixed(2);
                tooltipContent += `${market}: ${adjCloseRounded}<br>`;
                isContentAdded = true;
            }
        }
    
        // Add a partition if market data was added
        if (isContentAdded) tooltipContent += "<hr>";
    
        // Handle Currency Data if it exists
        if (jsonData[country].Currency) {
            const currencyData = jsonData[country].Currency;
            const currencyEntry = currencyData.find(entry => entry.Date.startsWith(latelyDate));
            if (currencyEntry && currencyEntry.value) {
                let currencyRounded = parseFloat(currencyEntry.value).toFixed(2);
                tooltipContent += `Exchange Rate: ${currencyRounded}<br>`;
            } else {
                tooltipContent += `Currency data not available for ${latelyDate}<br>`;
            }
        }
    
        return tooltipContent || `${country} Data not available`;
    }

function mouseOver(event, d) {
    d3.select(this)
        .style("opacity", 1)
        .style("stroke", "black") 
        .style("stroke-width", 2);

    let countryName = d.properties.name; 
    let tooltipHtml = getAdjCloseValues(countryName);

    tooltip.html(tooltipHtml)
           .style("left", (event.pageX + 10) + "px")
           .style("top", (event.pageY + 10) + "px")
           .style("visibility", "visible")
           .style("opacity", 1);
}

function mouseLeave() {
    d3.select(this)
        .style("opacity", 0.7) // 원래의 opacity 값으로 변경
        .style("stroke", "transparent");

    tooltip.style("visibility", "hidden")
           .style("opacity", 0);
}


Promise.all([
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
    d3.json('data/world_finance_data.json')
]).then(function([topo, financeData]) {
    jsonData = financeData

    svg.append("g")
        .selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
        .attr("d", d3.geoPath().projection(projection))
        .attr("fill", '#ccc')
        .style("stroke", "transparent")
        .attr("class", function(d){ return "Country" } )
        .on("mouseover", mouseOver)
        .on("mouseleave", mouseLeave)
});
