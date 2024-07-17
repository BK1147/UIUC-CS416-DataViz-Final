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
    createCharts1();
  } else if (pageId === 'charts2') {
    createCharts2();
  }
}

// Function to create pie charts for the first charts page
function createCharts1() {
  d3.csv('data/car_prices.csv').then(data => {
    // Helper function to create pie chart
    function createPieChart(data, key, chartId) {
      const svg = d3.select(chartId).append('svg')
        .attr('width', 600)
        .attr('height', 400)
        .append('g')
        .attr('transform', 'translate(300,200)');

      const radius = Math.min(600, 400) / 2;
      const pie = d3.pie().value(d => d.value);
      const arc = d3.arc().innerRadius(0).outerRadius(radius);

      const dataMap = d3.nest()
        .key(d => d[key])
        .rollup(leaves => leaves.length)
        .entries(data)
        .map(d => ({label: d.key, value: d.value}));

      const color = d3.scaleOrdinal(d3.schemeCategory10);

      const arcs = svg.selectAll('.arc')
        .data(pie(dataMap))
        .enter().append('g')
        .attr('class', 'arc');

      arcs.append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.label));

      arcs.append('text')
        .attr('transform', d => `translate(${arc.centroid(d)})`)
        .attr('dy', '0.35em')
        .text(d => d.data.label);
    }

    // Create pie charts
    createPieChart(data, 'year', '#chart1');
    createPieChart(data, 'make', '#chart2');
    createPieChart(data, 'body', '#chart3');
    createPieChart(data, 'transmission', '#chart4');
  });
}

// Function to create bar charts for the second charts page
function createCharts2() {
  d3.csv('data/car_prices.csv').then(data => {
    // Helper function to create bar chart
    function createBarChart(data, xKey, yKey, chartId) {
      const svg = d3.select(chartId).append('svg')
        .attr('width', 600)
        .attr('height', 400);

      const margin = { top: 20, right: 30, bottom: 40, left: 40 };
      const width = +svg.attr('width') - margin.left - margin.right;
      const height = +svg.attr('height') - margin.top - margin.bottom;

      const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
      const y = d3.scaleLinear().rangeRound([height, 0]);

      x.domain(data.map(d => d[xKey]));
      y.domain([0, d3.max(data, d => +d[yKey])]);

      g.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));

      g.append('g')
        .attr('class', 'axis axis--y')
        .call(d3.axisLeft(y).ticks(10, 's'));

      g.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d[xKey]))
        .attr('y', d => y(+d[yKey]))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(+d[yKey]));
    }

    // Create bar charts
    createBarChart(data, 'year', 'sellingprice', '#chart5');
    createBarChart(data, 'odometer', 'sellingprice', '#chart6');
    createBarChart(data, 'make', 'sellingprice', '#chart7');
  });
}

// Initialize the first page
document.addEventListener('DOMContentLoaded', () => {
  showPage('introduction');
});
