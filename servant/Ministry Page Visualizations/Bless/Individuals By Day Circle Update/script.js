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

let prayer_button = d3.select("#prayer_button");
let listen_button = d3.select("#listen_button");
let eat_button = d3.select("#eat_button");
let serve_button = d3.select("#serve_button");
let story_button = d3.select("#story_button");

let tooltip = d3.select("#chart")
    .append("div")
    .attr("class", "tooltip")


Promise.all(promises).then(function (data) {
    const individuals = data[0].sort((a, b) => d3.ascending(a.date, b.date))

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

    let rScale = d3.scaleSqrt()
        .domain([d3.min(by_date, d => d.totalPrayer), d3.max(by_date, d => d.totalPrayer)])
        .range([1, 15])

    // let rScaleEats = d3.scaleSqrt()
    //     .domain([d3.min(by_date, d => d.totalEat), d3.max(by_date, d => d.totalEat)])
    //     .range([1, 20])

    // let rScaleServes = d3.scaleSqrt()
    //     .domain([d3.min(by_date, d => d.totalServe), d3.max(by_date, d => d.totalServe)])
    //     .range([1, 20])

    // let rScaleStories = d3.scaleSqrt()
    //     .domain([d3.min(by_date, d => d.totalStory), d3.max(by_date, d => d.totalStory)])
    //     .range([1, 20])

    svg.selectAll("circle")
        .data(by_date)
        .enter()
        .append("circle")
        .attr("class", "circle")
        .attr("cx", d => xScale(d[0]))
        .attr("cy", height / 2)
        .attr("fill", "#00a469")
        .attr("opacity", 0.25)
        .style("mix-blend_mode", "multiply")
        .attr("r", 0)
        .transition()
        .duration(500)
        .attr("r", d => rScale(d.totalPrayer))

    // svg.selectAll(".eats")
    //     .data(by_date)
    //     .enter()
    //     .append("circle")
    //     .attr("class", "eats")
    //     .attr("cx", d => xScale(d[0]))
    //     .attr("cy", pointScale(3))
    //     .attr("r", d => rScaleEats(d.totalEat))
    //     .attr("fill", "#00a469")
    //     .attr("opacity", 0.25)
    //     .style("mix-blend_mode", "multiply")

    // svg.append("text")
    //     .attr("x", margin.left - 20)
    //     .attr("y", pointScale(3))
    //     .attr("class", "label")
    //     .attr("text-anchor", "end")
    //     .attr("alignment-baseline", "middle")
    //     .text("Eats")

    // svg.selectAll(".serves")
    //     .data(by_date)
    //     .enter()
    //     .append("circle")
    //     .attr("class", "serves")
    //     .attr("cx", d => xScale(d[0]))
    //     .attr("cy", pointScale(4))
    //     .attr("r", d => rScaleServes(d.totalServe))
    //     .attr("fill", "#00a469")
    //     .attr("opacity", 0.25)
    //     .style("mix-blend_mode", "multiply")

    // svg.append("text")
    //     .attr("x", margin.left - 20)
    //     .attr("y", pointScale(4))
    //     .attr("class", "label")
    //     .attr("text-anchor", "end")
    //     .attr("alignment-baseline", "middle")
    //     .text("Serves")

    // svg.selectAll(".stories")
    //     .data(by_date)
    //     .enter()
    //     .append("circle")
    //     .attr("class", "stories")
    //     .attr("cx", d => xScale(d[0]))
    //     .attr("cy", pointScale(5))
    //     .attr("r", d => rScaleStories(d.totalStory))
    //     .attr("fill", "#00a469")
    //     .attr("opacity", 0.25)
    //     .style("mix-blend_mode", "multiply")

    // svg.append("text")
    //     .attr("x", margin.left - 20)
    //     .attr("y", pointScale(5))
    //     .attr("class", "label")
    //     .attr("text-anchor", "end")
    //     .attr("alignment-baseline", "middle")
    //     .text("Stories")

    const xAxis = svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height / 2 + 50})`)
        .call(d3.axisBottom()
            .scale(xScale)
            .tickSize((-100))
        )

    xAxis.selectAll("text")
        .attr("transform", "translate(0,5)")

    svg.selectAll("circle").on("mouseover", function (d, e) {
        svg.selectAll("circle").attr("opacity", 0.1)
        d3.select(this).attr("opacity", 1)

        let cx = d.clientX + 15;
        let cy = d.clientY - 15;

        tooltip.style("visibility", "visible")
            .style("left", cx + "px")
            .style("top", cy + "px")
            .html(e.totalPrayer + " prayers")
        // .html(() => {
        //     if (d3.select(this).attr("class") === "prayers") {
        //         return e.totalPrayer + " prayers"
        //     } else if (d3.select(this).attr("class") === "listens") {
        //         return e.totalListen + " listens"
        //     } else if (d3.select(this).attr("class") === "eats") {
        //         return e.totalEat + " eats"
        //     } else if (d3.select(this).attr("class") === "serves") {
        //         return e.totalServe + " serves"
        //     } else {
        //         return e.totalStory + " stories"
        //     }
        // })
    }).on("mouseout", function () {
        svg.selectAll("circle").attr("opacity", 0.25)
        tooltip.style("visibility", "hidden")
    })

    prayer_button.on("click", function () {
        rScale.domain([d3.min(by_date, d => d.totalPrayer), d3.max(by_date, d => d.totalPrayer)])
        svg.selectAll("circle")
            .transition()
            .duration(500)
            .attr("r", d => rScale(d.totalPrayer))
        svg.selectAll("circle").on("mouseover", function (d, e) {
            svg.selectAll("circle").attr("opacity", 0.1)
            d3.select(this).attr("opacity", 1)

            let cx = d.clientX + 15;
            let cy = d.clientY - 15;

            tooltip.style("visibility", "visible")
                .style("left", cx + "px")
                .style("top", cy + "px")
                .html(e.totalPrayer + " prayers")
        })
    })

    listen_button.on("click", function () {
        rScale.domain([d3.min(by_date, d => d.totalListen), d3.max(by_date, d => d.totalListen)])
        svg.selectAll("circle")
            .transition()
            .duration(500)
            .attr("r", d => rScale(d.totalListen))
        svg.selectAll("circle").on("mouseover", function (d, e) {
            svg.selectAll("circle").attr("opacity", 0.1)
            d3.select(this).attr("opacity", 1)

            let cx = d.clientX + 15;
            let cy = d.clientY - 15;

            tooltip.style("visibility", "visible")
                .style("left", cx + "px")
                .style("top", cy + "px")
                .html(e.totalListen + " listens")
        })
    })

    eat_button.on("click", function () {
        rScale.domain([d3.min(by_date, d => d.totalEat), d3.max(by_date, d => d.totalEat)])
        svg.selectAll("circle")
            .transition()
            .duration(500)
            .attr("r", d => rScale(d.totalEat))

        svg.selectAll("circle").on("mouseover", function (d, e) {
            svg.selectAll("circle").attr("opacity", 0.1)
            d3.select(this).attr("opacity", 1)

            let cx = d.clientX + 15;
            let cy = d.clientY - 15;

            tooltip.style("visibility", "visible")
                .style("left", cx + "px")
                .style("top", cy + "px")
                .html(e.totalEat + " eats")
        })
    })

    serve_button.on("click", function () {
        rScale.domain([d3.min(by_date, d => d.totalServe), d3.max(by_date, d => d.totalServe)])
        svg.selectAll("circle")
            .transition()
            .duration(500)
            .attr("r", d => rScale(d.totalServe))

        svg.selectAll("circle").on("mouseover", function (d, e) {
            svg.selectAll("circle").attr("opacity", 0.1)
            d3.select(this).attr("opacity", 1)

            let cx = d.clientX + 15;
            let cy = d.clientY - 15;

            tooltip.style("visibility", "visible")
                .style("left", cx + "px")
                .style("top", cy + "px")
                .html(e.totalServe + " serves")
        })
    })

    story_button.on("click", function () {
        rScale.domain([d3.min(by_date, d => d.totalStory), d3.max(by_date, d => d.totalStory)])
        svg.selectAll("circle")
            .transition()
            .duration(500)
            .attr("r", d => rScale(d.totalStory))

        svg.selectAll("circle").on("mouseover", function (d, e) {
            svg.selectAll("circle").attr("opacity", 0.1)
            d3.select(this).attr("opacity", 1)

            let cx = d.clientX + 15;
            let cy = d.clientY - 15;

            tooltip.style("visibility", "visible")
                .style("left", cx + "px")
                .style("top", cy + "px")
                .html(e.totalStory + " stories")
        })
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