const promises = [
    d3.csv("./data/partner_data.csv", parse),
    d3.csv("./data/pop.csv", parse_cities)
];

/* defining variables for the width and heigth of the SVG */
const width = document.querySelector("#chart").clientWidth;
const height = document.querySelector("#chart").clientHeight;
const margin = { top: 100, left: 300, right: 300, bottom: 100 };

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

Promise.all(promises).then(function (data) {
    console.log(data)

    let partners = data[0]
    let cities = data[1]

    let boulder_pop = cities.filter(d => d.city === "Boulder city" && d.state === "Colorado")[0].pop
    let columbus_pop = cities.filter(d => d.city === "Columbus city" && d.state === "Ohio")[0].pop
    console.log(boulder_pop)
    console.log(columbus_pop)

    let boulder = partners.filter(d => d.city === "Boulder" && d.state === "CO")
    let columbus = partners.filter(d => d.city === "Columbus" && d.state === "OH")

    let boulder_by_category = d3.groups(boulder, d => d.category)
    boulder_by_category.forEach((d) => {
        d.per_capita = d[1].length / boulder_pop
    })

    let columbus_by_category = d3.groups(columbus, d => d.category)
    columbus_by_category.forEach((d) => {
        d.per_capita = d[1].length / columbus_pop
    })

    let xScale = d3.scalePoint()
        .domain(boulder_by_category.map(d => d[0]))
        .range([margin.left, width - margin.right])
        .padding(0.01)

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
    }

    let rScale = d3.scaleSqrt()
        .domain([d3.min(combined, d => d.per_capita), d3.max(combined, d => d.per_capita)])
        .range([40, 85])

    svg.selectAll("circle")
        .data(combined)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.category))
        .attr("cy", height / 3)
        .attr("r", d => rScale(d.per_capita))
        .attr("fill", (d) => {
            if (d.city === "Boulder") {
                return "#00a469"
            } else {
                return "none"
            }
        })
        .attr("stroke", (d) => {
            if (d.city === "Columbus") {
                return "black"
            } else {
                return "none"
            }
        })
        .attr("opacity", 0.75)

    svg.selectAll("line")
        .data(boulder_by_category)
        .enter()
        .append("line")
        .attr("x1", d => xScale(d[0]))
        .attr("x2", d => xScale(d[0]))
        .attr("y1", height / 3 - 125)
        .attr("y2", height / 3 + 125)
        .attr("stroke", "black")
        .attr("opacity", 0.3)

    svg.selectAll("text")
        .data(boulder_by_category)
        .enter()
        .append("text")
        .attr("class", "category_label")
        
        // .attr("x", d => xScale(d[0]))
        // .attr("y", height / 2 + 145)
        .attr("text-anchor", "end")
        .text(d => d[0])
        .attr("fill", "gray")
        .attr("transform", d => `translate(${xScale(d[0])},${height / 3 + 145})rotate(-45)`)

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
