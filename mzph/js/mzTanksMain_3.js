(function() {
	var screenWidth = 640;
	var screenHeight = 480;

	// SI O SI O SI O SI USAR MODO CANVAS
	// var game = new Phaser.Game(screenWidth, screenHeight, Phaser.CANVAS, 'game');
	var game = mzph().newGame(screenWidth, screenHeight, 'game');

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
			mzph().setRenderSessionRoundPixels();
			mzph().setWorldBounds(0, 0, this.worldBounds.w, this.worldBounds.h);
			mzph().startPhysicsSystem();
			mzph().setPhysicsArcadeGravityY(this.gravity.y);
		},

		preload: function() {
			mzph().setCrossOriginLoadAnonymous();

			mzph().loadImage('tank', 'assets/tank.png');
			mzph().loadImage('turret', 'assets/turret.png');
			mzph().loadImage('bullet', 'assets/bullet.png');
			mzph().loadImage('background', 'assets/background.png');
			mzph().loadImage('flame', 'assets/flame.png');
			mzph().loadImage('target', 'assets/target.png');

			mzph().loadImage('land', 'assets/land.png');
		},

		create: function() {
			this.background = mzph().addSprite(0, 0, 'background');

			// group(parent, name, addToStage, enableBody, physicsBodyType)
			this.targets = mzph().addGroup(game.world, 'targets', false, true, Phaser.Physics.ARCADE);

			mzph(this.targets).createInGroup(284, 378, 'target');
			mzph(this.targets).createInGroup(456, 153, 'target');
			mzph(this.targets).createInGroup(545, 305, 'target');
			mzph(this.targets).createInGroup(726, 391, 'target');
			mzph(this.targets).createInGroup(972, 74, 'target');

			// para cada elemento del grupo seteo un mismo de valor de propiedad de gravedad
			mzph(this.targets).setPropertyToAllInGroup('body.allowGravity', false);

			// bitmapData(width, height, key, addToCache)
			// Create a BitmapData object
			this.land = mzph().addBitmapData(992, 480);
			// hacemos que el mapa escanee / dibuje la imagen 'land'
			mzph(this.land).drawOnBitmap('land');
			// After we've drawn the PNG to the BitmapData we have to update it. This is because we need to access its
			//  pixel data during the game
			mzph(this.land).updateBitmap();
			mzph(this.land).addBitmapToWorld();

			// emitter(x, y, maxParticles)
			this.emitter = mzph().addEmitter(0, 0, 30);
			mzph(this.emitter).makeEmitterParticles('flame');
			// When the particles emit they'll pick a random x velocity between -120 and 120, 
			// and a vertical one between -100 and -200
			mzph(this.emitter).setXSpeed(-120, 120);
			mzph(this.emitter).setYSpeed(-100, 300);
			// Rotation is disabled by calling setRotation with no parameters
			mzph(this.emitter).setRotation();

			// se crea una bala que sera disparada por el tanque
			this.bullet = mzph().addSprite(0, 0, 'bullet');
			this.bullet.exists = false;
			mzph().enableArcadePhysicsOn(this.bullet);

			//  se agrega el tanque y la torreta
			this.tank = mzph().addSprite(24, 383, 'tank');
			//  The turret which we rotate (offset 30x14 from the tank)
			this.turret = mzph().addSprite(this.tank.x + 30, this.tank.y + 14, 'turret');
			// establecemos que el angulo inicial de la torre es cero (mirando hacia la derecha)
			this.turret.angle = 0;

			// se agrega el sprite de fuego para mostrar un disparo
			this.flame = mzph().addSprite(0, 0, 'flame');
			mzph(this.flame).setAnchor(0.5);
			mzph(this.flame).setInvisible();

			// se indica el poder utilizado para disparar...
			this.powerText = mzph().addText(8, 8, 'Power: 300', {
				font: "18px Arial",
				fill: "#ffffff"
			});
			mzph(this.powerText).setShadow(1, 1, "rgba(0, 0, 0, 0.8)", 1);
			// el texto no se movera de lugar
			mzph(this.powerText).setFixedToCamera();

			// creamos el control de teclas de flechas y agregamos la tecla de disparo
			this.cursors = mzph().createCursorKeys();
			this.fireButton = mzph().addKey(Phaser.Keyboard.SPACEBAR);
			mzph(this.fireButton).onKeyDownAddListener(this.fire, this);
		},

		fire: function() {
			console.log("firing!");

			if (this.bullet.exists) {
				return;
			}

			// Reposicionamos la bala a su punto original
			mzph(this.bullet).resetSprite( this.turret.x, this.turret.y);
			var p = mzph().newPoint(this.turret.x, this.turret.y);
			// rotate(x, y, angle, asDegrees, distance)
			mzph(p).rotatePoint(p.x, p.y, this.turret.rotation, false, 34);

			//  hacemos aparecer la flama de disparo...
			mzph(this.flame).setSpritePosX(p.x);
			mzph(this.flame).setSpritePosY(p.y);
			mzph(this.flame).setSpriteAlpha(1);
			mzph(this.flame).setVisible();


			// A Tween allows you to alter one or more properties of a target object over a defined period of time. This can be used for things such as 
			// alpha fading Sprites, scaling them or motion. Use Tween.to or Tween.from to set-up the tween values.
			// 
			// to(properties, duration, ease, autoStart, delay, repeat, yoyo)
			// game.add.tween(this.flame).to({
			// 	alpha: 0
			// }, 300, "Linear", true);

			mzph(this.flame).addTweenTo({
				alpha: 0
			}, 300, "Linear", true);

			// la camara perseguira a la bala
			mzph(this.bullet).cameraFollow();

			// velocityFromRotation(rotation, speed, point)
			// Given the rotation (in radians) and speed calculate the velocity and return it as a Point object, or set it to the given point object
			// rotation es una propiedad de Phaser.Sprite: 'The rotation of the object in radians'
			// game.physics.arcade.velocityFromRotation(this.turret.rotation, this.power, this.bullet.body.velocity);
			mzph(this.bullet).arcadeVelocityFromRotation(mzph(this.turret).getSpriteRotation(), this.power);
		},

		hitTarget: function(bullet, target) {
			// Change the emitters center to match the center of any object with a center property
			mzph(this.emitter).emitterAt(target);
			// explode(lifespan, quantity)
			mzph(this.emitter).explode(2000, 10);

			mzph(target).kill();
			this.removeBullet(true);
		},

		removeBullet: function(hasExploded) {
			mzph(this.bullet).kill();
			// reseteamos la camara de forma gradual

			mzph().cameraNotFollowAnything();

			var delay = 1000;
			if (hasExploded) {
				delay = 2000;
				console.log("has exploded!");
			}

			mzph(this.camera).addTweenTo({
				x: 0
			}, 1000, "Quint", true, 1000);
		},

		update: function() {
			if (this.bullet.exists) {
				// verificamos si la bala esta en superposicion con los objetivos
				mzph(this.bullet).overlap(this.targets, this.hitTarget, null, this);

				// verificamos si la bala se fue de la pantalla o si choco con el suelo...
				this.bulletVsLand();
			} else {
				if (mzph().leftIsDown() && this.power > this.minPower) {
					this.power -= this.powerDiff;
				} else if (mzph().rightIsDown() && this.power < this.maxPower) {
					this.power += this.powerDiff;
				}

				if (mzph().upIsDown() && this.turret.angle > -90) {
					// this.turret.angle -= this.angleDiff;
					mzph(this.turret).augmentAngle(-this.angleDiff);
				} else if (mzph().downIsDown() && this.turret.angle < 0) {
					mzph(this.turret).augmentAngle(this.angleDiff);
				}
			}

			this.powerText.text = "Power: " + this.power;
		},

		bulletVsLand: function() {

			//  Simple bounds check
			if (this.bullet.x < 0 || this.bullet.x > mzph().getWorldWidth() || this.bullet.y > mzph().getGameHeight()) {
				this.removeBullet();
				return;
			}

			var x = Math.floor(this.bullet.x);
			var y = Math.floor(this.bullet.y);
			var rgba = mzph(this.land).getBitmapPixel(x, y);

			if (rgba.a > 0) {
				this.land.blendDestinationOut();
				mzph(this.land).circleBitmap(x, y, 16, 'rgba(0, 0, 0, 255');
				this.land.blendReset();
				this.land.update();

				//  If you like you could combine the above 4 lines:
				// this.land.blendDestinationOut().circle(x, y, 16, 'rgba(0, 0, 0, 255').blendReset().update();

				this.removeBullet();
			}



		}
	};


	mzph().addGameState('Game', PhaserGame, true);
})();