var margin = {top: 40, right: 20, bottom: 90, left: 140},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var data = [
		{ "id": "1", "name": "Ruby", "size": 418701}, 
		{ "id": "2", "name": "HTML", "size": 175058}, 
		{ "id": "3", "name": "CSS", "size": 312613}, 
		{ "id": "4", "name": "CoffeeScript", "size": 1336}, 
		{ "id": "5", "name": "JavaScript", "size": 54871}
	];
/* 
 * value accessor - returns the value to encode for a given data object.
 * scale - maps value to a visual display encoding, such as a pixel position.
 * map function - maps from data value to display value
 * axis - sets up axis
 */ 

// setup x 
var xValue = function(d) { return d.id;}, // data -> value
    xScale = d3.scale.linear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
var yValue = function(d) { return 1;}, // data -> value
    yScale = d3.scale.linear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.svg.axis()
            .scale(yScale)
            // .ticks(5)
            .orient("left");

// setup fill color
var cValue = function(d) { return d.type;},
    color = d3.scale.category10();

// setup size of bubble based on bytes size
var pValue = function(d) { return d.size;}, // data -> value
    pScale = d3.scale.linear().range([10, 50]), // value -> display
    pMap = function(d) { return pScale(pValue(d));}; // data -> display

// // setup size of bubble based on pics
// var eValue = function(d) { return d.pics;}, // data -> value
//     eScale = d3.scale.linear().range([20, 50]), // value -> display
//     eMap = function(d) { return pScale(pValue(d));}; // data -> display
    
// add the graph canvas to the body of the webpage
var svg = d3.select("#graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
var tooltip = d3.select("#graph").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// change string (from json) into number format for x-axis use
data.forEach(function(d) {
  d.id = +d.id;
});

// don't want dots overlapping axis, so add in buffer to data domain
xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
yScale.domain([0, d3.max(data, yValue)+1]);
pScale.domain([d3.min(data, pValue)-1, d3.max(data, pValue)+1]);

// y-axis
// svg.append("g")
//     .attr("class", "y axis")
//     .call(yAxis)
//     .append("text")
//     .attr("class", "label")
//     .attr("transform", "rotate(-90)")
//     .attr("y", -46)
//     .attr("dy", ".71em")
//     .style("text-anchor", "end")
//     .text("Rating");

// draw dots
svg.selectAll(".dot")
    .data(data)
  .enter().append("circle")
    .attr("class", "dot")
    .attr("r", 0)
    
    .attr("cx", xMap)
    .attr("cy", yMap)
    .style("opacity",".7")
    .style("fill", function(d) { return color(cValue(d));}) 
    .on("mouseover", function(d) {
        tooltip.transition()
             .duration(200)
             .style("opacity", .9);
        tooltip.html(d["name"] + "<br/> Bytes: " + pValue(d));
    })
    .on("mouseout", function(d) {
        tooltip.transition()
             .duration(500)
             .style("opacity", 0);
    });
//animate the dots
svg.selectAll('circle')
    .transition()
    .duration(750)
    .delay(function(d, i) { return i * 100; })
    .attr("r", pMap);

  // // draw legend
  // var legend = svg.selectAll(".legend")
  //     .data(color.domain())
  //   .enter().append("g")
  //     .attr("class", "legend")
  //     .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // // draw legend colored rectangles
  // legend.append("rect")
  //     .attr("x", width - 18)
  //     .attr("width", 18)
  //     .attr("height", 18)
  //     .style("fill", color);

  // // draw legend text
  // legend.append("text")
  //     .attr("x", width - 24)
  //     .attr("y", 9)
  //     .attr("dy", ".35em")
  //     .style("text-anchor", "end")
  //     .text(function(d) { return d;})
