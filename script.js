// Sample D3 code to create a simple bar chart
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
