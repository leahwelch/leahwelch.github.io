
d3.csv("./data/tongan_food.csv", parseCSV).then(function(data) {

    //console.log(data)

    var width = document.querySelector("#chart").clientWidth;
    var height = document.querySelector("#chart").clientHeight;
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var titleWords = [];
    for(var i = 0; i < data.length; i++) {
        var words = data[i].title;
        words.forEach(function(val) {
            titleWords.push({word: val});
        }
        )
    }
    titleWords = titleWords.map(d => d.word.toLowerCase());

    var descWords = [];
    for(var i = 0; i < data.length; i++) {
        var words = data[i].description;
        words.forEach(function(val) {
            descWords.push({word: val});
        }
        )
    }
    descWords = descWords.map(d => d.word.toLowerCase());
    //console.log(descWords);

    //console.log(titleWords);

    // var words = [];
    // for(var i = 0; i < titleWords.length; i++) {
    //     var wordA = titleWords[i];
    //     words.push({word: wordA})
    // }
    // console.log(words);

    var words = [];
    for(var i = 0; i < descWords.length; i++) {
        var wordA = descWords[i];
        words.push({word: wordA})
    }

    // for(var i = 0; i < titleWords.length; i++) {
    //     var wordA = titleWords[i];
    //     words.push({word: wordA});
    // }
    //console.log(words);

    var nested = d3.nest()
        .key(function(d) { return d.word; })
        //.key(function(d) { return d.DAY_OF_WEEK; })
        .rollup(function(v) { return v.length;})
        .entries(words)
        .sort(function(a,b) { return b.value - a.value; });

        console.log(nested);
    
        //console.log("hello");
    });


function parseCSV(data) {
    var d = {};
    d.title = data.title;
    //d.id = data.VideoID;
    d.description = data.description;
    //d.thumbnail = data.thumbnail;

    var separators = [' ', '\\\!', '-', '\\\(', '\\\)', '\\*', '/', ':', '\\\?', '\\\.', ','];
    d.title = d.title.split(" ");
    //d.title = data.title.split(new RegExp(separators.join('|'), 'g'));
    d.description = data.description.split(new RegExp(separators.join('|'), 'g'));

    
    return d;
}
