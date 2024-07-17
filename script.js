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
    createChart1();
  } else if (pageId === 'charts2') {
    createChart2();
  }
}

// Function to create the first chart
function createChart1() {
  d3.csv('data/car_prices.csv').then(data => {
    // Create a sample bar chart for demonstration
    const svg = d3.select('#chart1').append('svg')
      .attr('width', 600)
      .attr('height', 400);

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = +svg.attr('width') - margin.left - margin.right;
    const height = +svg.attr('height') - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
    const y = d3.scaleLinear().rangeRound([height, 0]);

    x.domain(data.map(d => d.make));
    y.domain([0, d3.max(data, d => +d.sellingprice)]);

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
      .attr('x', d => x(d.make))
      .attr('y', d => y(+d.sellingprice))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(+d.sellingprice));
  });
}

// Function to create the second chart
function createChart2() {
  d3.csv('data/car_prices.csv').then(data => {
    // Create a sample line chart for demonstration
    const svg = d3.select('#chart2').append('svg')
      .attr('width', 600)
      .attr('height', 400);

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = +svg.attr('width') - margin.left - margin.right;
    const height = +svg.attr('height') - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime().rangeRound([0, width]);
    const y = d3.scaleLinear().rangeRound([height, 0]);

    const parseTime = d3.timeParse('%a %b %d %Y %H:%M:%S GMT%Z (PST)');

    data.forEach(d => {
      d.saledate = parseTime(d.saledate);
      d.sellingprice = +d.sellingprice;
    });

    x.domain(d3.extent(data, d => d.saledate));
    y.domain([0, d3.max(data, d => d.sellingprice)]);

    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(y).ticks(10, 's'));

    const line = d3.line()
      .x(d => x(d.saledate))
      .y(d => y(d.sellingprice));

    g.append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('d', line);
  });
}

// Initialize the first page
document.addEventListener('DOMContentLoaded', () => {
  showPage('introduction');
});
