//Config
var elem = document.getElementById("background");
var params = {
  //params here
  autostart : true,
  width : $(window).width(),
  height : $(window).height()
};
var colors = [
  "#18A8DE",
  "#EE586E",
  "#1ED5C8",
  "#FF9CA8",
  "#38C555"
]
var shapes = []; //list of all different shapes
var particles = []; //list of all unique particles from shapes

//start this shit
var two = new Two(params).appendTo(elem);

//find all shapes
var objects = $('#shapes object');
var count = objects.length;
objects.each(function(i, el) {
  el.onload = function() {
    var shape = two.interpret($(el).contents().find('svg')[0]);
    shape.visible = false;
    shapes.push(shape);
    if (!--count) generateShapes();
  }
});
//generate random shapes
function generateShapes() {
  _(20).times(function(n) {
    var shape = _.sample(shapes).clone();

    shape.fill = _.sample(colors);
    shape.scale = _.random(10,20)*.01; //The original SVGs are just this massive!
    shape.opacity = 0;
    shape.visible = true;

    var opacity, step, stepX, stepY, initialX, initialY;
    shape.start = function() {
      stepX = _.random(-10,10)/5;
      stepY = _.random(-10,10)/5;
      step = _.random(10,100)/10000;
      initialX = _.random(0,two.width);
      initialY = _.random(0,two.height);
      shape.translation.set(initialX,initialY);
      opacity = -1.0;
    }
    shape.step = function() {
      if (shape.opacity <= 0) shape.start();
      opacity += step;
      shape.translation.x += stepX;
      shape.translation.y += stepY;
      shape.rotation += step;
      shape.opacity = 1 - Math.abs(opacity);
    }
    particles.push(shape);
  });
}
//main animation
two.bind('update',function() {
  _.each(particles,function(child) {
    child.step();
  });
});

//make sure it runs after dom
$(function() {
  if(!navigator.userAgent.match('CriOS')) {
    //make things reveal when you scroll to it.
    window.scrollReveal = ScrollReveal({
      reset: true
    });
    scrollReveal.reveal('.rev');

    //make navbar transition
    $('#navbar').onePageNav({
      currentClass: 'active'
    });
  }
});
