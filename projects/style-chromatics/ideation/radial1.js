

var margin = {top: 150, left: 150, right: 150, bottom: 150};
const diameter = Math.min(innerWidth, innerHeight);
let width = diameter - margin.left - margin.right;
let height = diameter - margin.top - margin.bottom;
let innerRadius = width / 10;
let outerRadius = width / 2 - 50;


var svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.left + margin.right);


d3.csv("./data/wearlog.csv", parse).then(function(data) {
    var filtered_data = data.filter(function(d) {
        return d.id == "405";
    });

    console.log(filtered_data);

    const days = d3.timeDay.range(new Date(2020, 9, 5), new Date(2021, 9, 5));

    var scaleDate = d3.scaleTime()
        .domain([new Date("2020-10-05"), new Date("2021-10-04")])

    var histogramValues = d3.histogram()
        .value(function(d) {return d.date})
        .domain(scaleDate.domain())
        .thresholds(scaleDate.ticks(31))

    bins = histogramValues(filtered_data);
    console.log(bins)

    const radiusScale = d3.scaleLinear()
        .domain([0, 20])
        .range([innerRadius, outerRadius])

    scaleDate.range([0, Math.PI * 2]);

    let area = d3.areaRadial()
        .curve(d3.curveBasisClosed)
        .angle(d => scaleDate(d.x0))

    svg.append("path")
        .attr("fill", "darkred")
        .attr("d", area
            .innerRadius(d => radiusScale(0))
            .outerRadius(d => radiusScale(d.length))
          (bins));
        
});

function parse(d) {

    return {
        date: new Date(d.date),
        description: (d.Brand + " ").concat((d.Description + " ")).concat(d.Sub_Category),
        id: d.garmentId,
        group: d.group
    }
    
}