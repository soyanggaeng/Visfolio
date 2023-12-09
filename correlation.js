
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

  // console.log(startYearSelect);
  // console.log(endYearSelect);

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

          // Fetch data from the file and filter based on search query
          fetch(filePath)
              .then(response => response.text()) // 텍스트로 변환한 후, 각 줄을 읽어서 데이터를 처리
              .then(data => { // fetch로부터 비동기적으로 반환된 데이터가 data에 전달
                  const lines = data.split('\n'); // data 문자열을 개행 문자(\n)를 기준으로 나누어 각 줄을 배열로 변환
                  lines.forEach(line => { // forEach 메서드를 사용하여 lines 배열의 각 요소에 대해 반복 작업을 수행
                    // 각 줄(line)을 쉼표(,)를 기준으로 분리하고, 그 중 첫 번째 열에 해당하는 회사 이름을 추출하여 companyName 변수에 저장  
                    const companyName = line.split(',')[0]; // Assuming the company name is in the first column
                      
                    // 회사 이름을 포함하는 경우에만 <option> 엘리먼트를 생성하여 해당 목록에 동적으로 추가하는 부분
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

  // 오류나는 부분!! (new_df 가 defined되지 않았다고 뜸 -> promises 관련 코드를 추가했는데도 오류가 남..)
  // Function to perform data preprocessing
  async function performDataPreprocessing(startYear, endYear, markets, items) {
    const data = [];
    // const new_df = new dfd.DataFrame();  // 빈 데이터프레임에 열을 추가하려고 할 때 오류남

    const promises = markets.map((market, index) => {
    const item = items[index];
    return dfd.readCSV(`data/${market}/${item}.csv`)
      .then(df => {
        const mask = df['Date'].apply(date => {
          const year = parseInt(date.split('-')[0]);
          return year >= parseInt(startYear) && year <= parseInt(endYear);
        });
    const filteredData = df.loc({ rows: mask });
    const dateFilteredData = filteredData.column('Date');
    const closeFilteredData = filteredData.column('Close');

    if (index === 0) {
      const new_df = new dfd.DataFrame({ 'Date': dateFilteredData });
      // new_df.addColumn('Date', dateFilteredData, { inplace: true });
      new_df.addColumn(item, closeFilteredData, { inplace: true });
    } else {
      new_df.addColumn(item, closeFilteredData, { inplace: true });
    }
    })
    .catch(err => {
      console.log(err);
    });
  });

  Promise.all(promises)
  .then(() => {
    // All CSV reading and DataFrame manipulation operations are completed
    // At this point, the columns have been added to new_df
    console.log('new_df:', new_df);
    // Further processing or utilization of new_df can be done here
  })
  .catch(err => {
    console.log(err);
  });

  }

  // 오류나는 부분!!
  // 가장 최근 작업 (위에 나온 promise.all 코드 반영하기 이전 코드)
  // async function performDataPreprocessing(startYear, endYear, markets, items) {
  
  //   const data = [];
  //   // const new_df = new dfd.DataFrame();
  //   let new_df;

  //   for (let i = 0; i < markets.length; i++) {
  //     const market = markets[i];
  //     const item = items[i];

  //     dfd.readCSV(`data/${market}/${item}.csv`) //assumes file is in CWD
  //       .then(df => {

  //         const mask = df['Date'].apply((date) => {
  //           const year = parseInt(date.split('-')[0]); // Extract year from 'Date' column
  //           return year >= parseInt(startYear) && year <= parseInt(endYear);
  //         });
  //         // console.log("mask");   // mask는 series임
  //         // console.log(mask);
  
  //         // Create a new DataFrame with filtered rows
  //         let filteredData = df.loc({rows: mask});  
          
  //         const dateFilteredData = filteredData.column("Date");
  //         const closeFilteredData = filteredData.column("Close");

  //         if (i === 0) {
  //           // For the first file, add both 'Date' and 'Close' columns to new_df
  //           var new_df = new dfd.DataFrame({ 'Date': dateFilteredData });
  //           new_df.print();
  //           new_df.addColumn( item, closeFilteredData, { inplace: true } );
  //         } else {
  //           // For subsequent files, add only the 'Close' column to new_df
  //           new_df.addColumn( item, closeFilteredData, { inplace: true } );
  //         }

  //       }).catch(err=>{
  //         console.log(err);
  //       })
        
  //   } // for문 끝남.

  //   new_df.print();   // 여기서 오류가 남.

  //   // Remove rows with missing values from new_df
  //   //preprocessed_df = new_df.dropNa({ axis: 0 })

  //   // console.log("preprocessed_df : no missing");
  //   // preprocessed_df.print();

  //   // // Calculate correlation matrix
  //   // const correlationMatrix = preprocessed_df.corr();

  //   // // Extract correlation values and create JSON data
  //   // correlationMatrix.values.forEach((row, rowIndex) => {
  //   //   const item1 = new_df.columns[rowIndex];
  //   //   row.forEach((cor, colIndex) => {
  //   //     const item2 = new_df.columns[colIndex];
  //   //     if (!Number.isNaN(cor) && rowIndex !== colIndex) {
  //   //       data.push({ item1, item2, cor });
  //   //     }
  //   //   });
  //   // });

  //   // // Log the resulting data
  //   // console.log('Preprocessed data:', data);
  //   // return data;
  // }

  // let corr_data; // Variable to store preprocessed data

  // 아래 코드는 위에 있는 코드가 잘 돌아간 후 오류 확인 필요(위에서 막혀서 renderHeatmap함수까지 돌려보지 못한 상태)
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

    // Create Vega-Lite specification and render visualization
    renderHeatmap(corr_data);
  });


  // Function to render the heatmap using Vega-Lite
  function renderHeatmap(data) {
    // Vega-Lite specification
    const vlSpec = {
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
  }

});

// (참고)
// 자바스크립트로 직접 상관관계 계산하는 코드 작성 -> 위에서 통합해서 작성중임
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

// 직접 코드에 data 넣어서 돌려본 경우
// var corr_data = [{'item1': 'AJ네트웍스', 'item2': 'AJ네트웍스', 'cor': 1.0}, {'item1': 'AJ네트웍스', 'item2': 'AK홀딩스', 'cor': 0.5808991997452422}, {'item1': 'AJ네트웍스', 'item2': 'BGF', 'cor': 0.616733883261061}, {'item1': 'AJ네트웍스', 'item2': '삼성전자', 'cor': -0.4618927786873072}, {'item1': 'AJ네트웍스', 'item2': '아모레퍼시픽', 'cor': 0.6468522834150147}, {'item1': 'AJ네트웍스', 'item2': '카카오', 'cor': -0.22246497296865567}, {'item1': 'AJ네트웍스', 'item2': '경동나비엔', 'cor': -0.13246063488448556}, {'item1': 'AJ네트웍스', 'item2': '금호타이어', 'cor': 0.5240724651068914}, {'item1': 'AJ네트웍스', 'item2': '기아', 'cor': -0.070655577945304}, {'item1': 'AJ네트웍스', 'item2': '빙그레', 'cor': 0.2524327211079841}, {'item1': 'AK홀딩스', 'item2': 'AJ네트웍스', 'cor': 0.5808991997452422}, {'item1': 'AK홀딩스', 'item2': 'AK홀딩스', 'cor': 1.0}, {'item1': 'AK홀딩스', 'item2': 'BGF', 'cor': 0.6891861915340353}, {'item1': 'AK홀딩스', 'item2': '삼성전자', 'cor': -0.6739445868991941}, {'item1': 'AK홀딩스', 'item2': '아모레퍼시픽', 'cor': 0.8034018018942896}, {'item1': 'AK홀딩스', 'item2': '카카오', 'cor': -0.6289256377252997}, {'item1': 'AK홀딩스', 'item2': '경동나비엔', 'cor': 0.060416649043513605}, {'item1': 'AK홀딩스', 'item2': '금호타이어', 'cor': 0.6914095198327443}, {'item1': 'AK홀딩스', 'item2': '기아', 'cor': -0.6507087866352705}, {'item1': 'AK홀딩스', 'item2': '빙그레', 'cor': 0.7106891377164657}, {'item1': 'BGF', 'item2': 'AJ네트웍스', 'cor': 0.616733883261061}, {'item1': 'BGF', 'item2': 'AK홀딩스', 'cor': 0.6891861915340353}, {'item1': 'BGF', 'item2': 'BGF', 'cor': 1.0}, {'item1': 'BGF', 'item2': '삼성전자', 'cor': -0.6938834209837871}, {'item1': 'BGF', 'item2': '아모레퍼시픽', 'cor': 0.8274508560518724}, {'item1': 'BGF', 'item2': '카카오', 'cor': -0.5181140714213462}, {'item1': 'BGF', 'item2': '경동나비엔', 'cor': -0.24971555714036314}, {'item1': 'BGF', 'item2': '금호타이어', 'cor': 0.8403869490093576}, {'item1': 'BGF', 'item2': '기아', 'cor': -0.4042511668097954}, {'item1': 'BGF', 'item2': '빙그레', 'cor': 0.5027003371693426}, {'item1': '삼성전자', 'item2': 'AJ네트웍스', 'cor': -0.4618927786873072}, {'item1': '삼성전자', 'item2': 'AK홀딩스', 'cor': -0.6739445868991941}, {'item1': '삼성전자', 'item2': 'BGF', 'cor': -0.6938834209837871}, {'item1': '삼성전자', 'item2': '삼성전자', 'cor': 1.0}, {'item1': '삼성전자', 'item2': '아모레퍼시픽', 'cor': -0.6298299847678832}, {'item1': '삼성전자', 'item2': '카카오', 'cor': 0.8200594535994847}, {'item1': '삼성전자', 'item2': '경동나비엔', 'cor': 0.38351606811199934}, {'item1': '삼성전자', 'item2': '금호타이어', 'cor': -0.5794978446569281}, {'item1': '삼성전자', 'item2': '기아', 'cor': 0.7094213381186582}, {'item1': '삼성전자', 'item2': '빙그레', 'cor': -0.5527141864779478}, {'item1': '아모레퍼시픽', 'item2': 'AJ네트웍스', 'cor': 0.6468522834150147}, {'item1': '아모레퍼시픽', 'item2': 'AK홀딩스', 'cor': 0.8034018018942896}, {'item1': '아모레퍼시픽', 'item2': 'BGF', 'cor': 0.8274508560518724}, {'item1': '아모레퍼시픽', 'item2': '삼성전자', 'cor': -0.6298299847678832}, {'item1': '아모레퍼시픽', 'item2': '아모레퍼시픽', 'cor': 1.0}, {'item1': '아모레퍼시픽', 'item2': '카카오', 'cor': -0.39512984211874325}, {'item1': '아모레퍼시픽', 'item2': '경동나비엔', 'cor': 0.07986781914642205}, {'item1': '아모레퍼시픽', 'item2': '금호타이어', 'cor': 0.8169264066274052}, {'item1': '아모레퍼시픽', 'item2': '기아', 'cor': -0.413828187468009}, {'item1': '아모레퍼시픽', 'item2': '빙그레', 'cor': 0.6231240609694045}, {'item1': '카카오', 'item2': 'AJ네트웍스', 'cor': -0.22246497296865567}, {'item1': '카카오', 'item2': 'AK홀딩스', 'cor': -0.6289256377252997}, {'item1': '카카오', 'item2': 'BGF', 'cor': -0.5181140714213462}, {'item1': '카카오', 'item2': '삼성전자', 'cor': 0.8200594535994847}, {'item1': '카카오', 'item2': '아모레퍼시픽', 'cor': -0.39512984211874325}, {'item1': '카카오', 'item2': '카카오', 'cor': 1.0}, {'item1': '카카오', 'item2': '경동나비엔', 'cor': 0.4335783001493612}, {'item1': '카카오', 'item2': '금호타이어', 'cor': -0.37990674413517656}, {'item1': '카카오', 'item2': '기아', 'cor': 0.7842802046837066}, {'item1': '카카오', 'item2': '빙그레', 'cor': -0.40465518330605255}, {'item1': '경동나비엔', 'item2': 'AJ네트웍스', 'cor': -0.13246063488448556}, {'item1': '경동나비엔', 'item2': 'AK홀딩스', 'cor': 0.060416649043513605}, {'item1': '경동나비엔', 'item2': 'BGF', 'cor': -0.24971555714036314}, {'item1': '경동나비엔', 'item2': '삼성전자', 'cor': 0.38351606811199934}, {'item1': '경동나비엔', 'item2': '아모레퍼시픽', 'cor': 0.07986781914642205}, {'item1': '경동나비엔', 'item2': '카카오', 'cor': 0.4335783001493612}, {'item1': '경동나비엔', 'item2': '경동나비엔', 'cor': 1.0}, {'item1': '경동나비엔', 'item2': '금호타이어', 'cor': 0.13729048430124374}, {'item1': '경동나비엔', 'item2': '기아', 'cor': 0.17846387802449665}, {'item1': '경동나비엔', 'item2': '빙그레', 'cor': 0.08892821421248875}, {'item1': '금호타이어', 'item2': 'AJ네트웍스', 'cor': 0.5240724651068914}, {'item1': '금호타이어', 'item2': 'AK홀딩스', 'cor': 0.6914095198327443}, {'item1': '금호타이어', 'item2': 'BGF', 'cor': 0.8403869490093576}, {'item1': '금호타이어', 'item2': '삼성전자', 'cor': -0.5794978446569281}, {'item1': '금호타이어', 'item2': '아모레퍼시픽', 'cor': 0.8169264066274052}, {'item1': '금호타이어', 'item2': '카카오', 'cor': -0.37990674413517656}, {'item1': '금호타이어', 'item2': '경동나비엔', 'cor': 0.13729048430124374}, {'item1': '금호타이어', 'item2': '금호타이어', 'cor': 1.0}, {'item1': '금호타이어', 'item2': '기아', 'cor': -0.3012610019711417}, {'item1': '금호타이어', 'item2': '빙그레', 'cor': 0.5133655469514059}, {'item1': '기아', 'item2': 'AJ네트웍스', 'cor': -0.070655577945304}, {'item1': '기아', 'item2': 'AK홀딩스', 'cor': -0.6507087866352705}, {'item1': '기아', 'item2': 'BGF', 'cor': -0.4042511668097954}, {'item1': '기아', 'item2': '삼성전자', 'cor': 0.7094213381186582}, {'item1': '기아', 'item2': '아모레퍼시픽', 'cor': -0.413828187468009}, {'item1': '기아', 'item2': '카카오', 'cor': 0.7842802046837066}, {'item1': '기아', 'item2': '경동나비엔', 'cor': 0.17846387802449665}, {'item1': '기아', 'item2': '금호타이어', 'cor': -0.3012610019711417}, {'item1': '기아', 'item2': '기아', 'cor': 1.0}, {'item1': '기아', 'item2': '빙그레', 'cor': -0.5769556894996385}, {'item1': '빙그레', 'item2': 'AJ네트웍스', 'cor': 0.2524327211079841}, {'item1': '빙그레', 'item2': 'AK홀딩스', 'cor': 0.7106891377164657}, {'item1': '빙그레', 'item2': 'BGF', 'cor': 0.5027003371693426}, {'item1': '빙그레', 'item2': '삼성전자', 'cor': -0.5527141864779478}, {'item1': '빙그레', 'item2': '아모레퍼시픽', 'cor': 0.6231240609694045}, {'item1': '빙그레', 'item2': '카카오', 'cor': -0.40465518330605255}, {'item1': '빙그레', 'item2': '경동나비엔', 'cor': 0.08892821421248875}, {'item1': '빙그레', 'item2': '금호타이어', 'cor': 0.5133655469514059}, {'item1': '빙그레', 'item2': '기아', 'cor': -0.5769556894996385}, {'item1': '빙그레', 'item2': '빙그레', 'cor': 1.0}]

// Vega-Lite specification
// var vlSpec = {
//   $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
//   width: 340, 
//   height: 340, 
//   mark: { type: 'rect', tooltip: { content: 'data' }, clip: true },
//   data: { values: corr_data },
//   encoding: {
//     x: { field: 'item1', type: 'nominal' },
//     y: { field: 'item2', type: 'nominal' },
//     // color: { field: 'cor', type: 'quantitative' },
//     color: { 
//       field: 'cor', 
//       type: 'quantitative', 
//       scale: { scheme: 'redyellowblue', reverse: true } // 변경된 부분
//     }
//     // Add more encodings or transformations as needed
//   }
// };

// // Embed the visualization in the 'heatmap' div
// vegaEmbed('#heatmap', vlSpec)
//   .then(function(result) {})
//   .catch(console.error);

// 이하 network 코드는 잘 돌아감
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
// submitButton2 버튼을 눌렀을 때, 결과창 보여지게 하는 코드

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



