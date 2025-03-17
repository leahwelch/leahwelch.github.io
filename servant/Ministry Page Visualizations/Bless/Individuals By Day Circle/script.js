const promises = [
    d3.csv("./data/individuals_by_day.csv", parse_individuals)
];

/* defining variables for the width and heigth of the SVG */
const margin = { top: 50, left: 100, right: 100, bottom: 100 };
const width = document.querySelector("#chart").clientWidth;
const height = document.querySelector("#chart").clientHeight;

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

let tooltip = d3.select("#chart")
    .append("div")
    .attr("class", "tooltip")


Promise.all(promises).then(function (data) {
    const individuals = data[0].sort((a, b) => d3.ascending(a.date, b.date))

    let pointScale = d3.scalePoint()
        .domain([1, 2, 3, 4, 5])
        .range([margin.top, height - margin.bottom])
        .padding(0.1)

    let cumulativePrayers = 0
    let cumulativeListens = 0
    let cumulativeEats = 0
    let cumulativeServes = 0
    let cumulativeStories = 0
    let by_date = d3.groups(individuals, d => d.date)
    by_date.forEach((p) => {

        cumulativePrayers += d3.sum(p[1], m => m.prayer)
        cumulativeListens += d3.sum(p[1], m => m.listen)
        cumulativeEats += d3.sum(p[1], m => m.eat)
        cumulativeServes += d3.sum(p[1], m => m.serve)
        cumulativeStories += d3.sum(p[1], m => m.story)
        p.cumulativePrayers = cumulativePrayers
        p.cumulativeListens = cumulativeListens
        p.cumulativeEats = cumulativeEats
        p.cumulativeServes = cumulativePrayers
        p.cumulativeStories = cumulativeStories
        p.totalPrayer = d3.sum(p[1], m => m.prayer)
        p.totalListen = d3.sum(p[1], m => m.listen)
        p.totalEat = d3.sum(p[1], m => m.eat)
        p.totalServe = d3.sum(p[1], m => m.serve)
        p.totalStory = d3.sum(p[1], m => m.story)

    })
    console.log(by_date)

    let xScale = d3.scaleTime()
        .domain([d3.min(by_date, d => d[0]), d3.max(by_date, d => d[0])])
        .range([margin.left, width - margin.right])

    let rScalePrayers = d3.scaleSqrt()
        .domain([d3.min(by_date, d => d.totalPrayer), d3.max(by_date, d => d.totalPrayer)])
        .range([1, 20])

    let rScaleListens = d3.scaleSqrt()
        .domain([d3.min(by_date, d => d.totalListen), d3.max(by_date, d => d.totalListen)])
        .range([1, 20])

    let rScaleEats = d3.scaleSqrt()
        .domain([d3.min(by_date, d => d.totalEat), d3.max(by_date, d => d.totalEat)])
        .range([1, 20])

    let rScaleServes = d3.scaleSqrt()
        .domain([d3.min(by_date, d => d.totalServe), d3.max(by_date, d => d.totalServe)])
        .range([1, 20])

    let rScaleStories = d3.scaleSqrt()
        .domain([d3.min(by_date, d => d.totalStory), d3.max(by_date, d => d.totalStory)])
        .range([1, 20])

    svg.selectAll(".prayers")
        .data(by_date)
        .enter()
        .append("circle")
        .attr("class", "prayers")
        .attr("cx", d => xScale(d[0]))
        .attr("cy", pointScale(1))
        .attr("r", d => rScalePrayers(d.totalPrayer))
        .attr("fill", "#00a469")
        .attr("opacity", 0.25)
        .style("mix-blend_mode", "multiply")

    svg.append("text")
        .attr("x", margin.left - 20)
        .attr("y", pointScale(1))
        .attr("class", "label")
        .attr("text-anchor", "end")
        .attr("alignment-baseline", "middle")
        .text("Prayers")

    svg.selectAll(".listens")
        .data(by_date)
        .enter()
        .append("circle")
        .attr("class", "listens")
        .attr("cx", d => xScale(d[0]))
        .attr("cy", pointScale(2))
        .attr("r", d => rScaleListens(d.totalListen))
        .attr("fill", "#00a469")
        .attr("opacity", 0.25)
        .style("mix-blend_mode", "multiply")

    svg.append("text")
        .attr("x", margin.left - 20)
        .attr("y", pointScale(2))
        .attr("class", "label")
        .attr("text-anchor", "end")
        .attr("alignment-baseline", "middle")
        .text("Listens")

    svg.selectAll(".eats")
        .data(by_date)
        .enter()
        .append("circle")
        .attr("class", "eats")
        .attr("cx", d => xScale(d[0]))
        .attr("cy", pointScale(3))
        .attr("r", d => rScaleEats(d.totalEat))
        .attr("fill", "#00a469")
        .attr("opacity", 0.25)
        .style("mix-blend_mode", "multiply")

    svg.append("text")
        .attr("x", margin.left - 20)
        .attr("y", pointScale(3))
        .attr("class", "label")
        .attr("text-anchor", "end")
        .attr("alignment-baseline", "middle")
        .text("Eats")

    svg.selectAll(".serves")
        .data(by_date)
        .enter()
        .append("circle")
        .attr("class", "serves")
        .attr("cx", d => xScale(d[0]))
        .attr("cy", pointScale(4))
        .attr("r", d => rScaleServes(d.totalServe))
        .attr("fill", "#00a469")
        .attr("opacity", 0.25)
        .style("mix-blend_mode", "multiply")

    svg.append("text")
        .attr("x", margin.left - 20)
        .attr("y", pointScale(4))
        .attr("class", "label")
        .attr("text-anchor", "end")
        .attr("alignment-baseline", "middle")
        .text("Serves")

    svg.selectAll(".stories")
        .data(by_date)
        .enter()
        .append("circle")
        .attr("class", "stories")
        .attr("cx", d => xScale(d[0]))
        .attr("cy", pointScale(5))
        .attr("r", d => rScaleStories(d.totalStory))
        .attr("fill", "#00a469")
        .attr("opacity", 0.25)
        .style("mix-blend_mode", "multiply")

    svg.append("text")
        .attr("x", margin.left - 20)
        .attr("y", pointScale(5))
        .attr("class", "label")
        .attr("text-anchor", "end")
        .attr("alignment-baseline", "middle")
        .text("Stories")

    const xAxis = svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height - margin.bottom + 50})`)
        .call(d3.axisBottom()
            .scale(xScale)
            .tickSize((-height + margin.bottom - 50))
        )

    xAxis.selectAll("text")
        .attr("transform", "translate(0,5)")

    svg.selectAll("circle").on("mouseover", function (d, e) {
        d3.select(this).attr("opacity", 1)

        let cx = d.clientX + 15;
        let cy = d.clientY - 15;

        tooltip.style("visibility", "visible")
            .style("left", cx + "px")
            .style("top", cy + "px")
            .html(() => {
                if (d3.select(this).attr("class") === "prayers") {
                    return e.totalPrayer + " prayers"
                } else if (d3.select(this).attr("class") === "listens") {
                    return e.totalListen + " listens"
                } else if (d3.select(this).attr("class") === "eats") {
                    return e.totalEat + " eats"
                } else if (d3.select(this).attr("class") === "serves") {
                    return e.totalServe + " serves"
                } else {
                    return e.totalStory + " stories"
                }
            })
    }).on("mouseout", function () {
        svg.selectAll("circle").attr("opacity", 0.25)
        tooltip.style("visibility", "hidden")
    })

});

function parse_individuals(d) {
    return {
        year: +d.YEAR,
        month: +d.MONTH,
        date: new Date(d.FILE_DATE),
        state: d.STATE,
        county: d.COUNTY,
        prayer: +d['SUM(BEGIN_WITH_PRAYER)'],
        listen: +d['SUM(LISTEN)'],
        eat: +d['SUM(EAT)'],
        serve: +d['SUM(SERVE)'],
        story: +d['SUM(SHARE_YOUR_STORY)']

    }
}