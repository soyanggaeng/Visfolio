document.addEventListener('DOMContentLoaded', function() {
    document.querySelector("h2").textContent = `Global Financial Market on ${showDate}`;
});

document.querySelector("h2").textContent = `Global Financial Market on ${showDate}`;

// Set dimensions and margins for the treemap
const width = 300;
const height = 400;
const margin = { top: 10, right: 10, bottom: 10, left: 10 };

// Function to create a treemap
function createTreemap(data, containerId) {
    // Create a tooltip div
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip") // Style this in CSS
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background", "rgba(0, 0, 0, 0.6)")
        .style("color", "white")
        .style("padding", "5px")
        .style("border-radius", "5px")
        .style("pointer-events", "none"); // Ignore pointer events on the tooltip

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
        .style("fill", d => d.data.Change > 0 ? "red" : "blue") // Color based on 'Change'
        .on('mouseover', (event, d) => {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Name: ${d.data.name}<br>Market Cap: ${d.data.MC.toLocaleString()}<br>Change: ${d.data.Change.toLocaleString()}%`)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on('mouseout', () => {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    svg.selectAll("text")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("x", d => d.x0 + 5)    
        .attr("y", d => d.y0 + 20)    
        .text(d => {
            const maxChars = (d.x1 - d.x0) / 15; 
            let name = d.data.name;
            return name.length > maxChars ? name.substring(0, maxChars) + '...' : name;
        })
        .style("font-size", d => `${Math.min(20, (d.x1 - d.x0) / 5)}px`)
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
