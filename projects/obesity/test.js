






var themes = ["food", "america", "obesity", "disease", "problems", "children", "medicine", "lifestyle", "science", "education"];

var nested = d3.nest()
    .key(function(d) { return d.theme; })
    .rollup(function(v) { return v.length;})
    .entries(kuwait)
    .sort(function(a,b) { return b.value - a.value; });

var matrix = [];
for(k = 0; k < themes.length; k++) {
    var myArray = [];
    for(i = 0; i < nested.length; i++) {
        if(nested[i].key === themes[k]) {
            for(j = 0; j < nested[i].value; j++) {
                if(j<5){
                    myArray.push(`./assets/kuwait/${themes[k]}/${j + 1}.svg`)
                } 
            }
        }
    }
    matrix.push(myArray);
}







