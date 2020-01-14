var width = document.querySelector("#orionPics").clientWidth;
var height = document.querySelector("#orionPics").clientHeight;
var margin = {top: 0, left: 0, right: 0, bottom: 0};

var svg = d3.select("#orionPics")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var thirteen = svg.append("image")
    .attr("xlink:href", "./pictures/13m.jpg")
    .attr("x", margin.left)
    .attr("y", margin.top)
    .style("width", "auto")
    .style("height", "100%")
    .style("visibility", "visible");

var twelve = svg.append("image")
    .attr("xlink:href", "./pictures/12m.jpg")
    .attr("x", margin.left)
    .attr("y", margin.top)
    .style("width", "auto")
    .style("height", "100%")
    .style("visibility", "hidden");

var eleven = svg.append("image")
    .attr("xlink:href", "./pictures/11m.jpg")
    .attr("x", margin.left)
    .attr("y", margin.top)
    .style("width", "auto")
    .style("height", "100%")
    .style("visibility", "hidden");

var ten = svg.append("image")
    .attr("xlink:href", "./pictures/10m.jpg")
    .attr("x", margin.left)
    .attr("y", margin.top)
    .style("width", "auto")
    .style("height", "100%")
    .style("visibility", "hidden");

var nine = svg.append("image")
    .attr("xlink:href", "./pictures/9m.jpg")
    .attr("x", margin.left)
    .attr("y", margin.top)
    .style("width", "auto")
    .style("height", "100%")
    .style("visibility", "hidden");

var eight = svg.append("image")
    .attr("xlink:href", "./pictures/8m.jpg")
    .attr("x", margin.left)
    .attr("y", margin.top)
    .style("width", "auto")
    .style("height", "100%")
    .style("visibility", "hidden");

var seven = svg.append("image")
    .attr("xlink:href", "./pictures/7m.jpg")
    .attr("x", margin.left)
    .attr("y", margin.top)
    .style("width", "auto")
    .style("height", "100%")
    .style("visibility", "hidden");

var six = svg.append("image")
    .attr("xlink:href", "./pictures/6m.jpg")
    .attr("x", margin.left)
    .attr("y", margin.top)
    .style("width", "auto")
    .style("height", "100%")
    .style("visibility", "hidden");

var five = svg.append("image")
    .attr("xlink:href", "./pictures/5m.jpg")
    .attr("x", margin.left)
    .attr("y", margin.top)
    .style("width", "auto")
    .style("height", "100%")
    .style("visibility", "hidden");

var four = svg.append("image")
    .attr("xlink:href", "./pictures/4m.jpg")
    .attr("x", margin.left)
    .attr("y", margin.top)
    .style("width", "auto")
    .style("height", "100%")
    .style("visibility", "hidden");

var three = svg.append("image")
    .attr("xlink:href", "./pictures/3m.jpg")
    .attr("x", margin.left)
    .attr("y", margin.top)
    .style("width", "auto")
    .style("height", "100%")
    .style("visibility", "hidden");

var two = svg.append("image")
    .attr("xlink:href", "./pictures/2m.jpg")
    .attr("x", margin.left)
    .attr("y", margin.top)
    .style("width", "auto")
    .style("height", "100%")
    .style("visibility", "hidden");

var one = svg.append("image")
    .attr("xlink:href", "./pictures/1m.jpg")
    .attr("x", margin.left)
    .attr("y", margin.top)
    .style("width", "auto")
    .style("height", "100%")
    .style("visibility", "hidden");

var zero = svg.append("image")
    .attr("xlink:href", "./pictures/0m.jpg")
    .attr("x", margin.left)
    .attr("y", margin.top)
    .style("width", "auto")
    .style("height", "100%")
    .style("visibility", "hidden");

d3.select("#thirteen").on("click", function() {
    d3.select(this)
        .style("background-color", "#FFFFFF")
        .style("color", "#0b0b0b");

    d3.select("#twelve")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");
    
    d3.select("#eleven")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#ten")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#nine")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#eight")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#seven")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#six")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#five")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#four")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#three")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#two")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#one")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#zero")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    thirteen.style("visibility", "visible");
    twelve.style("visibility", "hidden");
    eleven.style("visibility", "hidden");
    ten.style("visibility", "hidden");
    nine.style("visibility", "hidden");
    eight.style("visibility", "hidden");
    seven.style("visibility", "hidden");
    six.style("visibility", "hidden");
    five.style("visibility", "hidden");
    four.style("visibility", "hidden");
    three.style("visibility", "hidden");
    two.style("visibility", "hidden");
    one.style("visibility", "hidden");
    zero.style("visibility", "hidden");
});

d3.select("#twelve").on("click", function() {
    d3.select(this)
        .style("background-color", "#FFFFFF")
        .style("color", "#0b0b0b");

    d3.select("#thirteen")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");
    
    d3.select("#eleven")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#ten")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#nine")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#eight")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#seven")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#six")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#five")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#four")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#three")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#two")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#one")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#zero")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    thirteen.style("visibility", "hidden");
    twelve.style("visibility", "visible");
    eleven.style("visibility", "hidden");
    ten.style("visibility", "hidden");
    nine.style("visibility", "hidden");
    eight.style("visibility", "hidden");
    seven.style("visibility", "hidden");
    six.style("visibility", "hidden");
    five.style("visibility", "hidden");
    four.style("visibility", "hidden");
    three.style("visibility", "hidden");
    two.style("visibility", "hidden");
    one.style("visibility", "hidden");
    zero.style("visibility", "hidden");
});

d3.select("#eleven").on("click", function() {
    d3.select(this)
        .style("background-color", "#FFFFFF")
        .style("color", "#0b0b0b");

    d3.select("#thirteen")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#twelve")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#ten")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#nine")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#eight")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#seven")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#six")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#five")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#four")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#three")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#two")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#one")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#zero")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    thirteen.style("visibility", "hidden");
    twelve.style("visibility", "hidden");
    eleven.style("visibility", "visible");
    ten.style("visibility", "hidden");
    nine.style("visibility", "hidden");
    eight.style("visibility", "hidden");
    seven.style("visibility", "hidden");
    six.style("visibility", "hidden");
    five.style("visibility", "hidden");
    four.style("visibility", "hidden");
    three.style("visibility", "hidden");
    two.style("visibility", "hidden");
    one.style("visibility", "hidden");
    zero.style("visibility", "hidden");
});

d3.select("#ten").on("click", function() {
    d3.select(this)
        .style("background-color", "#FFFFFF")
        .style("color", "#0b0b0b");

    d3.select("#thirteen")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#twelve")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#eleven")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#nine")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#eight")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#seven")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#six")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#five")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#four")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#three")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#two")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#one")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#zero")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    thirteen.style("visibility", "hidden");
    twelve.style("visibility", "hidden");
    eleven.style("visibility", "hidden");
    ten.style("visibility", "visible");
    nine.style("visibility", "hidden");
    eight.style("visibility", "hidden");
    seven.style("visibility", "hidden");
    six.style("visibility", "hidden");
    five.style("visibility", "hidden");
    four.style("visibility", "hidden");
    three.style("visibility", "hidden");
    two.style("visibility", "hidden");
    one.style("visibility", "hidden");
    zero.style("visibility", "hidden");
});

d3.select("#nine").on("click", function() {
    d3.select(this)
        .style("background-color", "#FFFFFF")
        .style("color", "#0b0b0b");

    d3.select("#thirteen")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#twelve")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#eleven")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#ten")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#eight")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#seven")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#six")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#five")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#four")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#three")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#two")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#one")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#zero")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    thirteen.style("visibility", "hidden");
    twelve.style("visibility", "hidden");
    eleven.style("visibility", "hidden");
    ten.style("visibility", "hidden");
    nine.style("visibility", "visible");
    eight.style("visibility", "hidden");
    seven.style("visibility", "hidden");
    six.style("visibility", "hidden");
    five.style("visibility", "hidden");
    four.style("visibility", "hidden");
    three.style("visibility", "hidden");
    two.style("visibility", "hidden");
    one.style("visibility", "hidden");
    zero.style("visibility", "hidden");
});

d3.select("#eight").on("click", function() {
    d3.select(this)
        .style("background-color", "#FFFFFF")
        .style("color", "#0b0b0b");

    d3.select("#thirteen")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#twelve")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#eleven")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#ten")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#nine")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#seven")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#six")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#five")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#four")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#three")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#two")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#one")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#zero")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    thirteen.style("visibility", "hidden");
    twelve.style("visibility", "hidden");
    eleven.style("visibility", "hidden");
    ten.style("visibility", "hidden");
    nine.style("visibility", "hidden");
    eight.style("visibility", "visible");
    seven.style("visibility", "hidden");
    six.style("visibility", "hidden");
    five.style("visibility", "hidden");
    four.style("visibility", "hidden");
    three.style("visibility", "hidden");
    two.style("visibility", "hidden");
    one.style("visibility", "hidden");
    zero.style("visibility", "hidden");
});

d3.select("#seven").on("click", function() {
    d3.select(this)
        .style("background-color", "#FFFFFF")
        .style("color", "#0b0b0b");

    d3.select("#thirteen")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#twelve")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#eleven")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#ten")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#nine")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#eight")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#six")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#five")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#four")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#three")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#two")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#one")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#zero")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    thirteen.style("visibility", "hidden");
    twelve.style("visibility", "hidden");
    eleven.style("visibility", "hidden");
    ten.style("visibility", "hidden");
    nine.style("visibility", "hidden");
    eight.style("visibility", "hidden");
    seven.style("visibility", "visible");
    six.style("visibility", "hidden");
    five.style("visibility", "hidden");
    four.style("visibility", "hidden");
    three.style("visibility", "hidden");
    two.style("visibility", "hidden");
    one.style("visibility", "hidden");
    zero.style("visibility", "hidden");
});

d3.select("#six").on("click", function() {
    d3.select(this)
        .style("background-color", "#FFFFFF")
        .style("color", "#0b0b0b");

    d3.select("#thirteen")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#twelve")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#eleven")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#ten")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#nine")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#eight")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#seven")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#five")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#four")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#three")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#two")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#one")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#zero")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    thirteen.style("visibility", "hidden");
    twelve.style("visibility", "hidden");
    eleven.style("visibility", "hidden");
    ten.style("visibility", "hidden");
    nine.style("visibility", "hidden");
    eight.style("visibility", "hidden");
    seven.style("visibility", "hidden");
    six.style("visibility", "visible");
    five.style("visibility", "hidden");
    four.style("visibility", "hidden");
    three.style("visibility", "hidden");
    two.style("visibility", "hidden");
    one.style("visibility", "hidden");
    zero.style("visibility", "hidden");
});

d3.select("#five").on("click", function() {
    d3.select(this)
        .style("background-color", "#FFFFFF")
        .style("color", "#0b0b0b");

    d3.select("#thirteen")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#twelve")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#eleven")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#ten")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#nine")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#eight")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#seven")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#six")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#four")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#three")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#two")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#one")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#zero")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    thirteen.style("visibility", "hidden");
    twelve.style("visibility", "hidden");
    eleven.style("visibility", "hidden");
    ten.style("visibility", "hidden");
    nine.style("visibility", "hidden");
    eight.style("visibility", "hidden");
    seven.style("visibility", "hidden");
    six.style("visibility", "hidden");
    five.style("visibility", "visible");
    four.style("visibility", "hidden");
    three.style("visibility", "hidden");
    two.style("visibility", "hidden");
    one.style("visibility", "hidden");
    zero.style("visibility", "hidden");
});

d3.select("#four").on("click", function() {
    d3.select(this)
        .style("background-color", "#FFFFFF")
        .style("color", "#0b0b0b");

    d3.select("#thirteen")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#twelve")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#eleven")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#ten")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#nine")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#eight")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#seven")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#six")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#five")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#three")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#two")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#one")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#zero")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    thirteen.style("visibility", "hidden");
    twelve.style("visibility", "hidden");
    eleven.style("visibility", "hidden");
    ten.style("visibility", "hidden");
    nine.style("visibility", "hidden");
    eight.style("visibility", "hidden");
    seven.style("visibility", "hidden");
    six.style("visibility", "hidden");
    five.style("visibility", "hidden");
    four.style("visibility", "visible");
    three.style("visibility", "hidden");
    two.style("visibility", "hidden");
    one.style("visibility", "hidden");
    zero.style("visibility", "hidden");
});

d3.select("#three").on("click", function() {
    d3.select(this)
        .style("background-color", "#FFFFFF")
        .style("color", "#0b0b0b");

    d3.select("#thirteen")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#twelve")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#eleven")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#ten")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#nine")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#eight")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#seven")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#six")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#five")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#four")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#two")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#one")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#zero")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    thirteen.style("visibility", "hidden");
    twelve.style("visibility", "hidden");
    eleven.style("visibility", "hidden");
    ten.style("visibility", "hidden");
    nine.style("visibility", "hidden");
    eight.style("visibility", "hidden");
    seven.style("visibility", "hidden");
    six.style("visibility", "hidden");
    five.style("visibility", "hidden");
    four.style("visibility", "vhidden");
    three.style("visibility", "visible");
    two.style("visibility", "hidden");
    one.style("visibility", "hidden");
    zero.style("visibility", "hidden");
});

d3.select("#two").on("click", function() {
    d3.select(this)
        .style("background-color", "#FFFFFF")
        .style("color", "#0b0b0b");

    d3.select("#thirteen")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#twelve")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#eleven")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#ten")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#nine")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#eight")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#seven")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#six")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#five")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#four")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#three")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#one")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#zero")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    thirteen.style("visibility", "hidden");
    twelve.style("visibility", "hidden");
    eleven.style("visibility", "hidden");
    ten.style("visibility", "hidden");
    nine.style("visibility", "hidden");
    eight.style("visibility", "hidden");
    seven.style("visibility", "hidden");
    six.style("visibility", "hidden");
    five.style("visibility", "hidden");
    four.style("visibility", "vhidden");
    three.style("visibility", "hidden");
    two.style("visibility", "visible");
    one.style("visibility", "hidden");
    zero.style("visibility", "hidden");
});

d3.select("#one").on("click", function() {
    d3.select(this)
        .style("background-color", "#FFFFFF")
        .style("color", "#0b0b0b");

    d3.select("#thirteen")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#twelve")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#eleven")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#ten")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#nine")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#eight")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#seven")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#six")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#five")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#four")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#three")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#two")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#zero")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    thirteen.style("visibility", "hidden");
    twelve.style("visibility", "hidden");
    eleven.style("visibility", "hidden");
    ten.style("visibility", "hidden");
    nine.style("visibility", "hidden");
    eight.style("visibility", "hidden");
    seven.style("visibility", "hidden");
    six.style("visibility", "hidden");
    five.style("visibility", "hidden");
    four.style("visibility", "vhidden");
    three.style("visibility", "hidden");
    two.style("visibility", "hidden");
    one.style("visibility", "visible");
    zero.style("visibility", "hidden");
});

d3.select("#zero").on("click", function() {
    d3.select(this)
        .style("background-color", "#FFFFFF")
        .style("color", "#0b0b0b");

    d3.select("#thirteen")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#twelve")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#eleven")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#ten")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#nine")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#eight")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#seven")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#six")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#five")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#four")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#three")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#two")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    d3.select("#one")
        .style("background-color", "#0b0b0b")
        .style("color", "#FFFFFF");

    thirteen.style("visibility", "hidden");
    twelve.style("visibility", "hidden");
    eleven.style("visibility", "hidden");
    ten.style("visibility", "hidden");
    nine.style("visibility", "hidden");
    eight.style("visibility", "hidden");
    seven.style("visibility", "hidden");
    six.style("visibility", "hidden");
    five.style("visibility", "hidden");
    four.style("visibility", "vhidden");
    three.style("visibility", "hidden");
    two.style("visibility", "hidden");
    one.style("visibility", "hidden");
    zero.style("visibility", "visible");
});