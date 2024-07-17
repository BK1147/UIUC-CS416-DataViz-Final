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

  // If the charts page is selected, create the chart
  if (pageId === 'charts1') {
      updateYearSelect('yearSelect');
      createPieCharts();
  }
  if (pageId === 'charts2') {
      updateYearSelect('yearSelect2');
      createBarCharts();
      createScatterPlot();
  }
}

// Fetch data
async function fetchData() {
  const response = await fetch('data/car_prices_subset.csv');
  const text = await response.text();
  const data = d3.csvParse(text);
  return data;
}

// Function to update year selection dropdown
function updateYearSelect(selectId) {
  fetchData().then(data => {
      const years = Array.from(new Set(data.map(d => d.year)));
      const yearSelect = document.getElementById(selectId);
      yearSelect.innerHTML = '<option value="all">All</option>'; // Add "All" option
      years.forEach(year => {
          const option = document.createElement('option');
          option.value = year;
          option.textContent = year;
          yearSelect.appendChild(option);
      });
  });
}

// Function to update charts based on selected year
function updateCharts() {
  const selectedYear1 = document.getElementById('yearSelect').value;
  const selectedYear2 = document.getElementById('yearSelect2').value;
  const selectedYear = selectedYear1 !== 'all' ? selectedYear1 : selectedYear2;

  fetchData().then(data => {
      const filteredData = selectedYear === 'all' ? data : data.filter(d => d.year === selectedYear);
      createPieCharts(filteredData);
      createBarCharts(filteredData);
      createScatterPlot(filteredData);
  });
}

// Function to create pie charts
async function createPieCharts(data = null) {
  if (!data) {
      data = await fetchData();
  }

  createPie(data, 'year', '#chart1');
  createPie(data, 'make', '#chart2');
  createPie(data, 'body', '#chart3');
  createPie(data, 'transmission', '#chart4');
}

// Function to create a pie chart
function createPie(data, category, elementId) {
  const width = 200;
  const height = 200;
  const radius = Math.min(width, height) / 2;

  const svg = d3.select(elementId)
      .html('')  // Clear existing content
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const pie = d3.pie()
      .value(d => d.value)
      .sort(null);

  const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

  const dataGrouped = d3.nest()
      .key(d => d[category])
      .rollup(v => v.length)
      .entries(data);

  const arcs = pie(dataGrouped);

  svg.selectAll('path')
      .data(arcs)
      .enter().append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.key));

  svg.selectAll('text')
      .data(arcs)
      .enter().append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .text(d => d.data.key);
}

// Function to create bar charts
async function createBarCharts(data = null) {
  if (!data) {
      data = await fetchData();
  }

  createBar(data, 'year', 'sellingprice', '#chart5');
}

// Function to create a bar chart
function createBar(data, category, value, elementId) {
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
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

  svg.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y));

  svg.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d[category]))
      .attr('y', d => y(d[value]))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d[value]));
}

// Function to create scatter plot
async function createScatterPlot(data = null) {
  if (!data) {
      data = await fetchData();
  }

  createScatter(data, 'year', 'make', 'sellingprice', '#chart6');
}

// Function to create a scatter plot
function createScatter(data, xCategory, yCategory, valueCategory, elementId) {
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
      .domain(data.map(d => d[xCategory]))
      .range([0, width])
      .padding(0.1);

  const y = d3.scaleBand()
      .domain(data.map(d => d[yCategory]))
      .range([height, 0])
      .padding(0.1);

  const color = d3.scaleLinear()
      .domain([0, d3.max(data, d => +d[valueCategory])])
      .range(['blue', 'red']);

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

  svg.selectAll('.dot')
      .data(data)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', d => x(d[xCategory]) + x.bandwidth() / 2)
      .attr('cy', d => y(d[yCategory]) + y.bandwidth() / 2)
      .attr('r', 5)
      .attr('fill', d => color(d[valueCategory]));
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  showPage('introduction');
});
