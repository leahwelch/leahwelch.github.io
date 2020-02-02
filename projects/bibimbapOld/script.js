var colors = ['ingredients', 'carrots', 'cucumbers', 'beef', 'rice', 'sauce', 'spinach', 'mushrooms', 'egg', 'combine']
var sections = [...document.getElementsByTagName('section')]


window.addEventListener('scroll', function () {

  var scrollFromTop = window.pageYOffset;

  for (var i = 0; sections.length > i; i++) {

    if (scrollFromTop <= sections[i].offsetTop /*+ (window.innerHeight * 0.75)*/) {
      console.log(i, colors[i]);
      document.body.className = colors[i] 
      break
    } 

  }

})