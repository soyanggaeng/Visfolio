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

// The svg
const svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

// Map and projection
const path = d3.geoPath();
const projection = d3.geoMercator()
  .scale(150)
  .center([0,20])
  .translate([width / 2, height /2 ]);

// Data and color scale
const data = new Map();
const colorScale = d3.scaleThreshold()
  .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
  .range(d3.schemeBlues[7]);

// Load external data and boot
Promise.all([
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
]).then(function(loadData){
  let topo = loadData[0]

  let mouseOver = function(event, d) {
    d3.select(this)
    .style("opacity", 1)
    .style("stroke", "black") 
    .style("stroke-width", 2); 

    tooltip.transition()
        .duration(200)
        .style("opacity", 1)
        .style("visibility", "visible");
    tooltip.html("Loading data...") // Default text before data loads
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY + 10) + "px");

    // Fetch country-specific data
    const countryName = d.properties.name; // guess d is the geojson above.
    const latelyDate = "2023-11-02"
    fetch(`${countryName}.json`)
        .then(response => response.json())
        .then(countryData => {
            // Let's find the data for the specific date
            const specificDateData = countryData.find(entry => entry.Date === latelyDate)
            if (specificDateData) {
              tooltip.html(`Country: ${countryName}<br>Adj Close on ${latelyDate}: ${specificDateData["Adj Close"]}`);
            } else {
              tooltip.html(`No data available for ${countryName} on ${latelyDate}`);
            }
        })
        .catch(error => {
            tooltip.html("No data available for " + countryName);
        });
}

  let mouseLeave = function(d) {
    d3.select(this)
    .style("opacity", 0.8) 
    .style("stroke", "transparent") 
    .style("stroke-width", 0); 

    tooltip.transition()
        .duration(500)
        .style("opacity", 0)
        .style("visibility", "hidden");
}


  let clickCountry = function(event, d) {
    const countryName = d.properties.name; // Adjust based on your data structure
    const latelyDate = "2023-11-02"; // Specify the date you want to display data for

    // Fetch country-specific data
    fetch(`${countryName}.json`)
        .then(response => response.json())
        .then(countryData => {
            // Find the data for the specific date
            const specificDateData = countryData.find(entry => entry.Date === latelyDate);
            let slidingWindowContent;
            if (specificDateData) {
                slidingWindowContent = `Country: ${countryName}<br>Adj Close on ${latelyDate}: ${specificDateData["Adj Close"]}`;
            } else {
                slidingWindowContent = `No data available for ${countryName} on ${latelyDate}`;
            }

            // Update and show sliding window with country info
            let slidingWindow = d3.select("#sliding-window");
            slidingWindow.html(slidingWindowContent)
                          .style("position", "fixed")
                          .style("top", "0") // Adjust top position
                          .style("right", "0") // Position on the right
                          .style("height", "100%") // Full height
                          .style("width", "300px") // Adjust width as needed
                          .style("background", "white")
                          .style("transform", "translateX(0%)") // Slide in from right
                          .style("transition", "transform 0.3s ease-in-out");
        })
        .catch(error => {
            console.error("Error fetching data: ", error);
        });
  }


  svg.append("g")
  .selectAll("path")
  .data(topo.features)
  .enter()
  .append("path")
    // draw each country
    .attr("d", d3.geoPath().projection(projection))
    // set the color of each country
    .attr("fill", '#ccc')
    .style("stroke", "transparent")
    .attr("class", function(d){ return "Country" } )
    .style("opacity", .8)
    .on("mouseover", mouseOver )
    .on("mouseleave", mouseLeave )
    .on("click", clickCountry);

});

