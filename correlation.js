// set the dimensions and margins of the graph
const margin = {top: 80, right: 25, bottom: 30, left: 30},
  width = 480 - margin.left - margin.right,
  height = 480 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Populate start year and end year options
document.addEventListener('DOMContentLoaded', function () {
  const startYearSelect = document.getElementById('startYearSelect');
  const endYearSelect = document.getElementById('endYearSelect');

  for (let year = 1990; year <= 2024; year++) {
    const optionStart = document.createElement('option');
    const optionEnd = document.createElement('option');

    optionStart.value = year;
    optionStart.textContent = year;
    startYearSelect.appendChild(optionStart);

    optionEnd.value = year;
    optionEnd.textContent = year;
    endYearSelect.appendChild(optionEnd);
  }
});

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

document.addEventListener('DOMContentLoaded', function () {
  // Define the number of select boxes (you mentioned market1 to market10)
  const numberOfSelects = 10;

  // Define the options for the market selection
  const marketOptions = ['Kospi', 'Kosdaq', 'KONEX', 'AMEX', 'NYSE', 'Nasdaq'];

  // Loop through each select box
  for (let i = 1; i <= numberOfSelects; i++) {
      // Select each market select box by its ID
      const marketSelect = document.getElementById(`market${i}`);

      // Populate the market selection dropdown
      marketOptions.forEach(option => {
          const optionElement = document.createElement('option');
          optionElement.value = option;
          optionElement.textContent = option;
          marketSelect.appendChild(optionElement);
      });
  }
});

// document.addEventListener('DOMContentLoaded', function () {
//   const jsonURL = 'data/market-items.json';

//   // Fetch JSON data
//   fetch(jsonURL)
//       .then(response => response.json())
//       .then(data => {
//           // Function to update items based on selected market
//           function updateItems(market, index) {
//               const selectedItemDropdown = document.getElementById(`item${index}`);
//               selectedItemDropdown.innerHTML = '<option value="" disabled selected>Item</option>';

//               // Get items based on selected market
//               const items = data[market];

//               // Populate items in the Item dropdown
//               items.forEach(item => {
//                   const option = document.createElement('option');
//                   option.value = item;
//                   option.textContent = item;
//                   selectedItemDropdown.appendChild(option);
//               });
//           }

//           // Populate Market dropdown options
//           const markets = ['Kospi', 'Kosdaq', 'KONEX', 'AMEX', 'NYSE', 'Nasdaq'];
//           for (let i = 1; i <= 10; i++) {
//               const marketDropdown = document.getElementById(`market${i}`);
//               markets.forEach(market => {
//                   const option = document.createElement('option');
//                   option.value = market;
//                   option.textContent = market;
//                   marketDropdown.appendChild(option);
//               });

//               marketDropdown.addEventListener('change', function () {
//                   const selectedMarket = this.value;
//                   updateItems(selectedMarket, i);
//               });
//           }
//       })
//       .catch(error => {
//           console.error('Error fetching JSON:', error);
//       });
// });
// document.addEventListener('DOMContentLoaded', function () {
//   const jsonURL = 'data/market-items.json';

//   // Fetch JSON data
//   fetch(jsonURL)
//       .then(response => response.json())
//       .then(data => {
//           // Select all Market and Item dropdowns
//           const marketDropdowns = document.querySelectorAll('select[name="market"]');
//           const itemDropdowns = document.querySelectorAll('select[name="item"]');

//           // Function to update items based on selected market
//           function updateItems(market, index) {
//               const selectedItemDropdown = itemDropdowns[index - 1];
//               selectedItemDropdown.innerHTML = '<option value="" disabled selected>Item</option>';
              
//               // Get items based on selected market
//               const items = data[market];

//               // Populate items in the Item dropdown
//               items.forEach(item => {
//                   const option = document.createElement('option');
//                   option.value = item;
//                   option.textContent = item;
//                   selectedItemDropdown.appendChild(option);
//               });
//           }

//           // Event listener for Market dropdown change
//           marketDropdowns.forEach((marketDropdown, index) => {
//               marketDropdown.addEventListener('change', function () {
//                   const selectedMarket = this.value;
//                   updateItems(selectedMarket, index + 1);
//               });
//           });

//           // Populate Market dropdown options
//           const markets = ['Kospi', 'Kosdaq', 'KONEX', 'AMEX', 'NYSE', 'Nasdaq'];
//           marketDropdowns.forEach(marketDropdown => {
//               markets.forEach(market => {
//                   const option = document.createElement('option');
//                   option.value = market;
//                   option.textContent = market;
//                   marketDropdown.appendChild(option);
//               });
//           });
//       })
//       .catch(error => {
//           console.error('Error fetching JSON:', error);
//       });
// });
// items 선택하는 박스
// document.addEventListener('DOMContentLoaded', function () {
//   const assetSelection = document.getElementById('assetSelection');

//   for (let i = 1; i <= 10; i++) {
//       const rowDiv = document.createElement('div');
//       rowDiv.className = 'row asset-row';

//       const assetLabelDiv = document.createElement('div');
//       assetLabelDiv.className = 'col-md-1 separateTop';
//       assetLabelDiv.textContent = `Asset ${i}`;

//       const assetColumnDiv = document.createElement('div');
//       assetColumnDiv.className = 'col-md-11';

//       const selectGroupDiv = document.createElement('div');
//       selectGroupDiv.className = 'input-group flex-nowrap smallMargin select-stock';

//       const marketSelect = createSelectElement(`market${i}`, 'Market');
//       marketSelect.style.width = '150px'; // Adjust the width here as needed

//       const itemSelect = createSelectElement(`item${i}`, 'Item');
//       itemSelect.style.width = '150px'; // Adjust the width here as needed

//       selectGroupDiv.appendChild(marketSelect);
//       selectGroupDiv.appendChild(itemSelect);

//       assetColumnDiv.appendChild(selectGroupDiv);

//       rowDiv.appendChild(assetLabelDiv);
//       rowDiv.appendChild(assetColumnDiv);

//       assetSelection.appendChild(rowDiv);
//   }
// });

// document.addEventListener('DOMContentLoaded', function () {
//   const assetSelection = document.getElementById('assetSelection');

//   for (let i = 1; i <= 10; i++) {
//       const rowDiv = document.createElement('div');
//       rowDiv.className = 'row asset-row';

//       const assetLabelDiv = document.createElement('div');
//       assetLabelDiv.className = 'col-md-1 separateTop';
//       assetLabelDiv.textContent = `Asset ${i}`;

//       const assetColumnDiv = document.createElement('div');
//       assetColumnDiv.className = 'col-md-11'; // Column size adjusted to accommodate both selects

//       const selectGroupDiv = document.createElement('div');
//       selectGroupDiv.className = 'input-group flex-nowrap smallMargin select-stock';

//       const marketSelect = createSelectElement(`market${i}`, 'Market');
//       const itemSelect = createSelectElement(`item${i}`, 'Item');

//       selectGroupDiv.appendChild(marketSelect);
//       selectGroupDiv.appendChild(itemSelect);

//       assetColumnDiv.appendChild(selectGroupDiv);

//       rowDiv.appendChild(assetLabelDiv);
//       rowDiv.appendChild(assetColumnDiv);

//       assetSelection.appendChild(rowDiv);
//   }
// });

function createSelectElement(id, placeholder) {
  const select = document.createElement('select');
  select.id = id;
  select.name = id;
  select.className = 'form-control form-select';
  const option = document.createElement('option');
  option.value = '';
  option.textContent = placeholder;
  option.disabled = true;
  option.selected = true;
  select.appendChild(option);
  // Add more options specific to the select here
  return select;
}
//##############
document.addEventListener('DOMContentLoaded', function () {
  const selectionBoxes = document.getElementById('selectionBoxes');

  for (let i = 1; i <= 10; i++) {
    const marketSelect = document.createElement('select');
    marketSelect.id = `market${i}`;
    marketSelect.className = 'marketSelect';

    const itemSelect = document.createElement('select');
    itemSelect.id = `item${i}`;
    itemSelect.className = 'itemSelect';

    const defaultOptions = ['Kospi', 'Kosdaq', 'KONEX', 'AMEX', 'NYSE', 'Nasdaq'];
    defaultOptions.forEach(option => {
      const marketOption = document.createElement('option');
      marketOption.value = option;
      marketOption.textContent = option;
      marketSelect.appendChild(marketOption);
    });

    selectionBoxes.appendChild(marketSelect);
    selectionBoxes.appendChild(itemSelect);

    // Event listener for market selection
    marketSelect.addEventListener('change', function () {
      const selectedMarket = this.value;
      const itemOptions = getItemOptions(selectedMarket);
      itemSelect.innerHTML = '';

      itemOptions.forEach(item => {
        const itemOption = document.createElement('option');
        itemOption.value = item;
        itemOption.textContent = item;
        itemSelect.appendChild(itemOption);
      });
    });

    // Event listener for item selection
    itemSelect.addEventListener('change', function () {
      const selectedItems = [...this.selectedOptions].map(option => option.value);
      console.log(`Selected Items for Item${i}:`, selectedItems);
    });
  }
});

// // Country와 Market
// document.addEventListener('DOMContentLoaded', function() {
//   const marketSelect = document.getElementById('market');
//   const defaultOptions = ['Kospi', 'Kosdaq', 'KONEX'];

//   defaultOptions.forEach(option => {
//     const marketOption = document.createElement('option');
//     marketOption.value = option;
//     marketOption.textContent = option;
//     marketSelect.appendChild(marketOption);
//   });

//   // Handle country selection to populate market options
//   const countrySelect = document.getElementById('country');
//   countrySelect.addEventListener('change', function() {
//     marketSelect.innerHTML = '';

//     const selectedCountry = this.value;
//     const marketOptions = selectedCountry === 'Korea' ?
//       ['Kospi', 'Kosdaq', 'KONEX'] :
//       ['AMEX', 'NYSE', 'Nasdaq'];

//     marketOptions.forEach(option => {
//       const marketOption = document.createElement('option');
//       marketOption.value = option;
//       marketOption.textContent = option;
//       marketSelect.appendChild(marketOption);
//     });
//   });
// });

///////////////
// document.addEventListener('DOMContentLoaded', function () {
//   const selectedItemsContainer = document.getElementById('selectedItemsContainer');
//   const marketsAndItemsDiv = document.createElement('div');
//   marketsAndItemsDiv.id = 'marketsAndItems';

//   for (let i = 1; i <= 10; i++) {
//     const assetLabel = document.createElement('label');
//     assetLabel.textContent = `Asset${i}: `;
//     const assetDiv = document.createElement('div');
//     assetDiv.className = 'assetDiv';

//     const marketSelect = document.createElement('select');
//     marketSelect.className = 'marketSelect';
//     marketSelect.id = `market_${i}`;

//     const itemSelect = document.createElement('select');
//     itemSelect.className = 'itemSelect';
//     itemSelect.id = `item_${i}`;

//     const defaultOptions = ['Kospi', 'Kosdaq', 'KONEX', 'AMEX', 'NYSE', 'Nasdaq'];
//     defaultOptions.forEach(option => {
//       const marketOption = document.createElement('option');
//       marketOption.value = option;
//       marketOption.textContent = option;
//       marketSelect.appendChild(marketOption);
//     });

//     assetDiv.appendChild(assetLabel);
//     assetDiv.appendChild(marketSelect);
//     assetDiv.appendChild(itemSelect);
//     marketsAndItemsDiv.appendChild(assetDiv);
//   }

//   selectedItemsContainer.appendChild(marketsAndItemsDiv);
// });

// Items 리스트 가져오기
// Function to fetch data from the file_names.json file
async function fetchData() {
  const response = await fetch('data/file_names.json');
  const data = await response.json();
  return data;
}


// // Handle item selection and display
// const itemsSelect = document.getElementById('items');
// const countrySelect = document.getElementById('country');
// const marketSelect = document.getElementById('market');
// const selectedItemsList = document.getElementById('selectedItemsList');

// function populateItems(country, market) {
//   fetchData().then(data => {
//     itemsSelect.innerHTML = '';
//     const companies = data[country][market];
//     companies.forEach(company => {
//       const option = document.createElement('option');
//       option.value = company;
//       option.textContent = company;
//       itemsSelect.appendChild(option);
//     });
//   });
// }

// countrySelect.addEventListener('change', function() {
//   const selectedCountry = this.value;
//   const selectedMarket = marketSelect.value;
//   populateItems(selectedCountry, selectedMarket);
// });

// marketSelect.addEventListener('change', function() {
//   const selectedCountry = countrySelect.value;
//   const selectedMarket = this.value;
//   populateItems(selectedCountry, selectedMarket);
// });

// itemsSelect.addEventListener('change', function() {
//   const selectedItems = [...this.selectedOptions].map(option => option.value);
//   console.log('Selected Items:', selectedItems);

//   // Display selected items
//   selectedItemsList.innerHTML = '';
//   selectedItems.forEach(item => {
//     const li = document.createElement('li');
//     li.textContent = item;
//     selectedItemsList.appendChild(li);
//   });

//   // Show the message to select up to 10 items
//   const remainingCount = 10 - selectedItems.length;
//   const message = remainingCount > 0 ? `Select ${remainingCount} more items` : 'Maximum items selected (10)';
//   alert(message);
// });

// // Handle item selection and display
// const itemsSelect = document.getElementById('items');
// const countrySelect = document.getElementById('country');
// const marketSelect = document.getElementById('market');
// const selectedItemsDiv = document.getElementById('selectedItems');

// function populateItems(country, market) {
//   fetchData().then(data => {
//     itemsSelect.innerHTML = '';
//     const companies = data[country][market];
//     companies.forEach(company => {
//       const option = document.createElement('option');
//       option.value = company;
//       option.textContent = company;
//       itemsSelect.appendChild(option);
//     });
//   });
// }

// countrySelect.addEventListener('change', function() {
//   const selectedCountry = this.value;
//   const selectedMarket = marketSelect.value;
//   populateItems(selectedCountry, selectedMarket);
// });

// marketSelect.addEventListener('change', function() {
//   const selectedCountry = countrySelect.value;
//   const selectedMarket = this.value;
//   populateItems(selectedCountry, selectedMarket);
// });

// itemsSelect.addEventListener('change', function() {
//   const selectedItems = [...this.selectedOptions].map(option => option.value);
//   updateSelectedItems(selectedItems);
// });

// // Function to populate markets and items for a given country
// function populateMarketsAndItems(country) {
//   fetchData().then(data => {
//     const marketsAndItemsDiv = document.getElementById('marketsAndItems');
//     marketsAndItemsDiv.innerHTML = '';

//     for (let i = 0; i < 10; i++) {
//       const marketSelect = document.createElement('select');
//       marketSelect.className = 'marketSelect';
//       marketSelect.id = `market_${i}`;
//       // Populate markets based on the selected country
//       const markets = data[country];
//       // Create an option for each market
//       markets.forEach(market => {
//         const option = document.createElement('option');
//         option.value = market;
//         option.textContent = market;
//         marketSelect.appendChild(option);
//       });

//       const itemsSelect = document.createElement('select');
//       itemsSelect.className = 'itemsSelect';
//       itemsSelect.id = `items_${i}`;
//       // Populate items based on the selected country and market
//       const items = data[country][markets[0]]; // Assuming first market initially
//       // Create an option for each item
//       items.forEach(item => {
//         const option = document.createElement('option');
//         option.value = item;
//         option.textContent = item;
//         itemsSelect.appendChild(option);
//       });

//       // Add market and items selection boxes to the marketsAndItemsDiv
//       marketsAndItemsDiv.appendChild(marketSelect);
//       marketsAndItemsDiv.appendChild(itemsSelect);
//     }
//   });
// }

// document.getElementById('country').addEventListener('change', function () {
//   const selectedCountry = this.value;
//   populateMarketsAndItems(selectedCountry);
// });

// // Initial population based on default values (assuming 'Korea' as default country)
// populateMarketsAndItems('Korea');

//######
// function updateSelectedItems(selectedItems) {
//   selectedItemsDiv.innerHTML = '';
//   selectedItems.slice(0, 10).forEach(item => {
//     const selectedItem = document.createElement('div');
//     selectedItem.className = 'selectedItem';
//     const itemText = document.createElement('span');
//     itemText.textContent = item;
//     const removeButton = document.createElement('button');
//     removeButton.textContent = 'x';
//     removeButton.addEventListener('click', () => {
//       itemsSelect.querySelector(`[value="${item}"]`).selected = false;
//       const updatedSelectedItems = [...itemsSelect.selectedOptions].map(option => option.value);
//       updateSelectedItems(updatedSelectedItems);
//     });
//     selectedItem.appendChild(itemText);
//     selectedItem.appendChild(removeButton);
//     selectedItemsDiv.appendChild(selectedItem);
//   });
// }

// function updateSelectedItems(selectedItems) {
//   selectedItemsDiv.innerHTML = '<h3>Selected Items: </h3>'; // Update the header
//   const selectedItemsContainer = document.createElement('div');
//   selectedItemsContainer.className = 'selectedItemsContainer'; // Added a new class

//   selectedItems.slice(0, 10).forEach(item => {
//     const selectedItem = document.createElement('div');
//     selectedItem.className = 'selectedItem';
//     const itemText = document.createElement('span');
//     itemText.textContent = item;
//     const removeButton = document.createElement('button');
//     removeButton.textContent = 'x';
//     removeButton.addEventListener('click', () => {
//       itemsSelect.querySelector(`[value="${item}"]`).selected = false;
//       const updatedSelectedItems = [...itemsSelect.selectedOptions].map(option => option.value);
//       updateSelectedItems(updatedSelectedItems);
//     });
//     selectedItem.appendChild(itemText);
//     selectedItem.appendChild(removeButton);
//     selectedItemsContainer.appendChild(selectedItem); // Appending each selected item to the container
//   });

//   selectedItemsDiv.appendChild(selectedItemsContainer); // Append the container to the main div
// }

// function updateSelectedItems(selectedItems) {
//   selectedItemsDiv.innerHTML = '<h3>Selected Items: </h3>'; // Update the header
//   const selectedItemsContainer = document.createElement('div');
//   selectedItemsContainer.className = 'selectedItemsContainer'; // Added a new class

//   selectedItems.slice(0, 10).forEach(item => {
//     const selectedItem = document.createElement('div');
//     selectedItem.className = 'selectedItem';
//     const itemText = document.createElement('span');
//     itemText.textContent = item;
//     const removeButton = document.createElement('button');
//     removeButton.textContent = 'x';
//     removeButton.addEventListener('click', () => {
//       itemsSelect.querySelector(`[value="${item}"]`).selected = false;
//       const updatedSelectedItems = [...itemsSelect.selectedOptions].map(option => option.value);
//       updateSelectedItems(updatedSelectedItems);
//     });
//     selectedItem.appendChild(itemText);
//     selectedItem.appendChild(removeButton);
//     selectedItemsContainer.appendChild(selectedItem); // Appending each selected item to the container
//   });

//   selectedItemsDiv.appendChild(selectedItemsContainer); // Append the container to the main div
// }

//Read the data
//d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv").then(function(data) {

// d3.json("data/correlation_matrix.json")
//   .then(function(data) {
//     // Your code to work with the loaded JSON data goes here
//     console.log(data); // Example: Displaying the loaded JSON data
//   })
//   .catch(function(error) {
//     // Handle any potential error while loading the JSON file
//     console.error('Error loading the JSON file:', error);
//   });

// d3.json("./data/correlation_matrix.json").then(function(data) {
  
//   // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
//   const myGroups = Array.from(new Set(data.map(d => d.group)))
//   const myVars = Array.from(new Set(data.map(d => d.variable)))

//   // Build X scales and axis:
//   const x = d3.scaleBand()
//     .range([ 0, width ])
//     .domain(myGroups)
//     .padding(0.05);
//   svg.append("g")
//     .style("font-size", 15)
//     .style("color", "black") 
//     .attr("transform", `translate(0, ${height})`)
//     .call(d3.axisBottom(x).tickSize(0))
//     .select(".domain").remove()

//   // Build Y scales and axis:
//   const y = d3.scaleBand()
//     .range([ height, 0 ])
//     .domain(myVars)
//     .padding(0.05);
//   svg.append("g")
//     .style("font-size", 15)
//     .style("color", "black") 
//     .call(d3.axisLeft(y).tickSize(0))
//     .select(".domain").remove()

//   // Build color scale
//   const myColor = d3.scaleSequential()
//     .interpolator(d3.interpolateInferno)
//     .domain([1,100])

//   // create a tooltip
//   const tooltip = d3.select("#my_dataviz")
//     .append("div")
//     .style("opacity", 0)
//     .style("color", "black") 
//     .attr("class", "tooltip")
//     .style("background-color", "white")
//     .style("border", "solid")
//     .style("border-width", "2px")
//     .style("border-radius", "5px")
//     .style("padding", "5px")

//   // Three function that change the tooltip when user hover / move / leave a cell
//   const mouseover = function(event,d) {
//     tooltip
//       .style("opacity", 1)
//       .style("left", (event.pageX + 10) + "px") // Set left position relative to pageX
//       .style("top", (event.pageY -20) + "px") // Set top position relative to pageY
//     d3.select(this)
//       .style("stroke", "black")
//       .style("opacity", 1)
//   }

//   const mousemove = function(event,d) {
//     tooltip
//       .html("The exact value of<br>this cell is: " + d.value)
//   }

//   const mouseleave = function(event,d) {
//     tooltip
//       .style("opacity", 0)
//     d3.select(this)
//       .style("stroke", "none")
//       .style("opacity", 0.8)
//   }

//   // add the squares
//   svg.selectAll()
//     .data(data, function(d) {return d.group+':'+d.variable;})
//     .join("rect")
//       .attr("x", function(d) { return x(d.group) })
//       .attr("y", function(d) { return y(d.variable) })
//       .attr("rx", 4)
//       .attr("ry", 4)
//       .attr("width", x.bandwidth() )
//       .attr("height", y.bandwidth() )
//       .style("fill", function(d) { return myColor(d.value)} )
//       .style("stroke-width", 4)
//       .style("stroke", "none")
//       .style("opacity", 0.8)
//     .on("mouseover", mouseover)
//     .on("mousemove", mousemove)
//     .on("mouseleave", mouseleave)
// })

// // Add title to graph
// svg.append("text")
//         .attr("x", 0)
//         .attr("y", -50)
//         .attr("text-anchor", "left")
//         .style("font-size", "22px")
//         .text("Close Correlation Heatmap");

// // Add subtitle to graph
// svg.append("text")
//         .attr("x", 0)
//         .attr("y", -20)
//         .attr("text-anchor", "left")
//         .style("font-size", "14px")
//         .style("fill", "grey")
//         .style("max-width", 400)
//         .text("몇 년도부터 상관관계를 계산한 것인지 나타내주기");


// var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
// var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
//   return new bootstrap.Tooltip(tooltipTriggerEl)
// })

// // JavaScript to populate the start year and end year select elements

// document.addEventListener("DOMContentLoaded", function () {
//   // Get references to the select elements
//   const startYearSelect = document.getElementById("startYearSelect");
//   const endYearSelect = document.getElementById("endYearSelect");

//   // Get the current year
//   const currentYear = new Date().getFullYear();

//   // Populate the start year select element
//   for (let year = 1990; year <= currentYear; year++) {
//       let option = new Option(year, year);
//       startYearSelect.add(option);
//   }

//   // Populate the end year select element
//   for (let year = 1990; year <= currentYear; year++) {
//       let option = new Option(year, year);
//       endYearSelect.add(option);
//   }
// });

// function test() {
//   var resultContent = document.getElementById("result-content");
//   if (resultContent.style.display === "none") {
//       resultContent.style.display = "block";
//   } else {
//       resultContent.style.display = "none";
//   }
// }

// function showResults() {
//   document.getElementById('result-content').style.display = 'block';
//   // Additional logic if needed
// }


// ///////////////////////////////////////////
// // set the dimensions and margins of the graph
// var margin = {top: 30, right: 30, bottom: 30, left: 30},
//   width = 450 - margin.left - margin.right,
//   height = 450 - margin.top - margin.bottom;

// // append the svg object to the body of the page
// var svg = d3.select("heatmap-container")
// .append("svg")
//   .attr("width", width + margin.left + margin.right)
//   .attr("height", height + margin.top + margin.bottom)
// .append("g")
//   .attr("transform",
//         "translate(" + margin.left + "," + margin.top + ")");

// // Labels of row and columns
// var myGroups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
// var myVars = ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10"]

// // Build X scales and axis:
// var x = d3.scaleBand()
//   .range([ 0, width ])
//   .domain(myGroups)
//   .padding(0.01);
// svg.append("g")
//   .attr("transform", "translate(0," + height + ")")
//   .call(d3.axisBottom(x))

// // Build X scales and axis:
// var y = d3.scaleBand()
//   .range([ height, 0 ])
//   .domain(myVars)
//   .padding(0.01);
// svg.append("g")
//   .call(d3.axisLeft(y));

// // Build color scale
// var myColor = d3.scaleLinear()
//   .range(["white", "#69b3a2"])
//   .domain([1,100])

// //Read the data
// d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv", function(data) {

//   // create a tooltip
//   var tooltip = d3.select("#heatmap-container")
//     .append("div")
//     .style("opacity", 0)
//     .attr("class", "tooltip")
//     .style("background-color", "white")
//     .style("border", "solid")
//     .style("border-width", "2px")
//     .style("border-radius", "5px")
//     .style("padding", "5px")

//   // Three function that change the tooltip when user hover / move / leave a cell
//   var mouseover = function(d) {
//     tooltip.style("opacity", 1)
//   }
//   var mousemove = function(d) {
//     tooltip
//       .html("The exact value of<br>this cell is: " + d.value)
//       .style("left", (d3.mouse(this)[0]+70) + "px")
//       .style("top", (d3.mouse(this)[1]) + "px")
//   }
//   var mouseleave = function(d) {
//     tooltip.style("opacity", 0)
//   }

//   // add the squares
//   svg.selectAll()
//     .data(data, function(d) {return d.group+':'+d.variable;})
//     .enter()
//     .append("rect")
//       .attr("x", function(d) { return x(d.group) })
//       .attr("y", function(d) { return y(d.variable) })
//       .attr("width", x.bandwidth() )
//       .attr("height", y.bandwidth() )
//       .style("fill", function(d) { return myColor(d.value)} )
//     .on("mouseover", mouseover)
//     .on("mousemove", mousemove)
//     .on("mouseleave", mouseleave)
// })


// // 웹페이지에서 입력한 정보를 변수로 받아서, 파이썬 코드로 전처리 후에
// // json 형태로 corr_data에 보내주기

// // vl
// //   .markRect(({tooltip: {"content": "data"}, clip: true}))
// //   .data(corr_data)
// //   .encode(
// //     vl.x().fieldN('key1'),
// //     vl.y().fieldN('key2'),
// //     vl.color().fieldQ('cor'),
// //   )
// //   .render()

// ///////////////////////////////////////////

//   // Load data based on selected market and sector
// function loadData() {
//     const market = document.getElementById('marketSelect').value;
//     const sector = document.getElementById('stockSelect').value;
//     const namesSelect = document.getElementById('companySelect');
//     const selectedNames = [];
//     const selectedOptions = namesSelect && namesSelect.options;
    
//     // Get the selected companies
//     for (let i = 0; i < selectedOptions.length; i++) {
//       if (selectedOptions[i].selected) {
//         selectedNames.push(selectedOptions[i].value);
//       }
//     }
  
//     // Send data to server-side Python script for processing
//     fetch('/process_data', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         market: market,
//         sector: sector,
//         names: selectedNames,
//       }),
//     })
//     .then(response => response.json())
//     .then(correlationData => {
//       // Call function to render heatmap using d3 with correlationData
//       renderHeatmap(correlationData);
//     })
//     .catch(error => console.error('Error:', error));
//   }
  
//   // Function to render heatmap using d3.js
//   function renderHeatmap(data) {
//     // Your d3.js code to render the heatmap using 'data'
//     // Example code using d3 can be placed here
//     // Use 'data' to draw the heatmap
//     console.log(data); // Sample log, replace with your d3.js code
//   }
  
//   // Event listener for changes in market and stock selections
//   document.getElementById('marketSelect').addEventListener('change', loadData);
//   document.getElementById('stockSelect').addEventListener('change', loadData);
  
//   // Initialize on page load
//   loadData();





// // $(function() {
//         //     $("form").submit(function(e){
//         //         e.preventDefault();
//         //         let $inputs = $("input, textarea, select", this);
//         //         param = "asset1_rate01=10&aset1_rate02=05";
//         //         d3.json(`http://localhost:5001/data/efficient_frontier?${param}`, function(data){
                    
//         //         });
//         //     });


//         // analyze portfolio button
//         $("form").submit(function(e) {
//           e.preventDefault(); // Prevent normal form submission
//           let formData = $(this).serialize(); // Serialize form data

//           $.ajax({
//               url: "http://localhost:5001/api/analyze",
//               method: "POST",
//               data: formData,
//               success: function(response) {
//                   // Handle success - maybe update the UI with the response
//                   console.log("Form submitted successfully");
//               },
//               error: function(jqXHR, textStatus, errorThrown) {
//                   // Handle error
//                   console.error("Form submission failed: " + textStatus, errorThrown);
//               }
//           });
//       });


//           $(document).ready(function() {
//               loadMarketOptions();

//               $(".select-stock select[id^='market']").on("change", function() {
//                   let marketId = $(this).attr('id');
//                   let itemId = marketId.replace('market', 'item');
//                   loadItemList(itemId, $(this).val());
//               });
//           });


//           function loadMarketOptions() {
//               $.ajax({
//                   url: "http://localhost:5001/data/market_list", // Adjust port if needed
//                   method: "GET",
//                   success: function(data) {
//                       for (let i = 1; i <= 10; i++) {
//                           let marketSelect = $('#market' + i);
//                           marketSelect.empty(); // Clear existing options
//                           marketSelect.append('<option value="" disabled selected>Select Market</option>');
//                           data.forEach(function(market) {
//                               marketSelect.append('<option value="' + market.code + '">' + market.text + '</option>');
//                           });
//                       }
//                   },
//                   error: function(jqXHR, textStatus, errorThrown) {
//                       console.error("Error loading market options: " + textStatus, errorThrown);
//                   }
//               });
//           }


//           function loadItemList(itemId, selectedMarket) {
//   $.ajax({
//       url: "http://localhost:5001/data/item_list?market=" + encodeURIComponent(selectedMarket),
//       method: "GET",
//       success: function(data) {
//           let itemSelect = $('#' + itemId);
//           itemSelect.empty();
//           itemSelect.append('<option value="" disabled selected>Select Item</option>');

//           // Iterate over each optgroup
//           $.each(data, function(optgroupLabel, options) {
//               let optgroup = $('<optgroup>').attr('label', optgroupLabel);
//               options.forEach(function(option) {
//                   optgroup.append($('<option>').text(option));
//               });
//               itemSelect.append(optgroup);
//           });
//       },
//       error: function(jqXHR, textStatus, errorThrown) {
//           console.error("Error loading item options: " + textStatus, errorThrown);
//       }
//   });
// }
          


// $(document).ready(function() {
//   // Event listener for all item input fields
//   $("input[id^='item']").on('input', function() {
//     var inputId = $(this).attr('id');
//     var rowIndex = inputId.replace('item', '');
//     var market = $(`#market${rowIndex}`).val();
//     var query = $(this).val();
//     var dataListId = $(this).attr('list');

//     if (query.length < 3) { // Only search if at least 3 characters are typed
//       return;
//     }

//     // Adjust URL based on the selected market
//     var url = 'http://localhost:5001/data/search_items';
//     var params = { query: query, market: market };

//     $.ajax({
//       url: url,
//       method: 'GET',
//       data: params,
//       success: function(data) {
//         var dataList = $('#' + dataListId);
//         dataList.empty(); // Clear existing options

//         data.forEach(function(item) {
//           dataList.append($('<option>').val(item));
//         });
//       },
//       error: function(jqXHR, textStatus, errorThrown) {
//         console.error("Error loading item options: " + textStatus, errorThrown);
//       }
//     });
//   });
// });




// $(document).on('click', '.dropdown-item', function() {
//   $('#itemSearch').val($(this).text());
//   $('#itemDropdown').hide();
// });



// function toggleTimeframe1(){
// }

// function analize_portfolio(){
    
//     console.log("start data");
//     $.ajax({
//         method: "get",
//         dataType: "json",
//         url : "http://localhost:5001/data/efficient_frontier",
//         success: function (data) {
//             console.log(data);
//         },
//         error: function(jq, status, error){
//             console.log(jq);
//             console.log(status);
//             console.log(error);
//         }
//     });
// }



// $(document).ready(function() {
//   // Bind the validateAndSubmitForm function to the form's onsubmit event
//   $(".pv-form").on('submit', function(event) {
//       event.preventDefault(); // Prevent the default form submission
//       validateAndSubmitForm();
//   });

//   // Function to check validations and submit form
//   function validateAndSubmitForm() {
//     var errors = [];

//     // Check if all allocations have corresponding market and item
//     $('.asset-row').each(function() {
//         var market = $(this).find('select[name^="market"]').val();
//         var item = $(this).find('input[name^="item"]').val();
//         var itemOptions = $(`#itemList${$(this).index()}`).find('option').map(function() {
//             return $(this).val();
//         }).get();

//         for (let i = 1; i <= 3; i++) {
//             var allocation = parseFloat($(`input[name="allocation${$(this).index()}_${i}"]`).val()) || 0;
//             if (allocation > 0 && (!market || !item)) {
//                 errors.push('All allocations must have a corresponding market and item.');
//                 break;
//             }
//             // Check if the entered item is in the list
//             if (item && !itemOptions.includes(item)) {
//                 errors.push(`Item "${item}" is not valid or not in the list.`);
//                 break;
//             }
//         }
//     });

//     // Check if totals are 100
//     ['total1', 'total2', 'total3'].forEach(function(totalId) {
//         var totalValue = parseFloat($("#" + totalId).val()) || 0;
//         if (totalValue !== 100 && totalValue !== 0) {
//             errors.push(`Total allocation for Portfolio ${totalId.slice(-1)} must be exactly 100%.`);
//         }
//     });

//     // Check if at least one total is 100
//     var isOneTotalValid = ['total1', 'total2', 'total3'].some(function(totalId) {
//         var totalValue = parseFloat($("#" + totalId).val()) || 0;
//         return totalValue === 100;
//     });

//     if (!isOneTotalValid) {
//         errors.push('At least one portfolio total must be exactly 100%.');
//     }

//     // Display errors or submit form
//     if (errors.length > 0) {
//         displayErrors(errors);
//         hideResultSections();
//     } else {
//         $("#error-messages").hide();
//         createResultSections();
//         console.log('Form submitted'); // Replace with actual submission logic
//     }
// }

// // Function to display errors
// function displayErrors(errors) {
//     var errorHtml = errors.map(function(error) {
//         return `<div>${error}</div>`;
//     }).join('');
//     $("#error-messages").html(errorHtml).show();
// }


//   // Function to create result sections (only if validations pass)
//   function hideResultSections() {
//       // Clear previous results
//       $("#result-content").empty();
//   }
// });


// function createResultSections() {
//   // Clear previous results
//   $("#result-content").empty();

//   // Iterate over each total field and create a section if there's a value
//   ['total1', 'total2', 'total3'].forEach(function(totalId, portfolioIndex) {
//       var totalValue = parseFloat($("#" + totalId).val()) || 0;
//       if (totalValue > 0) {
//           // Start constructing the HTML for the section
//           var sectionHtml = `<div class="card my-3 result-section">
//                                 <div class="card-header bg-gradient fw-bold">
//                                     <h3>Portfolio ${portfolioIndex + 1}</h3>
//                                 </div>
//                                 <div class="card-body">
//                                     <div class="row" style="margin: 0">
//                                         <div class="col-md-8" style="padding-left: 0; padding-right: 15px;">
//                                             <table class="table table-striped table-sm">
//                                                 <thead>
//                                                     <tr>
//                                                         <th>Market</th>
//                                                         <th>Name</th>
//                                                         <th class="numberCell">Allocation</th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody class="table-group-divider">`;

//           // Iterate over each asset row to extract and add the data
//           $('.asset-row').each(function(rowIndex) {
//               if (rowIndex > 0) { // Skip the header row
//                   var market = $(`#market${rowIndex}`).val();
//                   var item = $(`#item${rowIndex}`).val();
//                   var allocation = $(`#allocation${rowIndex}_${portfolioIndex + 1}`).val();

//                   // Only add a row if market, item, and allocation are provided
//                   if (market && item && allocation) {
//                       sectionHtml += `<tr>
//                                           <td>${market}</td>
//                                           <td>${item}</td>
//                                           <td class="numberCell">${allocation}%</td>
//                                       </tr>`;
//                   }
//               }
//           });

//           // Close the table and the rest of the HTML structure
//           sectionHtml += `</tbody></table></div>
//                            <div class="col-md-4" style="padding-left: 100px ; padding-top: 50px">
//                                <div id="chartDiv${portfolioIndex + 1}" style="min-width: 250px; min-height: 250px; max-width: 380px; max-height: 380px; overflow: hidden;">
//                                    <!-- Chart will be inserted here -->
//                                </div>
//                            </div>
//                        </div>
//                    </div>
//                </div>`;

//           $("#result-content").append(sectionHtml);
//           generateCharts(portfolioIndex + 1);

//       }
//   });
// }

