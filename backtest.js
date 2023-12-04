

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



function showResults(data) {
  if (!data) {
    console.error("Invalid data received:", data);
    return;
  }

  const resultContent = document.getElementById("result-content");
  resultContent.style.display = 'block';
  const tableDiv = document.createElement("div");
  tableDiv.classList.add("card", "my-3", "result-section");

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
    th.style.textAlign = 'right'; // Align text center for header cells
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

  Object.keys(data).forEach((portfolioKey, index) => {
    const portfolioData = data[portfolioKey];
    if (portfolioData.stats_longonly) {
      const stats = portfolioData.stats_longonly[0]; // Assuming stats_longonly is an array with a single object
      const row = document.createElement("tr");

      // Add portfolio name
      const portfolioTd = document.createElement("td");
      portfolioTd.textContent = `Portfolio ${index + 1}`;
      portfolioTd.style.textAlign = 'right'; // Align text center for the portfolio cell
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


  });

  table.appendChild(tbody);
  tableDiv.appendChild(table);
  resultContent.appendChild(tableDiv);

  console.log("Table created");

  
  // Create a new card for the graph
  const graphCard = document.createElement("div");
  graphCard.classList.add("card", "my-3", "result-section");

  // Create a card header for the graph
  const graphCardHeader = document.createElement("div");
  graphCardHeader.classList.add("card-header", "bg-gradient", "fw-bold");
  const graphCardTitle = document.createElement("h3");
  graphCardTitle.textContent = "Portfolio Growth";
  graphCardHeader.appendChild(graphCardTitle);
  graphCard.appendChild(graphCardHeader);

  // Set the dimensions and margins of the graph
  const margin = { top: 50, right: 100, bottom: 100, left: 100 },
    width = 1500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  // Append the shared svg object for the graph to the graphCard
  const svg = d3.select(graphCard)
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  const allData = Object.values(data).flatMap(portfolio => portfolio.js_data);
  const yMax = d3.max(allData, d => +d.return);
  const parseTime = d3.timeParse("%Y-%m-%d");
    
  // Create scales
  const x = d3.scaleTime()
    .domain(d3.extent(allData, d => parseTime(d.date)))
    .range([0, width]);
  const y = d3.scaleLinear()
    .domain([0, yMax])
    .range([height, 0]);

  // Draw X and Y axes here, only once
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .style("font-size", "12px"); // Change font size for X-axis tick labels

  svg.append("g")
    .call(d3.axisLeft(y))
    .style("font-size", "12px"); // Change font size for X-axis tick labels

    
  
    // Add X axis label
  svg.append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
  .style("text-anchor", "middle")
  .style("fill", "white") // Set label color to white
  .text("Date") // Label for the X axis
  .style("font-size", "14px"); // Change font size for X-axis title


  // Add Y axis label
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 20)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("fill", "white") // Set label color to white
    .text("Portfolio Balance ($)") // Label for the Y axis
    .style("font-size", "14px"); // Change font size for X-axis title

  
  // Add Y axis grid lines
  svg.append("g")
  .attr("class", "grid")
  .call(d3.axisLeft(y)
      .tickSize(-width)
      .tickFormat("")
  )
  .selectAll(".tick line")
  .style("stroke", "#778899") // Lighten the grid lines
  .style("stroke-width", "0.3px"); // Optional: Adjust the stroke width

  

  // Draw each portfolio's line on the shared SVG
  Object.keys(data).forEach((portfolioKey, index) => {
    const portfolioData = data[portfolioKey];
    if (portfolioData.js_data && portfolioData.js_data.length > 0) {
      drawGraph(svg, portfolioData.js_data, x, y, index); // Pass x and y scales
    }
    
  });


  // Append the graph card to the resultContent
  resultContent.appendChild(graphCard);


// Create a new card for the graph
const bargraphCard = document.createElement("div");
bargraphCard.classList.add("card", "my-3", "result-section");

// Create a card header for the graph
const bargraphCardHeader = document.createElement("div");
bargraphCardHeader.classList.add("card-header", "bg-gradient", "fw-bold");
const bargraphCardTitle = document.createElement("h3");
bargraphCardTitle.textContent = "Portfolio Growth";
bargraphCardHeader.appendChild(bargraphCardTitle);
bargraphCard.appendChild(bargraphCardHeader);

 // Specify the chart’s dimensions.
 const width_bar =1500;
 const height_bar = 500;
 const marginTop_bar = 20;
 const marginRight_bar = 50;
 const marginBottom_bar = 50;
 const marginLeft_bar = 100;


 
  // Process and combine data for all portfolios
  const allPortfoliosData = Object.values(data).flatMap((portfolio, index) => 
    portfolio.annual_ret.map(d => ({ year: d.year, return: d.return, portfolio: 'Portfolio ' + (index + 1) }))
  );
  

  // Ensure there's enough data to create scales
  if (allPortfoliosData.length === 0) {
    // Handle case with no data
    return;
  }

  // Adjust domain if only one data point
  const minY = d3.min(allPortfoliosData, d => d.return);
  const maxY = d3.max(allPortfoliosData, d => d.return);
  const yDomain = minY === maxY ? [minY - 1, maxY + 1] : [minY, maxY];

// Create a color scale
const portfolioColors = d3.scaleOrdinal()
  .domain(allPortfoliosData.map(d => d.portfolio))
  .range(d3.schemeTableau10); // This is an example color scheme. You can choose any other or define a custom array of colors



 // Create main x-scale for years
 const x0 = d3.scaleBand()
   .domain([...new Set(allPortfoliosData.map(d => d.year))])
   .range([marginLeft_bar, width_bar - marginRight_bar])
   .paddingInner(0.3);

 // Create secondary x-scale for portfolios
 const x1 = d3.scaleBand()
   .domain([...new Set(allPortfoliosData.map(d => d.portfolio))])
   .rangeRound([0, x0.bandwidth()])
   .padding(0.2);

 // Create y-scale
 const y_bar = d3.scaleLinear()
   .domain([d3.min(allPortfoliosData, d => d.return), d3.max(allPortfoliosData, d => d.return)]).nice()
   .range([height_bar - marginBottom_bar, marginTop_bar]);


  y_bar.domain(yDomain).nice();


 // Create the SVG container for the bar chart
 const svgBar = d3.select(bargraphCard)
   .append("svg")
   .attr("viewBox", [0, 0, width_bar, height_bar])
   .attr("width", width_bar)
   .attr("height", height_bar)
   .attr("style", "max-width: 100%; height: auto;");

 // Append grouped bars
 const yearGroups = svgBar.selectAll(".year-group")
   .data(allPortfoliosData)
   .enter().append("g")
     .attr("class", "year-group")
     .attr("transform", d => `translate(${x0(d.year)},0)`);

 yearGroups.selectAll("rect")
   .data(d => [{ key: d.portfolio, value: d.return }])
   .enter().append("rect")
     .attr("x", d => x1(d.key))
     .attr("y", d => y_bar(Math.max(0, d.value)))
     .attr("height", d => Math.abs(y_bar(d.value) - y_bar(0)))
     .attr("width", x1.bandwidth())
    .attr("fill", d => portfolioColors(d.key)); // Use the color scale to set the fill

  // Append X and Y axis to the SVG
  svgBar.append("g")
    .attr("transform", `translate(0,${height_bar - marginBottom_bar})`)
    .call(d3.axisBottom(x0))
    .selectAll("path, line")
    .style("stroke", "#778899")
    .selectAll("text")
    .style("font-size", "12px"); // Change font size for X-axis tick labels
  

  // Append the y-axis and add gridlines
  svgBar.append("g")
    .attr("transform", `translate(${marginLeft_bar},0)`)
    .call(d3.axisLeft(y_bar)
      .tickSize(-width_bar + marginLeft_bar + marginRight_bar) // Extend the tick lines across the chart
      .tickFormat(d3.format(".0%")) // Format ticks as percentages
    )
    .call(g => g.select(".domain").remove()) // Remove the axis line
    .call(g => g.selectAll(".tick:not(:first-of-type) line")
      .attr("stroke", d => d === 0 ? "#fff" : "#778899") // Bold line when y = 0
      .attr("stroke-width", d => d === 0 ? 1 : 0.3) // Increase stroke width for y = 0
    )
    .selectAll("text")
    .style("font-size", "12px"); // Change font size for Y-axis tick labels; // Make the y=0 line bold and blac
    
   // Add the X-axis label
   svgBar.append("text")
   .attr("transform", `translate(${(width_bar - marginLeft_bar - marginRight_bar) / 2 + marginLeft_bar}, ${height_bar - 20})`)
   .style("text-anchor", "middle")
   .text("Year")
   .style("fill", "white") // Set label color to white
   .style("font-size", "14px"); // Change font size for X-axis title

// Add the Y-axis label with adjusted positioning
svgBar.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - marginLeft_bar + 20) // Adjust the distance from the left edge
  .attr("x", 0 - (height_bar / 2)) // Center along the y-axis
  .attr("dy", "1em") // Adjust the distance from the top edge
  .style("text-anchor", "middle")
  .text("Annual Return")
  .style("fill", "black") // Set label color to black
  .style("font-size", "14px"); // Change font size for Y-axis title


 resultContent.appendChild(bargraphCard);

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





// $(function() {
        //     $("form").submit(function(e){
        //         e.preventDefault();
        //         let $inputs = $("input, textarea, select", this);
        //         param = "asset1_rate01=10&aset1_rate02=05";
        //         d3.json(`http://localhost:5001/data/efficient_frontier?${param}`, function(data){
                    
        //         });
        //     });


        // analyze portfolio button
      //   $("form").submit(function(e) {
      //     e.preventDefault(); // Prevent normal form submission
      //     let formData = $(this).serialize(); // Serialize form data

      //     $.ajax({
      //         url: "http://localhost:5001/api/analyze",
      //         method: "POST",
      //         data: formData,
      //         success: function(response) {
      //             // Handle success - maybe update the UI with the response
      //             console.log("Form submitted successfully");
      //             console.log(response)
      //             showResults(response);

      //         },
      //         error: function(jqXHR, textStatus, errorThrown) {
      //             // Handle error
      //             console.error("Form submission failed: " + textStatus, errorThrown);
      //         }
      //     });
      // });


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
                  url: "http://localhost:5001/data/market_list", // Adjust port if needed
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
      url: "http://localhost:5001/data/search_items?market=" + encodeURIComponent(selectedMarket),
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
    var url = 'http://localhost:5001/data/search_items';
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

  // Check if all allocations have corresponding market and item
  $('.asset-row').each(function() {
      var market = $(this).find('select[name^="market"]').val();
      var item = $(this).find('input[name^="item"]').val();
      var itemOptions = $(`#itemList${$(this).index()}`).find('option').map(function() {
          return $(this).val();
      }).get();

      for (let i = 1; i <= 3; i++) {
          var allocation = parseFloat($(`input[name="allocation${$(this).index()}_${i}"]`).val()) || 0;
          if (allocation > 0 && (!market || !item)) {
              errors.push('All allocations must have a corresponding market and item.');
              break;
          }
          // Check if the entered item is in the list
          if (item && !itemOptions.includes(item)) {
              errors.push(`Item "${item}" is not valid or not in the list.`);
              break;
          }
      }
  });

  // Check if totals are 100
  ['total1', 'total2', 'total3'].forEach(function(totalId) {
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

  // Check if at least one total is 100
  var isOneTotalValid = ['total1', 'total2', 'total3'].some(function(totalId) {
      var totalValue = parseFloat($("#" + totalId).val()) || 0;
      return totalValue === 100;
  });

  if (!isOneTotalValid) {
      errors.push('At least one portfolio total must be exactly 100%.');
  }

  // Display errors or submit form
  if (errors.length > 0) {
      displayErrors(errors);
      hideResultSections();
      return false; // Return false to indicate validation failed

  } else {
      $("#error-messages").hide();
      createResultSections();
      submitFormData(); // Call function to submit form data
      return true; // Return true to indicate validation passed    
    }
}


function submitFormData() {
  let formData = $(".pv-form").serialize(); // Serialize form data

  $.ajax({
      url: "http://localhost:5001/data/analyze",
      method: "POST",
      data: formData,
      success: function(response) {
        if (response.error) {
            // If there is an error in the response, show an alert
            alert("Error "+ "\nFirst available date: " + response.error.first_date);
        } else {
            // Handle successful response
            console.log("Form submitted successfully");
            console.log(response);
            showResults(response);
        }
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.error("Error in form submission:", textStatus, errorThrown);
        // Optionally, handle additional AJAX request errors
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


function createResultSections() {
  // Clear previous results
  $("#result-content").empty();

  // Iterate over each total field and create a section if there's a value
  ['total1', 'total2', 'total3'].forEach(function(totalId, portfolioIndex) {
      var totalValue = parseFloat($("#" + totalId).val()) || 0;
      if (totalValue > 0) {
          // Start constructing the HTML for the section
          var sectionHtml = `<div class="card my-3 result-section">
                                <div class="card-header bg-gradient fw-bold">
                                    <h3>Portfolio ${portfolioIndex + 1}</h3>
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



      }
  });


}




function generateCharts(portfolioIndex) {
  // Select the target container for the chart
  const chartContainer = d3.select(`#chartDiv${portfolioIndex}`);

  // Data for the chart
  const data = [];
  $('.asset-row').each(function(rowIndex) {
    let itemName = $(`#item${rowIndex + 1}`).val();
    let allocationValue = parseFloat($(`#allocation${rowIndex + 1}_${portfolioIndex}`).val());
    if (itemName && allocationValue) {
      data.push({'name': itemName, 'ratio': allocationValue});
    }
  });

  // Check if data is available
  if (data.length === 0) {
    return; // No data to display
  }

  // Chart dimensions and settings
  const width = 210;
  const height = Math.min(width, 300);
  const color = d3.scaleOrdinal(d3.schemeCategory10)
    .domain(data.map(d => d.name));

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

  // Create SVG element
  const svg = chartContainer.append("svg")
    .attr("width", width + 150) // Increased width to accommodate legend
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width + 150, height].join(' '))
    .attr("style", "max-width: 100%; height: auto; font: 12px sans-serif;");

  // Building the pie chart
  svg.append("g")
    .attr("stroke", "white")
    .selectAll("path")
    .data(pie(data))
    .join("path")
    .attr("fill", d => color(d.data.name))
    .attr("d", arc)
    .append("title")
    .text(d => `${d.data.name}: ${d.data.ratio.toLocaleString()}`);

  // Adding labels to the pie chart
  svg.append("g")
    .attr("text-anchor", "middle")
    .selectAll("text")
    .data(pie(data))
    .join("text")
    .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
    // .call(text => text.append("tspan")
    //   .attr("y", "-0.4em")
    //   .attr("font-weight", "bold")
    //   .attr("fill", "white") // White font color
    //   .text(d => d.data.name.length > 15 ? d.data.name.substring(0, 15) + '...' : d.data.name))
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



