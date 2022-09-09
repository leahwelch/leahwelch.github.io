//Setting up the SVG where we'll be appending everything for our chart
const width = document.querySelector("#chart").clientWidth;
const height = document.querySelector("#chart").clientHeight;
const margin = { top: 50, left: 150, right: 50, bottom: 150 };

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

d3.csv("./data/ieee_viz.csv", parse).then(function (data) {
    console.log(data)
    let allKeywords = [];
    for(let i = 0; i < data.length; i++) {
        for(let j = 0; j < data[i].keywords.length; j++) {
            allKeywords.push({year: data[i].year, word: data[i].keywords[j], paper: data[i].conference, title: data[i].title})
        }
    }
    let nested = d3.nest()
        .key(d => d.year)
        .key(d => d.word)
        .rollup()
        .entries(allKeywords)
        
    nested.forEach(d => d.key = +d.key)
    nested.sort((a,b) => { return a.key - b.key})
    nested.forEach((d) => {
        d.values.sort((a,b) => {return b.values.length - a.values.length});
    })
    console.log(nested)
    
    
});



function parse(d) {
    return {
        // keywords: d.AuthorKeywords.toLowerCase().split(/[,\s]+/), //split with multiple delimiters
        keywords: d.AuthorKeywords.toLowerCase().split(","),
        year: +d.Year,
        conference: d.Conference,
        title: d.Title
    }
}

