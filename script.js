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
    createPieCharts();
  } else if (pageId === 'charts2') {
    createBarCharts();
  }
}

// Function to create pie charts
async function createPieCharts() {
  const data = await fetchData();
  createPieChart(data, 'year', '#chart1');
  createPieChart(data, 'make', '#chart2');
  // createPieChart(data, 'body', '#chart3');
  // createPieChart(data, 'transmission', '#chart4');
}

// Function to create bar charts
async function createBarCharts() {
  const data = await fetchData();
  createBarChart(data, 'year', 'sellingprice', '#chart5');
  // createBarChart(data, 'odometer', 'sellingprice', '#chart6');
  // createBarChart(data, 'make', 'sellingprice', '#chart7');
}

// Function to fetch data asynchronously
async function fetchData() {
  const response = await fetch('data/car_prices_subset.csv');
  const data = await response.text();
  return d3.csvParse(data);
}

// Function to create a pie chart
function createPieChart(data, category, elementId) {
  const counts = d3.rollup(data, v => v.length, d => d[category]);
  const pieData = Array.from(counts, ([key, value]) => ({ key, value }));

  const width = 300;
  const height = 300;
  const radius = Math.min(width, height) / 2;

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const svg = d3.select(elementId)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`);

  const pie = d3.pie().value(d => d.value);
  const arc = d3.arc().innerRadius(0).outerRadius(radius);

  const path = svg.selectAll('path')
    .data(pie(pieData))
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', d => color(d.data.key));
}

// Function to create a bar chart
function createBarChart(data, category, value, elementId) {
  const width = 500;
  const height = 300;
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };

  const svg = d3.select(elementId)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const x = d3.scaleBand()
    .domain(data.map(d => d[category]))
    .range([0, width])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => +d[value])])
    .nice()
    .range([height, 0]);

  svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  svg.append('g')
    .attr('class', 'y-axis')
    .call(d3.axisLeft(y));

  svg.selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', d => x(d[category]))
    .attr('y', d => y(d[value]))
    .attr('width', x.bandwidth())
    .attr('height', d => height - y(d[value]))
    .attr('fill', 'steelblue');
}

// Initialize the first page
document.addEventListener('DOMContentLoaded', () => {
  showPage('introduction');
});
