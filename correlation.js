
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

//////////////////////////// Heatmap /////////////////////////////////

// 통합버전
// HTML 문서가 로드되면 내부의 함수가 실행되도록 설정하는 이벤트 리스너
document.addEventListener('DOMContentLoaded', async function () {
  // HTML에서 id가 'startYearSelect'인 요소를 찾아서 변수 startYearSelect에 할당
  const startYearSelect = document.getElementById('startYearSelect');
  const endYearSelect = document.getElementById('endYearSelect');

  // Get the current year
  const currentYear = new Date().getFullYear();

  for (let year = 1990; year <= currentYear; year++) {
    const optionStart = document.createElement('option');
    const optionEnd = document.createElement('option');

    // 생성한 <option> 요소에 연도 값을 할당하고 해당 텍스트를 추가
    optionStart.value = year;
    optionStart.textContent = year;
    // <option> 요소(optionStart)를 startYearSelect 요소의 하위 요소로 추가하는 코드 -> 드롭다운 목록을 채움
    startYearSelect.appendChild(optionStart);

    optionEnd.value = year;
    optionEnd.textContent = year;
    endYearSelect.appendChild(optionEnd);
  }
  
  // Define the number of select boxes (market1 to market10)
  const numberOfSelects = 10;

  // Define the options for the market selection
  const marketOptions = ['Korea Stock Market', 'US Stock Market'];

  // Loop through each select box
  for (let i = 1; i <= numberOfSelects; i++) {
      // Select each market select box by its ID
      const marketSelect = document.getElementById(`market${i}`);
      const itemList = document.getElementById(`itemList${i}`);
      const itemInput = document.getElementById(`item${i}`);

      // searchQuery는 사용자가 입력 상자에 입력한 텍스트

      // Function to fetch and filter item list based on market and search query
      // searchQuery는 itemInput으로부터 가져온 입력 상자의 값
      // 사용자가 입력 상자에 어떤 내용을 입력하면, 그 내용은 searchQuery 변수로 전달되어 filterItems() 함수에 전달되고, 
      // 그 후에 회사 이름 목록을 필터링하는 데 사용됨. 이를 통해 사용자가 입력한 검색어에 해당하는 회사 이름을 찾아 목록에 추가

      function filterItems(marketValue, searchQuery) { 
          itemList.innerHTML = ''; // Clear previous options
          
        // File paths based on market selection
        const filePath = (marketValue === 'US Stock Market') ? 'data/file_names_us.csv' : 'data/file_names_kor.csv';
        
        // Fetch data from the file
        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.arrayBuffer(); // Read the response as ArrayBuffer
            })
            .then(buffer => {
                const decoder = new TextDecoder('utf-8'); // UTF-8 Decoder
                const text = decoder.decode(buffer); // Decode the ArrayBuffer to text
        
                // Process the CSV text
                // Split the data into lines
                const lines = text.split('\n');
                lines.forEach(line => {
                    // Process each line
                    const companyName = line.split(',')[0]; // Assuming the company name is in the first column
        
                    // Do something with companyName
                    const optionElement = document.createElement('option');
                    optionElement.value = companyName;
                    optionElement.textContent = companyName;
                    itemList.appendChild(optionElement);
                });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

      }

      // Select box event listeners for market and item input
      marketSelect.addEventListener('change', function () { // marketSelect 요소의 값이 변경될 때마다 실행됨
          const selectedMarket = this.value;
          const searchQuery = itemInput.value.trim();
          filterItems(selectedMarket, searchQuery);
      });

      itemInput.addEventListener('input', function () {
          const selectedMarket = marketSelect.value;
          const searchQuery = this.value.trim();
          filterItems(selectedMarket, searchQuery);
      });

      // Populate the market selection dropdown
      // marketOptions 배열을 기반으로 한 옵션으로 시장 선택(marketSelect)을 위한 드롭다운 메뉴를 채우는 역할을 함
      marketOptions.forEach(option => {
          const optionElement = document.createElement('option');
          optionElement.value = option;
          optionElement.textContent = option;
          marketSelect.appendChild(optionElement);
      });
  }

  // 플라스크로 연결하는 부분
  async function performDataPreprocessing(startYear, endYear, markets, items) {
    let new_df = null;

    // 비동기적으로 CSV 데이터를 가져오기 위한 프로미스를 생성
    const promises = markets.map((market, index) => {
        const item = items[index];

        // Construct the URL for the Flask endpoint
        const url = `https://api.ninahas.io/scrape/get_csv_data?market=${encodeURIComponent(market)}&item=${encodeURIComponent(item)}`;

        // Return a new Promise for the asynchronous operation
        // $.ajax를 사용하여 Flask 서버에 요청함
        return new Promise((resolve, reject) => {
            $.ajax({
                url: url,
                method: 'GET',
                dataType: 'json', // Expect JSON response
                success: function(data) {
                    // Convert the JSON data back into a DataFrame
                    let df = new dfd.DataFrame(data.data, { columns: data.columns });

                     // 필터링을 위한 날짜 범위를 설정
                    const mask = df['Date'].apply(date => {
                    const year = parseInt(date.split('-')[0]);
                    return year >= parseInt(startYear) && year <= parseInt(endYear);
                    });
                    let filteredData = df.loc({ rows: mask });
                    let dateColumn = filteredData['Date'];
                    let closeColumn = filteredData['Close'].dropNa();

                    // 'Date'와 각 항목의 'Close' 값으로 새 DataFrame을 생성
                    let itemDf = new dfd.DataFrame({ 'Date': dateColumn.values, [item]: closeColumn.values });

                    // 이전에 생성된 DataFrame과 병합
                    if (new_df === null) {
                        new_df = itemDf;
                    } else {
                        new_df = dfd.merge({ left: new_df, right: itemDf, on: ['Date'], how: 'inner' });
                    }

                    resolve(df); // Resolve the promise with the DataFrame
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.error('Error fetching data:', textStatus, errorThrown);
                    reject(errorThrown); // 오류가 발생하면 Promise를 거부
                }
            });
        });
    });

    // 모든 프로미스가 완료될 때까지 기다림
    await Promise.all(promises);

    // 병합된 DataFrame을 반환
    return new_df;
  }

  // async function performDataPreprocessing(startYear, endYear, markets, items) {
  //   let new_df = null;

  //   const promises = markets.map((market, index) => {
  //       const item = items[index];
  //       return dfd.readCSV(`data/${market}/${item}.csv`)
  //           .then(df => {
  //               // Filter by date range first
  //               const mask = df['Date'].apply(date => {
  //                   const year = parseInt(date.split('-')[0]);
  //                   return year >= parseInt(startYear) && year <= parseInt(endYear);
  //               });
  //               let filteredData = df.loc({ rows: mask });
  //               let dateColumn = filteredData['Date'];
  //               let closeColumn = filteredData['Close'].dropNa();

  //               // Create a new DataFrame with 'Date' and the item's 'Close' values
  //               let itemDf = new dfd.DataFrame({ 'Date': dateColumn.values, [item]: closeColumn.values });  // []를 붙여야 item 이름으로 컬럼명이 지정됨!

  //               if (new_df === null) {
  //                   new_df = itemDf;
  //               } else {
  //                   // Perform inner merge on 'Date'
  //                   // addColumn 함수를 쓰면 행의 길이가 다른 컬럼을 합치는게 불가능하므로 merge 함수를 써야 함!
  //                   new_df = dfd.merge({ left: new_df, right: itemDf, on: ['Date'], how: 'inner' });  // on에서 [] 넣어줘야 함!
  //               }
  //           })
  //           .catch(err => {
  //               console.log(err);
  //           });
  //   });

  //   await Promise.all(promises);
  //   // console.log('new_df after merging:');
  //   // new_df.print();

  //   return new_df;
  // }


  // Event listener for form submission
  document.getElementById('submitButton1').addEventListener('click', async function (event) {
    event.preventDefault();

    // Get start year and end year values
    const startYear = parseInt(document.getElementById('startYearSelect').value);
    const endYear = parseInt(document.getElementById('endYearSelect').value);

    // Create arrays to store selected markets and items
    const markets = [];
    const items = [];

    for (let i = 1; i <= 10; i++) {
      const market = document.getElementById(`market${i}`).value;
      const item = document.getElementById(`item${i}`).value;

      if (market && item) {
        markets.push(market);
        items.push(item);
      }
    }

    // Perform data preprocessing
    corr_data = await performDataPreprocessing(startYear, endYear, markets, items);
    // console.log("corr_data");
    // console.log(corr_data);
    // corr_data.print();

    df = corr_data.drop({ columns: ["Date"], axis: 1 })
    // df.print();

    function pearsonCorrelation(arr1, arr2) {

      let n = arr1.length;
      let sumX = arr1.reduce((a, b) => a + b, 0);
      let sumY = arr2.reduce((a, b) => a + b, 0);
    
      let sumXY = arr1.map((x, i) => x * arr2[i]).reduce((a, b) => a + b, 0);
      let sumX2 = arr1.map(x => x * x).reduce((a, b) => a + b, 0);
      let sumY2 = arr2.map(y => y * y).reduce((a, b) => a + b, 0);
    
      let numerator = n * sumXY - sumX * sumY;
      let denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
      if (denominator === 0) {
        return 0; // If the denominator is 0, correlation is not defined
      }
    
      return numerator / denominator;
    }

    async function calculateCorrelationMatrix(df) {
      let cols = df.columns;
      let correlationMatrix = {};
    
      for (let i = 0; i < cols.length; i++) {
        correlationMatrix[cols[i]] = {};
        for (let j = 0; j < cols.length; j++) {
          // Make sure to retrieve Series objects from the DataFrame
          let col1Series = df.column(cols[i]);
          let col2Series = df.column(cols[j]);
    
          // Then get the values as arrays
          let col1Data = col1Series.values;
          let col2Data = col2Series.values;
    
          // Make sure both columns are defined and have values
          if (col1Data && col2Data) {
            let corrValue = pearsonCorrelation(col1Data, col2Data);
            correlationMatrix[cols[i]][cols[j]] = corrValue;
          } else {
            // Handle the case where data is not available
            console.error(`Data not available for columns: ${cols[i]}, ${cols[j]}`);
          }
        }
      }
    
      return correlationMatrix;
    }
    
    calculateCorrelationMatrix(df).then(corrMatrix => {
        console.log("corrMatrix");
        console.log(corrMatrix);
        // Convert to JSON or perform other operations as needed

        let corr_data = [];

        // Iterate over all the items in the correlation matrix
        Object.keys(corrMatrix).forEach(item1 => {
          Object.keys(corrMatrix[item1]).forEach(item2 => {
            corr_data.push({
              item1: item1,
              item2: item2,
              cor: corrMatrix[item1][item2]
            });
          });
        });

        // Now corr_data contains the correlation data in the required format
        console.log("corr_data");
        console.log(corr_data);

        // Vega-Lite specification
        var vlSpec = {
          $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
          width: 340, 
          height: 340, 
          mark: { type: 'rect', tooltip: { content: 'data' }, clip: true },
          data: { values: corr_data },
          encoding: {
            x: { field: 'item1', type: 'nominal' },
            y: { field: 'item2', type: 'nominal' },
            // color: { field: 'cor', type: 'quantitative' },
            color: { 
              field: 'cor', 
              type: 'quantitative', 
              scale: { scheme: 'redyellowblue', reverse: true } // 변경된 부분
            }
            // Add more encodings or transformations as needed
          }
        };

        // Embed the visualization in the 'heatmap' div
        vegaEmbed('#heatmap', vlSpec)
          .then(function(result) {})
          .catch(console.error);

    });

  });

  
});

//////////////////////////// select box for Network ///////////////////////////////////////

// Populate both dropdowns on page load
populateDropdown('sector1');
populateDropdown('sector2');

// Function to populate dropdown with sectors
function populateDropdown(sectorId) {
  var sectorList = ['서비스업','기타금융','유통업','섬유의복','운수창고업',
  '음식료품','비금속광물','증권','보험','전기전자','화학','건설업','철강금속','기계','운수장비','광업','의약품',
  '통신업','기타제조업','전기가스업','종이목재','은행','의료정밀','농업, 임업 및 어업']

  // 제공된 sectorId를 사용하여 드롭다운 요소를 가져옴
  var dropdown = document.getElementById(sectorId);

  // 드롭다운 내의 기존 옵션을 모두 지움. 새 옵션으로 드롭다운을 채우기 전에 드롭다운이 비어 있는지 확인
  dropdown.innerHTML = '';

  // 각 섹터에 대해 새로운 <option> 요소를 생성
  sectorList.forEach(function (sector) {
    var option = document.createElement('option');
    option.text = sector;
    option.value = sector;
    // 새로 생성된 <option> 요소를 드롭다운에 추가
    dropdown.appendChild(option);
  });

  // Attach event listener to handle selection change
  // 'change' 이벤트가 발생하면(예: 사용자가 드롭다운에서 다른 옵션을 선택하는 경우) 
  // anonymous function인 (function () { /* code here */ }를 사용하여 정의됨)가 실행
  dropdown.addEventListener('change', function () {
    handleSelectionChange(); // Call handleSelectionChange when a selection changes
  });
}

// Add a flag to check if both sectors have been selected
let sector1Selected = false;
let sector2Selected = false;

// Update the event listener for sector1 to set the flag and call handleSelectionChange
document.getElementById('sector1').addEventListener('change', function () {
  sector1Selected = true;
  // console.log("sector1Selected", sector1Selected);
});

// Update the event listener for sector2 to set the flag and call handleSelectionChange
document.getElementById('sector2').addEventListener('change', function () {
  sector2Selected = true;
  // console.log("sector1Selected", sector1Selected);
  handleSelectionChange();
  // console.log("handleSelectionChange 실행");
});


let selected_nodes_list = [];
let selected_links_list = [];

// Step 1: Function to handle selection change in sector1 and sector2
// handleSelectionChange()는 두 개의 선택 상자(sector1과 sector2)에서 선택이 변경되었을 때 호출되며, 
// 선택된 섹터에 해당하는 노드를 찾고, 해당 노드에 연결된 링크를 추출하는 일련의 작업을 수행
function handleSelectionChange() {
  // Assuming sector1 and sector2 are the IDs of the selection boxes
  const sector1 = document.getElementById('sector1').value;
  const sector2 = document.getElementById('sector2').value;

  if (sector1Selected && sector2Selected) {  // sector1과 sector2가 모두 선택이 된 다음에 아래 실행
  // Load and parse the kospi_nodes.json file
  fetch('data/kospi_nodes_final.json')
    .then(response => response.json())  // 이 파일은 데이터를 포함하고 있으며, 데이터는 JSON 형식으로 파싱됨
    .then(data => { // .then(data => { /* 코드 */ })를 사용하여 JSON 데이터에 접근
      // 선택된 섹터에 해당하는 노드들을 필터링하여 nodes 배열에 저장
      const nodes = data.nodes.filter(node =>
        node.group === sector1 || node.group === sector2
      );

      // Add the matched nodes to selected_nodes
      // 선택된 노드를 selected_nodes 배열에 추가. selected_nodes는 id와 group을 포함하는 객체들의 배열임
      selected_nodes = nodes.map(node => ({ id: node.id, group: node.group }));
      console.log('Selected nodes:', selected_nodes);
      // 선택된 노드의 id만을 포함하는 배열
      selected_nodes_list = selected_nodes.map(node => node.id);
      console.log('selected_nodes_list:', selected_nodes_list);
      
      // Once nodes are selected, extract corresponding links
      // 선택된 노드를 기반으로 해당하는 링크를 추출
      extractSelectedLinks();
    })
    .catch(error => console.error('Error fetching nodes:', error));
  }
}

// Step 2: Extract corresponding links from kospi_links_one_side.json
// Function to filter and extract links based on selected_nodes
function extractSelectedLinks() {
  // Load and parse the kospi_links_one_side.json file
  fetch('data/kospi_links_one_side.json')
    .then(response => response.json())
    .then(linksData => {
      // Filter links matching the selected nodes - 선택된 노드에 맞는 링크를 필터링
      const links = linksData.links.filter(link =>
        link.value >= 0.85 &&
        selected_nodes_list.includes(link.source) && selected_nodes_list.includes(link.target)
      );

      // Add the matched links to selected_links - 선택된 링크를 selected_links에 추가
      selected_links = links.map(link => ({
        source: link.source,
        target: link.target,
        value: link.value
        // s: selected_nodes_list.includes(link.source),
        // t: selected_nodes_list.includes(link.target)
      }));
      // console.log('Selected links:', selected_links);

      // Save selected nodes and links - 선택된 노드 및 링크를 저장
      saveData(selected_nodes, selected_links);
    })
    .catch(error => console.error('Error fetching links:', error));
}

// var graph;

// Step 3: Save selected_nodes and selected_links in data variable in JSON format
function saveData(nodes, links) {
  graph = {
    "nodes": nodes,
    "links": links
  };
  console.log('Final data:', graph);

  drawNetworkGraph(graph);
}


////////////////////////// Network visualization ///////////////////////////////

// Example of toggling visibility using plain JavaScript
// submitButton2 버튼을 눌렀을 때, 결과창 보여지기 하는 코드

// 1) submitButton2를 클릭하면, showResults 함수 호출
document.getElementById('submitButton1').addEventListener('click', toggleVisibility1);
document.getElementById('submitButton2').addEventListener('click', showResults);
const resultContent1 = document.getElementById('result-content1');
const resultContent2 = document.getElementById('result-content2');
// Function to toggle visibility
function toggleVisibility1() {
    if (resultContent1.style.display === 'none') {
        resultContent1.style.display = 'block'; // Show the content
    } else {
        resultContent1.style.display = 'none'; // Hide the content
    }
}
function toggleVisibility2() {
  if (resultContent2.style.display === 'none') {
      resultContent2.style.display = 'block'; // Show the content
  } else {
      resultContent2.style.display = 'none'; // Hide the content
  }
}
// 2) showResults 함수 호출하면 -> toggleVisibility() 함수 호출되면서 화면에 보여짐
// Function to show results (assuming data parameter is used to draw the graph)
function showResults(data) {
  if (!data) {
    console.error("Invalid data received:", data);
    return;
  }

  // Show the result content after drawing the graph
  toggleVisibility2();

}


function drawNetworkGraph(graph) {

  var svg = d3.select("#network-graph"),
  // var svg = d3.select("svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height");

  var color = d3.scaleOrdinal()
      .range(["#FF6666", "#3366FF"]);  // 색상 바꿀 때, 앞에 # 붙여야 함

  var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));

  // // Tooltip element
  var tooltip = d3.select("svg") //  var tooltip = d3.select("#network-graph")
      .append("div")
      .attr("class", "tooltip");
  // var tooltip = d3.select("#network-graph") // Set tooltip to append to the SVG
  //   .append("div")
  //   .attr("class", "tooltip")
  //   .style("position", "absolute") // Set position to absolute for better positioning
  //   .style("display", "none"); // Hide initially

  
  function showLinkInfo(d) {
    var sourceId = d.source.id;
    var targetId = d.target.id;
    tooltip.style("display", "block");
    tooltip.html(`<strong>[Link Information]</strong><br><strong>Source:</strong> ${sourceId}<br><strong>Target:</strong> ${targetId}<br><strong>Value:</strong> ${d.value}`)
      // .style("left", (d3.event.pageX + 10) + "px") // Position the tooltip next to the mouse pointer
      // .style("top", (d3.event.pageY - 20) + "px"); // Position the tooltip slightly above the mouse pointer
      .style("left", (width - 200) + "px") // Adjust x-coordinate for horizontal positioning
      .style("top", "100px"); // Fixed y-coordinate for top positioning
    }

  function showNodeInfo(d) {
    tooltip.style("display", "block");
    tooltip.html(`<strong>Item ID:</strong> ${d.id}<br><strong>Group:</strong> ${d.group}`)
      // .style("left", (d3.event.pageX + 10) + "px") // Position the tooltip next to the mouse pointer
      // .style("top", (d3.event.pageY - 20) + "px"); // Position the tooltip slightly above the mouse pointer
      .style("left", (width - 200) + "px") // Adjust x-coordinate for horizontal positioning
      .style("top", "100px"); // Fixed y-coordinate for top positioning
    }

    // // Filter links based on the value being 0.5 or higher
    // var filteredLinks = graph.links.filter(function(link) {
    //   return link.value >= 0.85;
    // });
    
      // // Count the number of links connected to each node
      // var nodeLinksCount = {};
      // filteredLinks.forEach(function(link) {
      //   nodeLinksCount[link.source.id] = (nodeLinksCount[link.source.id] || 0) + 1;
      //   nodeLinksCount[link.target.id] = (nodeLinksCount[link.target.id] || 0) + 1;
      // });
      
  
    var link = svg.append("g")
        .attr("class", "links")
      .selectAll("line")
      // .data(filteredLinks)
      .data(graph.links)
      .enter().append("line")
        // .attr("stroke-width", function(d) { return Math.sqrt(d.value); })
        // .attr("stroke", "#999")
        // .attr("stroke-opacity", 0.6)
        .attr("stroke-width", function(d) { 
        // Map link values to stroke widths using a power scale
        // Adjust the exponent (e.g., 2) to control the scaling effect
        var scale = d3.scalePow().exponent(2).domain([0.8, 1]).range([-5, 5]); // Example domain and range
        return scale(d.value);
        })
        .on("mouseover", showLinkInfo) // Show link information on mouseover
        .on("mouseout", hideTooltip);
  
    var node = svg.append("g")
        .attr("class", "nodes")
      .selectAll("circle")
      .data(graph.nodes)
      .enter().append("circle")
        .attr("r", 11) // 증가된 원의 크기
        //.attr("r", 5)
        // .attr("r", function(d) { 
        //   // Set radius based on the number of links connected to each node
        //   return Math.max(5, nodeLinksCount[d.id] * 1.5); // Adjust the scale factor as needed
        // })
        .attr("fill", function(d) { return color(d.group); })
        .on("mouseover", showNodeInfo) // Show node information on mouseover
        .on("mouseout", hideTooltip) // Hide tooltip on mouseout
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    // 노드에 텍스트 추가
    var texts = svg.append("g")
    .attr("class", "texts")
    .selectAll("text")
    .data(graph.nodes)
    .enter().append("text")
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d) { return d.y; })
    .text(function(d) { return d.id; }) // 각 노드의 ID를 텍스트로 표시
    .attr("text-anchor", "middle") // 텍스트를 중앙 정렬
    .attr("alignment-baseline", "middle") // 수직 중앙 정렬
    .style("fill", "white") // 텍스트 색상을 흰색으로 변경
    .style("font-size", "7px"); // 텍스트 크기 감소
  
    node.append("title")
        .text(function(d) { return d.id; });
  
    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);
  
    simulation.force("link")
        .links(graph.links);
  
    function ticked() {
      link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });
  
      node
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
      
      texts
          .attr("x", function(d) { return d.x; })
          .attr("y", function(d) { return d.y; });
    }
  
    // 노드 위에 마우스를 대면, 해당 노드에 연결된 노드들의 색깔이 변하도록 함
    // When you hover the mouse over a node, the colors of the nodes connected to that node change.
    node.on("mouseover", function(d) {
      // Extracts the IDs of nodes connected to the hovered node (d)
      var connectedNodeIds = graph
        .links
        .filter(x => x.source.id == d.id || x.target.id == d.id)
        .map(x => x.source.id == d.id ? x.target.id : x.source.id);
    
      // Selects all circle nodes and changes their fill color based on their connection to the hovered node
      d3.select(".nodes")
        .selectAll("circle")
        .attr("fill", function(c) {
          if (connectedNodeIds.indexOf(c.id) > -1 || c.id == d.id) {
            return "#CCFF00"; // Change connected node color
          } else {
            return color(c.group); // Maintain the original color based on the node's group
          }
        })

        // d3.selectAll(".nodes circle")
        // .style("stroke", function(c) {
        //   return connectedNodeIds.indexOf(c.id) > -1 || c.id === d.id ? "black" : "white";
        //         // Set stroke color to black for connected nodes, otherwise set to none
        // })

        d3.selectAll(".links line") // Target all links
        // .style("stroke", function(link) {
        //   return link.source.id === d.id || link.target.id === d.id ? "#CCFFCC" : "#999"; // Change link color to black for connected links
        // })
        .style("stroke", function(link) {
          return link.source.id === d.id || link.target.id === d.id ? "white" : "#999"; // Change link color to black for connected links
        }) // 링크 색을 흰색으로!
        // .style("stroke-width", function(link) {
        //   return link.source.id === d.id || link.target.id === d.id ? 2 : 1; // Increase link thickness to 2 for connected links, otherwise 1
        // })
        .style("stroke-opacity", function(link) {
          return link.source.id === d.id || link.target.id === d.id ? 1 : 0.6; // Set stroke opacity to 1 for connected links, otherwise 0.5
        })

        // 연결된 노드의 텍스트 색상을 검은색으로 변경
        d3.selectAll(".texts text")
        .style("fill", function(c) {
          return connectedNodeIds.indexOf(c.id) > -1 || c.id === d.id ? "black" : "white";
        });

    });

    node.on("mouseout", function(d) {
      // Reset the fill color and stroke color of all circle nodes to their original colors based on their groups
      d3.select(".nodes")
        .selectAll("circle")
        .attr("fill", function(c) {
          return color(c.group); // Reset fill color based on the node's group
        })
        .attr("stroke", "none"); // Reset fill color based on the node's group
        
      d3.selectAll(".links line") // Target all links
      .style("stroke-width", function(d) { 
        // Map link values to stroke widths using a power scale
        // Adjust the exponent (e.g., 2) to control the scaling effect
        var scale = d3.scalePow().exponent(2).domain([0.8, 1]).range([-5, 5]); // Example domain and range
        return scale(d.value);
        })
      .style("stroke", "#999") // Reset link color to default
      .style("stroke-opacity", 0.6);

      d3.selectAll(".texts text")
        .style("fill", "white");

    });

    // Function to hide tooltip
    function hideTooltip() {
      tooltip.style("display", "none");
    }
  // });
  
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }
  
  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

}

