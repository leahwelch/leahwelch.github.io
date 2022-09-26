d3.csv("./data/data.csv", parse).then(function (data) {
    console.log(data)
    //svg Width and height
    var w = 500;
    var h = 500;

    //Create SVG element
    var svg = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    const categories = ["cover", "color"]
    const xScale = d3.scaleBand()
        // .domain(d3.map(data, d => d.year))
        .domain([1964,1965])
        .range([0, 500])
        .padding(0.1)

    const yScale = d3.scaleBand()
        .domain(categories)
        .range([0, 500])
        .padding(0.1)

    const colorRect = svg.selectAll(".colorRect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "colorRect")
        .attr("x", d => xScale(d.year))
        .attr("y", yScale("color"))
        .attr("width", xScale.bandwidth())
        .attr("height", yScale.bandwidth())
        .attr("fill", d => d.color);

    const imageRect = svg.selectAll(".imageRect")
        .data(data)
        .enter()
        .append('image')
        .attr('xlink:href', d => `./images/cover/${d.year}.jpg`)
        .attr("width", xScale.bandwidth())
        .attr("height", yScale.bandwidth())
        .attr("x", d => xScale(d.year))
        .attr("y", yScale("cover"))
// repeat the above for the different categories
// create axes using the heatmap example 
// css styling including tick styling 
// do the other chapters 

});

function parse(d) {
    return {
        year: +d.year,
        color: d.color
    }
}