const promises = [
    d3.csv("./data/messages.csv", parse_messages),
    d3.csv("./data/user_view_definition_filtered.csv", parse_users)
];

/* defining variables for the width and heigth of the SVG */
const width = document.querySelector("#chart").clientWidth;
const height = document.querySelector("#chart").clientHeight;
const margin = { top: 50, left: 100, right: 150, bottom: 30 };

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const padding = 40;

Promise.all(promises).then(function (data) {
    let messages_data = data[0].sort((a, b) => d3.ascending(a.month, b.month)).filter(d => d.month > new Date("2021-05-01"))
    let users_data = data[1].filter(d => d.id != "17754" && d.month > new Date("2021-05-01")).sort((a, b) => d3.ascending(a.month, b.month))

    //MESSAGES DATA DISCOVERY
    let messages_by_name = d3.groups(messages_data, d => d.name)
    messages_by_name.forEach((d) => {
        d.total = d3.sum(d[1], v => v.count)
    })
    const min_messages = d3.min(messages_by_name, d => d.total)
    const max_messages = d3.max(messages_by_name, d => d.total)

    let messages_by_month = d3.groups(messages_data, d => d.month)

    messages_by_month.forEach((d) => {
        d.total = d3.sum(d[1], v => v.count)
    })

    let messages_total = 0;
    for (let i = 0; i < messages_by_month.length; i++) {
        messages_total += messages_by_month[i].total
        messages_by_month[i].val = messages_total
    }
    console.log(messages_by_month)

    //USER VIEW DATA DISCOVERY
    let by_month = d3.groups(users_data, d => d.month)
    let by_year = d3.groups(users_data, d => d.month.getYear())
    by_year.forEach((d) => {
        d.date = d[1][0].month
    })
    console.log(by_year)

    let val = 148944;
    for (let i = 0; i < by_month.length; i++) {
        val += by_month[i][1].length
        by_month[i].val = val
    }

    let xScale = d3.scaleTime()
        .domain([d3.min(users_data, d => d.month), d3.max(users_data, d => d.month)])
        .range([margin.left, width - margin.right])

    let yScale_platform = d3.scaleLinear()
        .domain([0, d3.max(by_month, d => d.val)])
        .range([(height - margin.bottom) / 2 - padding, margin.top])

    let yScale_messages = d3.scaleLinear()
        .domain([0, d3.max(messages_by_month, d => d.val)])
        .range([height - margin.bottom, (height - margin.bottom) / 2 + padding])

    let area_platform = d3.area()
        .x(p => xScale(p[0]))
        .y1(p => yScale_platform(p.val))
        .y0((height - margin.bottom) / 2 - padding)
        .curve(d3.curveBumpX)

    let area_messages = d3.area()
        .x(p => xScale(p[0]))
        .y1(p => yScale_messages(p.val))
        .y0(height - margin.bottom)
        .curve(d3.curveBumpX)

    let line_platform = d3.line()
        .x(p => xScale(p[0]))
        .y(p => yScale_platform(p.val))
        .curve(d3.curveBumpX)

    let line_messages = d3.line()
        .x(p => xScale(p[0]))
        .y(p => yScale_messages(p.val))
        .curve(d3.curveBumpX)

    svg.append("path")
        .datum(messages_by_month)
        .attr("d", area_messages)
        .attr("stroke", "none")
        .attr("fill", "#00a469")
        .attr("opacity", 0.1)

    svg.append("path")
        .datum(by_month)
        .attr("d", area_platform)
        .attr("stroke", "none")
        .attr("fill", "#00a469")
        .attr("opacity", 0.1)

    svg.append("path")
        .datum(messages_by_month)
        .attr("d", line_messages)
        .attr("fill", "none")
        .attr("stroke", "#00a469")

    svg.append("path")
        .datum(by_month)
        .attr("d", line_platform)
        .attr("fill", "none")
        .attr("stroke", "#00a469")

    svg.append("text")
        .attr("class", "side_label")
        .attr("x", width - margin.right + 5)
        .attr("y", yScale_platform(by_month[by_month.length - 1].val))
        .attr("dominant-baseline", "central")
        .attr("fill", "#00a469")
        .text("Total Accounts Created")

    svg.append("text")
        .attr("class", "side_label")
        .attr("x", width - margin.right + 5)
        .attr("y", yScale_platform(by_month[by_month.length - 1].val) + 15)
        .attr("dominant-baseline", "central")
        .attr("fill", "#00a469")
        .text(d3.format(",.2r")(by_month[by_month.length - 1].val))

    svg.append("text")
        .attr("class", "side_label")
        .attr("x", width - margin.right + 5)
        .attr("y", yScale_messages(messages_by_month[messages_by_month.length - 1].val))
        .attr("dominant-baseline", "central")
        .attr("fill", "#00a469")
        .text("Total Messages Sent")

    svg.append("text")
        .attr("class", "side_label")
        .attr("x", width - margin.right + 5)
        .attr("y", yScale_messages(messages_by_month[messages_by_month.length - 1].val) + 15)
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
        .attr("stroke", "white")
        .attr("opacity", 0.5)

    svg.append("line")
        .attr("x1", margin.left)
        .attr("x2", width - margin.right)
        .attr("y1", (height - margin.bottom) / 2 - padding)
        .attr("y2", (height - margin.bottom) / 2 - padding)
        .attr("stroke", "white")
        .attr("opacity", 0.5)

    const xAxis_messages = svg.append("g")
        .attr("class", "xAxis")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom()
            .scale(xScale)
            .tickSize((-height + margin.bottom))
        )

    xAxis_messages.selectAll("text")
        .attr("transform", "translate(0,5)")

    const yAxis_messages = svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft()
            .scale(yScale_messages)
            .ticks(4)
            .tickFormat(d3.format("~s"))
            .tickSize(-width + margin.left + margin.right))

    yAxis_messages.selectAll("text")
        .attr("transform", "translate(-5,0)")

    const yAxis_platform = svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft()
            .scale(yScale_platform)
            .ticks(4)
            .tickFormat(d3.format("~s"))
            .tickSize(-width + margin.left + margin.right))

    yAxis_platform.selectAll("text")
        .attr("transform", "translate(-5,0)")

    svg.append("line")
        .attr("x1", margin.left)
        .attr("x2", width - margin.right)
        .attr("y1", height - margin.bottom)
        .attr("y2", height - margin.bottom)
        .attr("stroke", "#00a469")
        .attr("opacity", 0.7)

    svg.append("rect")
        .attr("x", margin.left + 10)
        .attr("y", margin.top - 20)
        .attr("width", 135)
        .attr("height", 30)
        .attr("fill", "white")
        .attr("stroke", "#00a469")

    svg.append("rect")
        .attr("x", margin.left + 10)
        .attr("y", (height - margin.bottom) / 2 + padding - 20)
        .attr("width", 180)
        .attr("height", 30)
        .attr("fill", "white")
        .attr("stroke", "#00a469")

    svg.append("text")
        .attr("class", "label")
        .attr("x", margin.left + 20)
        .attr("y", margin.top)
        .attr("fill", "#00a469")
        .text("Platform Growth")

    svg.append("text")
        .attr("class", "label")
        .attr("x", margin.left + 20)
        .attr("y", (height - margin.bottom) / 2 + padding)
        .attr("fill", "#00a469")
        .text("Message Engagement")

    svg.append("text")
        .attr("class", "axisLabel")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height - margin.bottom) / 2 + padding)
        .attr("text-anchor", "start")
        .attr("y", margin.left - 50)
        .attr("fill", "#00a469")
        .text("Accounts Created Per Month")

    svg.append("text")
        .attr("class", "axisLabel")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height - margin.bottom))
        .attr("text-anchor", "start")
        .attr("y", margin.left - 50)
        .attr("fill", "#00a469")
        .text("Messages Sent Per Month")


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

function parse_users(d) {
    return {
        month: new Date(d.MONTH_ACTIVATED),
        id: d.PLATFORM_USER_ID,
        email: d.EMAIL,
        business: d.BUSINESS,
        product: d.PRODUCT,
        gloo_id: +d.GLOO_UNIQUE_ID
    }
}