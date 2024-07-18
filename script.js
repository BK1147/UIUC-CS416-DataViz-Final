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
    createPieCharts();
  } else if (pageId === 'charts2') {
    updateYearSelect('yearSelect2');
    createLineCharts();
  }
}

// Function to fetch data asynchronously
async function fetchData() {
  const response = await fetch('data/car_prices_subset.csv');
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
    createPieCharts(globalData);
  } else {
    createPieCharts(globalData.filter(d => d.year === selectedYear1));
  }

  if (selectedYear2 === 'all') {
    createLineCharts(globalData);

  } else {
    createLineCharts(globalData.filter(d => d.year === selectedYear2));
  }
}

// Function to create pie charts
async function createPieCharts(data = null) {
  if (!data) {
    data = await fetchData();
  }

  createPieChart(data, 'make', '#chart1');
  createPieChart(data, 'body', '#chart2');
}

// Function to create a pie chart
function createPieChart(data, category, elementId) {
  const counts = d3.rollups(data, v => v.length, d => d[category]);
  const pieData = Array.from(counts, ([key, value]) => ({ key, value }));

  const width = 300;
  const height = 300;
  const radius = Math.min(width, height) / 2;

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const svg = d3.select(elementId)
    .html('')  // Clear existing content
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`);

  const pie = d3.pie().value(d => d.value);
  const arc = d3.arc().innerRadius(0).outerRadius(radius);

  const g = svg.selectAll('.arc')
    .data(pie(pieData))
    .enter().append('g')
    .attr('class', 'arc');

  g.append('path')
    .attr('d', arc)
    .attr('fill', d => color(d.data.key));

  g.append('text')
    .attr('transform', d => `translate(${arc.centroid(d)})`)
    .attr('dy', '0.35em')
    .style('text-anchor', 'middle')
    .text(d => `${d.data.key}: ${d.data.value}`);
}

// // Function to create bar charts
// async function createBarCharts(data = null) {
//   if (!data) {
//     data = await fetchData();
//   }

//   createBarChart(data, 'make', 'sellingprice', '#chart5');
// }

// // Function to create a bar chart
// function createBarChart(data, category, value, elementId) {
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
//     .domain(data.map(d => d[category]))
//     .range([0, width])
//     .padding(0.1);

//   const y = d3.scaleLinear()
//     .domain([0, d3.max(data, d => +d[value])])
//     .nice()
//     .range([height, 0]);

//   svg.append('g')
//     .attr('class', 'x-axis')
//     .attr('transform', `translate(0, ${height})`)
//     .call(d3.axisBottom(x))
//     .selectAll('text')
//     .attr('transform', 'rotate(-45)')
//     .style('text-anchor', 'end');

//   svg.append('g')
//     .attr('class', 'y-axis')
//     .call(d3.axisLeft(y));

//   svg.selectAll('.bar')
//     .data(data)
//     .enter().append('rect')
//     .attr('class', 'bar')
//     .attr('x', d => x(d[category]))
//     .attr('y', d => y(d[value]))
//     .attr('width', x.bandwidth())
//     .attr('height', d => height - y(d[value]))
//     .attr('fill', 'steelblue');
// }

// Function to create line charts
async function createLineCharts(data = null) {
  if (!data) {
    data = await fetchData();
  }

  createLineChart(data, 'make', 'sellingprice', '#chart5');
}

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
  const margin = { top: 20, right: 20, bottom: 50, left: 50 };

  const svg = d3.select(elementId)
    .html('')  // Clear existing content
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

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
}

// Fetch data and show the introduction page initially
fetchData().then(() => showPage('introduction'));
