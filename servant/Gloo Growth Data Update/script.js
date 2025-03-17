const promises = [
    d3.csv("./data/messages.csv", parse_messages),
    d3.csv("./data/user_view_definition_filtered.csv", parse_users)
];

/* defining variables for the width and heigth of the SVG */
const width = document.querySelector("#chart").clientWidth;
const height = document.querySelector("#chart").clientHeight;
const margin = { top: 100, left: 75, right: 175, bottom: 50 };

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const padding = 40;

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

let accounts_button = d3.select("#accounts_button")
let messages_button = d3.select("#messages_button")

let area_path = svg.append("path").attr("class", "myArea")
let line_path = svg.append("path").attr("class", "myPath")

Promise.all(promises).then(function (data) {
    let messages_data = data[0].sort((a, b) => d3.ascending(a.month, b.month))
    let users_data = data[1].filter(d => d.id != "17754").sort((a, b) => d3.ascending(a.month, b.month))

    let messages_by_month = d3.groups(messages_data, d => d.month)

    messages_by_month.forEach((d) => {
        d.total = d3.sum(d[1], v => v.count)
    })

    let messages_total = 0;
    for (let i = 0; i < messages_by_month.length; i++) {
        messages_total += messages_by_month[i].total
        messages_by_month[i].val = messages_total
    }

    //USER VIEW DATA DISCOVERY
    let by_month = d3.groups(users_data, d => d.month)

    let val = 144065;
    for (let i = 0; i < by_month.length; i++) {
        val += by_month[i][1].length
        by_month[i].val = val
    }

    let xAxis = svg.append("g")
        .attr("class", "xAxis")
        .attr("transform", `translate(0,${height - margin.bottom})`)

    let yAxis = svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(${margin.left},0)`)

    svg.append("text")
        .attr("class", "type_label")
        .attr("x", width - margin.right + 5)
        .attr("dominant-baseline", "central")
        .attr("fill", "#00a469")

    svg.append("text")
        .attr("class", "val_label")
        .attr("x", width - margin.right + 5)
        .attr("dominant-baseline", "central")
        .attr("fill", "#00a469")


    function draw(dataset) {

        let xScale = d3.scaleTime()
            .domain([d3.min(dataset, d => d[0]), d3.max(dataset, d => d[0])])
            .range([margin.left, width - margin.right])

        let yScale = d3.scaleLinear()
            .domain([0, d3.max(dataset, d => d.val)])
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

        svg.selectAll(".myArea").datum(dataset)
        svg.selectAll(".myPath").datum(dataset)

        area_path.enter().merge(area_path)
            .attr("opacity", 0)
            .transition()
            .duration(500)
            .attr("d", d => area(d))
            .attr("fill", "#00a469")
            .attr("opacity", 0.1)
            .attr("stroke", "none")

        area_path.exit()
            .transition()
            .duration(500)
            .attr("opacity", 0)
            .remove();

        line_path.enter().merge(line_path)
            .transition()
            .duration(500)
            .attr("d", d => line(d))
            .attr("fill", "none")
            .attr("stroke", "#00a469")

        line_path.exit()
            .transition()
            .duration(500)
            .remove();

        xAxis.transition().duration(500).call(d3.axisBottom()
            .scale(xScale)
            .tickSize((-height + margin.bottom + margin.top)));
        yAxis.transition().duration(500).call(d3.axisLeft()
            .scale(yScale)
            .ticks(4)
            .tickFormat(d3.format("~s"))
            .tickSize(-width + margin.left + margin.right)
        );

        svg.selectAll(".xAxis").selectAll("text")
            .attr("transform", "translate(0,5)")

        svg.selectAll(".type_label")
            .attr("y", yScale(dataset[dataset.length - 1].val))

        svg.selectAll(".val_label")
            .attr("y", yScale(dataset[dataset.length - 1].val) + 15)
            .text(d3.format(",.2r")(dataset[dataset.length - 1].val))

    }


    draw(by_month)
    svg.selectAll(".type_label")
        .text("Total Accounts Created")

    accounts_button.on("click", function () {
        draw(by_month)
        svg.selectAll(".type_label")
            .text("Total Accounts Created")
    })

    messages_button.on("click", function () {
        draw(messages_by_month)
        svg.selectAll(".type_label")
            .text("Total Messages Sent")
    })





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

    // svg.append("text")
    //     .attr("class", "label")
    //     .attr("x", width - margin.right + 5)
    //     .attr("y", yScale(messages_by_month[messages_by_month.length - 1].val))
    //     .attr("dominant-baseline", "central")
    //     .attr("fill", "#00a469")
    //     .text("Total Messages Sent")

    // svg.append("text")
    //     .attr("class", "label")
    //     .attr("x", width - margin.right + 5)
    //     .attr("y", yScale(messages_by_month[messages_by_month.length - 1].val) + 15)
    //     .attr("dominant-baseline", "central")
    //     .attr("fill", "#00a469")
    //     .text(d3.format(",.2r")(messages_by_month[messages_by_month.length - 1].val))

    // svg.append("line")
    //     .attr("x1", margin.left)
    //     .attr("x2", width - margin.right)
    //     .attr("y1", height - margin.bottom)
    //     .attr("y2", height - margin.bottom)
    //     .attr("stroke", "#00a469")
    //     .attr("opacity", 0.7)

    // const xAxis_messages = svg.append("g")
    //     .attr("class", "xAxis")
    //     .attr("transform", `translate(0,${height - margin.bottom})`)
    //     .call(d3.axisBottom()
    //         .scale(xScale)
    //         .tickSize((-height + margin.bottom))
    //     )

    // xAxis_messages.selectAll("text")
    //     .attr("transform", "translate(0,5)")

    // const yAxis = svg.append("g")
    //     .attr("class", "axis")
    //     .attr("transform", `translate(${margin.left},0)`)
    //     .call(d3.axisLeft()
    //         .scale(yScale)
    //         .ticks(4)
    //         .tickFormat(d3.format("~s"))
    //         .tickSize(-width + margin.left + margin.right))

    // yAxis.selectAll("text")
    //     .attr("transform", "translate(-5,0)")


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
        business: d.BUSINESS,
        product: d.PRODUCT,
    }
}