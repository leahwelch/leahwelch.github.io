

var width = document.querySelector("#chart").clientWidth;
var height = document.querySelector("#chart").clientHeight;
var margin = {top: 150, left: 150, right: 150, bottom: 150};

// console.log(width);
// console.log(height);

var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);


d3.csv("./data/wearlog.csv", parse).then(function(data) {
    console.log(data);

    var scaleDate = d3.scaleTime()
        .domain([new Date("2020-10-05"), new Date("2021-05-23")])
        .range([margin.left, width-margin.right])

    var histogramValues = d3.histogram()
        .value(function(d) {return d.date})
        .domain(scaleDate.domain())
        .thresholds(scaleDate.ticks(28))

    var bins = histogramValues(data)
    console.log(bins)

    by_id = d3.groups(data, d => d.id)
    console.log(by_id)

    // var bins_by_id = histogramValues(by_id[0][1]);
    // console.log(bins_by_id)
    var bins_by_id = [];
        for(var i = 0; i < by_id.length; i++) {
            var key = by_id[i][0]
            var arr = histogramValues(by_id[i][1])
            for(var j = 0; j < arr.length; j++) {
                var date = arr[j].x0;
                var value = arr[j].length;
                bins_by_id.push({key: key, date: date, value: value})
            }
        }
    console.log(bins_by_id);

    var by_date = aq
        .from(bins_by_id) // create an arquero table from the data
        .groupby('date') // group by date
        .pivot("key", "value") // create a key for each state, populated with the # of new cases
        .objects() // return JavaScript objects

    console.log(by_date)

    

});

function parse(d) {

    return {
        date: new Date(d.date),
        description: (d.Brand + " ").concat((d.Description + " ")).concat(d.Sub_Category),
        id: d.garmentId,
        group: d.group
    }
    
}