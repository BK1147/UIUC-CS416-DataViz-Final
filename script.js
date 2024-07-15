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
    if (pageId === 'charts') {
      createChart();
    }
  }
  
  // Sample D3 code to create a simple bar chart
  function createChart() {
    // Remove any existing SVG elements
    d3.select("#chart").selectAll("svg").remove();
  
    const data = [30, 86, 168, 281, 303, 365];
  
    const width = 500;
    const height = 300;
    const barWidth = 40;
  
    const svg = d3.select("#chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  
    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * (barWidth + 10))
      .attr("y", d => height - d)
      .attr("width", barWidth)
      .attr("height", d => d)
      .attr("fill", "teal");
  }
  
  // Initially show the introduction page
  showPage('introduction');
  