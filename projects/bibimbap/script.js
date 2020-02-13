
//////////////////////////////////
    // MAKE A STICKY DASHBOARD
//////////////////////////////////
var intro = document.getElementById("intro");
var recipe = document.getElementById("recipe");
var dashboard = document.getElementById("dashboard");
    dashboard.style.opacity = 0;
var sticky = recipe.offsetTop;

function makeSticky() {

  if (window.pageYOffset > sticky - 50) {
  dashboard.style.opacity = 1;
  } else {
  dashboard.style.opacity = 0;
  }
};

//////////////////////////////////
    // DEFINE SVG AND DIMENSION VARIABLES
//////////////////////////////////

var margin = {top: 200, left: 100, right: 100, bottom: 200};
var width = document.querySelector("#recipe").clientWidth;
var viewHeight = document.querySelector("#recipe").clientHeight;
var height = document.querySelector("#recipe").scrollHeight;

var carrotContainer = document.getElementById("carrots");
var cucumberTop = sticky + carrotContainer.getBoundingClientRect().height;
var cucumberContainer = document.getElementById("cucumbers");
var beefTop = cucumberTop + cucumberContainer.getBoundingClientRect().height;
var beefContainer = document.getElementById("beef");
var riceTop = beefTop + beefContainer.getBoundingClientRect().height;
var riceContainer = document.getElementById("rice");
var sauceTop = riceTop + riceContainer.getBoundingClientRect().height;
var sauceContainer = document.getElementById("sauce");
var spinachTop = sauceTop + sauceContainer.getBoundingClientRect().height;
var spinachContainer = document.getElementById("spinach");
var mushroomTop = spinachTop + spinachContainer.getBoundingClientRect().height;
var mushroomContainer = document.getElementById("mushrooms");
var eggTop = mushroomTop + mushroomContainer.getBoundingClientRect().height;
var eggContainer = document.getElementById("egg");
var combineTop = eggTop + eggContainer.getBoundingClientRect().height;

//////////////////////////////////
    // LISTEN FOR SCROLL POSITION AND MAKE CHANGES
//////////////////////////////////
var scrollTop = [0];
var timeTos = ["24 hours", "24 hours", "3.25 hours", "30 minutes", "20 minutes", "15 minutes", "10 minutes", "3 minutes", "0 seconds"];
var preps = ["20 minutes", "1.25 hours", "15 minutes", "22 minutes", "10 minutes", "10 minutes", "8 minutes", "3 minutes", "30 seconds"];

window.addEventListener("scroll", function() { 
        
  scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  var prepTime = document.getElementById("prepTime");
  var timeToEat = document.getElementById("timeToEat");

  makeSticky();

  // DASHBOARD TEXT COLOR CHANGES, PREP TIME UPDATES, TIME UNTIL EATING UPDATES //
    console.log(scrollTop);

    if (scrollTop > (sticky - 50) && scrollTop < cucumberTop) {
      dashboard.className = ("carrots");
      prepTime.innerHTML = preps[0];
      timeToEat.innerHTML = timeTos[0];
    } else if (scrollTop >= cucumberTop && scrollTop < beefTop) {
      dashboard.className = ("cucumbers");
      prepTime.innerHTML = preps[1];
      timeToEat.innerHTML = timeTos[1];
    } else if (scrollTop >= beefTop && scrollTop < riceTop) {
      dashboard.className = ("beef");
      prepTime.innerHTML = preps[2];
      timeToEat.innerHTML = timeTos[2];
    } else if (scrollTop >= riceTop && scrollTop < sauceTop) {
      dashboard.className = ("rice");
      prepTime.innerHTML = preps[3];
      timeToEat.innerHTML = timeTos[3];
    } else if (scrollTop >= sauceTop && scrollTop < spinachTop) {
      dashboard.className = ("sauce");
      prepTime.innerHTML = preps[4];
      timeToEat.innerHTML = timeTos[4];
    } else if (scrollTop >= spinachTop && scrollTop < mushroomTop) {
      dashboard.className = ("spinach");
      prepTime.innerHTML = preps[5];
      timeToEat.innerHTML = timeTos[5];
    } else if (scrollTop >= mushroomTop && scrollTop < eggTop) {
      dashboard.className = ("mushrooms");
      prepTime.innerHTML = preps[6];
      timeToEat.innerHTML = timeTos[6];
    } else if (scrollTop >= eggTop && scrollTop < combineTop) {
      dashboard.className = ("egg");
      prepTime.innerHTML = preps[7];
      timeToEat.innerHTML = timeTos[7];
    } else {
      dashboard.className = ("combine");
      prepTime.innerHTML = preps[8];
      timeToEat.innerHTML = timeTos[8];
    }

    
});

//////////////////////////////////
    // MAKE SCALES THAT MAP SCROLLING POSITION TO OTHER THINGS
//////////////////////////////////

// SCALE TO CONVERT SCROLL TOP POSITION TO TIME UNTIL EATING
var scrollToTimeToEat = d3.scaleLinear() 
    .domain([sticky+10, height-margin.bottom]) 
    .range([0, 36]) //need to figure out the time mapping and inserting data here?
    .clamp(true);
