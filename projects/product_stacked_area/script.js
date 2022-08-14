/* defining variables for the width and heigth of the SVG */
const width = document.querySelector("#chart").clientWidth;
const height = document.querySelector("#chart").clientHeight;
const margin = { top: 100, left: 50, right: 1250, bottom: 100 };

/*creating the actual SVG */
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Function to offset each layer by the maximum of the previous layer
function offset(series, order) {
    if (!((n = series.length) > 1)) return;
    // Standard series
    for (var i = 1, s0, s1 = series[order[0]], n, m = s1.length; i < n; ++i) {
        (s0 = s1), (s1 = series[order[i]]);
        let base = d3.max(s0, d => d[1]); // here is where you calculate the maximum of the previous layer
        for (var j = 0; j < m; ++j) {
            // Set the height based on the data values, shifted up by the previous layer
            let diff = s1[j][1] - s1[j][0];
            s1[j][0] = base + 4;
            s1[j][1] = base + diff + 4;
        }
    }
}

// d3.csv("./data/gapminder.csv", parse).then(function (data) {
d3.csv("./data/products_rise_run.csv", parseProducts).then(function (data) {

    console.log(data)

    /* filter subset of data, grabbing only the rows where the country = China or the US */
    // const filtered_data = data.filter(d => d.country === "China" || d.country === "United States");
    const keys = ["model", "drawing", "code", "image", "text", "profession", "building"]

    //set out colors based on our list of keys
    const colorScale = d3.scaleOrdinal()
        .domain(keys)
        .range(["#03ac4b", "#de2528", "#00add7", "#c474af", "#425ba8", "#f1783b", "#f2c918"])

    //generate the dataset we'll feed into our chart
    const stackedData = d3.stack()
        // .offset(d3.stackOffsetExpand)
        .offset(offset)
        .keys(keys)(data)
        .map((d) => {
            return d.forEach(v => v.key = d.key), d;
        })
    console.log(stackedData)

    //scales - xScale is a linear scale of the years
    const xScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.year), d3.max(data, d => d.year)])
        .range([margin.left, width - margin.right]);

    //yScale is a linear scale with a minimum value of 0 and a maximum bsed on the total population maximum
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(stackedData, d => d3.max(d, d => d[1]))])
        // .domain([0, d3.max(data, d => d["model"] + d["drawing"] + d["code"] + d["image"] + d["text"] + d["profession"] + d["building"])])
        .range([height - margin.bottom - 10, margin.top]);

    //draw the areas
    svg.selectAll(".path")
        .data(stackedData)
        .enter()
        .append("path")
        .attr("class", "path")
        .attr("fill", d => colorScale(d.key))
        // .attr("stroke", "#ffffff")
        .attr("d", d3.area()
            .x((d, i) => {
                return xScale(d.data.year);
            })
            //the starting and ending points for each section of the stack
            .y1(d => yScale(d[0]))
            .y0(d => yScale(d[1]))
            // .curve(d3.curveBasis)
        )

    // //draw the x and y axis
    // const xAxis = svg.append("g")
    //     .attr("class", "axis")
    //     .attr("transform", `translate(0,${height - margin.bottom})`)
    //     .call(d3.axisBottom().scale(xScale).tickFormat(d3.format("Y")));

    // const xAxisLabel = svg.append("text")
    //     .attr("class", "axisLabel")
    //     .attr("x", width / 2)
    //     .attr("y", height - margin.bottom / 3)
    //     .text("Year");

    // //draw the legend
    // const legendRects = legend.selectAll("rect")
    //     .data(keys)
    //     .enter()
    //     .append("rect")
    //     .attr("x", 0)
    //     .attr("y", (d, i) => i * 30)
    //     .attr("width", 20)
    //     .attr("height", 20)
    //     .attr("fill", d => colorScale(d))

    // const legendLabels = legend.selectAll("text")
    //     .data(keys)
    //     .enter()
    //     .append("text")
    //     .attr("class", "legendLabel")
    //     .attr("x", 27)
    //     .attr("y", (d, i) => i * 30 + 15)
    //     .text(d => d)

});

//SLIDER

var dataTime = d3.range(0, 6).map(function (d) {
    return new Date(1995 + d, 10, 3);
});

var sliderTime = d3
    .sliderBottom()
    .min(d3.min(dataTime))
    .max(d3.max(dataTime))
    .step(1000 * 60 * 60 * 24 * 365)
    .width(width - margin.left - margin.right)
    .tickFormat(d3.timeFormat('%Y'))
    .tickValues(dataTime)
    .default(new Date(1998, 10, 3))
    .on('onchange', val => {
        d3.select('p#value-step').text(d3.timeFormat('%Y')(val));
    });

var gTime = svg
    .append('g')
    .attr("transform", `translate(${margin.left},${height - margin.bottom})`);

gTime.call(sliderTime);

d3.select('p#value-step').text(d3.timeFormat('%Y')(sliderTime.value()));

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

//get the data in the right format
function parseProducts(d) {
    return {
        year: +d.year,
        building: +d.building,
        code: +d.code,
        drawing: +d.drawing,
        image: +d.image,
        model: +d.model,
        profession: +d.profession,
        text: +d.text
    }
}

