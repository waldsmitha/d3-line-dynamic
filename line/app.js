async function draw() {
    
  

  // Dimensions
  let dimensions = {
    width: 1000,
    height: 600,
    margin: 100
  };

  dimensions.ctrWidth =
    dimensions.width - dimensions.margin;
  dimensions.ctrHeight =
    dimensions.height - dimensions.margin;

  // Draw Image
  const svg = d3
    .select("#chart")
    .append("svg")
    .attr('viewBox', `0 0 1000 700`)

  const ctr = svg
    .append("g")
    .attr(
      "transform",
      `translate(${dimensions.margin}, ${dimensions.margin})`
    );
 
  const xAxisGroup = ctr.append('g')
    .style('transform', `translateY(${dimensions.ctrHeight}px)`)
    .classed('axis', true)
  const yAxisGroup = ctr.append('g')
    .classed('axis', true)

  xAxisGroup.append('text')
  .attr('fill', 'black')
  .attr('transform', `translate(${dimensions.ctrWidth / 2}, ${dimensions.margin / 2})`)
  .text('Year')
  
  yAxisGroup.append('text')
  .attr('fill', 'black')
  .attr('x', -dimensions.ctrHeight / 2)
  .attr('y', -dimensions.margin / 2 - 10)
  .attr('transform', 'rotate(270)')
  .attr('text-anchor', 'middle')
  .text('Price (USD)')  

  const currentLine = d3.select('.line')

  // Draw Data

  async function drawLine(symbol){
    const xAccessor = (d) => d.Date;
    const yAccessor = (d) => d.Close

    // Data
    const dataset = await d3.csv(`./data/${symbol}.us.csv`, (d) => {
      d3.autoType(d)
      return d
    });
 
    const toolTip = d3.select("#tooltip")
    const toolTipDot = ctr
      .append("circle")
      .attr("r", 5)
      .attr("fill", "#fc8781")
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .style("opacity", 0)
      .style("pointer-events", "none");
    // Scales
    const xScale = d3
    .scaleUtc()  
    .domain(d3.extent(dataset, xAccessor))
    .range([0,dimensions.ctrWidth])

    const yScale = d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.ctrHeight, 0])
  
    const lineGenerator = d3.line()
      .x(d=> xScale(xAccessor(d)))
      .y(d=> yScale(yAccessor(d)))

  // const exitTransition = d3.transition().duration(500);
  // // Will wait for exit transition before playing update transition
  // const updateTransition = exitTransition.transition().duration(500);


  const linePath = d3.select('.line')._groups[0][0]
    
  // if(linePath === null) {
  //   console.log(`doesn't exist`)} 
  //   else {
  //     console.log(linePath)
  //   }

  if(linePath === null) {
    ctr
      .append("path")
      // Append all data with one element 
      .datum(dataset)
      .classed('line', true)
      .attr("d", lineGenerator)
      .attr("fill", "none")
      .attr("stroke", "#30475e")
      .attr("stroke-width", 2) } 
      
    else {
        d3.select('.line')
        .datum(dataset)
        .transition()
        .duration(500)
        .attr('d', lineGenerator)
    }

  // ctr
  //     .append("path")
  //     // Append all data with one element
  //     .datum(dataset)
  //     .classed('line', true)
  //     .attr("d", lineGenerator)
  //     .attr("fill", "none")
  //     .attr("stroke", "#30475e")
  //     .attr("stroke-width", 2); 

      // function updateLine(){
      //   d3.select('.line').attr('d', lineGenerator)
      // }
      // updateLine();

        
    
  ctr
    .append("rect")
    .attr("width", dimensions.ctrWidth)
    .attr("height", dimensions.ctrHeight)
    .style("opacity", 0)
    .on("touchmouse mousemove", function (event) {
      const mousePos = d3.pointer(event, this);
      const date = xScale.invert(mousePos[0]);

      // Custom Bisector - left (lowest possible index, etc.), center, right properties
      const bisector = d3.bisector(xAccessor).left;
      const index = bisector(dataset, date);
      const stock = dataset[index - 1];

      // console.log(mousePos);
      // console.log(date);
      // console.log(stock);

      // Update Image
      toolTipDot
        .style("opacity", 1)
        .attr("cx", xScale(xAccessor(stock)))
        .attr("cy", yScale(yAccessor(stock)))
        .raise();

      toolTip
        .style("display", "block")
        .style("top", yScale(yAccessor(stock)) + 30 + "px")
        .style("left", xScale(xAccessor(stock)) + 60 + "px");

      toolTip.select(".price").text(`$${yAccessor(stock)}`);
      
    })

  
  // Draw Axes
  
  // const timeFormatter = d3.timeFormat("%Y")
  // console.log(timeFormatter(dataset[0].Date))
  const xAxis = d3.axisBottom(xScale)
    .ticks(10)
    // .tickFormat(d=> timeFormatter(d))
    .tickSizeOuter(0)
    
  const yAxis = d3.axisLeft(yScale)
    .tickSizeOuter(0)
    
  xAxisGroup.transition().duration(500).call(xAxis)
  yAxisGroup.transition().duration(500).call(yAxis)
  
 
  
}





d3.select("#metric").on("change", function (e) {
  e.preventDefault();
  // console.log(this.value);
  drawLine(this.value)
  
});



  
  drawLine('aapl')
  
}

draw();
