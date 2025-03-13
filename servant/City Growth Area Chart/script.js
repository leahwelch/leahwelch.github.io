const promises = [
    d3.csv("./data/messages.csv", parse_messages)
];

/* defining variables for the width and heigth of the SVG */
const width = document.querySelector("#chart").clientWidth;
const height = document.querySelector("#chart").clientHeight;
const margin = { top: 300, left: 75, right: 175, bottom: 50 };

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const padding = 40;

Promise.all(promises).then(function (data) {
//filter data by city

    let messages_data = data[0].sort((a, b) => d3.ascending(a.month, b.month)).filter(d => d.city === "Chicago")

    let messages_by_month = d3.groups(messages_data, d => d.month)
    messages_by_month.forEach((d) => {
        d.total = d3.sum(d[1], v => v.count)
    })

    console.log(messages_by_month)
    let messages_total = 0;
    for (let i = 0; i < messages_by_month.length; i++) {
        messages_total += messages_by_month[i].total
        messages_by_month[i].val = messages_total
    }
    console.log(messages_by_month)

    //USER VIEW DATA DISCOVERY

    let xScale = d3.scaleTime()
        .domain([d3.min(messages_data, d => d.month), d3.max(messages_data, d => d.month)])
        .range([margin.left, width - margin.right])

    let yScale = d3.scaleLinear()
        .domain([0, d3.max(messages_by_month, d => d.val)])
        .range([height - margin.bottom, margin.top])

    let line = d3.line()
        .x(p => xScale(p[0]))
        .y(p => yScale(p.val))
        .curve(d3.curveBumpX)

    let area = d3.area()
        .x(p => xScale(p[0]))
        .y1(p => yScale(p.val))
        .y0(height - margin.bottom)
        .curve(d3.curveBumpX)

    //area charts with opacity
    //dotted line yScale ticks
    //no xScale ticks
    //darker line strokes
    //squat aspect ratio?

    // svg.append("path")
    //     .datum(by_month)
    //     .attr("d", area)
    //     .attr("fill", "#00a469")
    //     .attr("opacity", 0.1)
    //     .attr("stroke", "none")

    svg.append("path")
        .datum(messages_by_month)
        .attr("d", area)
        .attr("fill", "#00a469")
        .attr("opacity", 0.1)
        .style("mix-blend-mode", "multiply")
        .attr("stroke", "none")

    svg.append("path")
        .datum(messages_by_month)
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "#00a469")

    // svg.append("path")
    //     .datum(by_month)
    //     .attr("d", line)
    //     .attr("fill", "none")
    //     .attr("stroke", "#00a469")

    // svg.append("text")
    //     .attr("class", "label")
    //     .attr("x", width - margin.right + 5)
    //     .attr("y", yScale(by_month[by_month.length - 1].val))
    //     .attr("dominant-baseline", "central")
    //     .attr("fill", "#00a469")
    //     .text("Total Accounts Created")

    // svg.append("text")
    //     .attr("class", "label")
    //     .attr("x", width - margin.right + 5)
    //     .attr("y", yScale(by_month[by_month.length - 1].val) + 15)
    //     .attr("dominant-baseline", "central")
    //     .attr("fill", "#00a469")
    //     .text(d3.format(",.2r")(by_month[by_month.length - 1].val))

    svg.append("text")
        .attr("class", "label")
        .attr("x", width - margin.right + 5)
        .attr("y", yScale(messages_by_month[messages_by_month.length - 1].val))
        .attr("dominant-baseline", "central")
        .attr("fill", "#00a469")
        .text("Total Messages Sent")

    svg.append("text")
        .attr("class", "label")
        .attr("x", width - margin.right + 5)
        .attr("y", yScale(messages_by_month[messages_by_month.length - 1].val) + 15)
        .attr("dominant-baseline", "central")
        .attr("fill", "#00a469")
        .text(d3.format(",.2r")(messages_by_month[messages_by_month.length - 1].val))

    let curtain = svg.append("rect")
        .attr("fill", "white")
        .attr("x", margin.left)
        .attr("y", margin.top - 10)
        .attr("height", height)
        .attr("width", width)
        .transition()
        .ease(d3.easeCubicOut)
        .duration(3000)
        .attr("width", 0)
        .attr("x", width)

    svg.append("line")
        .attr("x1", margin.left)
        .attr("x2", width - margin.right)
        .attr("y1", height - margin.bottom)
        .attr("y2", height - margin.bottom)
        .attr("stroke", "#00a469")
        .attr("opacity", 0.7)

    const xAxis_messages = svg.append("g")
        .attr("class", "xAxis")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom()
            .scale(xScale)
            .tickSize((-height + margin.bottom))
        )

    xAxis_messages.selectAll("text")
        .attr("transform", "translate(0,5)")

    const yAxis = svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft()
            .scale(yScale)
            .ticks(6)
            .tickFormat(d3.format("~s"))
            .tickSize(-width + margin.left + margin.right))

    yAxis.selectAll("text")
        .attr("transform", "translate(-5,0)")


})

function parse_messages(d) {
    return {
        name: d.NAME,
        month: new Date(d.MONTH),
        city: d.CITY,
        state: d.STATE,
        zip: +d.ZIP_CODE,
        count: +d.MESSAGE_COUNT
    }
}

// function parse_partners(d) {
//     return {
//         partner: d.PARTNER,
//         church: d.CHURCH,
//         category: d.MINISTRY_CATEGORY,
//         city: d.CITY,
//         state: d.STATE,
//         zip: +d.ZIP_CODE,
//         lat: +d.LAT,
//         lng: +d.LNG
//     }
// }

// function parse_walks(d) {
//     return {
//         campus: d.CAMPUS_NAME,
//         count: +d.WALK_COUNT,
//         city: d.CITY,
//         state: d.STATE,
//         zip: +d.ZIPCODE,
//         lat: +d.LATITUDE,
//         lng: +d.LONGITUDE
//     }
// }

// function parse_users(d) {
//     return {
//         month: new Date(d.MONTH_ACTIVATED),
//         business: d.BUSINESS,
//         product: d.PRODUCT,
//     }
// }
