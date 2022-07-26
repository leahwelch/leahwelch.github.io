/* defining variables for the width and heigth of the SVG */
const width = document.querySelector("#chart").clientWidth;
const height = document.querySelector("#chart").clientHeight;
const margin = { top: 50, left: 150, right: 50, bottom: 150 };

/*creating the actual SVG */
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

d3.csv("./data/gapminder.csv", parse).then(function (data) {


    /* filter subset of data, grabbing only the rows where the country = China or the US */
    // const filtered_data = data.filter(d => d.country === "China" || d.country === "United States");
    const keys = ["Africa", "Americas", "Asia", "Europe", "Oceania"]

    //set out colors based on our list of keys
    const colorScale = d3.scaleOrdinal()
        .domain(keys)
        .range(["#00A676", "#CBFF4D", "#C84630", "#235789", "#FF9B42"])

    //use the arquero library to pivot the data to the right format
    const by_continent = d3.groups(data, d=>d.continent)
    console.log(by_continent)

    let pop_by_year = []
    for(let i = 0; i < by_continent.length; i++) {
        let nested = d3.nest()
            .key(d => d.year)
            .rollup(d.values.sum(p => p.pop))
            .entries(by_continent[i])
        console.log(nested)
    }

    const by_year = aq.from(filtered_data)
        .groupby("year")
        .pivot("country", "pop")
        .objects()
    console.log(by_year)

    const stackedData = d3.stack()
        .keys(keys)(by_year)
        .map((d) => {
            return d.forEach(v => v.key = d.key), d;
        })
    console.log(stackedData)
    //scales - xScale is a linear scale of the years
    const xScale = d3.scaleLinear()
        .domain([d3.min(by_year, d => d.year), d3.max(by_year, d => d.year)])
        .range([margin.left, width - margin.right]);

    //yScale is a linear scale with a minimum value of 0 and a maximum bsed on the population maximum
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(by_year, d => d["China"] + d["United States"])])
        .range([height - margin.bottom, margin.top]);

    console.log(stackedData[0][0].data)

    //draw the path
    svg.selectAll("path")
        .data(stackedData)
        .enter()
        .append("path")
        .attr("fill", d => colorScale(d.key))
        .attr("d", d3.area()
            // .x(function(d, i) { return xScale(d.data.year); })
            .x((d, i) => {
                return xScale(d.data.year);
            })
            .y1(d => yScale(d[0]))
            .y0(d => yScale(d[1]))
        )
        

    const xAxis = svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom().scale(xScale).tickFormat(d3.format("Y")));

    const yAxis = svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft()
            .scale(yScale)
            .tickFormat(d3.format(".2s"))); //use d3.format to customize your axis tick format


    const xAxisLabel = svg.append("text")
        .attr("class", "axisLabel")
        .attr("x", width / 2)
        .attr("y", height - margin.bottom / 2)
        .text("Year");

    const yAxisLabel = svg.append("text")
        .attr("class", "axisLabel")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", margin.left / 2)
        .text("Population");

});

//get the data in the right format
function parse(d) {
    return {
        country: d.country,
        continent: d.continent,
        year: +d.year,
        lifeExp: +d.lifeExp,
        gdpPercap: +d.gdpPercap,
        pop: +d.pop
    }
}

