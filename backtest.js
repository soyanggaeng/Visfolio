

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

function showResults() {
  document.getElementById('result-content').style.display = 'block';
  // Additional logic if needed
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
        $("form").submit(function(e) {
          e.preventDefault(); // Prevent normal form submission
          let formData = $(this).serialize(); // Serialize form data

          $.ajax({
              url: "http://localhost:5001/api/analyze",
              method: "POST",
              data: formData,
              success: function(response) {
                  // Handle success - maybe update the UI with the response
                  console.log("Form submitted successfully");
              },
              error: function(jqXHR, textStatus, errorThrown) {
                  // Handle error
                  console.error("Form submission failed: " + textStatus, errorThrown);
              }
          });
      });


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
      url: "http://localhost:5001/data/item_list?market=" + encodeURIComponent(selectedMarket),
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

    if (query.length < 3) { // Only search if at least 3 characters are typed
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


      function analize_portfolio(){
          
          console.log("start data");
          $.ajax({
              method: "get",
              dataType: "json",
              url : "http://localhost:5001/data/efficient_frontier",
              success: function (data) {
                  console.log(data);
              },
              error: function(jq, status, error){
                  console.log(jq);
                  console.log(status);
                  console.log(error);
              }
          });
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
    } else {
        $("#error-messages").hide();
        createResultSections();
        console.log('Form submitted'); // Replace with actual submission logic
    }
}

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




// Call generateCharts at the appropriate place in your code


      
