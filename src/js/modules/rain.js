var rain = {};
rain.id = "dubplus-rain";
rain.moduleName = "Rain";
rain.description = "Make it rain!";
rain.category = "General";

// Rain settings
rain.particles = [];
rain.drops = [];
rain.numbase = 5;
rain.numb = 2;
rain.width, rain.height = 0;

// We can update these realtime
rain.controls = {
  rain: 2,
  alpha: 1,
  color: 200,
  opacity: 1,
  saturation: 100,
  lightness: 50,
  back: 0,
  multi: false,
  speed: 1
};

rain.turnOn = function(){
  $('body').prepend('<canvas id="dubPlusRainCanvas" style="position : fixed; top : 0px; left : 0px; z-index: 100; pointer-events:none;"></canvas>');
  this.bindCanvas();
};

// this function will be run on each click of the menu
rain.turnOff = function () {
  $('#dubPlusRainCanvas').remove();
  this.unbindCanvas();
};

rain.bindCanvas = function () {
  this.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      };
  })();

  var canvas = document.getElementById('dubPlusRainCanvas');

  if (!canvas) return;

  var ctx = canvas.getContext('2d');

  this.width, this.height = 0;

  window.onresize = function onresize() {
    this.width = canvas.width = window.innerWidth;
    this.height = canvas.height = window.innerHeight;
  };

  window.onresize();

  this.particles, this.drops = [];
  this.numbase = 5;
  this.numb = 2;

  function Screenshot() {
    window.open(canvas.toDataURL());
  }

  let that = this;

  (function boucle() {
    that.requestAnimFrame(boucle);
    that.update();
    that.rendu(ctx);
  })();
};

rain.buildRainParticle = function(X, Y, num) {
  if (!num) {
    num = this.numb;
  }
  while (num--) {
    this.particles.push({
      speedX: (Math.random() * 0.25),
      speedY: (Math.random() * 9) + 1,
      X: X,
      Y: Y,
      alpha: 1,
      color: "hsla(" + this.controls.color + "," + this.controls.saturation + "%, " + this.controls.lightness + "%," + this.controls.opacity + ")",
    })
  }
};

rain.explosion = function(X, Y, color, num) {
  if (!num) {
    num = this.numbase;
  }
  while (num--) {
    this.drops.push({
      speedX: (Math.random() * 4 - 2),
      speedY: (Math.random() * -4),
      X: X,
      Y: Y,
      radius: 0.65 + Math.floor(Math.random() * 1.6),
      alpha: 1,
      color: color
    })
  }
};

rain.rendu = function(ctx) {
  if (this.controls.multi == true) {
    this.controls.color = Math.random() * 360;
  }

  ctx.save();
  ctx.clearRect(0, 0, width, height);

  var particleslocales = this.particles;
  var dropslocales = this.drops;
  var tau = Math.PI * 2;

  for (var i = 0, particlesactives; particlesactives = particleslocales[i]; i++) {

    ctx.globalAlpha = particlesactives.alpha;
    ctx.fillStyle = particlesactives.color;
    ctx.fillRect(particlesactives.X, particlesactives.Y, particlesactives.speedY / 4, particlesactives.speedY);
  }

  for (var i = 0, dropsactives; dropsactives = dropslocales[i]; i++) {

    ctx.globalAlpha = dropsactives.alpha;
    ctx.fillStyle = dropsactives.color;

    ctx.beginPath();
    ctx.arc(dropsactives.X, dropsactives.Y, dropsactives.radius, 0, tau);
    ctx.fill();
  }
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;

  ctx.restore();
}

rain.update = function() {
  var particleslocales = this.particles;
  var dropslocales = this.drops;

  for (var i = 0, particlesactives; particlesactives = particleslocales[i]; i++) {
    particlesactives.X += particlesactives.speedX;
    particlesactives.Y += particlesactives.speedY + 5;
    if (particlesactives.Y > height - 15) {
      particleslocales.splice(i--, 1);
      this.explosion(particlesactives.X, particlesactives.Y, particlesactives.color);
    }
  }

  for (var i = 0, dropsactives; dropsactives = dropslocales[i]; i++) {
    dropsactives.X += dropsactives.speedX;
    dropsactives.Y += dropsactives.speedY;
    dropsactives.radius -= 0.075;
    if (dropsactives.alpha > 0) {
      dropsactives.alpha -= 0.005;
    } else {
      dropsactives.alpha = 0;
    }
    if (dropsactives.radius < 0) {
      dropslocales.splice(i--, 1);
    }
  }

  var i = this.controls.rain;
  while (i--) {
    this.buildRainParticle(Math.floor((Math.random() * width)), -15);
  }
};

rain.unbindCanvas = function () {
  this.requestAnimFrame = function() {};
};

module.exports = rain;