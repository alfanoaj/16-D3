// D3 Scatterplot Assignment

// Students:
// =========
// Follow your written instructions and create a scatter plot with D3.js.

var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 90,
    left: 150
  };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
    .select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chartGroup1 = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXAxis = "poverty";

// function used for updating x-scale var upon click on axis label
function xScale(healthData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenXAxis])*.9, 
            d3.max(healthData, d => d[chosenXAxis])*1.1])
        .range([0, width]);
  
    return xLinearScale;
  }

var chosenYAxis = "obesity";

// function used for updating x-scale var upon click on axis label
function yScale(healthData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d=> d[chosenYAxis]*.8), 
            d3.max(healthData, d => d[chosenYAxis])*1.1])
        .range([height, 0]);
  
    return yLinearScale;
  }

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }

function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));
    return circlesGroup;
  }

// function used for updating text group with a transition to
// new text
function renderText(textGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

    textGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
      .attr("y", d => newYScale(d[chosenYAxis])+5);
    return textGroup;
  }

// function used for updating circles group with new tooltip
function updateCirclesTT(chosenXAxis, chosenYAxis, circlesGroup) {

    if (chosenXAxis === "poverty") {
      var xlabel1 = "Poverty:";
      var xlabel2 = "%";
    }
    else if (chosenXAxis === "age") {
        var xlabel1 = "Age:"
        var xlabel2 = ""
    }
    else {
      var xlabel1 = "Income: $";
      var xlabel2 = ""
    }

    if(chosenYAxis === "obesity") {
        var ylabel = "Obesity:"
    }
    else if (chosenYAxis === "smokes") {
        var ylabel = "Smokes:"
    }
    else {
        var ylabel = "Healthcare:"
    }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<hr>${xlabel1}${d[chosenXAxis]}${xlabel2}<br>${ylabel}${d[chosenYAxis]}%`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
}

// function used for updating text group with new tooltip
function updateTextTT(chosenXAxis, chosenYAxis, textGroup) {

    if (chosenXAxis === "poverty") {
      var xlabel1 = "Poverty:";
      var xlabel2 = "%";
    }
    else if (chosenXAxis === "age") {
        var xlabel1 = "Age:"
        var xlabel2 = ""
    }
    else {
      var xlabel1 = "Income: $";
      var xlabel2 = ""
    }

    if(chosenYAxis === "obesity") {
        var ylabel = "Obesity:"
    }
    else if (chosenYAxis === "smokes") {
        var ylabel = "Smokes:"
    }
    else {
        var ylabel = "Healthcare:"
    }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<hr>${xlabel1}${d[chosenXAxis]}${xlabel2}<br>${ylabel}${d[chosenYAxis]}%`);
      });
  
    textGroup.call(toolTip);
  
    textGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return textGroup;
}


// Import Data
d3.csv("data.csv", function(err, healthData) {
    if (err) throw err;

    healthData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
        data.healthcare = +data.healthcare;
    });

    var xLinearScale = xScale(healthData, chosenXAxis);

    var yLinearScale = yScale(healthData, chosenYAxis);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .attr("transform", `translate(0, 0)`)
        .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 15)
        .attr("fill", "red")
        .attr("opacity", ".6")
        .classed("circle", true);

    var textGroup = chartGroup1.selectAll("text")
        .data(healthData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis])+5)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .classed("textGroup", true)
        .text(d => d.abbr);

    // Create group for  3 x-axis labels
    var xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty (%)");

    var ageLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age (Median)");
    
    var incomeLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Household Income (Median)");

    // Create group for  3 y-axis labels
    var ylabelsGroup = chartGroup.append("g")
        
    var obeseLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 30 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "obesity")
        .classed("active", true)
        .text("Obese (%)");
    
    var smokesLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 55 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "smokes")
        .classed("inactive", true)
        .text("Smokes (%)");

    var healthcareLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 80 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "healthcare")
        .classed("inactive", true)
        .text("Lacks Healthcare (%)");

    var circlesGroup = updateCirclesTT(chosenXAxis, chosenYAxis, circlesGroup);

    var textGroup = updateTextTT(chosenXAxis, chosenYAxis, textGroup);
    
    xlabelsGroup.selectAll("text")
        .on("click", function() {

            var xValue = d3.select(this).attr("value");
            if (xValue !== chosenXAxis) {

                chosenXAxis = xValue;

                xLinearScale = xScale(healthData, chosenXAxis);
                yLinearScale = yScale(healthData, chosenYAxis);

                xAxis = renderXAxes(xLinearScale, xAxis);
                yAxis = renderYAxes(yLinearScale, yAxis);

                circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
                circlesGroup = updateCirclesTT(chosenXAxis, chosenYAxis, circlesGroup)

                textGroup = renderText(textGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis)
                textGroup = updateTextTT(chosenXAxis, chosenYAxis, textGroup)
            
                if(chosenXAxis === "poverty") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if(chosenXAxis === "age") {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        })

    ylabelsGroup.selectAll("text")
        .on("click", function() {

            var value = d3.select(this).attr("value");
            if (value !== chosenYAxis) {

                chosenYAxis = value;

                xLinearScale = xScale(healthData, chosenXAxis);
                yLinearScale = yScale(healthData, chosenYAxis);

                xAxis = renderXAxes(xLinearScale, xAxis);
                yAxis = renderYAxes(yLinearScale, yAxis);

                circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
                circlesGroup = updateCirclesTT(chosenXAxis, chosenYAxis, circlesGroup)

                textGroup = renderText(textGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis)
                textGroup = updateTextTT(chosenXAxis, chosenYAxis, textGroup)
        
                if(chosenYAxis === "obesity") {
                    obeseLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if(chosenYAxis === "smokes") {
                    obeseLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    obeseLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        })
});