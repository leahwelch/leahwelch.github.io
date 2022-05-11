var width = document.querySelector("#chart").clientWidth;
var height = document.querySelector("#chart").clientHeight;
var margin = {top: 50, left: 50, right: 50, bottom: 50};

var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);


d3.csv("./data/wearlog.csv", parse).then(function(data) {

    data.forEach(function(d) {
        if(d.brand === '') {
            d.brand = 'Vintage';
        }
    })

    console.log(data);

    const monthNest = d3.nest()
        .key(function(d) { return d.year; })
        .key(function(d) { return d.month; })
        .key(function(d) { return d.id; })
        .rollup()
        .entries(data);
    console.log(monthNest)

    // const oldest = data.filter(function(d) {
    //     return d. month == 10 && d.year == 20;
    // })

    // const newest = data.filter(function(d) {
    //     return d. month == 4 && d.year == 22;
    // })

    // console.log(oldest)
    // console.log(newest)

    // const oldNest = d3.nest()
    //     .key(function(d) { return d.id; })
    //     .rollup()
    //     .entries(oldest);

    // const newNest = d3.nest()
    //     .key(function(d) { return d.id; })
    //     .rollup()
    //     .entries(newest);

    // console.log(oldNest);
    // console.log(newNest);
    

    // const color = d3.scaleOrdinal()
    //     .domain(["Madewell", "Aritzia", "The Reformation", "Vintage"])
    //     .range(["#233D4D", "#FE7F2D", "#FCCA46", "#A1C181"])

   
});

function parse(d) {

    return {
        date: new Date(d.date),
        month: new Date(d.date).getMonth() + 1,
        year: new Date(d.date).getYear() - 100,
        week: +d.week,
        description: (d.Brand + " ").concat((d.Description + " ")).concat(d.Sub_Category),
        id: +d.garmentId,
        new: d.new,
        sold: d.sold,
        brand: d.Brand
    }
    
}