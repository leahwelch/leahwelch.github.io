const promises = [
    d3.csv("./data/individuals.csv", parse_individuals),
    d3.csv("./data/states_positions.csv", parse_states)
];

function showVis(evt) {
    // Declare all variables
    var i, tablinks;

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    evt.currentTarget.className += " active";
}

/* defining variables for the width and heigth of the SVG */
const margin = { top: 20, left: 10, right: 10, bottom: 8 };
const width = document.querySelector("#chart").clientWidth;
const height = document.querySelector("#chart").clientHeight;

let prayer_button = d3.select("#prayer_button");
let listen_button = d3.select("#listen_button");
let eat_button = d3.select("#eat_button");
let serve_button = d3.select("#serve_button");
let story_button = d3.select("#story_button");

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

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
        .padding(0.05)

    let rowScale = d3.scaleBand()
        .domain([1, 2, 3, 4, 5, 6, 7, 8])
        .range([margin.top, height - margin.bottom])
        .padding(0.05)

    let svgWidth = columnScale.bandwidth()
    let svgHeight = rowScale.bandwidth()

    let xScale = d3.scaleBand()
        .domain(byDate.map(d => d[0]))
        .range([margin.left, svgWidth - margin.right])
        .padding(0.1)

    let yScale = d3.scaleSqrt()
        .domain([0, d3.max(byStatebyDate, d => d.maxPrayers)])
        .range([svgHeight - margin.bottom, margin.top])

    let grouping = svg.selectAll(".grouping")
        .data(byStatebyDate)
        .enter()
        .append("g")
        .attr("class", "grouping")
        .attr("transform", d => `translate(${columnScale(d.x)}, ${rowScale(d.y)})`)

    grouping.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .attr("fill", "#cdfee3")

    grouping.append("text")
        .attr("class", "stateLabel")
        .attr("x", margin.left)
        .attr("y", margin.top - 8)
        .text(d => d[0])
        .attr("fill", "#00A469")

    grouping.append("line")
        .attr("stroke", "#00553b")
        .attr("x1", margin.left)
        .attr("x2", svgWidth - margin.right)
        .attr("y1", svgHeight - margin.bottom)
        .attr("y2", svgHeight - margin.bottom)

    grouping.selectAll(".bar")
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

    prayer_button.on("click", function() {
        yScale.domain([0,d3.max(byStatebyDate, d => d.maxPrayers)])
        svg.selectAll(".bar")
            .transition()
            .duration(500)
            .attr("y", p => yScale(p.totalPrayer))
            .attr("height", p => svgHeight - margin.bottom - yScale(p.totalPrayer))
    })

    listen_button.on("click", function() {
        yScale.domain([0,d3.max(byStatebyDate, d => d.maxListens)])
        svg.selectAll(".bar")
            .transition()
            .duration(500)
            .attr("y", p => yScale(p.totalListen))
            .attr("height", p => svgHeight - margin.bottom - yScale(p.totalListen))
    })

    eat_button.on("click", function() {
        yScale.domain([0,d3.max(byStatebyDate, d => d.maxEats)])
        svg.selectAll(".bar")
            .transition()
            .duration(500)
            .attr("y", p => yScale(p.totalEat))
            .attr("height", p => svgHeight - margin.bottom - yScale(p.totalEat))
    })

    serve_button.on("click", function() {
        yScale.domain([0,d3.max(byStatebyDate, d => d.maxServes)])
        svg.selectAll(".bar")
            .transition()
            .duration(500)
            .attr("y", p => yScale(p.totalServe))
            .attr("height", p => svgHeight - margin.bottom - yScale(p.totalServe))
    })

    story_button.on("click", function() {
        yScale.domain([0,d3.max(byStatebyDate, d => d.maxStories)])
        svg.selectAll(".bar")
            .transition()
            .duration(500)
            .attr("y", p => yScale(p.totalStory))
            .attr("height", p => svgHeight - margin.bottom - yScale(p.totalStory))
    })


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