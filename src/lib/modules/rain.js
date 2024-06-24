class RainEffect {
  constructor() {
    // Rain settings
    this.particles = [];
    this.drops = [];
    this.numbase = 5;
    this.numb = 2;
    this.width = 0;
    this.height = 0;

    // We can update these realtime
    this.controls = {
      rain: 2,
      alpha: 1,
      color: 200,
      opacity: 1,
      saturation: 100,
      lightness: 50,
      back: 0,
      multi: false,
      speed: 1,
    };

    this.requestAnimFrame = null;

    /**
     * @type {HTMLCanvasElement}
     */
    this.canvas = null;
  }
  makeCanvas() {
    this.canvas = document.createElement("canvas");
    this.canvas.id = "dubPlusRainCanvas";
    this.canvas.style.position = "fixed";
    this.canvas.style.top = "0px";
    this.canvas.style.left = "0px";
    this.canvas.style.zIndex = "100";
    this.canvas.style.pointerEvents = "none";
    document.body.prepend(this.canvas);
  }

  start() {
    this.makeCanvas();
    this.startAnimation();
  }

  stop() {
    this.stopAnimation();
    this.canvas?.remove();
  }

  onWindowResize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  startAnimation() {
    const windowAnimFram = window.requestAnimationFrame;

    this.requestAnimFrame = windowAnimFram ? windowAnimFram.bind(window) : null;
    if (!this.canvas) return;

    const ctx = this.canvas.getContext("2d");

    this.width, (this.height = 0);

    this.onWindowResize();
    window.onresize = this.onWindowResize.bind(this);

    this.particles = [];
    this.drops = [];
    this.numbase = 5;
    this.numb = 2;

    let that = this;

    (function boucle() {
      that.requestAnimFrame(boucle);
      that.update();
      that.rendu(ctx);
    })();
  }

  /**
   *
   * @param {number} X
   * @param {number} Y
   * @param {number} [num]
   */
  buildRainParticle(X, Y, num) {
    if (!num) {
      num = this.numb;
    }
    while (num--) {
      this.particles.push({
        speedX: Math.random() * 0.25,
        speedY: Math.random() * 9 + 1,
        X,
        Y,
        alpha: 1,
        color:
          "hsla(" +
          this.controls.color +
          "," +
          this.controls.saturation +
          "%, " +
          this.controls.lightness +
          "%," +
          this.controls.opacity +
          ")",
      });
    }
  }

  /**
   *
   * @param {number} X
   * @param {number} Y
   * @param {any} color
   * @param {number} [num]
   */
  explosion(X, Y, color, num) {
    if (!num) {
      num = this.numbase;
    }
    while (num--) {
      this.drops.push({
        speedX: Math.random() * 4 - 2,
        speedY: Math.random() * -4,
        X,
        Y,
        radius: 0.65 + Math.floor(Math.random() * 1.6),
        alpha: 1,
        color,
      });
    }
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  rendu(ctx) {
    if (this.controls.multi) {
      this.controls.color = Math.random() * 360;
    }

    ctx.save();
    ctx.clearRect(0, 0, this.width, this.height);

    const particleslocales = this.particles;
    const dropslocales = this.drops;
    const tau = Math.PI * 2;

    for (
      let i = 0, particlesactives;
      (particlesactives = particleslocales[i]);
      i++
    ) {
      ctx.globalAlpha = particlesactives.alpha;
      ctx.fillStyle = particlesactives.color;
      ctx.fillRect(
        particlesactives.X,
        particlesactives.Y,
        particlesactives.speedY / 4,
        particlesactives.speedY
      );
    }

    for (let i = 0, dropsactives; (dropsactives = dropslocales[i]); i++) {
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

  update() {
    const particleslocales = this.particles;
    const dropslocales = this.drops;

    for (
      let i = 0, particlesactives;
      (particlesactives = particleslocales[i]);
      i++
    ) {
      particlesactives.X += particlesactives.speedX;
      particlesactives.Y += particlesactives.speedY + 5;
      if (particlesactives.Y > this.height - 15) {
        particleslocales.splice(i--, 1);
        this.explosion(
          particlesactives.X,
          particlesactives.Y,
          particlesactives.color
        );
      }
    }

    for (let i = 0, dropsactives; (dropsactives = dropslocales[i]); i++) {
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

    let i = this.controls.rain;
    while (i--) {
      this.buildRainParticle(Math.floor(Math.random() * this.width), -15);
    }
  }

  stopAnimation() {
    this.requestAnimFrame = function () {};
  }
}

export const rain = {
  id: "dubplus-rain",
  label: "dubplus-rain.label",
  description: "dubplus-rain.description",
  category: "General",
  turnOn() {
    this.rainEffect = new RainEffect();
    this.rainEffect.start();
  },
  turnOff() {
    this.rainEffect.stop();
    delete this.rainEffect;
  },
};
