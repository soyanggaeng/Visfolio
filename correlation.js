
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

//////////////////////////// Heatmap /////////////////////////////////

var corr_data = [{'item1': 'AJ네트웍스', 'item2': 'AJ네트웍스', 'cor': 1.0}, {'item1': 'AJ네트웍스', 'item2': 'AK홀딩스', 'cor': 0.5808991997452422}, {'item1': 'AJ네트웍스', 'item2': 'BGF', 'cor': 0.616733883261061}, {'item1': 'AJ네트웍스', 'item2': '삼성전자', 'cor': -0.4618927786873072}, {'item1': 'AJ네트웍스', 'item2': '아모레퍼시픽', 'cor': 0.6468522834150147}, {'item1': 'AJ네트웍스', 'item2': '카카오', 'cor': -0.22246497296865567}, {'item1': 'AJ네트웍스', 'item2': '경동나비엔', 'cor': -0.13246063488448556}, {'item1': 'AJ네트웍스', 'item2': '금호타이어', 'cor': 0.5240724651068914}, {'item1': 'AJ네트웍스', 'item2': '기아', 'cor': -0.070655577945304}, {'item1': 'AJ네트웍스', 'item2': '빙그레', 'cor': 0.2524327211079841}, {'item1': 'AK홀딩스', 'item2': 'AJ네트웍스', 'cor': 0.5808991997452422}, {'item1': 'AK홀딩스', 'item2': 'AK홀딩스', 'cor': 1.0}, {'item1': 'AK홀딩스', 'item2': 'BGF', 'cor': 0.6891861915340353}, {'item1': 'AK홀딩스', 'item2': '삼성전자', 'cor': -0.6739445868991941}, {'item1': 'AK홀딩스', 'item2': '아모레퍼시픽', 'cor': 0.8034018018942896}, {'item1': 'AK홀딩스', 'item2': '카카오', 'cor': -0.6289256377252997}, {'item1': 'AK홀딩스', 'item2': '경동나비엔', 'cor': 0.060416649043513605}, {'item1': 'AK홀딩스', 'item2': '금호타이어', 'cor': 0.6914095198327443}, {'item1': 'AK홀딩스', 'item2': '기아', 'cor': -0.6507087866352705}, {'item1': 'AK홀딩스', 'item2': '빙그레', 'cor': 0.7106891377164657}, {'item1': 'BGF', 'item2': 'AJ네트웍스', 'cor': 0.616733883261061}, {'item1': 'BGF', 'item2': 'AK홀딩스', 'cor': 0.6891861915340353}, {'item1': 'BGF', 'item2': 'BGF', 'cor': 1.0}, {'item1': 'BGF', 'item2': '삼성전자', 'cor': -0.6938834209837871}, {'item1': 'BGF', 'item2': '아모레퍼시픽', 'cor': 0.8274508560518724}, {'item1': 'BGF', 'item2': '카카오', 'cor': -0.5181140714213462}, {'item1': 'BGF', 'item2': '경동나비엔', 'cor': -0.24971555714036314}, {'item1': 'BGF', 'item2': '금호타이어', 'cor': 0.8403869490093576}, {'item1': 'BGF', 'item2': '기아', 'cor': -0.4042511668097954}, {'item1': 'BGF', 'item2': '빙그레', 'cor': 0.5027003371693426}, {'item1': '삼성전자', 'item2': 'AJ네트웍스', 'cor': -0.4618927786873072}, {'item1': '삼성전자', 'item2': 'AK홀딩스', 'cor': -0.6739445868991941}, {'item1': '삼성전자', 'item2': 'BGF', 'cor': -0.6938834209837871}, {'item1': '삼성전자', 'item2': '삼성전자', 'cor': 1.0}, {'item1': '삼성전자', 'item2': '아모레퍼시픽', 'cor': -0.6298299847678832}, {'item1': '삼성전자', 'item2': '카카오', 'cor': 0.8200594535994847}, {'item1': '삼성전자', 'item2': '경동나비엔', 'cor': 0.38351606811199934}, {'item1': '삼성전자', 'item2': '금호타이어', 'cor': -0.5794978446569281}, {'item1': '삼성전자', 'item2': '기아', 'cor': 0.7094213381186582}, {'item1': '삼성전자', 'item2': '빙그레', 'cor': -0.5527141864779478}, {'item1': '아모레퍼시픽', 'item2': 'AJ네트웍스', 'cor': 0.6468522834150147}, {'item1': '아모레퍼시픽', 'item2': 'AK홀딩스', 'cor': 0.8034018018942896}, {'item1': '아모레퍼시픽', 'item2': 'BGF', 'cor': 0.8274508560518724}, {'item1': '아모레퍼시픽', 'item2': '삼성전자', 'cor': -0.6298299847678832}, {'item1': '아모레퍼시픽', 'item2': '아모레퍼시픽', 'cor': 1.0}, {'item1': '아모레퍼시픽', 'item2': '카카오', 'cor': -0.39512984211874325}, {'item1': '아모레퍼시픽', 'item2': '경동나비엔', 'cor': 0.07986781914642205}, {'item1': '아모레퍼시픽', 'item2': '금호타이어', 'cor': 0.8169264066274052}, {'item1': '아모레퍼시픽', 'item2': '기아', 'cor': -0.413828187468009}, {'item1': '아모레퍼시픽', 'item2': '빙그레', 'cor': 0.6231240609694045}, {'item1': '카카오', 'item2': 'AJ네트웍스', 'cor': -0.22246497296865567}, {'item1': '카카오', 'item2': 'AK홀딩스', 'cor': -0.6289256377252997}, {'item1': '카카오', 'item2': 'BGF', 'cor': -0.5181140714213462}, {'item1': '카카오', 'item2': '삼성전자', 'cor': 0.8200594535994847}, {'item1': '카카오', 'item2': '아모레퍼시픽', 'cor': -0.39512984211874325}, {'item1': '카카오', 'item2': '카카오', 'cor': 1.0}, {'item1': '카카오', 'item2': '경동나비엔', 'cor': 0.4335783001493612}, {'item1': '카카오', 'item2': '금호타이어', 'cor': -0.37990674413517656}, {'item1': '카카오', 'item2': '기아', 'cor': 0.7842802046837066}, {'item1': '카카오', 'item2': '빙그레', 'cor': -0.40465518330605255}, {'item1': '경동나비엔', 'item2': 'AJ네트웍스', 'cor': -0.13246063488448556}, {'item1': '경동나비엔', 'item2': 'AK홀딩스', 'cor': 0.060416649043513605}, {'item1': '경동나비엔', 'item2': 'BGF', 'cor': -0.24971555714036314}, {'item1': '경동나비엔', 'item2': '삼성전자', 'cor': 0.38351606811199934}, {'item1': '경동나비엔', 'item2': '아모레퍼시픽', 'cor': 0.07986781914642205}, {'item1': '경동나비엔', 'item2': '카카오', 'cor': 0.4335783001493612}, {'item1': '경동나비엔', 'item2': '경동나비엔', 'cor': 1.0}, {'item1': '경동나비엔', 'item2': '금호타이어', 'cor': 0.13729048430124374}, {'item1': '경동나비엔', 'item2': '기아', 'cor': 0.17846387802449665}, {'item1': '경동나비엔', 'item2': '빙그레', 'cor': 0.08892821421248875}, {'item1': '금호타이어', 'item2': 'AJ네트웍스', 'cor': 0.5240724651068914}, {'item1': '금호타이어', 'item2': 'AK홀딩스', 'cor': 0.6914095198327443}, {'item1': '금호타이어', 'item2': 'BGF', 'cor': 0.8403869490093576}, {'item1': '금호타이어', 'item2': '삼성전자', 'cor': -0.5794978446569281}, {'item1': '금호타이어', 'item2': '아모레퍼시픽', 'cor': 0.8169264066274052}, {'item1': '금호타이어', 'item2': '카카오', 'cor': -0.37990674413517656}, {'item1': '금호타이어', 'item2': '경동나비엔', 'cor': 0.13729048430124374}, {'item1': '금호타이어', 'item2': '금호타이어', 'cor': 1.0}, {'item1': '금호타이어', 'item2': '기아', 'cor': -0.3012610019711417}, {'item1': '금호타이어', 'item2': '빙그레', 'cor': 0.5133655469514059}, {'item1': '기아', 'item2': 'AJ네트웍스', 'cor': -0.070655577945304}, {'item1': '기아', 'item2': 'AK홀딩스', 'cor': -0.6507087866352705}, {'item1': '기아', 'item2': 'BGF', 'cor': -0.4042511668097954}, {'item1': '기아', 'item2': '삼성전자', 'cor': 0.7094213381186582}, {'item1': '기아', 'item2': '아모레퍼시픽', 'cor': -0.413828187468009}, {'item1': '기아', 'item2': '카카오', 'cor': 0.7842802046837066}, {'item1': '기아', 'item2': '경동나비엔', 'cor': 0.17846387802449665}, {'item1': '기아', 'item2': '금호타이어', 'cor': -0.3012610019711417}, {'item1': '기아', 'item2': '기아', 'cor': 1.0}, {'item1': '기아', 'item2': '빙그레', 'cor': -0.5769556894996385}, {'item1': '빙그레', 'item2': 'AJ네트웍스', 'cor': 0.2524327211079841}, {'item1': '빙그레', 'item2': 'AK홀딩스', 'cor': 0.7106891377164657}, {'item1': '빙그레', 'item2': 'BGF', 'cor': 0.5027003371693426}, {'item1': '빙그레', 'item2': '삼성전자', 'cor': -0.5527141864779478}, {'item1': '빙그레', 'item2': '아모레퍼시픽', 'cor': 0.6231240609694045}, {'item1': '빙그레', 'item2': '카카오', 'cor': -0.40465518330605255}, {'item1': '빙그레', 'item2': '경동나비엔', 'cor': 0.08892821421248875}, {'item1': '빙그레', 'item2': '금호타이어', 'cor': 0.5133655469514059}, {'item1': '빙그레', 'item2': '기아', 'cor': -0.5769556894996385}, {'item1': '빙그레', 'item2': '빙그레', 'cor': 1.0}]

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

//////////////////////////// select box ///////////////////////////////

// JavaScript to populate the start year and end year select elements
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

document.addEventListener('DOMContentLoaded', function () {
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

      // Function to fetch and filter item list based on market and search query
      function filterItems(marketValue, searchQuery) {
          itemList.innerHTML = ''; // Clear previous options
          
          // File paths based on market selection
          const filePath = (marketValue === 'US Stock Market') ? 'data/file_names_us.csv' : 'data/file_names_kor.csv';

          // Fetch data from the file and filter based on search query
          fetch(filePath)
              .then(response => response.text())
              .then(data => {
                  const lines = data.split('\n');
                  lines.forEach(line => {
                      const companyName = line.split(',')[0]; // Assuming the company name is in the first column
                      
                      if (companyName.toLowerCase().includes(searchQuery.toLowerCase())) {
                          const optionElement = document.createElement('option');
                          optionElement.value = companyName;
                          itemList.appendChild(optionElement);
                      }
                  });
              })
              .catch(error => {
                  console.error('Error fetching data:', error);
              });
      }

      // Select box event listeners for market and item input
      marketSelect.addEventListener('change', function () {
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
      marketOptions.forEach(option => {
          const optionElement = document.createElement('option');
          optionElement.value = option;
          optionElement.textContent = option;
          marketSelect.appendChild(optionElement);
      });
  }
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

// Import the necessary libraries
// 자바스크립트로 직접 상관관계 계산하는 코드 작성
// function extractSelectedLinks() {

//   // Step 1: Load the CSV file and save the data as a DataFrame

//   dfd.readCSV('data/kospi_1year_no_missing.csv')
//   .then(function(df) {

//     df.print();

//     // Step 2: Extract columns with stock names included in selected_nodes_list
//     selected_nodes_list = ['신세계 I&C', '한전기술'];
//     let filtered_df = df.loc({columns: selected_nodes_list});
//     // filtered_df.print();

//     // // Step 3: Calculate the correlation matrix
//     // const correlationMatrix = filtered_df.corr();

//     // // Extract pairs with a correlation value of 0.5 or higher, excluding the diagonal
//     // const selected_links = [];
//     // const columns = correlationMatrix.columns;
//     // for (let i = 0; i < columns.length; i++) {
//     //   for (let j = i + 1; j < columns.length; j++) {
//     //     const value = correlationMatrix.values[i][j];

//     //     if (value >= 0.5 && value !== 1) {
//     //       selected_links.push({
//     //         source: columns[i],
//     //         target: columns[j],
//     //         value: value
//     //         // value: value.toFixed(2) // Rounding to two decimal places
//     //       });
//     //     }
//     //   }
//     // }

//     // // Step 4: Save the final graph information
//     // const graph = {
//     //   nodes: selected_nodes,
//     //   links: selected_links
//     // };

//     // // Do whatever you need to do with the 'graph' object here
//     // console.log('Final graph information:', graph);

//   }).catch(err=>{
//      console.log(err);
//   })

// }

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
  // const svg = d3.select("#network-graph");
  // console.log('data in draNetwork:', graph);  // 잘 전달 됨
  // var svg = d3.select("#network-graph")
  // .append("svg")
  // .attr("width", width)
  // .attr("height", height)
  // .append("g")
  // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
        .attr("r", 5)
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

// //////////////////////////// Heatmap /////////////////////////////////

// var corr_data = [{'item1': 'AJ네트웍스', 'item2': 'AJ네트웍스', 'cor': 1.0}, {'item1': 'AJ네트웍스', 'item2': 'AK홀딩스', 'cor': 0.5808991997452422}, {'item1': 'AJ네트웍스', 'item2': 'BGF', 'cor': 0.616733883261061}, {'item1': 'AJ네트웍스', 'item2': '삼성전자', 'cor': -0.4618927786873072}, {'item1': 'AJ네트웍스', 'item2': '아모레퍼시픽', 'cor': 0.6468522834150147}, {'item1': 'AJ네트웍스', 'item2': '카카오', 'cor': -0.22246497296865567}, {'item1': 'AJ네트웍스', 'item2': '경동나비엔', 'cor': -0.13246063488448556}, {'item1': 'AJ네트웍스', 'item2': '금호타이어', 'cor': 0.5240724651068914}, {'item1': 'AJ네트웍스', 'item2': '기아', 'cor': -0.070655577945304}, {'item1': 'AJ네트웍스', 'item2': '빙그레', 'cor': 0.2524327211079841}, {'item1': 'AK홀딩스', 'item2': 'AJ네트웍스', 'cor': 0.5808991997452422}, {'item1': 'AK홀딩스', 'item2': 'AK홀딩스', 'cor': 1.0}, {'item1': 'AK홀딩스', 'item2': 'BGF', 'cor': 0.6891861915340353}, {'item1': 'AK홀딩스', 'item2': '삼성전자', 'cor': -0.6739445868991941}, {'item1': 'AK홀딩스', 'item2': '아모레퍼시픽', 'cor': 0.8034018018942896}, {'item1': 'AK홀딩스', 'item2': '카카오', 'cor': -0.6289256377252997}, {'item1': 'AK홀딩스', 'item2': '경동나비엔', 'cor': 0.060416649043513605}, {'item1': 'AK홀딩스', 'item2': '금호타이어', 'cor': 0.6914095198327443}, {'item1': 'AK홀딩스', 'item2': '기아', 'cor': -0.6507087866352705}, {'item1': 'AK홀딩스', 'item2': '빙그레', 'cor': 0.7106891377164657}, {'item1': 'BGF', 'item2': 'AJ네트웍스', 'cor': 0.616733883261061}, {'item1': 'BGF', 'item2': 'AK홀딩스', 'cor': 0.6891861915340353}, {'item1': 'BGF', 'item2': 'BGF', 'cor': 1.0}, {'item1': 'BGF', 'item2': '삼성전자', 'cor': -0.6938834209837871}, {'item1': 'BGF', 'item2': '아모레퍼시픽', 'cor': 0.8274508560518724}, {'item1': 'BGF', 'item2': '카카오', 'cor': -0.5181140714213462}, {'item1': 'BGF', 'item2': '경동나비엔', 'cor': -0.24971555714036314}, {'item1': 'BGF', 'item2': '금호타이어', 'cor': 0.8403869490093576}, {'item1': 'BGF', 'item2': '기아', 'cor': -0.4042511668097954}, {'item1': 'BGF', 'item2': '빙그레', 'cor': 0.5027003371693426}, {'item1': '삼성전자', 'item2': 'AJ네트웍스', 'cor': -0.4618927786873072}, {'item1': '삼성전자', 'item2': 'AK홀딩스', 'cor': -0.6739445868991941}, {'item1': '삼성전자', 'item2': 'BGF', 'cor': -0.6938834209837871}, {'item1': '삼성전자', 'item2': '삼성전자', 'cor': 1.0}, {'item1': '삼성전자', 'item2': '아모레퍼시픽', 'cor': -0.6298299847678832}, {'item1': '삼성전자', 'item2': '카카오', 'cor': 0.8200594535994847}, {'item1': '삼성전자', 'item2': '경동나비엔', 'cor': 0.38351606811199934}, {'item1': '삼성전자', 'item2': '금호타이어', 'cor': -0.5794978446569281}, {'item1': '삼성전자', 'item2': '기아', 'cor': 0.7094213381186582}, {'item1': '삼성전자', 'item2': '빙그레', 'cor': -0.5527141864779478}, {'item1': '아모레퍼시픽', 'item2': 'AJ네트웍스', 'cor': 0.6468522834150147}, {'item1': '아모레퍼시픽', 'item2': 'AK홀딩스', 'cor': 0.8034018018942896}, {'item1': '아모레퍼시픽', 'item2': 'BGF', 'cor': 0.8274508560518724}, {'item1': '아모레퍼시픽', 'item2': '삼성전자', 'cor': -0.6298299847678832}, {'item1': '아모레퍼시픽', 'item2': '아모레퍼시픽', 'cor': 1.0}, {'item1': '아모레퍼시픽', 'item2': '카카오', 'cor': -0.39512984211874325}, {'item1': '아모레퍼시픽', 'item2': '경동나비엔', 'cor': 0.07986781914642205}, {'item1': '아모레퍼시픽', 'item2': '금호타이어', 'cor': 0.8169264066274052}, {'item1': '아모레퍼시픽', 'item2': '기아', 'cor': -0.413828187468009}, {'item1': '아모레퍼시픽', 'item2': '빙그레', 'cor': 0.6231240609694045}, {'item1': '카카오', 'item2': 'AJ네트웍스', 'cor': -0.22246497296865567}, {'item1': '카카오', 'item2': 'AK홀딩스', 'cor': -0.6289256377252997}, {'item1': '카카오', 'item2': 'BGF', 'cor': -0.5181140714213462}, {'item1': '카카오', 'item2': '삼성전자', 'cor': 0.8200594535994847}, {'item1': '카카오', 'item2': '아모레퍼시픽', 'cor': -0.39512984211874325}, {'item1': '카카오', 'item2': '카카오', 'cor': 1.0}, {'item1': '카카오', 'item2': '경동나비엔', 'cor': 0.4335783001493612}, {'item1': '카카오', 'item2': '금호타이어', 'cor': -0.37990674413517656}, {'item1': '카카오', 'item2': '기아', 'cor': 0.7842802046837066}, {'item1': '카카오', 'item2': '빙그레', 'cor': -0.40465518330605255}, {'item1': '경동나비엔', 'item2': 'AJ네트웍스', 'cor': -0.13246063488448556}, {'item1': '경동나비엔', 'item2': 'AK홀딩스', 'cor': 0.060416649043513605}, {'item1': '경동나비엔', 'item2': 'BGF', 'cor': -0.24971555714036314}, {'item1': '경동나비엔', 'item2': '삼성전자', 'cor': 0.38351606811199934}, {'item1': '경동나비엔', 'item2': '아모레퍼시픽', 'cor': 0.07986781914642205}, {'item1': '경동나비엔', 'item2': '카카오', 'cor': 0.4335783001493612}, {'item1': '경동나비엔', 'item2': '경동나비엔', 'cor': 1.0}, {'item1': '경동나비엔', 'item2': '금호타이어', 'cor': 0.13729048430124374}, {'item1': '경동나비엔', 'item2': '기아', 'cor': 0.17846387802449665}, {'item1': '경동나비엔', 'item2': '빙그레', 'cor': 0.08892821421248875}, {'item1': '금호타이어', 'item2': 'AJ네트웍스', 'cor': 0.5240724651068914}, {'item1': '금호타이어', 'item2': 'AK홀딩스', 'cor': 0.6914095198327443}, {'item1': '금호타이어', 'item2': 'BGF', 'cor': 0.8403869490093576}, {'item1': '금호타이어', 'item2': '삼성전자', 'cor': -0.5794978446569281}, {'item1': '금호타이어', 'item2': '아모레퍼시픽', 'cor': 0.8169264066274052}, {'item1': '금호타이어', 'item2': '카카오', 'cor': -0.37990674413517656}, {'item1': '금호타이어', 'item2': '경동나비엔', 'cor': 0.13729048430124374}, {'item1': '금호타이어', 'item2': '금호타이어', 'cor': 1.0}, {'item1': '금호타이어', 'item2': '기아', 'cor': -0.3012610019711417}, {'item1': '금호타이어', 'item2': '빙그레', 'cor': 0.5133655469514059}, {'item1': '기아', 'item2': 'AJ네트웍스', 'cor': -0.070655577945304}, {'item1': '기아', 'item2': 'AK홀딩스', 'cor': -0.6507087866352705}, {'item1': '기아', 'item2': 'BGF', 'cor': -0.4042511668097954}, {'item1': '기아', 'item2': '삼성전자', 'cor': 0.7094213381186582}, {'item1': '기아', 'item2': '아모레퍼시픽', 'cor': -0.413828187468009}, {'item1': '기아', 'item2': '카카오', 'cor': 0.7842802046837066}, {'item1': '기아', 'item2': '경동나비엔', 'cor': 0.17846387802449665}, {'item1': '기아', 'item2': '금호타이어', 'cor': -0.3012610019711417}, {'item1': '기아', 'item2': '기아', 'cor': 1.0}, {'item1': '기아', 'item2': '빙그레', 'cor': -0.5769556894996385}, {'item1': '빙그레', 'item2': 'AJ네트웍스', 'cor': 0.2524327211079841}, {'item1': '빙그레', 'item2': 'AK홀딩스', 'cor': 0.7106891377164657}, {'item1': '빙그레', 'item2': 'BGF', 'cor': 0.5027003371693426}, {'item1': '빙그레', 'item2': '삼성전자', 'cor': -0.5527141864779478}, {'item1': '빙그레', 'item2': '아모레퍼시픽', 'cor': 0.6231240609694045}, {'item1': '빙그레', 'item2': '카카오', 'cor': -0.40465518330605255}, {'item1': '빙그레', 'item2': '경동나비엔', 'cor': 0.08892821421248875}, {'item1': '빙그레', 'item2': '금호타이어', 'cor': 0.5133655469514059}, {'item1': '빙그레', 'item2': '기아', 'cor': -0.5769556894996385}, {'item1': '빙그레', 'item2': '빙그레', 'cor': 1.0}]

// // Vega-Lite specification
// var vlSpec = {
//   $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
//   width: 340, 
//   height: 340, 
//   mark: { type: 'rect', tooltip: { content: 'data' }, clip: true },
//   data: { values: corr_data },
//   encoding: {
//     x: { field: 'item1', type: 'nominal' },
//     y: { field: 'item2', type: 'nominal' },
//     color: { field: 'cor', type: 'quantitative' }
//     // Add more encodings or transformations as needed
//   }
// };

// // Embed the visualization in the 'heatmap' div
// vegaEmbed('#heatmap', vlSpec)
//   .then(function(result) {})
//   .catch(console.error);

// //////////////////////////// select box ///////////////////////////////

// var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
// var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
//   return new bootstrap.Tooltip(tooltipTriggerEl)
// })

// // Populate start year and end year options
// document.addEventListener('DOMContentLoaded', function () {
//   const startYearSelect = document.getElementById('startYearSelect');
//   const endYearSelect = document.getElementById('endYearSelect');

//   for (let year = 1990; year <= 2024; year++) {
//     const optionStart = document.createElement('option');
//     const optionEnd = document.createElement('option');

//     optionStart.value = year;
//     optionStart.textContent = year;
//     startYearSelect.appendChild(optionStart);

//     optionEnd.value = year;
//     optionEnd.textContent = year;
//     endYearSelect.appendChild(optionEnd);
//   }
// });

// document.addEventListener('DOMContentLoaded', function () {
//   // Define the number of select boxes (market1 to market10)
//   const numberOfSelects = 10;

//   // Define the options for the market selection
//   const marketOptions = ['Korea Stock Market', 'US Stock Market'];

//   // Loop through each select box
//   for (let i = 1; i <= numberOfSelects; i++) {
//       // Select each market select box by its ID
//       const marketSelect = document.getElementById(`market${i}`);
//       const itemList = document.getElementById(`itemList${i}`);
//       const itemInput = document.getElementById(`item${i}`);

//       // Function to fetch and filter item list based on market and search query
//       function filterItems(marketValue, searchQuery) {
//           itemList.innerHTML = ''; // Clear previous options
          
//           // File paths based on market selection
//           const filePath = (marketValue === 'US Stock Market') ? 'data/file_names_us.csv' : 'data/file_names_kor.csv';

//           // Fetch data from the file and filter based on search query
//           fetch(filePath)
//               .then(response => response.text())
//               .then(data => {
//                   const lines = data.split('\n');
//                   lines.forEach(line => {
//                       const companyName = line.split(',')[0]; // Assuming the company name is in the first column
                      
//                       if (companyName.toLowerCase().includes(searchQuery.toLowerCase())) {
//                           const optionElement = document.createElement('option');
//                           optionElement.value = companyName;
//                           itemList.appendChild(optionElement);
//                       }
//                   });
//               })
//               .catch(error => {
//                   console.error('Error fetching data:', error);
//               });
//       }

//       // Select box event listeners for market and item input
//       marketSelect.addEventListener('change', function () {
//           const selectedMarket = this.value;
//           const searchQuery = itemInput.value.trim();
//           filterItems(selectedMarket, searchQuery);
//       });

//       itemInput.addEventListener('input', function () {
//           const selectedMarket = marketSelect.value;
//           const searchQuery = this.value.trim();
//           filterItems(selectedMarket, searchQuery);
//       });

//       // Populate the market selection dropdown
//       marketOptions.forEach(option => {
//           const optionElement = document.createElement('option');
//           optionElement.value = option;
//           optionElement.textContent = option;
//           marketSelect.appendChild(optionElement);
//       });
//   }
// });

// //////////////////////////// select box for Network ///////////////////////////////////////

// // Populate both dropdowns on page load
// populateDropdown('sector1');
// populateDropdown('sector2');

// // Function to populate dropdown with sectors
// function populateDropdown(sectorId) {
//   var sectorList = ['서비스업','기타금융','유통업','섬유의복','운수창고업',
//   '음식료품','비금속광물','증권','보험','전기전자','화학','건설업','철강금속','기계','운수장비','광업','의약품',
//   '통신업','기타제조업','전기가스업','종이목재','은행','의료정밀','농업, 임업 및 어업']

//   // 제공된 sectorId를 사용하여 드롭다운 요소를 가져옴
//   var dropdown = document.getElementById(sectorId);

//   // 드롭다운 내의 기존 옵션을 모두 지움. 새 옵션으로 드롭다운을 채우기 전에 드롭다운이 비어 있는지 확인
//   dropdown.innerHTML = '';

//   // 각 섹터에 대해 새로운 <option> 요소를 생성
//   sectorList.forEach(function (sector) {
//     var option = document.createElement('option');
//     option.text = sector;
//     option.value = sector;
//     // 새로 생성된 <option> 요소를 드롭다운에 추가
//     dropdown.appendChild(option);
//   });

//   // Attach event listener to handle selection change
//   // 'change' 이벤트가 발생하면(예: 사용자가 드롭다운에서 다른 옵션을 선택하는 경우) 
//   // anonymous function인 (function () { /* code here */ }를 사용하여 정의됨)가 실행
//   dropdown.addEventListener('change', function () {
//     handleSelectionChange(); // Call handleSelectionChange when a selection changes
//   });
// }

// // Step 1: Function to handle selection change in sector1 and sector2
// // handleSelectionChange()는 두 개의 선택 상자(sector1과 sector2)에서 선택이 변경되었을 때 호출되며, 
// // 선택된 섹터에 해당하는 노드를 찾고, 해당 노드에 연결된 링크를 추출하는 일련의 작업을 수행
// function handleSelectionChange() {
//   // Assuming sector1 and sector2 are the IDs of the selection boxes
//   const sector1 = document.getElementById('sector1').value;
//   const sector2 = document.getElementById('sector2').value;

//   // Load and parse the kospi_nodes.json file
//   fetch('data/kospi_nodes_final.json')
//     .then(response => response.json())  // 이 파일은 데이터를 포함하고 있으며, 데이터는 JSON 형식으로 파싱됨
//     .then(data => { // .then(data => { /* 코드 */ })를 사용하여 JSON 데이터에 접근
//       // 선택된 섹터에 해당하는 노드들을 필터링하여 nodes 배열에 저장
//       const nodes = data.nodes.filter(node =>
//         node.group === sector1 || node.group === sector2
//       );

//       // Add the matched nodes to selected_nodes
//       // 선택된 노드를 selected_nodes 배열에 추가. selected_nodes는 id와 group을 포함하는 객체들의 배열임
//       selected_nodes = nodes.map(node => ({ id: node.id, group: node.group }));
//       console.log('Selected nodes:', selected_nodes);
//       // 선택된 노드의 id만을 포함하는 배열
//       selected_nodes_list = selected_nodes.map(node => node.id);
//       // console.log('selected_nodes_list:', selected_nodes_list);
      
//       // Once nodes are selected, extract corresponding links
//       // 선택된 노드를 기반으로 해당하는 링크를 추출
//       extractSelectedLinks();
//     })
//     .catch(error => console.error('Error fetching nodes:', error));
// }

// // Step 2: Extract corresponding links from kospi_links_one_side.json
// // Function to filter and extract links based on selected_nodes
// function extractSelectedLinks() {
//   // Load and parse the kospi_links_one_side.json file
//   fetch('data/kospi_links_one_side.json')
//     .then(response => response.json())
//     .then(linksData => {
//       // Filter links matching the selected nodes - 선택된 노드에 맞는 링크를 필터링
//       const links = linksData.links.filter(link =>
//         link.value >= 0.85 &&
//         selected_nodes_list.includes(link.source) && selected_nodes_list.includes(link.target)
//       );

//       // Add the matched links to selected_links - 선택된 링크를 selected_links에 추가
//       selected_links = links.map(link => ({
//         source: link.source,
//         target: link.target,
//         value: link.value
//         // s: selected_nodes_list.includes(link.source),
//         // t: selected_nodes_list.includes(link.target)
//       }));
//       console.log('Selected links:', selected_links);

//       // Save selected nodes and links - 선택된 노드 및 링크를 저장
//       saveData(selected_nodes, selected_links);
//     })
//     .catch(error => console.error('Error fetching links:', error));
// }



// var graph;

// // Step 3: Save selected_nodes and selected_links in data variable in JSON format
// function saveData(nodes, links) {
//   graph = {
//     node: nodes,
//     links: links
//   };
//   console.log('Final data:', graph);

//   drawNetworkGraph(graph);
// }


// ////////////////////////// Network visualization ///////////////////////////////

// let selected_nodes_list = [];
// let selected_links_list = [];

// // Example of toggling visibility using plain JavaScript
// // submitButton2 버튼을 눌렀을 때, 결과창 보여지기 하는 코드

// // 1) submitButton2를 클릭하면, showResults 함수 호출
// document.getElementById('submitButton1').addEventListener('click', toggleVisibility1);
// document.getElementById('submitButton2').addEventListener('click', showResults);
// const resultContent1 = document.getElementById('result-content1');
// const resultContent2 = document.getElementById('result-content2');
// // Function to toggle visibility
// function toggleVisibility1() {
//     if (resultContent1.style.display === 'none') {
//         resultContent1.style.display = 'block'; // Show the content
//     } else {
//         resultContent1.style.display = 'none'; // Hide the content
//     }
// }
// function toggleVisibility2() {
//   if (resultContent2.style.display === 'none') {
//       resultContent2.style.display = 'block'; // Show the content
//   } else {
//       resultContent2.style.display = 'none'; // Hide the content
//   }
// }
// // 2) showResults 함수 호출하면 -> toggleVisibility() 함수 호출되면서 화면에 보여짐
// // Function to show results (assuming data parameter is used to draw the graph)
// function showResults(data) {
//   if (!data) {
//     console.error("Invalid data received:", data);
//     return;
//   }

//   // Show the result content after drawing the graph
//   toggleVisibility2();

// }


// function drawNetworkGraph(graph) {
//   // const svg = d3.select("#network-graph");
//   console.log('data in draNetwork:', graph);
//   // var svg = d3.select("#network-graph")
//   // .append("svg")
//   // .attr("width", width)
//   // .attr("height", height)
//   // .append("g")
//   // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//   // var svg = d3.select("#network-graph"),
//   var svg = d3.select("svg"),
//       width = +svg.attr("width"),
//       height = +svg.attr("height");

//   var color = d3.scaleOrdinal()
//       .range(["#FF6666", "#3366FF"]);

//   var simulation = d3.forceSimulation()
//       .force("link", d3.forceLink().id(function(d) { return d.id; }))
//       .force("charge", d3.forceManyBody())
//       .force("center", d3.forceCenter(width / 2, height / 2));

//   // Tooltip element
//   var tooltip = d3.select("body")
//       .append("div")
//       .attr("class", "tooltip");

//   // var data = {
//   //   "nodes": selected_nodes_list,
//   //   "links": selected_links_list
//   // };
  
//   // Use the provided data directly
//   // var graph = {
//   //   "nodes": data.nodes,
//   //   "links": data.links
//   // };
  
//   // Filter links based on the value being 0.5 or higher
//   // var filteredLinks = graph.links.filter(function(link) {
//   //   return link.value >= 0.85;
//   // });
  
//     // // Count the number of links connected to each node
//     // var nodeLinksCount = {};
//     // filteredLinks.forEach(function(link) {
//     //   nodeLinksCount[link.source.id] = (nodeLinksCount[link.source.id] || 0) + 1;
//     //   nodeLinksCount[link.target.id] = (nodeLinksCount[link.target.id] || 0) + 1;
//     // });
  
//     var link = svg.append("g")
//         .attr("class", "links")
//       .selectAll("line")
//       // .data(filteredLinks)
//       .data(graph.links)
//       .enter().append("line")
//         .attr("stroke-width", function(d) { return Math.sqrt(d.value); })
//         // .attr("stroke-width", function(d) { 
//         // // Map link values to stroke widths using a power scale
//         // // Adjust the exponent (e.g., 2) to control the scaling effect
//         // var scale = d3.scalePow().exponent(2).domain([0.8, 1]).range([-5, 5]); // Example domain and range
//         // return scale(d.value);
//         // })
//         .on("mouseover", showLinkInfo) // Show link information on mouseover
//         .on("mouseout", hideTooltip);
  
//     var node = svg.append("g")
//         .attr("class", "nodes")
//       .selectAll("circle")
//       .data(graph.nodes)
//       .enter().append("circle")
//         .attr("r", 5)
//         // .attr("r", function(d) { 
//         //   // Set radius based on the number of links connected to each node
//         //   return Math.max(5, nodeLinksCount[d.id] * 1.5); // Adjust the scale factor as needed
//         // })
//         .attr("fill", function(d) { return color(d.group); })
//         .on("mouseover", showNodeInfo) // Show node information on mouseover
//         .on("mouseout", hideTooltip) // Hide tooltip on mouseout
//         .call(d3.drag()
//             .on("start", dragstarted)
//             .on("drag", dragged)
//             .on("end", dragended));
  
//     node.append("title")
//         .text(function(d) { return d.id; });
  
//     simulation
//         .nodes(graph.nodes)
//         .on("tick", ticked);
  
//     simulation.force("link")
//         .links(graph.links);
  
//     function ticked() {
//       link
//           .attr("x1", function(d) { return d.source.x; })
//           .attr("y1", function(d) { return d.source.y; })
//           .attr("x2", function(d) { return d.target.x; })
//           .attr("y2", function(d) { return d.target.y; });
  
//       node
//           .attr("cx", function(d) { return d.x; })
//           .attr("cy", function(d) { return d.y; });
//     }
  
//     // Function to show link information
//     function showLinkInfo(d) {
//       var sourceId = d.source.id;
//       var targetId = d.target.id;
//       tooltip.style("display", "block");
//       tooltip.html(`<strong>[Link Information]</strong><br><strong>Source:</strong> ${sourceId}<br><strong>Target:</strong> ${targetId}<br><strong>Value:</strong> ${d.value}`)
//         .style("left", (width - 200) + "px") // Adjust x-coordinate for horizontal positioning
//         .style("top", "100px"); // Fixed y-coordinate for top positioning
//     }
  
  
//     // Function to show node information
//     function showNodeInfo(d) {
//       tooltip.style("display", "block");
//       tooltip.html(`<strong>Item ID:</strong> ${d.id}<br><strong>Group:</strong> ${d.group}`)
//         .style("left", (width - 200) + "px") // Adjust x-coordinate for horizontal positioning
//         .style("top", "100px"); // Fixed y-coordinate for top positioning
//     }
  
//   // //Function to show node information
//   // function showNodeInfo(d) {
//   //   var xPos = d3.event.pageX + 10;
//   //   var yPos = d3.event.pageY + 10;
  
//   //   tooltip.style("display", "block")
//   //     .html(`<strong>Item ID:</strong> ${d.id}<br><strong>Group:</strong> ${d.group}`)
//   //     .style("left", xPos + "px")
//   //     .style("top", yPos + "px");
//   // }
  
//     // Function to hide tooltip
//     function hideTooltip() {
//       tooltip.style("display", "none");
//     }
//   // });
  
//   function dragstarted(d) {
//     if (!d3.event.active) simulation.alphaTarget(0.3).restart();
//     d.fx = d.x;
//     d.fy = d.y;
//   }
  
//   function dragged(d) {
//     d.fx = d3.event.x;
//     d.fy = d3.event.y;
//   }
  
//   function dragended(d) {
//     if (!d3.event.active) simulation.alphaTarget(0);
//     d.fx = null;
//     d.fy = null;
//   }

// }


// ////////// 샘플 예시 (스크립트 코드에 있는 data를 읽어서 화면에 바로 표시한 그림) /////////////

// // // Append the SVG to the network-container div
// // d3.select("#network-graph")
// //   .append("svg")
// //   .attr("width", width) // Set the width attribute of the SVG
// //   .attr("height", height) // Set the height attribute of the SVG
// //   .append("g") // Append a group element to hold the network graph
// //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); // Optional 
// // // const svg = d3.select("#map").select("svg")

// var svg = d3.select("#sample-graph"),
// // var svg = d3.select("svg"),
//     width = +svg.attr("width"),
//     height = +svg.attr("height");

// var color = d3.scaleOrdinal()
//     .range(["#FF6666", "#3366FF"]);

// var simulation = d3.forceSimulation()
//     .force("link", d3.forceLink().id(function(d) { return d.id; }))
//     .force("charge", d3.forceManyBody())
//     .force("center", d3.forceCenter(width / 2, height / 2));

// // Tooltip element
// var tooltip = d3.select("body")
//     .append("div")
//     .attr("class", "tooltip");

// var sample_selected_nodes_list = [
//   {"id": "Myriel", "group": 1},
//   {"id": "Napoleon", "group": 1},
//   {"id": "Mlle.Baptistine", "group": 1},
//   {"id": "Mme.Magloire", "group": 1},
//   {"id": "CountessdeLo", "group": 1},
//   {"id": "Geborand", "group": 1},
//   {"id": "Champtercier", "group": 1},
//   {"id": "Cravatte", "group": 1},
//   {"id": "Count", "group": 1},
//   {"id": "OldMan", "group": 1},
//   {"id": "Labarre", "group": 2},
//   {"id": "Valjean", "group": 2},
//   {"id": "Marguerite", "group": 3},
//   {"id": "Mme.deR", "group": 2},
//   {"id": "Isabeau", "group": 2},
//   {"id": "Gervais", "group": 2},
//   {"id": "Tholomyes", "group": 3},
//   {"id": "Listolier", "group": 3},
//   {"id": "Fameuil", "group": 3},
//   {"id": "Blacheville", "group": 3},
//   {"id": "Favourite", "group": 3},
//   {"id": "Dahlia", "group": 3},
//   {"id": "Zephine", "group": 3},
//   {"id": "Fantine", "group": 3},
//   {"id": "Mme.Thenardier", "group": 4},
//   {"id": "Thenardier", "group": 4},
//   {"id": "Cosette", "group": 5},
//   {"id": "Javert", "group": 4},
//   {"id": "Fauchelevent", "group": 0},
//   {"id": "Bamatabois", "group": 2},
//   {"id": "Perpetue", "group": 3},
//   {"id": "Simplice", "group": 2},
//   {"id": "Scaufflaire", "group": 2},
//   {"id": "Woman1", "group": 2},
//   {"id": "Judge", "group": 2},
//   {"id": "Champmathieu", "group": 2},
//   {"id": "Brevet", "group": 2},
//   {"id": "Chenildieu", "group": 2},
//   {"id": "Cochepaille", "group": 2},
//   {"id": "Pontmercy", "group": 4},
//   {"id": "Boulatruelle", "group": 6},
//   {"id": "Eponine", "group": 4},
//   {"id": "Anzelma", "group": 4},
//   {"id": "Woman2", "group": 5},
//   {"id": "MotherInnocent", "group": 0},
//   {"id": "Gribier", "group": 0},
//   {"id": "Jondrette", "group": 7},
//   {"id": "Mme.Burgon", "group": 7},
//   {"id": "Gavroche", "group": 8},
//   {"id": "Gillenormand", "group": 5},
//   {"id": "Magnon", "group": 5},
//   {"id": "Mlle.Gillenormand", "group": 5},
//   {"id": "Mme.Pontmercy", "group": 5},
//   {"id": "Mlle.Vaubois", "group": 5},
//   {"id": "Lt.Gillenormand", "group": 5},
//   {"id": "Marius", "group": 8},
//   {"id": "BaronessT", "group": 5},
//   {"id": "Mabeuf", "group": 8},
//   {"id": "Enjolras", "group": 8},
//   {"id": "Combeferre", "group": 8},
//   {"id": "Prouvaire", "group": 8},
//   {"id": "Feuilly", "group": 8},
//   {"id": "Courfeyrac", "group": 8},
//   {"id": "Bahorel", "group": 8},
//   {"id": "Bossuet", "group": 8},
//   {"id": "Joly", "group": 8},
//   {"id": "Grantaire", "group": 8},
//   {"id": "MotherPlutarch", "group": 9},
//   {"id": "Gueulemer", "group": 4},
//   {"id": "Babet", "group": 4},
//   {"id": "Claquesous", "group": 4},
//   {"id": "Montparnasse", "group": 4},
//   {"id": "Toussaint", "group": 5},
//   {"id": "Child1", "group": 10},
//   {"id": "Child2", "group": 10},
//   {"id": "Brujon", "group": 4},
//   {"id": "Mme.Hucheloup", "group": 8}
// ];

// var sample_selected_links_list = [
//   {"source": "Napoleon", "target": "Myriel", "value": 1},
//   {"source": "Mlle.Baptistine", "target": "Myriel", "value": 8},
//   {"source": "Mme.Magloire", "target": "Myriel", "value": 10},
//   {"source": "Mme.Magloire", "target": "Mlle.Baptistine", "value": 6},
//   {"source": "CountessdeLo", "target": "Myriel", "value": 1},
//   {"source": "Geborand", "target": "Myriel", "value": 1},
//   {"source": "Champtercier", "target": "Myriel", "value": 1},
//   {"source": "Cravatte", "target": "Myriel", "value": 1},
//   {"source": "Count", "target": "Myriel", "value": 2},
//   {"source": "OldMan", "target": "Myriel", "value": 1},
//   {"source": "Valjean", "target": "Labarre", "value": 1},
//   {"source": "Valjean", "target": "Mme.Magloire", "value": 3},
//   {"source": "Valjean", "target": "Mlle.Baptistine", "value": 3},
//   {"source": "Valjean", "target": "Myriel", "value": 5},
//   {"source": "Marguerite", "target": "Valjean", "value": 1},
//   {"source": "Mme.deR", "target": "Valjean", "value": 1},
//   {"source": "Isabeau", "target": "Valjean", "value": 1},
//   {"source": "Gervais", "target": "Valjean", "value": 1},
//   {"source": "Listolier", "target": "Tholomyes", "value": 4},
//   {"source": "Fameuil", "target": "Tholomyes", "value": 4},
//   {"source": "Fameuil", "target": "Listolier", "value": 4},
//   {"source": "Blacheville", "target": "Tholomyes", "value": 4},
//   {"source": "Blacheville", "target": "Listolier", "value": 4},
//   {"source": "Blacheville", "target": "Fameuil", "value": 4},
//   {"source": "Favourite", "target": "Tholomyes", "value": 3},
//   {"source": "Favourite", "target": "Listolier", "value": 3},
//   {"source": "Favourite", "target": "Fameuil", "value": 3},
//   {"source": "Favourite", "target": "Blacheville", "value": 4},
//   {"source": "Dahlia", "target": "Tholomyes", "value": 3},
//   {"source": "Dahlia", "target": "Listolier", "value": 3},
//   {"source": "Dahlia", "target": "Fameuil", "value": 3},
//   {"source": "Dahlia", "target": "Blacheville", "value": 3},
//   {"source": "Dahlia", "target": "Favourite", "value": 5},
//   {"source": "Zephine", "target": "Tholomyes", "value": 3},
//   {"source": "Zephine", "target": "Listolier", "value": 3},
//   {"source": "Zephine", "target": "Fameuil", "value": 3},
//   {"source": "Zephine", "target": "Blacheville", "value": 3},
//   {"source": "Zephine", "target": "Favourite", "value": 4},
//   {"source": "Zephine", "target": "Dahlia", "value": 4},
//   {"source": "Fantine", "target": "Tholomyes", "value": 3},
//   {"source": "Fantine", "target": "Listolier", "value": 3},
//   {"source": "Fantine", "target": "Fameuil", "value": 3},
//   {"source": "Fantine", "target": "Blacheville", "value": 3},
//   {"source": "Fantine", "target": "Favourite", "value": 4},
//   {"source": "Fantine", "target": "Dahlia", "value": 4},
//   {"source": "Fantine", "target": "Zephine", "value": 4},
//   {"source": "Fantine", "target": "Marguerite", "value": 2},
//   {"source": "Fantine", "target": "Valjean", "value": 9},
//   {"source": "Mme.Thenardier", "target": "Fantine", "value": 2},
//   {"source": "Mme.Thenardier", "target": "Valjean", "value": 7},
//   {"source": "Thenardier", "target": "Mme.Thenardier", "value": 13},
//   {"source": "Thenardier", "target": "Fantine", "value": 1},
//   {"source": "Thenardier", "target": "Valjean", "value": 12},
//   {"source": "Cosette", "target": "Mme.Thenardier", "value": 4},
//   {"source": "Cosette", "target": "Valjean", "value": 31},
//   {"source": "Cosette", "target": "Tholomyes", "value": 1},
//   {"source": "Cosette", "target": "Thenardier", "value": 1},
//   {"source": "Javert", "target": "Valjean", "value": 17},
//   {"source": "Javert", "target": "Fantine", "value": 5},
//   {"source": "Javert", "target": "Thenardier", "value": 5},
//   {"source": "Javert", "target": "Mme.Thenardier", "value": 1},
//   {"source": "Javert", "target": "Cosette", "value": 1},
//   {"source": "Fauchelevent", "target": "Valjean", "value": 8},
//   {"source": "Fauchelevent", "target": "Javert", "value": 1},
//   {"source": "Bamatabois", "target": "Fantine", "value": 1},
//   {"source": "Bamatabois", "target": "Javert", "value": 1},
//   {"source": "Bamatabois", "target": "Valjean", "value": 2},
//   {"source": "Perpetue", "target": "Fantine", "value": 1},
//   {"source": "Simplice", "target": "Perpetue", "value": 2},
//   {"source": "Simplice", "target": "Valjean", "value": 3},
//   {"source": "Simplice", "target": "Fantine", "value": 2},
//   {"source": "Simplice", "target": "Javert", "value": 1},
//   {"source": "Scaufflaire", "target": "Valjean", "value": 1},
//   {"source": "Woman1", "target": "Valjean", "value": 2},
//   {"source": "Woman1", "target": "Javert", "value": 1},
//   {"source": "Judge", "target": "Valjean", "value": 3},
//   {"source": "Judge", "target": "Bamatabois", "value": 2},
//   {"source": "Champmathieu", "target": "Valjean", "value": 3},
//   {"source": "Champmathieu", "target": "Judge", "value": 3},
//   {"source": "Champmathieu", "target": "Bamatabois", "value": 2},
//   {"source": "Brevet", "target": "Judge", "value": 2},
//   {"source": "Brevet", "target": "Champmathieu", "value": 2},
//   {"source": "Brevet", "target": "Valjean", "value": 2},
//   {"source": "Brevet", "target": "Bamatabois", "value": 1},
//   {"source": "Chenildieu", "target": "Judge", "value": 2},
//   {"source": "Chenildieu", "target": "Champmathieu", "value": 2},
//   {"source": "Chenildieu", "target": "Brevet", "value": 2},
//   {"source": "Chenildieu", "target": "Valjean", "value": 2},
//   {"source": "Chenildieu", "target": "Bamatabois", "value": 1},
//   {"source": "Cochepaille", "target": "Judge", "value": 2},
//   {"source": "Cochepaille", "target": "Champmathieu", "value": 2},
//   {"source": "Cochepaille", "target": "Brevet", "value": 2},
//   {"source": "Cochepaille", "target": "Chenildieu", "value": 2},
//   {"source": "Cochepaille", "target": "Valjean", "value": 2},
//   {"source": "Cochepaille", "target": "Bamatabois", "value": 1},
//   {"source": "Pontmercy", "target": "Thenardier", "value": 1},
//   {"source": "Boulatruelle", "target": "Thenardier", "value": 1},
//   {"source": "Eponine", "target": "Mme.Thenardier", "value": 2},
//   {"source": "Eponine", "target": "Thenardier", "value": 3},
//   {"source": "Anzelma", "target": "Eponine", "value": 2},
//   {"source": "Anzelma", "target": "Thenardier", "value": 2},
//   {"source": "Anzelma", "target": "Mme.Thenardier", "value": 1},
//   {"source": "Woman2", "target": "Valjean", "value": 3},
//   {"source": "Woman2", "target": "Cosette", "value": 1},
//   {"source": "Woman2", "target": "Javert", "value": 1},
//   {"source": "MotherInnocent", "target": "Fauchelevent", "value": 3},
//   {"source": "MotherInnocent", "target": "Valjean", "value": 1},
//   {"source": "Gribier", "target": "Fauchelevent", "value": 2},
//   {"source": "Mme.Burgon", "target": "Jondrette", "value": 1},
//   {"source": "Gavroche", "target": "Mme.Burgon", "value": 2},
//   {"source": "Gavroche", "target": "Thenardier", "value": 1},
//   {"source": "Gavroche", "target": "Javert", "value": 1},
//   {"source": "Gavroche", "target": "Valjean", "value": 1},
//   {"source": "Gillenormand", "target": "Cosette", "value": 3},
//   {"source": "Gillenormand", "target": "Valjean", "value": 2},
//   {"source": "Magnon", "target": "Gillenormand", "value": 1},
//   {"source": "Magnon", "target": "Mme.Thenardier", "value": 1},
//   {"source": "Mlle.Gillenormand", "target": "Gillenormand", "value": 9},
//   {"source": "Mlle.Gillenormand", "target": "Cosette", "value": 2},
//   {"source": "Mlle.Gillenormand", "target": "Valjean", "value": 2},
//   {"source": "Mme.Pontmercy", "target": "Mlle.Gillenormand", "value": 1},
//   {"source": "Mme.Pontmercy", "target": "Pontmercy", "value": 1},
//   {"source": "Mlle.Vaubois", "target": "Mlle.Gillenormand", "value": 1},
//   {"source": "Lt.Gillenormand", "target": "Mlle.Gillenormand", "value": 2},
//   {"source": "Lt.Gillenormand", "target": "Gillenormand", "value": 1},
//   {"source": "Lt.Gillenormand", "target": "Cosette", "value": 1},
//   {"source": "Marius", "target": "Mlle.Gillenormand", "value": 6},
//   {"source": "Marius", "target": "Gillenormand", "value": 12},
//   {"source": "Marius", "target": "Pontmercy", "value": 1},
//   {"source": "Marius", "target": "Lt.Gillenormand", "value": 1},
//   {"source": "Marius", "target": "Cosette", "value": 21},
//   {"source": "Marius", "target": "Valjean", "value": 19},
//   {"source": "Marius", "target": "Tholomyes", "value": 1},
//   {"source": "Marius", "target": "Thenardier", "value": 2},
//   {"source": "Marius", "target": "Eponine", "value": 5},
//   {"source": "Marius", "target": "Gavroche", "value": 4},
//   {"source": "BaronessT", "target": "Gillenormand", "value": 1},
//   {"source": "BaronessT", "target": "Marius", "value": 1},
//   {"source": "Mabeuf", "target": "Marius", "value": 1},
//   {"source": "Mabeuf", "target": "Eponine", "value": 1},
//   {"source": "Mabeuf", "target": "Gavroche", "value": 1},
//   {"source": "Enjolras", "target": "Marius", "value": 7},
//   {"source": "Enjolras", "target": "Gavroche", "value": 7},
//   {"source": "Enjolras", "target": "Javert", "value": 6},
//   {"source": "Enjolras", "target": "Mabeuf", "value": 1},
//   {"source": "Enjolras", "target": "Valjean", "value": 4},
//   {"source": "Combeferre", "target": "Enjolras", "value": 15},
//   {"source": "Combeferre", "target": "Marius", "value": 5},
//   {"source": "Combeferre", "target": "Gavroche", "value": 6},
//   {"source": "Combeferre", "target": "Mabeuf", "value": 2},
//   {"source": "Prouvaire", "target": "Gavroche", "value": 1},
//   {"source": "Prouvaire", "target": "Enjolras", "value": 4},
//   {"source": "Prouvaire", "target": "Combeferre", "value": 2},
//   {"source": "Feuilly", "target": "Gavroche", "value": 2},
//   {"source": "Feuilly", "target": "Enjolras", "value": 6},
//   {"source": "Feuilly", "target": "Prouvaire", "value": 2},
//   {"source": "Feuilly", "target": "Combeferre", "value": 5},
//   {"source": "Feuilly", "target": "Mabeuf", "value": 1},
//   {"source": "Feuilly", "target": "Marius", "value": 1},
//   {"source": "Courfeyrac", "target": "Marius", "value": 9},
//   {"source": "Courfeyrac", "target": "Enjolras", "value": 17},
//   {"source": "Courfeyrac", "target": "Combeferre", "value": 13},
//   {"source": "Courfeyrac", "target": "Gavroche", "value": 7},
//   {"source": "Courfeyrac", "target": "Mabeuf", "value": 2},
//   {"source": "Courfeyrac", "target": "Eponine", "value": 1},
//   {"source": "Courfeyrac", "target": "Feuilly", "value": 6},
//   {"source": "Courfeyrac", "target": "Prouvaire", "value": 3},
//   {"source": "Bahorel", "target": "Combeferre", "value": 5},
//   {"source": "Bahorel", "target": "Gavroche", "value": 5},
//   {"source": "Bahorel", "target": "Courfeyrac", "value": 6},
//   {"source": "Bahorel", "target": "Mabeuf", "value": 2},
//   {"source": "Bahorel", "target": "Enjolras", "value": 4},
//   {"source": "Bahorel", "target": "Feuilly", "value": 3},
//   {"source": "Bahorel", "target": "Prouvaire", "value": 2},
//   {"source": "Bahorel", "target": "Marius", "value": 1},
//   {"source": "Bossuet", "target": "Marius", "value": 5},
//   {"source": "Bossuet", "target": "Courfeyrac", "value": 12},
//   {"source": "Bossuet", "target": "Gavroche", "value": 5},
//   {"source": "Bossuet", "target": "Bahorel", "value": 4},
//   {"source": "Bossuet", "target": "Enjolras", "value": 10},
//   {"source": "Bossuet", "target": "Feuilly", "value": 6},
//   {"source": "Bossuet", "target": "Prouvaire", "value": 2},
//   {"source": "Bossuet", "target": "Combeferre", "value": 9},
//   {"source": "Bossuet", "target": "Mabeuf", "value": 1},
//   {"source": "Bossuet", "target": "Valjean", "value": 1},
//   {"source": "Joly", "target": "Bahorel", "value": 5},
//   {"source": "Joly", "target": "Bossuet", "value": 7},
//   {"source": "Joly", "target": "Gavroche", "value": 3},
//   {"source": "Joly", "target": "Courfeyrac", "value": 5},
//   {"source": "Joly", "target": "Enjolras", "value": 5},
//   {"source": "Joly", "target": "Feuilly", "value": 5},
//   {"source": "Joly", "target": "Prouvaire", "value": 2},
//   {"source": "Joly", "target": "Combeferre", "value": 5},
//   {"source": "Joly", "target": "Mabeuf", "value": 1},
//   {"source": "Joly", "target": "Marius", "value": 2},
//   {"source": "Grantaire", "target": "Bossuet", "value": 3},
//   {"source": "Grantaire", "target": "Enjolras", "value": 3},
//   {"source": "Grantaire", "target": "Combeferre", "value": 1},
//   {"source": "Grantaire", "target": "Courfeyrac", "value": 2},
//   {"source": "Grantaire", "target": "Joly", "value": 2},
//   {"source": "Grantaire", "target": "Gavroche", "value": 1},
//   {"source": "Grantaire", "target": "Bahorel", "value": 1},
//   {"source": "Grantaire", "target": "Feuilly", "value": 1},
//   {"source": "Grantaire", "target": "Prouvaire", "value": 1},
//   {"source": "MotherPlutarch", "target": "Mabeuf", "value": 3},
//   {"source": "Gueulemer", "target": "Thenardier", "value": 5},
//   {"source": "Gueulemer", "target": "Valjean", "value": 1},
//   {"source": "Gueulemer", "target": "Mme.Thenardier", "value": 1},
//   {"source": "Gueulemer", "target": "Javert", "value": 1},
//   {"source": "Gueulemer", "target": "Gavroche", "value": 1},
//   {"source": "Gueulemer", "target": "Eponine", "value": 1},
//   {"source": "Babet", "target": "Thenardier", "value": 6},
//   {"source": "Babet", "target": "Gueulemer", "value": 6},
//   {"source": "Babet", "target": "Valjean", "value": 1},
//   {"source": "Babet", "target": "Mme.Thenardier", "value": 1},
//   {"source": "Babet", "target": "Javert", "value": 2},
//   {"source": "Babet", "target": "Gavroche", "value": 1},
//   {"source": "Babet", "target": "Eponine", "value": 1},
//   {"source": "Claquesous", "target": "Thenardier", "value": 4},
//   {"source": "Claquesous", "target": "Babet", "value": 4},
//   {"source": "Claquesous", "target": "Gueulemer", "value": 4},
//   {"source": "Claquesous", "target": "Valjean", "value": 1},
//   {"source": "Claquesous", "target": "Mme.Thenardier", "value": 1},
//   {"source": "Claquesous", "target": "Javert", "value": 1},
//   {"source": "Claquesous", "target": "Eponine", "value": 1},
//   {"source": "Claquesous", "target": "Enjolras", "value": 1},
//   {"source": "Montparnasse", "target": "Javert", "value": 1},
//   {"source": "Montparnasse", "target": "Babet", "value": 2},
//   {"source": "Montparnasse", "target": "Gueulemer", "value": 2},
//   {"source": "Montparnasse", "target": "Claquesous", "value": 2},
//   {"source": "Montparnasse", "target": "Valjean", "value": 1},
//   {"source": "Montparnasse", "target": "Gavroche", "value": 1},
//   {"source": "Montparnasse", "target": "Eponine", "value": 1},
//   {"source": "Montparnasse", "target": "Thenardier", "value": 1},
//   {"source": "Toussaint", "target": "Cosette", "value": 2},
//   {"source": "Toussaint", "target": "Javert", "value": 1},
//   {"source": "Toussaint", "target": "Valjean", "value": 1},
//   {"source": "Child1", "target": "Gavroche", "value": 2},
//   {"source": "Child2", "target": "Gavroche", "value": 2},
//   {"source": "Child2", "target": "Child1", "value": 3},
//   {"source": "Brujon", "target": "Babet", "value": 3},
//   {"source": "Brujon", "target": "Gueulemer", "value": 3},
//   {"source": "Brujon", "target": "Thenardier", "value": 3},
//   {"source": "Brujon", "target": "Gavroche", "value": 1},
//   {"source": "Brujon", "target": "Eponine", "value": 1},
//   {"source": "Brujon", "target": "Claquesous", "value": 1},
//   {"source": "Brujon", "target": "Montparnasse", "value": 1},
//   {"source": "Mme.Hucheloup", "target": "Bossuet", "value": 1},
//   {"source": "Mme.Hucheloup", "target": "Joly", "value": 1},
//   {"source": "Mme.Hucheloup", "target": "Grantaire", "value": 1},
//   {"source": "Mme.Hucheloup", "target": "Bahorel", "value": 1},
//   {"source": "Mme.Hucheloup", "target": "Courfeyrac", "value": 1},
//   {"source": "Mme.Hucheloup", "target": "Gavroche", "value": 1},
//   {"source": "Mme.Hucheloup", "target": "Enjolras", "value": 1}
// ];

// // selected_nodes_list와 selected_links_list가 채워진 후에 위치해야 함
// // Your data in JSON format
// var data = {
//   "nodes": sample_selected_nodes_list,
//   "links": sample_selected_links_list
// };

// // Use the provided data directly
// var graph = {
//   "nodes": data.nodes,
//   "links": data.links
// };

// // Filter links based on the value being 0.5 or higher
// var filteredLinks = graph.links.filter(function(link) {
//   return link.value >= 0.85;
// });

//   // // Count the number of links connected to each node
//   // var nodeLinksCount = {};
//   // filteredLinks.forEach(function(link) {
//   //   nodeLinksCount[link.source.id] = (nodeLinksCount[link.source.id] || 0) + 1;
//   //   nodeLinksCount[link.target.id] = (nodeLinksCount[link.target.id] || 0) + 1;
//   // });

//   var link = svg.append("g")
//       .attr("class", "links")
//     .selectAll("line")
//     .data(filteredLinks)
//     .enter().append("line")
//       .attr("stroke-width", function(d) { return Math.sqrt(d.value); })
//       // .attr("stroke-width", function(d) { 
//       // // Map link values to stroke widths using a power scale
//       // // Adjust the exponent (e.g., 2) to control the scaling effect
//       // var scale = d3.scalePow().exponent(2).domain([0.8, 1]).range([-5, 5]); // Example domain and range
//       // return scale(d.value);
//       // })
//       .on("mouseover", showLinkInfo) // Show link information on mouseover
//       .on("mouseout", hideTooltip);

//   var node = svg.append("g")
//       .attr("class", "nodes")
//     .selectAll("circle")
//     .data(graph.nodes)
//     .enter().append("circle")
//       .attr("r", 5)
//       // .attr("r", function(d) { 
//       //   // Set radius based on the number of links connected to each node
//       //   return Math.max(5, nodeLinksCount[d.id] * 1.5); // Adjust the scale factor as needed
//       // })
//       .attr("fill", function(d) { return color(d.group); })
//       .on("mouseover", showNodeInfo) // Show node information on mouseover
//       .on("mouseout", hideTooltip) // Hide tooltip on mouseout
//       .call(d3.drag()
//           .on("start", dragstarted)
//           .on("drag", dragged)
//           .on("end", dragended));

//   node.append("title")
//       .text(function(d) { return d.id; });

//   simulation
//       .nodes(graph.nodes)
//       .on("tick", ticked);

//   simulation.force("link")
//       .links(filteredLinks);

//   function ticked() {
//     link
//         .attr("x1", function(d) { return d.source.x; })
//         .attr("y1", function(d) { return d.source.y; })
//         .attr("x2", function(d) { return d.target.x; })
//         .attr("y2", function(d) { return d.target.y; });

//     node
//         .attr("cx", function(d) { return d.x; })
//         .attr("cy", function(d) { return d.y; });
//   }

//   // Function to show link information
//   function showLinkInfo(d) {
//     var sourceId = d.source.id;
//     var targetId = d.target.id;
//     tooltip.style("display", "block");
//     tooltip.html(`<strong>[Link Information]</strong><br><strong>Source:</strong> ${sourceId}<br><strong>Target:</strong> ${targetId}<br><strong>Value:</strong> ${d.value}`)
//       .style("left", (width - 200) + "px") // Adjust x-coordinate for horizontal positioning
//       .style("top", "100px"); // Fixed y-coordinate for top positioning
//   }


//   // Function to show node information
//   function showNodeInfo(d) {
//     tooltip.style("display", "block");
//     tooltip.html(`<strong>Item ID:</strong> ${d.id}<br><strong>Group:</strong> ${d.group}`)
//       .style("left", (width - 200) + "px") // Adjust x-coordinate for horizontal positioning
//       .style("top", "100px"); // Fixed y-coordinate for top positioning
//   }

// // //Function to show node information
// // function showNodeInfo(d) {
// //   var xPos = d3.event.pageX + 10;
// //   var yPos = d3.event.pageY + 10;

// //   tooltip.style("display", "block")
// //     .html(`<strong>Item ID:</strong> ${d.id}<br><strong>Group:</strong> ${d.group}`)
// //     .style("left", xPos + "px")
// //     .style("top", yPos + "px");
// // }

//   // Function to hide tooltip
//   function hideTooltip() {
//     tooltip.style("display", "none");
//   }
// // });

// function dragstarted(d) {
//   if (!d3.event.active) simulation.alphaTarget(0.3).restart();
//   d.fx = d.x;
//   d.fy = d.y;
// }

// function dragged(d) {
//   d.fx = d3.event.x;
//   d.fy = d3.event.y;
// }

// function dragended(d) {
//   if (!d3.event.active) simulation.alphaTarget(0);
//   d.fx = null;
//   d.fy = null;
// }

// ////////////////////////////////////////////////////////


