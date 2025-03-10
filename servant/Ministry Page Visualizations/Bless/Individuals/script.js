const promises = [
    d3.csv("./data/individuals.csv", parse_individuals),
    d3.csv("./data/states_positions.csv", parse_states)
];

/* defining variables for the width and heigth of the SVG */
const margin = { top: 25, left: 10, right: 10, bottom: 10 };
const width = document.querySelector("#chart").clientWidth;
const height = document.querySelector("#chart").clientHeight;

let padding = 5

// 8 rows
// 11 columns

Promise.all(promises).then(function (data) {
    const individuals = data[0]

    console.log(individuals)

    //INDIVIDUALS - 
    // roll it up by date, possibly by state
    //make mini time series for each of the different metrics
    //also could make a total impact time series

    //slider over the months and light up a map?
    //bars instead of line? - small multiple bars by state
    //something with circles?

    let byDate = d3.groups(individuals, d => d.date)

    let byStatebyDate = d3.groups(individuals, d => d.state, d => d.date).sort((a, b) => d3.ascending(a[0], b[0]))
    byStatebyDate.forEach((d) => {
        d[1].forEach((p) => {
            p.totalPrayer = d3.sum(p[1], m => m.prayer)
            p.totalListen = d3.sum(p[1], m => m.listen)
            p.totalEat = d3.sum(p[1], m => m.eat)
            p.totalServe = d3.sum(p[1], m => m.serve)
            p.totalStory = d3.sum(p[1], m => m.story)
        })
        d.maxPrayers = d3.max(d[1], p => p.totalPrayer)
        d.maxListens = d3.max(d[1], p => p.totalListen)
        d.maxEats = d3.max(d[1], p => p.totalEat)
        d.maxServes = d3.max(d[1], p => p.totalServe)
        d.maxStories = d3.max(d[1], p => p.totalStory)
    })

    for (let i = 0; i < byStatebyDate.length; i++) {
        byStatebyDate[i].x = data[1][i].column
        byStatebyDate[i].y = data[1][i].row
    }
    console.log(byStatebyDate)

    let columnScale = d3.scaleBand()
        .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
        .range([margin.left, width - margin.right])

    let rowScale = d3.scaleBand()
        .domain([1, 2, 3, 4, 5, 6, 7, 8])
        .range([margin.top, height - margin.bottom])

    let svgWidth = columnScale.bandwidth()
    let svgHeight = rowScale.bandwidth()

    let xScale = d3.scaleBand()
        .domain(byDate.map(d => d[0]))
        .range([margin.left, svgWidth - margin.right])
        .padding(0.1)

    let yScale = d3.scaleSqrt()
        .domain([0, d3.max(byStatebyDate, d => d.maxPrayers)])
        .range([svgHeight - margin.bottom, margin.top])

    let svg = d3.select("#chart")
        .selectAll(".uniqueChart")
        .data(byStatebyDate)
        .enter()
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .append("g")
        // .attr("transform", d => `translate(${columnScale(d.x)}, ${rowScale(d.y)})`)

    svg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", svgWidth - padding)
        .attr("height", svgHeight)
        .attr("fill", "#cdfee3")

    svg.append("text")
        .attr("class", "stateLabel")
        .attr("x", margin.left)
        .attr("y", margin.top - 10)
        .text(d => d[0])
        .attr("fill", "#00A469")

    svg.selectAll(".bar")
        .data(d => d[1])
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", p => xScale(p[0]))
        .attr("width", xScale.bandwidth())
        .attr("fill", "#00A469")
        .attr("y", svgHeight - margin.bottom)
        .attr("height", 0)
        .transition()
        .duration(500)
        .attr("y", p => yScale(p.totalPrayer))
        .attr("height", p => svgHeight - margin.bottom - yScale(p.totalPrayer))


    //enter update exit
    //re-arrange to look like a map

});

function parse_individuals(d) {
    return {
        year: +d.YEAR,
        month: +d.MONTH,
        date: new Date(`${+d.YEAR}-${+d.MONTH}-15`),
        state: d.STATE,
        county: d.COUNTY,
        prayer: +d['SUM(BEGIN_WITH_PRAYER)'],
        listen: +d['SUM(LISTEN)'],
        eat: +d['SUM(EAT)'],
        serve: +d['SUM(SERVE)'],
        story: +d['SUM(SHARE_YOUR_STORY)']
    }
}

function parse_states(d) {
    return {
        state: d.state,
        column: +d.column,
        row: +d.row
    }
}