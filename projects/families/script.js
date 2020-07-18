d3.csv("./data/ms_2018.csv").then(function(data) {

    var memberInc = [];
    for(var i =0; i < data.length; i++) {
        var memberA = data[i];
        memberInc.push({id: memberA.COUPLE_ID, income: memberA.INCTOT})
    }
    //console.log(memberInc);

    data.forEach(function(d){
        d.INCTOT = +d.INCTOT;
    });

    var famID = [];
    for(var i = 0; i < data.length; i++) {
        var couples = [data[i].COUPLE_ID];
            couples.forEach(function(val) {
                if(famID.indexOf(val) < 0) {
                    famID.push(val);
                }
        })
    }
    //console.log(famID);

    var couple1 = data.filter(function(d){
        return d.COUPLE_SEQUENCE === "c1";
    });

    var couple2 = data.filter(function(d){
        return d.COUPLE_SEQUENCE === "c2";
    });

    console.log(couple1);

    var incomeSums = [];
    for(var i = 0; i < 100; i++) {
        if(couple1[i].COUPLE_ID === couple2[i].COUPLE_ID) {
            var sumA = couple1[i].INCTOT + couple2[i].INCTOT;
            incomeSums.push({id: couple1[i].COUPLE_ID, incomeTotal: sumA})
        }
    }
    console.log(incomeSums);
    incomeSums.sort(function(a, b) { return a.incomeTotal - b.incomeTotal; }); 
    console.log(incomeSums);      


    /*var incTotal = [];
    for (var i = 0; i < famID.length; i++) {
        for (var j = 0; i < memberInc.length; j++) {
            var memberA = memberInc[j].id;
            if (memberA === famID[i]) {
                incTotal.push
            }
        }
    }*/


});