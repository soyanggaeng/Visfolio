// Set dimensions and margins for the treemap
const width = 300;
const height = 400;
const margin = { top: 10, right: 10, bottom: 10, left: 10 };

// Function to create a treemap
function createTreemap(data, containerId) {
    let leaves = d3.hierarchy(data).leaves();
    leaves.sort((a, b) => b.data.MC - a.data.MC);
    leaves = leaves.slice(0, 20);

    const root = d3.hierarchy({name: "Root", children: leaves.map(d => d.data)})
        .sum(d => d.MC)
        .sort((a, b) => b.value - a.value);

    d3.treemap()
        .size([width - margin.left - margin.right, height - margin.top - margin.bottom])
        .padding(1)
        (root);

    const svg = d3.select(containerId)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    svg.selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("rect")
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .style("fill", d => d.data.Change > 0 ? "red" : "blue");  // Color based on 'Change'

    svg.selectAll("text")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("x", d => d.x0 + 5)    
        .attr("y", d => d.y0 + 20)    
        .text(d => d.data.name)
        .style("font-size", d => `${Math.min(20, (d.x1 - d.x0) / 5)}px`) // Dynamic font size
        .attr("fill", "white")
        .call(wrap, (d) => d.x1 - d.x0); // Wrap text function call
}

// Function to wrap text in SVG
function wrap(text, width) {
    text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy") || 0),
            tspan = text.text(null).append("tspan").attr("x", text.attr("x")).attr("y", y).attr("dy", dy + "em");
        
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", text.attr("x")).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }
    });
}

// Tooltip setup (using d3-tip)
const tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(d => `Name: ${d.data.name}<br>Market Cap: ${d.data.MC}<br>Change: ${d.data.Change}%`);

// Call the tooltip in the svg
svg.call(tip);

// On mouseover, call the tooltip
svg.selectAll("rect")
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);

// Load the data and create the treemaps
d3.json("data/Kospi_20231109.json").then(data => {
    createTreemap(data, "#treemapKospi");
});

d3.json("data/Kosdaq_20231109.json").then(data => {
    createTreemap(data, "#treemapKosdaq");
});

d3.json("data/KONEX_20231109.json").then(data => {
    createTreemap(data, "#treemapKonex");
});

d3.json("data/Nasdaq_20231109.json").then(data => {
    createTreemap(data, "#treemapNasdaq");
});

d3.json("data/NYSE_20231109.json").then(data => {
    createTreemap(data, "#treemapNyse");
});

d3.json("data/AMEX_20231109.json").then(data => {
    createTreemap(data, "#treemapAmex");
});
