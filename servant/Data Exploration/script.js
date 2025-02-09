const promises = [
    d3.csv("./data/messages.csv", parse_messages),
    d3.csv("./data/partner_data.csv", parse_partners),
    d3.csv("./data/prayer_walks.csv", parse_walks),
    d3.csv("./data/user_view_definition.csv", parse_users)
];

/* defining variables for the width and heigth of the SVG */
const width = document.querySelector("#chart").clientWidth;
const height = document.querySelector("#chart").clientHeight;
const margin = { top: 20, left: 350, right: 350, bottom: 30 };

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

Promise.all(promises).then(function (data) {
    let messages_data = data[0]
    let partner_data = data[1]
    let walks_data = data[2]
    let users_data = data[3].filter(d => d.id != "17754").sort((a, b) => d3.ascending(a.month, b.month))

    //MESSAGES DATA DISCOVERY
    let messages_by_name = d3.groups(messages_data, d => d.name)
    messages_by_name.forEach((d) => {
        d.total = d3.sum(d[1], v => v.count)
    })
    const min_messages = d3.min(messages_by_name, d => d.total)
    const max_messages = d3.max(messages_by_name, d => d.total)

    //USER VIEW DATA DISCOVERY
    let by_product_by_month = d3.groups(users_data, d => d.product, d => d.month)
    let keys = by_product_by_month.map(d => d[0])

    by_product_by_month.forEach((d) => {
        let val = 0;
        for (let i = 0; i < d[1].length; i++) {
            val += d[1][i][1].length
            d[1][i].val = val
        }
        d.max = d3.max(d[1], p => p.val)
    })

    console.log(by_product_by_month)

    let colorScale = d3.scaleOrdinal()
        .domain(keys)
        .range(["#f6c414", "#00A469", "#1492fc", "#9b2eef", "#90640a", "#25e297", "#53cbff", "#5d198a"])

    let shelf_scale = d3.scaleBand()
        .domain(keys)
        .range([margin.top, height - margin.bottom])
        .padding(0.01)

    let xScale = d3.scaleTime()
        .domain([d3.min(users_data, d => d.month), d3.max(users_data, d => d.month)])
        .range([margin.left, width - margin.right])

    let yScale = d3.scaleLinear()
        .domain([0, d3.max(by_product_by_month, d => d.max)])
        .range([shelf_scale.bandwidth(), 0])

    let line = d3.area()
        .x(p => xScale(p[0]))
        .y1(p => yScale(p.val))
        .y0(shelf_scale.bandwidth())
        .curve(d3.curveStep)

    by_product_by_month.forEach((d) => {
        svg.append("path")
            .datum(d[1])
            .attr("transform", `translate(0, ${shelf_scale(d[0])})`)
            .attr("d", line)
            .attr("stroke", "none")
            .attr("fill", "#9b2eef")

        svg.append("text")
            .data(d[1])
            .attr("transform", `translate(0, ${shelf_scale(d[0])})`)
            .attr("x", width - margin.right + 10)
            .attr("y", shelf_scale.bandwidth())
            .attr("class", "label")
            .style("fill", "white")
            .text(d[0])

        svg.append("line")
            .attr("transform", `translate(0, ${shelf_scale(d[0])})`)
            .attr("x1", margin.left)
            .attr("x2", width - margin.right)
            .attr("y1", shelf_scale.bandwidth())
            .attr("y2", shelf_scale.bandwidth())
            .attr("stroke", "white")
            .attr("opacity", 0.7)
    })

    const xAxis = svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom()
            .scale(xScale)
            .tickSize(-height + margin.bottom + margin.top - 10)
        )
        .attr("opacity", 0.7)

    xAxis.selectAll("text")
        .attr("transform", "translate(0,5)")

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

function parse_partners(d) {
    return {
        partner: d.PARTNER,
        church: d.CHURCH,
        category: d.MINISTRY_CATEGORY,
        city: d.CITY,
        state: d.STATE,
        zip: +d.ZIP_CODE,
        lat: +d.LAT,
        lng: +d.LNG
    }
}

function parse_walks(d) {
    return {
        campus: d.CAMPUS_NAME,
        count: +d.WALK_COUNT,
        city: d.CITY,
        state: d.STATE,
        zip: +d.ZIPCODE,
        lat: +d.LATITUDE,
        lng: +d.LONGITUDE
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