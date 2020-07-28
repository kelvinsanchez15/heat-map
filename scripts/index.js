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
const margin = { top: 30, right: 20, bottom: 35, left: 80 };

const svg = d3
  .select("#graph")
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
    .scaleSequential()
    .domain([2.8, 12.8])
    .interpolator(d3.interpolateBlues);

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

  // Rect (bar) elements append
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
    .attr("fill", (d) => colorScale(baseTemp + d.variance));
  // .on("mouseover", (d) => tooltipMouseOver(d))
  // .on("mouseout", (d) => tooltipMouseOut(d));

  // Interaction logic
  const tooltip = d3
    .select("#graph")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  const tooltipMouseOver = (d) => {
    tooltip.transition().duration(200).style("opacity", 0.9);

    tooltip
      .html(
        `${d["Name"]} (${d["Nationality"]})
        <br />Year: ${formatYear(d["Year"])}, Time: ${formatTime(d["Time"])}`
      )
      .attr("data-year", d["Year"])
      .style("left", d3.event.pageX + 20 + "px")
      .style("top", d3.event.pageY + 20 + "px");
  };

  const tooltipMouseOut = () =>
    tooltip.transition().duration(200).style("opacity", 0);

  // Legend logic
  // const keys = ["Dopping Allegations", "No Dopping Allegations"];

  // const color = d3.scaleOrdinal().domain(keys).range(["#ad4231", "#079672"]);

  // const size = 10;

  // const legend = svg.append("g").attr("id", "legend");

  // legend
  //   .selectAll("mydots")
  //   .data(keys)
  //   .enter()
  //   .append("rect")
  //   .attr("x", 450)
  //   .attr("y", (d, i) => margin.top + i * (size + 5))
  //   .attr("width", size)
  //   .attr("height", size)
  //   .style("fill", (d) => color(d));

  // legend
  //   .selectAll("mylabels")
  //   .data(keys)
  //   .enter()
  //   .append("text")
  //   .attr("x", 450 + size * 1.2)
  //   .attr("y", (d, i) => margin.top + i * (size + 5) + size / 2)
  //   .style("fill", (d) => color(d))
  //   .text((d) => d)
  //   .attr("text-anchor", "left")
  //   .style("alignment-baseline", "central");
};
