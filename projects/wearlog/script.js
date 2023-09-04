var width = document.querySelector("#chart").clientWidth;
var height = document.querySelector("#chart").clientHeight;
var margin = { top: 50, left: 50, right: 50, bottom: 50 };

var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);


d3.csv("./data/wearlog.csv", parse).then(function (data) {

    data.forEach(function (d) {
        if (d.brand === '') {
            d.brand = 'Vintage';
        }
    })

    console.log(data);
    let filtered = data.filter(d => d.preowned === "Y")

    const monthNest = d3.nest()
        .key(function (d) { return d.year; })
        .key(function (d) { return d.month; })
        .key(function (d) { return d.id; })
        .rollup()
        .entries(data);

    monthNest.forEach((d) => {
        d.values.forEach((p) => {
            p.date = +p.key + (+d.key / 100);
            p.values.sort((a, b) => d3.ascending(a.values.length, b.values.length))
        })
    })

    let nodeData = [];
    for (let i = 0; i < monthNest.length; i++) {
        console.log(i)
        for (let j = 0; j < monthNest[i].values.length; j++) {

            let xValue = monthNest[i].values[j].date;

            for (let k = 0; k < monthNest[i].values[j].values.length; k++) {
                let yValue = k;
                let rValue = monthNest[i].values[j].values[k].values.length;
                let id = monthNest[i].values[j].values[k].values[0].id;
                let description = monthNest[i].values[j].values[k].values[0].description;
                nodeData.push({
                    xValue: xValue,
                    yValue: yValue,
                    rValue: rValue,
                    id: id,
                    description: description
                })
            }
        }
    }

    console.log(nodeData)



    const xScale = d3.scalePoint()
        .domain(d3.map(nodeData, d => d.xValue))
        .range([margin.left, width - margin.right - margin.left])
        .padding(0)

    let yScale = d3.scalePoint()
        .domain(d3.map(nodeData, d => d.yValue))
        .range([height - margin.top - margin.bottom, margin.top])
        .padding(0.1)

    let rScale = d3.scaleSqrt()
        .domain([1, d3.max(nodeData, d => d.rValue)])
        .range([4, 18])

    let points = svg.selectAll("circle")
        .data(nodeData)


    points.enter()
        .append("circle")
        .attr("cx", d => xScale(d.xValue))
        .attr("cy", d => height - margin.top - yScale(d.yValue))
        .attr("fill", "white")
        .attr("opacity", 0.4)
        .merge(points)
        .transition()
        .duration(500)
        .attr("r", d => rScale(d.rValue))

    points.exit()
        .transition()
        .duration(500)
        .remove()

    console.log(monthNest)

    const dateScale = d3.scaleTime()
        .domain([data[0].date, data[data.length - 1].date])
        .range([margin.left, width - margin.right])

    let xAxis = svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height - 50})`)
        .style("opacity", 1)
        .call(d3.axisBottom().scale(dateScale))




});

function parse(d) {

    return {
        date: new Date(d.date),
        month: new Date(d.date).getMonth() + 1,
        year: new Date(d.date).getYear() - 100,
        week: +d.week,
        description: (d.Brand + " ").concat((d.Description + " ")).concat(d.Sub_Category),
        id: +d.garmentId,
        new: d.new,
        sold: d.sold,
        brand: d.Brand,
        preowned: d.pre
    }

}