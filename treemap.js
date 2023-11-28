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
        .attr("font-size", "15px")
        .attr("fill", "white");
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
