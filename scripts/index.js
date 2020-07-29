// Fetch json and preprocess data
const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

d3.json(url).then((data) => {
  data.monthlyVariance.map((e) => (e.month -= 1));
  render(data);
});

const fullNameMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// SVG layout setup
const width = 900;
const height = 300;
const margin = { top: 10, right: 10, bottom: 45, left: 80 };

const svg = d3
  .select("#heat-map")
  .append("svg")
  .attr("viewBox", [0, 0, width, height]);

// Render function
const render = (data) => {
  const xValue = (d) => d.year;
  const yValue = (d) => d.month;
  const baseTemp = data.baseTemperature;

  const xScale = d3
    .scaleBand()
    .domain(data.monthlyVariance.map((d) => d.year))
    .rangeRound([margin.left, width - margin.right]);

  const yScale = d3
    .scaleBand()
    .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    .rangeRound([height - margin.bottom, margin.top]);

  // Sequential color scale implementation
  const colorScale = d3
    .scaleSequentialQuantile()
    .domain([2.8, 4.5, 6.2, 7.9, 9.6, 11.3, 12.8])
    .interpolator(d3.interpolateYlOrRd);

  // Axes setup
  const xAxis = d3
    .axisBottom(xScale)
    .tickValues(xScale.domain().filter((year) => year % 10 === 0));
  const xAxisLabel = "Years";

  const yAxis = d3
    .axisLeft(yScale)
    .tickValues(yScale.domain())
    .tickFormat((month, index) => fullNameMonths[index]);
  const yAxisLabel = "Months";

  // Bottom Axis append
  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(xAxis);

  // Left Axis append
  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(yAxis);

  // Left Axis label append
  svg
    .append("text")
    .attr("class", "axis-label")
    .attr("text-anchor", "middle")
    .attr("transform", `translate(${10}, ${height / 2})rotate(-90)`)
    .text(yAxisLabel)
    .attr("fill", "white");

  // Bottom Axis label append
  svg
    .append("text")
    .attr("class", "axis-label")
    .attr("text-anchor", "middle")
    .attr("transform", `translate(${width / 2}, ${height})`)
    .text(xAxisLabel)
    .attr("fill", "white");

  // Rect (cell) elements append
  svg
    .selectAll("rect")
    .data(data.monthlyVariance)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-year", xValue)
    .attr("data-month", yValue)
    .attr("data-temp", (d) => baseTemp + d.variance)
    .attr("x", (d) => xScale(xValue(d)))
    .attr("y", (d) => yScale(yValue(d)))
    .attr("width", xScale.bandwidth())
    .attr("height", yScale.bandwidth())
    .attr("fill", (d) => colorScale(baseTemp + d.variance))
    .on("mouseover", (d) => tooltipMouseOver(d))
    .on("mouseout", (d) => tooltipMouseOut(d));

  // Interaction logic
  const tooltip = d3
    .select("#heat-map")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  const tooltipMouseOver = (d) => {
    tooltip.transition().duration(200).style("opacity", 0.9);

    tooltip
      .html(
        `Year: ${d.year}<br />
      Temp: ${(baseTemp + d.variance).toFixed(1)}°C<br />
      Variance: ${d.variance}`
      )
      .attr("data-year", d.year)
      .style("left", d3.event.pageX + 20 + "px")
      .style("top", d3.event.pageY + 20 + "px");
  };

  const tooltipMouseOut = () =>
    tooltip.transition().duration(200).style("opacity", 0);

  // Legend logic
  const keys = [2.8, 4.5, 6.2, 7.9, 9.6, 11.3, 12.8];

  const rectHeight = 7;
  const rectWidth = 25;

  const legend = svg.append("g").attr("id", "legend");

  legend
    .selectAll("myrects")
    .data(keys)
    .enter()
    .append("rect")
    .attr("x", (d, i) => margin.left + i * rectWidth)
    .attr("y", 285)
    .attr("width", rectWidth)
    .attr("height", rectHeight)
    .attr("stroke", "black")
    .style("fill", (d) => colorScale(d));

  legend
    .selectAll("mylabels")
    .data(keys)
    .enter()
    .append("text")
    .attr("x", (d, i) => margin.left + rectWidth / 2 + i * rectWidth)
    .attr("y", height)
    .style("fill", "white")
    .text((d) => d)
    .attr("text-anchor", "middle");
};
