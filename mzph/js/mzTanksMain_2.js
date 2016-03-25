(function() {
	var screenWidth = 640;
	var screenHeight = 480;

	// SI O SI O SI O SI USAR MODO CANVAS
	var game = new Phaser.Game(screenWidth, screenHeight, Phaser.CANVAS, 'game');

	var PhaserGame = {
		worldBounds: {
			w: 992,
			h: 480
		},
		gravity: {
			x: 0,
			y: 200
		},

		power: 300,
		minPower: 100,
		maxPower: 600,
		groundLimit: 420,
		powerDiff: 2,
		minAngle: -90,
		maxAngle: 0,
		angleDiff: 1,

		init: function() {
			console.log('running init...');
			game.renderer.renderSession.roundPixels = true;
			game.world.setBounds(0, 0, this.worldBounds.w, this.worldBounds.h);
			game.physics.startSystem(Phaser.Physics.ARCADE);
			game.physics.arcade.gravity.y = this.gravity.y;
		},

		preload: function() {
			this.load.crossOrigin = 'anonymous';

			game.load.image('tank', 'assets/tank.png');
			game.load.image('turret', 'assets/turret.png');
			game.load.image('bullet', 'assets/bullet.png');
			game.load.image('background', 'assets/background.png');
			game.load.image('flame', 'assets/flame.png');
			game.load.image('target', 'assets/target.png');

			game.load.image('land', 'assets/land.png');
		},

		create: function() {
			this.background = game.add.sprite(0, 0, 'background');

			// group(parent, name, addToStage, enableBody, physicsBodyType)
			this.targets = game.add.group(game.world, 'targets', false, true, Phaser.Physics.ARCADE);

			this.targets.create(284, 378, 'target');
			this.targets.create(456, 153, 'target');
			this.targets.create(545, 305, 'target');
			this.targets.create(726, 391, 'target');
			this.targets.create(972, 74, 'target');

			// para cada elemento del grupo seteo un mismo de valor de propiedad de gravedad
			this.targets.setAll('body.allowGravity', false);

			// bitmapData(width, height, key, addToCache)
			// Create a BitmapData object
			this.land = game.add.bitmapData(992, 480);
			// hacemos que el mapa escanee / dibuje la imagen 'land'
			this.land.draw('land');
			// After we've drawn the PNG to the BitmapData we have to update it. This is because we need to access its
			//  pixel data during the game
			this.land.update();
			this.land.addToWorld();

			// emitter(x, y, maxParticles)
			this.emitter = game.add.emitter(0, 0, 30);
			this.emitter.makeParticles('flame');
			// When the particles emit they'll pick a random x velocity between -120 and 120, 
			// and a vertical one between -100 and -200
			this.emitter.setXSpeed(-120, 120);
			this.emitter.setYSpeed(-100, 300);
			// Rotation is disabled by calling setRotation with no parameters
			this.emitter.setRotation();

			// se crea una bala que sera disparada por el tanque
			this.bullet = game.add.sprite(0, 0, 'bullet');
			this.bullet.exists = false;
			game.physics.arcade.enable(this.bullet);

			//  se agrega el tanque y la torreta
			this.tank = game.add.sprite(24, 383, 'tank');
			//  The turret which we rotate (offset 30x14 from the tank)
			this.turret = game.add.sprite(this.tank.x + 30, this.tank.y + 14, 'turret');
			// establecemos que el angulo inicial de la torre es cero (mirando hacia la derecha)
			this.turret.angle = 0;

			// se agrega el sprite de fuego para mostrar un disparo
			this.flame = game.add.sprite(0, 0, 'flame');
			this.flame.anchor.set(0.5);
			this.flame.visible = false;

			// se indica el poder utilizado para disparar...
			this.powerText = this.add.text(8, 8, 'Power: 300', {
				font: "18px Arial",
				fill: "#ffffff"
			});
			this.powerText.setShadow(1, 1, "rgba(0, 0, 0, 0.8)", 1);
			// el texto no se movera de lugar
			this.powerText.fixedToCamera = true;

			// creamos el control de teclas de flechas y agregamos la tecla de disparo
			this.cursors = game.input.keyboard.createCursorKeys();
			this.fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
			this.fireButton.onDown.add(this.fire, this);
		},

		fire: function() {
			console.log("firing!");

			if (this.bullet.exists) {
				return;
			}

			// Reposicionamos la bala a su punto original
			this.bullet.reset(this.turret.x, this.turret.y);
			var p = new Phaser.Point(this.turret.x, this.turret.y);
			// rotate(x, y, angle, asDegrees, distance)
			p.rotate(p.x, p.y, this.turret.rotation, false, 34);

			//  hacemos aparecer la flama de disparo...
			this.flame.x = p.x;
			this.flame.y = p.y;
			this.flame.alpha = 1;
			this.flame.visible = true;


			// A Tween allows you to alter one or more properties of a target object over a defined period of time. This can be used for things such as 
			// alpha fading Sprites, scaling them or motion. Use Tween.to or Tween.from to set-up the tween values.
			// 
			// to(properties, duration, ease, autoStart, delay, repeat, yoyo)
			game.add.tween(this.flame).to({
				alpha: 0
			}, 300, "Linear", true);

			// la camara perseguira a la bala
			game.camera.follow(this.bullet);

			// velocityFromRotation(rotation, speed, point)
			// Given the rotation (in radians) and speed calculate the velocity and return it as a Point object, or set it to the given point object
			// rotation es una propiedad de Phaser.Sprite: 'The rotation of the object in radians'
			game.physics.arcade.velocityFromRotation(this.turret.rotation, this.power, this.bullet.body.velocity);
		},

		hitTarget: function(bullet, target) {
			// Change the emitters center to match the center of any object with a center property
			this.emitter.at(target);
			// explode(lifespan, quantity)
			this.emitter.explode(2000, 10);

			target.kill();
			this.removeBullet(true);
		},

		removeBullet: function(hasExploded) {
			this.bullet.kill();
			// reseteamos la camara de forma gradual
			game.camera.follow();

			var delay = 1000;
			if (hasExploded) {
				delay = 2000;
				console.log("has exploded!");
			}

			// to(properties, duration, ease, autoStart, delay, repeat, yoyo)
			game.add.tween(this.camera).to({
				x: 0
			}, 1000, "Quint", true, 1000);
		},

		update: function() {
			if (this.bullet.exists) {
				// verificamos si la bala esta en superposicion con los objetivos
				game.physics.arcade.overlap(this.bullet, this.targets, this.hitTarget, null, this);

				// verificamos si la bala se fue de la pantalla o si choco con el suelo...
				this.bulletVsLand();
			} else {
				if (this.cursors.left.isDown && this.power > this.minPower) {
					this.power -= this.powerDiff;
				} else if (this.cursors.right.isDown && this.power < this.maxPower) {
					this.power += this.powerDiff;
				}

				if (this.cursors.up.isDown && this.turret.angle > -90) {
					this.turret.angle -= this.angleDiff;
				} else if (this.cursors.down.isDown && this.turret.angle < 0) {
					this.turret.angle += this.angleDiff;
				}
			}

			this.powerText.text = "Power: " + this.power;
		},

		bulletVsLand: function() {

			//  Simple bounds check
			if (this.bullet.x < 0 || this.bullet.x > this.game.world.width || this.bullet.y > this.game.height) {
				this.removeBullet();
				return;
			}

			var x = Math.floor(this.bullet.x);
			var y = Math.floor(this.bullet.y);
			var rgba = this.land.getPixel(x, y);

			if (rgba.a > 0) {
				this.land.blendDestinationOut();
				this.land.circle(x, y, 16, 'rgba(0, 0, 0, 255');
				this.land.blendReset();
				this.land.update();

				//  If you like you could combine the above 4 lines:
				// this.land.blendDestinationOut().circle(x, y, 16, 'rgba(0, 0, 0, 255').blendReset().update();

				this.removeBullet();
			}



		}
	};


	game.state.add('Game', PhaserGame, true);
})();