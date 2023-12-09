var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

// JavaScript to populate the start year and end year select elements

document.addEventListener("DOMContentLoaded", function () {
  // Get references to the select elements
  const startYearSelect = document.getElementById("startYearSelect");
  const endYearSelect = document.getElementById("endYearSelect");

  // Get the current year
  const currentYear = new Date().getFullYear();

  // Populate the start year select element
  for (let year = 1990; year <= currentYear; year++) {
      let option = new Option(year, year);
      startYearSelect.add(option);
  }

  // Populate the end year select element
  for (let year = 1990; year <= currentYear; year++) {
      let option = new Option(year, year);
      endYearSelect.add(option);
  }
});

function test() {
  var resultContent = document.getElementById("result-content");
  if (resultContent.style.display === "none") {
      resultContent.style.display = "block";
  } else {
      resultContent.style.display = "none";
  }
}



function drawGraph(svg, data, x, y, index) {
  const parseTime = d3.timeParse("%Y-%m-%d");

  data.forEach(function(d) {
    d.date = parseTime(d.date);
    d.return = +d.return;
  });

  // Create the line generator using the passed scales
  const line = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.return));

  // Append the path for this dataset
  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", d3.schemeCategory10[index % 10])
    .attr("stroke-width", 1.5)
    .attr("d", line);

  // Other parts of the drawGraph function


}



          $(document).ready(function() {
              loadMarketOptions();

              $(".select-stock select[id^='market']").on("change", function() {
                  let marketId = $(this).attr('id');
                  let itemId = marketId.replace('market', 'item');
                  loadItemList(itemId, $(this).val());
              });
          });


          function loadMarketOptions() {
              $.ajax({
                  url: "https://api.ninahas.io/data/market_list", // Adjust port if needed
                  method: "GET",
                  success: function(data) {
                      for (let i = 1; i <= 10; i++) {
                          let marketSelect = $('#market' + i);
                          marketSelect.empty(); // Clear existing options
                          marketSelect.append('<option value="" disabled selected>Select Market</option>');
                          data.forEach(function(market) {
                              marketSelect.append('<option value="' + market.code + '">' + market.text + '</option>');
                          });
                      }
                  },
                  error: function(jqXHR, textStatus, errorThrown) {
                      console.error("Error loading market options: " + textStatus, errorThrown);
                  }
              });
          }


function loadItemList(itemId, selectedMarket) {
  $.ajax({
      url: "https://api.ninahas.io/data/search_items?market=" + encodeURIComponent(selectedMarket),
      method: "GET",
      success: function(data) {
          let itemSelect = $('#' + itemId);
          itemSelect.empty();
          itemSelect.append('<option value="" disabled selected>Select Item</option>');

          // Iterate over each optgroup
          $.each(data, function(optgroupLabel, options) {
              let optgroup = $('<optgroup>').attr('label', optgroupLabel);
              options.forEach(function(option) {
                  optgroup.append($('<option>').text(option));
              });
              itemSelect.append(optgroup);
          });
      },
      error: function(jqXHR, textStatus, errorThrown) {
          console.error("Error loading item options: " + textStatus, errorThrown);
      }
  });
}
          


$(document).ready(function() {
  // Event listener for all item input fields
  $("input[id^='item']").on('input', function() {
    var inputId = $(this).attr('id');
    var rowIndex = inputId.replace('item', '');
    var market = $(`#market${rowIndex}`).val();
    var query = $(this).val();
    var dataListId = $(this).attr('list');

    if (query.length < 2) { // Only search if at least 3 characters are typed
      return;
    }

    // Adjust URL based on the selected market
    var url = 'https://api.ninahas.io/data/search_items';
    var params = { query: query, market: market };

    $.ajax({
      url: url,
      method: 'GET',
      data: params,
      success: function(data) {
        var dataList = $('#' + dataListId);
        dataList.empty(); // Clear existing options

        data.forEach(function(item) {
          dataList.append($('<option>').val(item));
        });
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error("Error loading item options: " + textStatus, errorThrown);
      }
    });
  });
});




$(document).on('click', '.dropdown-item', function() {
  $('#itemSearch').val($(this).text());
  $('#itemDropdown').hide();
});



      function toggleTimeframe1(){

      }




function updateTotals() {
  let totalSum = [0, 0, 0]; // To store the sum of each column

  // Loop through each row
  $('.asset-row').each(function() {
      // For each column in the row
      for (let i = 1; i <= 3; i++) {
          let allocationValue = parseFloat($(`input[name="allocation${$(this).index()}_${i}"]`).val()) || 0;
          totalSum[i - 1] += allocationValue;
      }
  });

  // Update the total fields and their styles
  for (let i = 0; i < 3; i++) {
      let totalField = $(`#total${i + 1}`);
      totalField.val(totalSum[i].toFixed(2));

      if (totalSum[i] === 100) {
          totalField.css({'background-color': 'LightGreen'});
      } else if (totalSum[i] > 100 || totalSum[i] < 100) {
          totalField.css({'background-color': 'LightCoral'});
      } else {
          totalField.css({'background-color': 'grey'});
      }
  }
}

// Call updateTotals when any allocation input changes
$('input[name^="allocation"]').on('input', updateTotals);

// Initialize with default styling
updateTotals();



// // Run the initialization function when the document is ready
// $(document).ready(function() {
//   initializeAllocations();
// });




$(document).ready(function() {
  // Bind the validateAndSubmitForm function to the form's onsubmit event
  $(".pv-form").on('submit', function(event) {
      event.preventDefault(); // Prevent the default form submission
      validateAndSubmitForm();
  });



// Function to check validations and submit form
function validateAndSubmitForm() {
  var errors = [];
  var itemsEntered = 0; // Counter for entered items


  // Check if all allocations have corresponding market and item
  $('.asset-row').each(function() {
      var market = $(this).find('select[name^="market"]').val();
      var item = $(this).find('input[name^="item"]').val();
      var itemOptions = $(`#itemList${$(this).index()}`).find('option').map(function() {
          return $(this).val();
      }).get();

      var allocation = parseFloat($(`input[name="allocation${$(this).index()}_1"]`).val()) || 0;

      if (market && item && allocation > 0) {
        itemsEntered++; // Increment counter if both market and item are entered
    }

      if (allocation > 0 && (!market || !item)) {
          errors.push('All allocations must have a corresponding market and item.');
      }

      // Check if the entered item is in the list
      if (item && !itemOptions.includes(item)) {
          errors.push(`Item "${item}" is not valid or not in the list.`);
      }

      
  });

   // Add a check for at least two items
   if (itemsEntered < 2) {
    errors.push("At least two items must be entered.");
}
    
  // Check if totals are 100
  ['total1'].forEach(function(totalId) {
      var totalValue = parseFloat($("#" + totalId).val()) || 0;
      if (totalValue !== 100 && totalValue !== 0) {
          errors.push(`Total allocation for Portfolio ${totalId.slice(-1)} must be exactly 100%.`);
      }
  });

  // Retrieve the start year and end year values
  var startYear = parseInt($("#startYearSelect").val());
  var endYear = parseInt($("#endYearSelect").val());

  // Check if end year is larger than start year
  if (endYear < startYear) {
      errors.push("End year must be larger or equal to start year.");
      }


  // Display errors or submit form
  if (errors.length > 0) {
      displayErrors(errors);
      hideResultSections();
      return false; // Return false to indicate validation failed

  } else {
      $("#error-messages").hide();
      // createResultSections();
      submitFormData(); // Call function to submit form data
      return true; // Return true to indicate validation passed    
    }
}



function submitFormData() {
  let formData = $(".pv-form").serialize();

  $.ajax({
      url: "https://api.ninahas.io/data/efficient_frontier",
      method: "POST",
      data: formData,
      success: function(response) {
          if (response.error) {
            hideResultSections();
              alert("Error " + "\nFirst available date: " + response.error.first_date);
          }
          else {
              console.log("Form submitted successfully");
              console.log(response);
              createResultSections(response); // Pass response data
              generateCharts(response);
              showResults(response);
              generateScatterPlot(response.plot_data, response.plot_max_sharpe,response.plot_provided_sharpe);
              // Pass response data
          }
      },
      error: function(jqXHR, textStatus, errorThrown) {
          console.error("Error in form submission:", textStatus, errorThrown);
      }
  });
}




// // Bind the validateAndSubmitForm function to the form's onsubmit event
// $(document).ready(function() {
//   $(".pv-form").on('submit', function(event) {
//       event.preventDefault(); // Prevent the default form submission
//       validateAndSubmitForm(); // Validate and submit the form
//   });

//   // ... other initialization code ...
// });



// Function to display errors
function displayErrors(errors) {
    var errorHtml = errors.map(function(error) {
        return `<div>${error}</div>`;
    }).join('');
    $("#error-messages").html(errorHtml).show();
}


  // Function to create result sections (only if validations pass)
  function hideResultSections() {
      // Clear previous results
      $("#result-content").empty();
  }
});


function createResultSections(data) {
  // Clear previous results
  $("#result-content").empty();

  // Iterate over each total field and create a section if there's a value
  ['total1', 'total2', 'total3'].forEach(function(totalId, portfolioIndex) {
      var totalValue = parseFloat($("#" + totalId).val()) || 0;
      if (totalValue > 0) {
          // Start constructing the HTML for the section
          var sectionHtml = `<div class="card my-3 result-section">
                                <div class="card-header bg-gradient fw-bold">
                                    <h3>Provided Portfolio</h3>
                                </div>
                                <div class="card-body">
                                    <div class="row" style="margin: 0">
                                        <div class="col-md-8" style="padding-left: 0; padding-right: 15px;">
                                            <table class="table table-striped table-sm">
                                                <thead>
                                                    <tr>
                                                        <th>Market</th>
                                                        <th>Name</th>
                                                        <th class="numberCell">Allocation</th>
                                                    </tr>
                                                </thead>
                                                <tbody class="table-group-divider">`;

          // Iterate over each asset row to extract and add the data
          $('.asset-row').each(function(rowIndex) {
              if (rowIndex > 0) { // Skip the header row
                  var market = $(`#market${rowIndex}`).val();
                  var item = $(`#item${rowIndex}`).val();
                  var allocation = $(`#allocation${rowIndex}_${portfolioIndex + 1}`).val();

                  // Only add a row if market, item, and allocation are provided
                  if (market && item && allocation) {
                      sectionHtml += `<tr>
                                          <td>${market}</td>
                                          <td>${item}</td>
                                          <td class="numberCell">${allocation}%</td>
                                      </tr>`;
                  }
              }
          });

          // Close the table and the rest of the HTML structure
          sectionHtml += `</tbody></table></div>
                           <div class="col-md-4" style="padding-left: 100px ; padding-top: 50px">
                               <div id="chartDiv${portfolioIndex + 1}" style="min-width: 250px; min-height: 250px; max-width: 380px; max-height: 380px; overflow: hidden;">
                                   <!-- Chart will be inserted here -->
                               </div>
                           </div>
                       </div>
                   </div>
               </div>`;

              

          $("#result-content").append(sectionHtml);
          generateCharts(portfolioIndex + 1);

          if (data && data.max_sharpe_ratio) {
            var maxSharpeRatioSectionHtml = `
            <div class="card my-3 result-section">
                <div class="card-header bg-gradient fw-bold">
                    <h3>Max Sharpe Ratio Portfolio</h3>
                </div>
                <div class="card-body">
                    <div class="row" style="margin: 0">
                        <div class="col-md-8" style="padding-left: 0; padding-right: 15px;">
                            <table class="table table-striped table-sm" id="maxSharpeRatioTable">
                                <thead>
                                    <tr>
                                        <th>Asset</th>
                                        <th class="numberCell">Allocation</th>
                                    </tr>
                                </thead>
                                <tbody class="table-group-divider">`;
          
              // Add rows to the table
              for (var asset in data.max_sharpe_ratio) {
                  maxSharpeRatioSectionHtml += `
                      <tr>
                          <td>${asset}</td>
                          <td class="numberCell">${(data.max_sharpe_ratio[asset] * 100).toFixed(2)}%</td>
                      </tr>`;
              }
          
              maxSharpeRatioSectionHtml += `
                                      </tbody>
                                  </table>
                              </div>
                              <div class="col-md-4" style="padding-left: 100px; padding-top: 50px">
                                  <div id="maxSharpeRatioChart" style="min-width: 250px; min-height: 250px; max-width: 375px; max-height: 375px; overflow: hidden;">
                                      <!-- Pie chart will be inserted here -->
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>`;
          
              $("#result-content").append(maxSharpeRatioSectionHtml);
          }

          if (data && data.max_sharpe_ratio&&data.plot_data) {
            var scatterPlotSectionHtml = `
                <div class="card my-3 result-section">
                    <div class="card-header bg-gradient fw-bold">
                        <h3>Efficient Frontier</h3>
                    </div>
                    <div class="card-body">
                        <div id="scatterPlot" style="min-width: 500px; min-height: 500px;"></div>
                    </div>
                </div>`;
    
            $("#result-content").append(scatterPlotSectionHtml);
    
            // Call the function to generate the scatter plot
            generateScatterPlot(data.plot_data);
        }
    

        }
      });

}



function generateCharts(responseData) {
  // Ensure data is an array
  let data = [];

  // Populate data for the provided portfolio chart
  $('.asset-row').each(function(rowIndex) {
    let itemName = $(`#item${rowIndex + 1}`).val();
    let allocationValue = parseFloat($(`#allocation${rowIndex + 1}_1`).val());
    if (itemName && allocationValue) {
      data.push({'name': itemName, 'ratio': allocationValue});
    }
  });

  if (data.length > 0) {
    drawPieChart("chartDiv1", data);  // Assuming chartDiv1 is the ID for your provided portfolio chart
  }

  // Check and generate Max Sharpe Ratio Portfolio Chart
  if (responseData && responseData.max_sharpe_ratio) {
    let maxSharpeData = [];
    Object.keys(responseData.max_sharpe_ratio).forEach(key => {
      maxSharpeData.push({ name: key, ratio: responseData.max_sharpe_ratio[key] * 100 });
    });

    if (maxSharpeData.length > 0) {
      drawPieChart("maxSharpeRatioChart", maxSharpeData); // Ensure you have a container with this ID in your HTML
    }
  }
}


function drawPieChart(containerId, chartData) {
  // Clear the existing content in the container
  const container = d3.select(`#${containerId}`);
  container.selectAll("*").remove(); 

  const width = 210;  // Width of the chart
  const height = Math.min(width, 300); // Adjust the height as needed
  const color = d3.scaleOrdinal(d3.schemeCategory10)
      .domain(chartData.map(d => d.name));

  const pie = d3.pie()
      .sort(null)
      .value(d => d.ratio);

  const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(Math.min(width, height) / 2 - 1);

  const labelRadius = Math.min(width, height) / 2 * 0.6;
  const arcLabel = d3.arc()
      .innerRadius(labelRadius)
      .outerRadius(labelRadius);

  // Append a new SVG element
  const svg = container.append('svg')
      .attr('width', width + 150) // Increased width to accommodate legend
      .attr('height', height)
      .attr('viewBox', [-width / 2, -height / 2, width + 150, height].join(' '))
      .attr("style", "max-width: 100%; height: auto; font: 12px sans-serif;");
  
  
  const arcHover = d3.arc()
  .innerRadius(0)
  .outerRadius(Math.min(width, height) / 2 * 1.1); // Slightly larger radius for hover


  
  // Tooltip for hover information
  const tooltip = container.append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  // Building the pie chart with hover effects
  const paths = svg.append("g")
      .attr("stroke", "white")
      .selectAll("path")
      .data(pie(chartData))
      .join("path")
      .attr("fill", d => color(d.data.name))
      .attr("d", arc)
      .on("mouseover", function(event, d) {
          d3.select(this).transition()
              .duration(200)
              .attr("d", arcHover);
          tooltip.transition()
              .duration(200)
              .style("opacity", 1);
          tooltip.html(`${d.data.name}: ${d.data.ratio.toLocaleString()}`)
              .style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
          d3.select(this).transition()
              .duration(200)
              .attr("d", arc);
          tooltip.transition()
              .duration(500)
              .style("opacity", 0);
      });
  // Building the pie chart
  svg.append("g")
      .attr("stroke", "white")
      .selectAll("path")
      .data(pie(chartData))
      .join("path")
      .attr("fill", d => color(d.data.name))
      .attr("d", arc)
      .append("title")
      .text(d => `${d.data.name}: ${d.data.ratio.toLocaleString()}`);

  // Adding labels to the pie chart
  svg.append("g")
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(pie(chartData))
      .join("text")
      .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
      .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
        .attr("x", 0)
        .attr("y", "0.7em")
        .attr("fill-opacity", 0.7)
        .attr("fill", "white") // White font color
        .text(d => `${d.data.ratio.toLocaleString()}%`));

  // Adding legend
  const legend = svg.append("g")
      .attr("transform", `translate(${width / 2 + 20}, ${-height / 2})`) // Positioning the legend to the right
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("text-anchor", "start")
      .selectAll("g")
      .data(color.domain())
      .join("g")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`);

  legend.append("rect")
      .attr("x", 0)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", color);

  legend.append("text")
      .attr("x", 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .attr("fill", "white") // White font color
      .text(d => d);
}


function showResults(data) {
  // if (!data) {
  //   console.error("Invalid data received:", data);
  //   return;
  // }
 
  const resultContent = document.getElementById("result-content");
  resultContent.style.display = 'block';
  const tableDiv = document.createElement("div");
  tableDiv.classList.add("card", "my-3", "result-section");

  // Creating table structure
  const table = document.createElement("table");
  table.classList.add("table", "table-sm", "table-striped");
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const headers = [
    "Portfolio",
    "Initial Amount",
    "Final Amount",
    "Annualized Returns",
    "Annualized Volatility",
    "Maximum Drawdown",
    "Sharpe Ratio",
    "Sortino Ratio",
    "Profit/Loss Ratio"
  ];

  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    th.style.textAlign = 'right';
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const cardHeader = document.createElement("div");
  cardHeader.classList.add("card-header", "bg-gradient", "fw-bold");
  const cardHeaderTitle = document.createElement("h3");
  cardHeaderTitle.textContent = "Performance Summary";
  cardHeader.appendChild(cardHeaderTitle);
  tableDiv.appendChild(cardHeader);

  const tbody = document.createElement("tbody");

  // Iterate over each portfolio data and create table rows
  if (data.stats_longonly) {
    createTableRow(tbody, 'Provided Portfolio', data.stats_longonly[0]);
  }

  if (data.stats_longonly_max) {
    createTableRow(tbody, 'Max Sharpe Ratio Portfolio', data.stats_longonly_max[0]);
  }

  // Append tbody to the table and the table to the result content
  table.appendChild(tbody);
  tableDiv.appendChild(table);
  resultContent.appendChild(tableDiv);
}



function createTableRow(tbody, portfolioName, stats) {
  const row = document.createElement("tr");

  // Add portfolio name
  const portfolioTd = document.createElement("td");
  portfolioTd.textContent = portfolioName;
  portfolioTd.style.textAlign = 'right';
  row.appendChild(portfolioTd);

  const values = [
    stats.initial_amount ? stats.initial_amount.toFixed(2) : "N/A",
    stats.final_amount ? stats.final_amount.toFixed(2) : "N/A",
    (stats.returns_annualised ? stats.returns_annualised * 100 : 0).toFixed(2) + "%",
    (stats.vol_annualised ? stats.vol_annualised * 100 : 0).toFixed(2) + "%",
    (stats.max_drawdown ? stats.max_drawdown * 100 : 0).toFixed(2) + "%",
    stats.sharpe ? stats.sharpe.toFixed(2) : "N/A",
    stats.sortino ? stats.sortino.toFixed(2) : "N/A",
    stats.pnl_ratio ? stats.pnl_ratio.toFixed(2) : "N/A"
  ];

  values.forEach((value) => {
    const td = document.createElement("td");
    td.textContent = value;
    td.style.textAlign = 'right'; 
    row.appendChild(td);
  });

  tbody.appendChild(row);
}




function generateScatterPlot(plotData, plotMaxSharpe, plotProvidedSharpe) {
  // Select the scatter plot container
  const container = d3.select('#scatterPlot');
  container.selectAll("*").remove(); // Clear any existing content

  const margin = {top: 50, right: 150, bottom: 100, left: 150},
      width = 1500 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

  // Append SVG for the plot
  const svg = container.append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  // Consolidate all data to determine the scale domains
  const allData = plotData.concat(plotMaxSharpe || [], plotProvidedSharpe || []);
  const xExtent = d3.extent(allData, d => d.volatility);
  const yExtent = d3.extent(allData, d => d.return);

  // Create scales using the consolidated extents
  const x = d3.scaleLinear()
      .domain(xExtent).nice()
      .range([0, width]);
  
  const y = d3.scaleLinear()
      .domain(yExtent).nice()
      .range([height, 0]);


  // Create a color scale
  const color = d3.scaleSequential(d => d3.interpolateViridis(1 - d))
      .domain(d3.extent(plotData, d => d.sharpe).reverse());

      margin.right = 60; // Adjust this as needed

  // Colorbar settings
  const colorbarWidth = 20;
  const colorbarHeight = 450;
  const numSwatches = 50; // Number of color swatches in the colorbar
  const colorbarDomain = color.domain().reverse();
  const colorStep = (colorbarDomain[1] - colorbarDomain[0]) / numSwatches;

  // Append colorbar
  const colorbar = svg.append("g")
    .attr("transform", `translate(${width + margin.right - colorbarWidth - 10}, ${height / 2 - colorbarHeight / 2})`);

  for (let i = 0; i < numSwatches; i++) {
    colorbar.append("rect")
      .attr("x", 0)
      .attr("y", colorbarHeight - (i + 1) * (colorbarHeight / numSwatches)) // Invert the Y position
      .attr("width", colorbarWidth)
      .attr("height", colorbarHeight / numSwatches)
      .style("fill", color(colorbarDomain[0] + i * colorStep));
  }

  // Add colorbar axis - reverse the range for correct tick positioning
  const colorbarScale = d3.scaleLinear()
    .domain(colorbarDomain.reverse())
    .range([0, colorbarHeight]); // Reverse the range

  const colorbarAxis = d3.axisRight(colorbarScale)
    .ticks(5) // Adjust the number of ticks as needed

    colorbar.append("g")
    .attr("transform", `translate(${colorbarWidth}, 0)`)
    .call(colorbarAxis)
    .selectAll(".tick text")
    .style("fill", "white") // Change color of tick labels to white
    .selectAll("text")
    .style("font-size", "12px"); // Adjust font size as needed

  // Colorbar Label
  colorbar.append("text")
    .attr("y", -12)
    .attr("x", colorbarWidth + 5) // Adjust the position as needed
    .style("fill", "white") // Change color of the colorbar label to white
    .text("Sharpe Ratio")
    .style("font-size", "12px"); // Set font size for x-axis labels
  // Function to find the closest data point to the mouse position
  function findClosestData(x0, dataset) {
    return dataset.reduce((prev, curr) => 
      (Math.abs(curr.volatility - x0) < Math.abs(prev.volatility - x0) ? curr : prev));
  }

  // Mouse move function
  function mousemove(event) {
    const [mouseX, mouseY] = d3.pointer(event, this);
    hoverLine.attr("transform", `translate(${mouseX},0)`).style("display", null);

    const x0 = x.invert(mouseX);
    let closestData = findClosestData(x0, plotData);

    // Check if we are closer to a special point (Max or Provided Sharpe)
    if (plotMaxSharpe && plotMaxSharpe.length > 0) {
      const closestMaxSharpe = findClosestData(x0, plotMaxSharpe);
      if (Math.abs(closestMaxSharpe.volatility - x0) < Math.abs(closestData.volatility - x0)) {
        closestData = closestMaxSharpe;
      }
    }
    if (plotProvidedSharpe && plotProvidedSharpe.length > 0) {
      const closestProvidedSharpe = findClosestData(x0, plotProvidedSharpe);
      if (Math.abs(closestProvidedSharpe.volatility - x0) < Math.abs(closestData.volatility - x0)) {
        closestData = closestProvidedSharpe;
      }
    }

    hoverGroup.attr("transform", `translate(${mouseX}, ${y(closestData.return) - 60})`)
      .style("display", null);
    
    hoverText.text(`Return: ${closestData.return.toFixed(4)}`)
      .append("tspan")
      .attr("x", 15)
      .attr("dy", "1.2em")
      .text(`Volatility: ${closestData.volatility.toFixed(4)}`)
      .append("tspan")
      .attr("x", 15)
      .attr("dy", "1.2em")
      .text(`Sharpe: ${closestData.sharpe.toFixed(4)}`);
    
    // Enlarge the nearest dot
    svg.selectAll('.scatter-dot, .maxSharpeDot, .providedSharpeDot')
      .attr('r', d => d === closestData ? 6 : 3);
  }

// Add scatter plot points
svg.selectAll("dot")
.data(plotData)
.enter().append("circle")
.attr("class", "scatter-dot")
.attr("r", 3)
.attr("cx", d => x(d.volatility))
.attr("cy", d => y(d.return))
.style("fill", d => color(d.sharpe));


// Create an invisible overlay for mouse events
const mouseG = svg.append("g").attr("class", "mouse-over-effects");


mouseG.append("rect")
.attr("width", width)
.attr("height", height)
.attr("fill", "none")
.attr("pointer-events", "all")
.on("mousemove", mousemove)
.on("mouseout", () => {
  hoverGroup.style("display", "none");
  hoverLine.style("display", "none");
  d3.selectAll('.scatter-dot')
    .attr('r', 3); // Reset all dots to original size
});

// Hover line
const hoverLine = mouseG.append("line")
.attr("class", "hover-line")
.attr("y1", 0)
.attr("y2", height)
.style("stroke", "white")
.style("stroke-width", 1)
.style("stroke-dasharray", "3,3")
.style("display", "none");

// Hover label group
const hoverGroup = mouseG.append("g")
.attr("class", "hover-label")
.style("display", "none");

hoverGroup.append("rect")
.attr("x", 10)
.attr("width", 120)
.attr("height", 50)
.attr("fill", "white")
.style("opacity", 0.8);

const hoverText = hoverGroup.append("text")
.attr("x", 15)
.attr("dy", "1.2em")
.style("font-size", "12px")
.style("fill", "black");



// Add the X Axis and Gridlines
svg.append("g")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(x))
  .selectAll("text")
  .style("font-size", "12px");

svg.append("g")
  .attr("class", "grid")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(x).tickSize(-height).tickFormat(""));

// Add the Y Axis and Gridlines
svg.append("g")
  .call(d3.axisLeft(y))
  .selectAll("text")
  .style("font-size", "12px");

svg.append("g")
  .attr("class", "grid")
  .call(d3.axisLeft(y).tickSize(-width).tickFormat(""));

// Customize grid lines
svg.selectAll(".grid line")
  .style("stroke", "#778899")
  .style("stroke-opacity", "0.7")
  .style("shape-rendering", "crispEdges");

svg.selectAll(".grid path")
  .style("stroke-width", "0");


  // Add axis labels (optional)
  svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height + margin.top)
      .attr("fill", "white") // Set text color to white
      .text("Volatility")
      .style("font-size", "12px"); // Set font size for x-axis labels

  svg.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -50)
      .attr("x", 0)  // Adjust this for top margin
      .attr("fill", "white") // Set text color to white
      .text("Return")
      .style("font-size", "12px"); // Set font size for x-axis labels





     // Add a special marker and label for the maximum Sharpe ratio point
if (plotMaxSharpe && plotMaxSharpe.length > 0) {
  plotMaxSharpe.forEach(d => {
    svg.append("circle")
      .attr("class", "maxSharpeDot")
      .attr("r", 7) // Larger radius for the max Sharpe ratio point
      .attr("cx", x(d.volatility))
      .attr("cy", y(d.return))
      .style("fill", 'red') // Red color for the max Sharpe ratio point
      .style("stroke", 'red') // Optional: add stroke to make it more visible
      .style("stroke-width", 2);

    svg.append("text")
      .attr("x", x(d.volatility) + 10)
      .attr("y", y(d.return) + 5)
      .style("fill", "red")
      .style("font-size", "12px")
      .text("Max Sharpe");

  });
}

// Add a special marker and label for the provided Sharpe ratio point
if (plotProvidedSharpe && plotProvidedSharpe.length > 0) {
  plotProvidedSharpe.forEach(d => {
    svg.append("circle")
      .attr("class", "providedSharpeDot")
      .attr("r", 7) // Radius for the provided Sharpe ratio point
      .attr("cx", x(d.volatility))
      .attr("cy", y(d.return))
      .style("fill", 'DarkSalmon') // Different color to distinguish it
      .style("stroke", 'DarkSalmon')
      .style("stroke-width", 1);

    svg.append("text")
      .attr("x", x(d.volatility) + 10)
      .attr("y", y(d.return) + 5)
      .style("fill", "DarkSalmon")
      .style("font-size", "12px")
      .text("Provided Sharpe");
  });
}


// Customize the appearance of all points (including special points)
svg.selectAll('.scatter-dot, .maxSharpeDot, .providedSharpeDot')
.on("mouseover", function(event, d) {
  d3.select(this).attr("r", 6); // Enlarge the dot on hover
  hoverGroup.style("display", null); // Show hover label
})
.on("mouseout", function(event, d) {
  d3.select(this).attr("r", d => d === closestData ? 6 : 3); // Reset dot size
  hoverGroup.style("display", "none"); // Hide hover label
});

    

}
