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

Promise.all(promises).then(function (data) {
    const individuals = data[0].sort((a, b) => d3.ascending(a.date, b.date))

    let pointScale = d3.scalePoint()
        .domain([1, 2, 3, 4, 5])
        .range([margin.top, height - margin.bottom])
        .padding(0.1)

    let bandScale = d3.scaleBand()
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

    let totalDays = by_date.length

    let xScale = d3.scaleTime()
        .domain([d3.min(by_date, d => d[0]), d3.max(by_date, d => d[0])])
        .range([margin.left, width - margin.right])

    let oScalePrayers = d3.scaleLinear()
        .domain([d3.min(by_date, d => d.totalPrayer), d3.max(by_date, d => d.totalPrayer)])
        .range([0, 1])

    let oScaleListens = d3.scaleLinear()
        .domain([d3.min(by_date, d => d.totalListen), d3.max(by_date, d => d.totalListen)])
        .range([0, 1])

    let oScaleEats = d3.scaleLinear()
        .domain([d3.min(by_date, d => d.totalEat), d3.max(by_date, d => d.totalEat)])
        .range([0, 1])

    let oScaleServes = d3.scaleLinear()
        .domain([d3.min(by_date, d => d.totalServe), d3.max(by_date, d => d.totalServe)])
        .range([0, 1])

    let oScaleStories = d3.scaleLinear()
        .domain([d3.min(by_date, d => d.totalStory), d3.max(by_date, d => d.totalStory)])
        .range([0, 1])

    svg.selectAll(".prayerBars")
        .data(by_date)
        .enter()
        .append("rect")
        .attr("class", "prayerBars")
        .attr("x", d => xScale(d[0]))
        .attr("y", bandScale(1) - bandScale.bandwidth() / 2)
        .attr("width", (width - margin.left - margin.right) / totalDays)
        .attr("height", bandScale.bandwidth())
        .attr("opacity", d => oScalePrayers(d.totalPrayer))
        .attr("fill", "#00a469")


    svg.append("text")
        .attr("x", margin.left - 20)
        .attr("y", bandScale(1))
        .attr("class", "label")
        .attr("text-anchor", "end")
        .attr("alignment-baseline", "middle")
        .text("Prayers")

    svg.selectAll(".listenBars")
        .data(by_date)
        .enter()
        .append("rect")
        .attr("class", "listenBars")
        .attr("x", d => xScale(d[0]))
        .attr("y", bandScale(2) - bandScale.bandwidth() / 2)
        .attr("width", (width - margin.left - margin.right) / totalDays)
        .attr("height", bandScale.bandwidth())
        .attr("fill", "#00a469")
        .attr("opacity", d => oScaleListens(d.totalListen))

    svg.append("text")
        .attr("x", margin.left - 20)
        .attr("y", bandScale(2))
        .attr("class", "label")
        .attr("text-anchor", "end")
        .attr("alignment-baseline", "middle")
        .text("Listens")

    svg.selectAll(".eatPoints")
        .data(by_date)
        .enter()
        .append("rect")
        .attr("class", "eatPoints")
        .attr("x", d => xScale(d[0]))
        .attr("y", bandScale(3) - bandScale.bandwidth() / 2)
        .attr("width", (width - margin.left - margin.right) / totalDays)
        .attr("height", bandScale.bandwidth())
        .attr("fill", "#00a469")
        .attr("opacity", d => oScaleEats(d.totalEat))

    svg.append("text")
        .attr("x", margin.left - 20)
        .attr("y", bandScale(3))
        .attr("class", "label")
        .attr("text-anchor", "end")
        .attr("alignment-baseline", "middle")
        .text("Eats")

    svg.selectAll(".servePoints")
        .data(by_date)
        .enter()
        .append("rect")
        .attr("class", "servePoints")
        .attr("x", d => xScale(d[0]))
        .attr("y", bandScale(4) - bandScale.bandwidth() / 2)
        .attr("width", (width - margin.left - margin.right) / totalDays)
        .attr("height", bandScale.bandwidth())
        .attr("fill", "#00a469")
        .attr("opacity", d => oScaleServes(d.totalServe))

    svg.append("text")
        .attr("x", margin.left - 20)
        .attr("y", bandScale(4))
        .attr("class", "label")
        .attr("text-anchor", "end")
        .attr("alignment-baseline", "middle")
        .text("Serves")

    svg.selectAll(".storyPoints")
        .data(by_date)
        .enter()
        .append("rect")
        .attr("class", "storyPoints")
        .attr("x", d => xScale(d[0]))
        .attr("y", bandScale(5) - bandScale.bandwidth() / 2)
        .attr("width", (width - margin.left - margin.right) / totalDays)
        .attr("height", bandScale.bandwidth())
        .attr("fill", "#00a469")
        .attr("opacity", d => oScaleStories(d.totalStory))

    svg.append("text")
        .attr("x", margin.left - 20)
        .attr("y", bandScale(5))
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