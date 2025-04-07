const promises = [
    d3.csv("./data/partner_data.csv", parse),
    d3.csv("./data/pop.csv", parse_cities)
];

/* defining variables for the width and heigth of the SVG */
const width = document.querySelector("#chart").clientWidth;
const height = document.querySelector("#chart").clientHeight;
const margin = { top: 100, left: 350, right: 350, bottom: 100 };

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

Promise.all(promises).then(function (data) {
    let partners = data[0]
    let cities = data[1].sort((a, b) => d3.ascending(a.pop, b.pop))
    console.log(cities)

    let similar_cities = ["Boulder", "Columbus", "Houston", "Portland", "Seattle"]

    let boulder_pop = cities.filter(d => d.city === "Boulder city" && d.state === "Colorado")[0].pop
    let columbus_pop = cities.filter(d => d.city === "Columbus city" && d.state === "Ohio")[0].pop
    let houston_pop = cities.filter(d => d.city === "Houston city" && d.state === "Texas")[0].pop
    let portland_pop = cities.filter(d => d.city === "Portland city" && d.state === "Oregon")[0].pop
    let seattle_pop = cities.filter(d => d.city === "Seattle city" && d.state === "Washington")[0].pop

    let boulder = partners.filter(d => d.city === "Boulder" && d.state === "CO")
    let columbus = partners.filter(d => d.city === "Columbus" && d.state === "OH")
    let houston = partners.filter(d => d.city === "Houston" && d.state === "TX")
    let portland = partners.filter(d => d.city === "Portland" && d.state === "OR")
    let seattle = partners.filter(d => d.city === "Seattle" && d.state === "WA")

    let boulder_by_category = d3.groups(boulder, d => d.category)
    boulder_by_category.forEach((d) => {
        d.per_capita = d[1].length / boulder_pop
    })

    let columbus_by_category = d3.groups(columbus, d => d.category)
    columbus_by_category.forEach((d) => {
        d.per_capita = d[1].length / columbus_pop
    })

    let houston_by_category = d3.groups(houston, d => d.category)
    houston_by_category.forEach((d) => {
        d.per_capita = d[1].length / houston_pop
    })

    let portland_by_category = d3.groups(portland, d => d.category)
    portland_by_category.forEach((d) => {
        d.per_capita = d[1].length / portland_pop
    })

    let seattle_by_category = d3.groups(seattle, d => d.category)
    seattle_by_category.forEach((d) => {
        d.per_capita = d[1].length / seattle_pop
    })

    console.log(houston_by_category)
    console.log(portland_by_category)
    console.log(seattle_by_category)

    let yScale = d3.scaleBand()
        .domain(boulder_by_category.map(d => d[0]))
        .range([margin.top, height - margin.bottom])
        .padding(0.02)

    let xScale = d3.scaleBand()
        .domain(similar_cities)
        .range([margin.left, width - margin.right])
        .padding(0.02)

    console.log(boulder_by_category)
    console.log(columbus_by_category)

    let combined = []
    for (let i = 0; i < boulder_by_category.length; i++) {
        combined.push({
            category: boulder_by_category[i][0],
            per_capita: boulder_by_category[i].per_capita,
            city: "Boulder"
        })
        combined.push({
            category: columbus_by_category[i][0],
            per_capita: columbus_by_category[i].per_capita,
            city: "Columbus"
        })
        combined.push({
            category: houston_by_category[i][0],
            per_capita: houston_by_category[i].per_capita,
            city: "Houston"
        })
        combined.push({
            category: portland_by_category[i][0],
            per_capita: portland_by_category[i].per_capita,
            city: "Portland"
        })
        combined.push({
            category: seattle_by_category[i][0],
            per_capita: seattle_by_category[i].per_capita,
            city: "Seattle"
        })
    }

    let oScale = d3.scaleLinear()
        .domain([0, d3.max(combined, d => d.per_capita)])
        .range([0, 1])

    svg.selectAll("rect")
        .data(combined)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.city))
        .attr("y", d => yScale(d.category))
        .attr("width", xScale.bandwidth())
        .attr("height", yScale.bandwidth())
        .attr("opacity", d => oScale(d.per_capita))
        .attr("fill", "#00a469")

    svg.selectAll(".category_label")
        .data(boulder_by_category)
        .enter()
        .append("text")
        .attr("class", "category_label")
        .attr("x", margin.left - 10)
        .attr("y", d => yScale(d[0]) + yScale.bandwidth()/2)
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "middle")
        .text(d => d[0])
        .attr("fill", "gray")

    svg.selectAll(".city_label")
        .data(similar_cities)
        .enter()
        .append("text")
        .attr("class", "city_label")
        .attr("x", d => xScale(d) + xScale.bandwidth()/2)
        .attr("y", margin.top - 10)
        .attr("text-anchor", "middle")
        .text(d => d)

    svg.selectAll(".value_label")
        .data(combined)
        .enter()
        .append("text")
        .attr("class", "value_label")
        .attr("x", d => xScale(d.city) + xScale.bandwidth()/2)
        .attr("y", d => yScale(d.category) + yScale.bandwidth()/2)
        .text(d => (d.per_capita * 100).toFixed(4))
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")

     


});

function parse(d) {
    return {
        partner: d.PARTNER,
        church: d.CHURCH,
        category: d.MINISTRY_CATEGORY,
        city: d.CITY,
        state: d.STATE,
        zip: +d.ZIP_CODE,
        lat: +d.LAT,
        lon: +d.LNG
    }
}

function parse_cities(d) {
    return {
        city: d.City,
        state: d.state.slice(1),
        pop: +d.pop
    }
}
