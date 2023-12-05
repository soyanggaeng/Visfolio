const latelyDate = "2023-11-09"; 
const showDate = "2023-12-04";

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector("h2").textContent = `Global Financial Market on ${showDate}`;
});

document.querySelector("h2").textContent = `Global Financial Market on ${showDate}`;


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
    width = 1100, 
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

function getPreviousDate(date, daysToSubtract, monthsToSubtract) {
        let newDate = new Date(date);
        newDate.setDate(newDate.getDate() - daysToSubtract);
        newDate.setMonth(newDate.getMonth() - monthsToSubtract);
        return newDate.toISOString().split('T')[0];
    };

function createLinePlot(data, width, height) {
        let svg = d3.create("svg")
            .attr("width", width)
            .attr("height", height);
    
        let xScale = d3.scaleTime()
            .domain(d3.extent(data, d => d.date)) 
            .range([0, width]);
        
        let yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)]) 
            .range([height, 0]);
    
        let line = d3.line()
            .x(d => xScale(d.date))
            .y(d => yScale(d.value));
    
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", 1.5)
            .attr("d", line);
    
        return new XMLSerializer().serializeToString(svg.node());
    };

function createCurrencyLinePlot(data, width, height) {
        let svg = d3.create("svg")
            .attr("width", width)
            .attr("height", height);
    
        let xScale = d3.scaleTime()
            .domain(d3.extent(data, d => d.date)) 
            .range([0, width]);
        
        let yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)]) 
            .range([height, 0]);
    
        let line = d3.line()
            .x(d => xScale(d.date))
            .y(d => yScale(d.value));
    
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "green")
            .attr("stroke-width", 1.5)
            .attr("d", line);
    
        return new XMLSerializer().serializeToString(svg.node());
    };


function getAdjCloseValues(country) {
        if (!jsonData[country]) {
            return `${country} Data not available`;
        }
    
        const marketData = jsonData[country].Market;
        let tooltipContent = `<strong>${country}</strong><br><hr><strong>Stock Market:</strong><br>`;
        let isContentAdded = false; // Flag to track if any content is added
    
        let previousDay = getPreviousDate(latelyDate, 1, 0); 
        let previousMonth = getPreviousDate(latelyDate, 0, 1); 
        let twopreviousDay = getPreviousDate(latelyDate, 2, 0); 

        // Handle Market Data
        for (let market in marketData) {
            let marketEntry = marketData[market].find(entry => entry.Date.startsWith(latelyDate));
            let onepdmarketEntry = marketData[market].find(entry => entry.Date.startsWith(previousDay));
            let onepmmarketEntry = marketData[market].find(entry => entry.Date.startsWith(previousMonth));
            if (marketEntry && marketEntry['Adj Close'] && onepdmarketEntry && onepdmarketEntry['Adj Close']) {
                let adjClose = parseFloat(marketEntry['Adj Close']);
                let prev_adjClose = parseFloat(onepdmarketEntry['Adj Close']);
                // let adjCloseRounded = parseFloat(marketEntry['Adj Close']).toLocaleString();
                // tooltipContent += `${market}: ${adjCloseRounded}<br>`;
                // let prev_adjCloseRounded = parseFloat(onepdmarketEntry['Adj Close']).toLocaleString();
                let day_growth = adjClose - prev_adjClose;

                tooltipContent += `${market}: ${adjClose.toLocaleString()}<br>`;

                if (isNaN(day_growth)){
                    day_growth = 0;
                }
                if (day_growth > 0) {
                    tooltipContent += ` <span style="color: red;">&#9650; +${day_growth.toLocaleString()}</span><br>`;
                } else {
                    tooltipContent += ` <span style="color: blue;">&#9660; ${day_growth.toLocaleString()}</span><br>`;
                }
                isContentAdded = true;
            }
        }
    
        // Add a partition if market data was added
        if (isContentAdded) tooltipContent += "<hr>";
    
        // Handle Currency Data if it exists
        if (jsonData[country].Currency) {
            tooltipContent += `<strong>$ Exchange Rate:</strong><br>`;
            const currencyData = jsonData[country].Currency;
            const currencyEntry = currencyData.find(entry => entry.Date.startsWith(latelyDate));
            let onepdcurrencyEntry = currencyData.find(entry => entry.Date.startsWith(twopreviousDay));

            if (currencyEntry && currencyEntry.value && onepdcurrencyEntry && onepdcurrencyEntry.value) {
                let currencyRounded = parseFloat(currencyEntry.value);
                let prev_currencyRounded = parseFloat(onepdcurrencyEntry.value);
                let day_growth_currency = currencyRounded - prev_currencyRounded;

                tooltipContent += ` ${currencyRounded.toLocaleString()}<br>`;

                if (isNaN(day_growth_currency)){
                    day_growth_currency = 0;
                }
                if (day_growth_currency > 0) {
                    tooltipContent += ` <span style="color: red;">&#9650; +${day_growth_currency.toLocaleString()}</span><br>`;
                } else {
                    tooltipContent += ` <span style="color: blue;">&#9660; ${day_growth_currency.toLocaleString()}</span><br>`;
                }
            } else {
                //tooltipContent += `Currency data not available<br>`;
            }
        }
    
        return tooltipContent //|| `${country} Data not available`;
    }

function mouseOver(event, d) {
    d3.select(this)
        .style("opacity", 0.7)
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
        .style("opacity", 1) 
        .style("stroke", "transparent");

    tooltip.style("visibility", "hidden")
           .style("opacity", 0);
}

function countryClick(event, d) {
    let countryName = d.properties.name;
    let infoWindow = d3.select("#infoWindow");
    let previousDay = getPreviousDate(latelyDate, 1, 0); 
    let twopreviousDay = getPreviousDate(latelyDate, 2, 0); 


    if (!jsonData[countryName]) {
        //infoWindow.html(`${countryName} Data not available`).style("display", "block");
        return;
    }

    const marketData = jsonData[countryName].Market;
    let infoWindowContent = `<strong>${countryName}</strong><br><hr><strong>Stock Market:</strong><br>`;
    let isContentAdded = false;

    for (let market in marketData) {
        let adjCloseData = marketData[market].map(entry => {
            return {
                date: new Date(entry.Date), 
                value: parseFloat(entry['Adj Close'])}});
        let adj_linePlot = createLinePlot(adjCloseData, 200, 100);

        let marketEntry = marketData[market].find(entry => entry.Date.startsWith(latelyDate));
        let onepdmarketEntry = marketData[market].find(entry => entry.Date.startsWith(previousDay));
        if (marketEntry && marketEntry['Adj Close'] && onepdmarketEntry && onepdmarketEntry['Adj Close']) {
            let adjClose = parseFloat(marketEntry['Adj Close']);
            let prev_adjClose = parseFloat(onepdmarketEntry['Adj Close']);
            let day_growth = adjClose - prev_adjClose;

            infoWindowContent += `${market}: ${adjClose.toLocaleString()}<br>`;

            if (isNaN(day_growth)) {
                day_growth = 0;
            }
            if (day_growth > 0) {
                infoWindowContent += ` <span style="color: red;">&#9650; +${day_growth.toLocaleString()}</span>  from previous day<br>`;
            } else {
                infoWindowContent += ` <span style="color: blue;">&#9660; ${day_growth.toLocaleString()}</span>  from previous day<br>`;
            }
            infoWindowContent += `<br><br><div>${adj_linePlot}</div>`;
            isContentAdded = true;
        }
    }

    if (isContentAdded) {
        infoWindowContent += "<hr>";
    }

    if (jsonData[countryName].Currency) {
        let currencyData = jsonData[countryName].Currency;
        let currency_array = jsonData[countryName]["Currency"].map(entry => {
            return {
                date: new Date(entry.Date),
                value: parseFloat(entry.value)
            }
        });
        let currency_lineplot = createCurrencyLinePlot(currency_array, 200, 100);
        let currencyEntry = currencyData.find(entry => entry.Date.startsWith(latelyDate));
        let onepdcurrencyEntry = currencyData.find(entry => entry.Date.startsWith(twopreviousDay));

        if (currencyEntry && currencyEntry.value && onepdcurrencyEntry && onepdcurrencyEntry.value) {
            let currencyRounded = parseFloat(currencyEntry.value);
            let prev_currencyRounded = parseFloat(onepdcurrencyEntry.value);
            let day_growth_currency = currencyRounded - prev_currencyRounded;

            infoWindowContent += `<strong>$ Exchange Rate:</strong><br>${currencyRounded.toLocaleString()}<br>`;

            if (isNaN(day_growth_currency)) {
                day_growth_currency = 0;
            }
            if (day_growth_currency > 0) {
                infoWindowContent += ` <span style="color: red;">&#9650; +${day_growth_currency.toLocaleString()}</span>  from previous day<br>`;
            } else {
                infoWindowContent += ` <span style="color: blue;">&#9660; ${day_growth_currency.toLocaleString()}</span>  from previous day<br>`;
            }
        } else {
            infoWindowContent += `Currency data not available<br>`;
        } infoWindowContent += `<br><br><div>${currency_lineplot}</div>`;
    }

    infoWindow.html(infoWindowContent).style("display", "block");
}

// infoWindow 클릭 이벤트 핸들러 활성화
d3.select("#infoWindow").on("click", function() {
    d3.select(this).style("display", "none");
});


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
        .on("click", countryClick);
});
