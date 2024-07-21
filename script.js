let globalData = [];

// Function to show the correct page
function showPage(pageId) {
  // Hide all pages
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
    page.style.display = 'none';
  });

  // Show the selected page
  const selectedPage = document.getElementById(pageId);
  if (selectedPage) {
    selectedPage.style.display = 'block';
  }

  // If the charts page is selected, create the charts
  if (pageId === 'charts1') {
    updateYearSelect('yearSelect');
    createBarCharts();
  } else if (pageId === 'charts2') {
    updateYearSelect('yearSelect2');
    createLineCharts();
  }
}

// Function to fetch data asynchronously
async function fetchData() {
  const response = await fetch('data/car_prices_sample_cleaned.csv');
  const data = await response.text();
  globalData = d3.csvParse(data);
  return globalData;
}

// Function to update year select options
function updateYearSelect(selectId) {
  const yearSelect = document.getElementById(selectId);
  const years = Array.from(new Set(globalData.map(d => d.year)));
  years.sort();
  yearSelect.innerHTML = '<option value="all">All</option>';
  years.forEach(year => {
    const option = document.createElement('option');
    option.value = year;
    option.text = year;
    yearSelect.appendChild(option);
  });
}

// Function to update charts based on selected year
function updateCharts() {
  const selectedYear1 = document.getElementById('yearSelect').value;
  const selectedYear2 = document.getElementById('yearSelect2').value;
  
  if (selectedYear1 === 'all') {
    createBarCharts(globalData);
  } else {
    createBarCharts(globalData.filter(d => d.year === selectedYear1));
  }

  if (selectedYear2 === 'all') {
    createLineCharts(globalData);
  } else {
    createLineCharts(globalData.filter(d => d.year === selectedYear2));
  }
}

// Function to create bar charts
async function createBarCharts(data = null) {
  if (!data) {
    data = await fetchData();
  }

  createBarChart(data, 'make', '#chart1');
  createBarChart(data, 'body', '#chart2');
}

// Function to create a bar chart
function createBarChart(data, category, elementId) {
  const counts = d3.rollups(data, v => v.length, d => d[category]);
  const barData = Array.from(counts, ([key, value]) => ({ key, value }));

  const width = 500;
  const height = 300;
  // top was 20
  const margin = { top: 30, right: 20, bottom: 50, left: 50 }; 

  const svg = d3.select(elementId)
    .html('')  // Clear existing content
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // Add a title to the chart
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', -margin.top / 2)
    .attr('text-anchor', 'middle')
    .attr('class', 'chart-title')
    .text(`${category.charAt(0).toUpperCase() + category.slice(1)} Distribution`);

  const x = d3.scaleBand()
    .domain(barData.map(d => d.key))
    .range([0, width])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(barData, d => d.value)])
    .nice()
    .range([height, 0]);

  // Define the color scale
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
    .attr('transform', 'rotate(-45)')
    .style('text-anchor', 'end');

  svg.append('g')
    .attr('class', 'y-axis')
    .call(d3.axisLeft(y));

  svg.selectAll('.bar')
    .data(barData)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('x', d => x(d.key))
    .attr('y', d => y(d.value))
    .attr('width', x.bandwidth())
    .attr('height', d => height - y(d.value))
    .attr('fill', d => color(d.key)); // Use the color scale
}

// Function to create line charts
async function createLineCharts(data = null) {
  if (!data) {
    data = await fetchData();
  }

  createLineChart(data, 'odometer_custom', 'sellingprice', '#chart5'); // make
  //createLineChart(data, 'state', 'sellingprice', '#chart5'); 
}

// // Function to create a line chart
// function createLineChart(data, category, value, elementId) {
//   // Group data by category and calculate the average selling price
//   const groupedData = d3.rollups(
//     data,
//     v => d3.mean(v, d => +d[value]),
//     d => d[category]
//   ).map(([key, value]) => ({ category: key, value }));

//   // Sort data by category
//   groupedData.sort((a, b) => d3.ascending(a.category, b.category));

//   const width = 500;
//   const height = 300;
//   const margin = { top: 20, right: 20, bottom: 50, left: 50 };

//   const svg = d3.select(elementId)
//     .html('')  // Clear existing content
//     .append('svg')
//     .attr('width', width + margin.left + margin.right)
//     .attr('height', height + margin.top + margin.bottom)
//     .append('g')
//     .attr('transform', `translate(${margin.left}, ${margin.top})`);

//   const x = d3.scaleBand()
//     .domain(groupedData.map(d => d.category))
//     .range([0, width])
//     .padding(0.1);

//   const y = d3.scaleLinear()
//     .domain([0, d3.max(groupedData, d => d.value)])
//     .nice()
//     .range([height, 0]);

//   // Append the x-axis
//   svg.append('g')
//     .attr('class', 'x-axis')
//     .attr('transform', `translate(0, ${height})`)
//     .call(d3.axisBottom(x))
//     .selectAll('text')
//     .attr('transform', 'rotate(-45)')
//     .style('text-anchor', 'end');

//   // Append the y-axis
//   svg.append('g')
//     .attr('class', 'y-axis')
//     .call(d3.axisLeft(y));

//   // Line generator
//   const line = d3.line()
//     .x(d => x(d.category) + x.bandwidth() / 2)
//     .y(d => y(d.value));

//   // Append the line path
//   svg.append('path')
//     .datum(groupedData)
//     .attr('class', 'line')
//     .attr('d', line)
//     .attr('fill', 'none')
//     .attr('stroke', 'steelblue')
//     .attr('stroke-width', 1.5);

//   // Append circles at data points
//   svg.selectAll('.dot')
//     .data(groupedData)
//     .enter().append('circle')
//     .attr('class', 'dot')
//     .attr('cx', d => x(d.category) + x.bandwidth() / 2)
//     .attr('cy', d => y(d.value))
//     .attr('r', 3)
//     .attr('fill', 'steelblue');
// }

// Function to create a line chart
function createLineChart(data, category, value, elementId) {
  // Group data by category and calculate the average selling price
  const groupedData = d3.rollups(
    data,
    v => d3.mean(v, d => +d[value]),
    d => d[category]
  ).map(([key, value]) => ({ category: key, value }));

  // Sort data by category
  groupedData.sort((a, b) => d3.ascending(a.category, b.category));

  const width = 500;
  const height = 300;
  const margin = { top: 30, right: 20, bottom: 50, left: 50 };

  const svg = d3.select(elementId)
    .html('')  // Clear existing content
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // Add a title to the chart
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', -margin.top / 2)
    .attr('text-anchor', 'middle')
    .attr('class', 'chart-title')
    .text(`${category.charAt(0).toUpperCase() + category.slice(1)} vs ${value.charAt(0).toUpperCase() + value.slice(1)}`);
    
  const x = d3.scaleBand()
    .domain(groupedData.map(d => d.category))
    .range([0, width])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(groupedData, d => d.value)])
    .nice()
    .range([height, 0]);

  // Append the x-axis
  svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
    .attr('transform', 'rotate(-45)')
    .style('text-anchor', 'end');

  // Append the y-axis
  svg.append('g')
    .attr('class', 'y-axis')
    .call(d3.axisLeft(y));

  // Line generator
  const line = d3.line()
    .x(d => x(d.category) + x.bandwidth() / 2)
    .y(d => y(d.value));

  // Append the line path
  svg.append('path')
    .datum(groupedData)
    .attr('class', 'line')
    .attr('d', line)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 1.5);

  // Append circles at data points
  svg.selectAll('.dot')
    .data(groupedData)
    .enter().append('circle')
    .attr('class', 'dot')
    .attr('cx', d => x(d.category) + x.bandwidth() / 2)
    .attr('cy', d => y(d.value))
    .attr('r', 3)
    .attr('fill', 'steelblue');

  // Find the highest data point
  const maxData = groupedData.reduce((max, d) => (d.value > max.value ? d : max), groupedData[0]);

  // Add annotation for the highest data point
  const annotationX = x(maxData.category) + x.bandwidth() / 2;
  const annotationY = y(maxData.value) - 10;

  svg.append('line')
    .attr('x1', annotationX)
    .attr('y1', y(maxData.value))
    .attr('x2', annotationX)
    .attr('y2', annotationY)
    .attr('stroke', 'black')
    .attr('stroke-width', 1)
    .attr('marker-end', 'url(#arrow)');

  svg.append('text')
    .attr('x', annotationX)
    .attr('y', annotationY - 10)
    .attr('text-anchor', 'middle')
    .style('font-size', '12px')
    .style('font-weight', 'bold')
    .text(`Highest one in here: ${maxData.category} (${maxData.value.toFixed(2)})`);

  // Define arrow marker
  svg.append('defs').append('marker')
    .attr('id', 'arrow')
    .attr('markerWidth', 10)
    .attr('markerHeight', 10)
    .attr('refX', 5)
    .attr('refY', 5)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M0,0 L10,5 L0,10 Z')
    .attr('fill', 'black');
}


// Fetch data and show the introduction page initially
fetchData().then(() => showPage('introduction'));
