(function() {
	game = mzph().newGame(640, 480, 'game');

	var PhaserGame = function() {
		this.player = null;
		this.platforms = null;
		this.sky = null;

		this.facing = 'left';
		this.edgeTimer = 0;
		this.jumpTimer = 0;

		this.wasStanding = false;
		this.cursors = null;
	};

	PhaserGame.prototype.init = function() {
		console.log("running init");

		mzph().setRenderSessionRoundPixels();
		mzph().resizeWorld(640, 2000);
		mzph().startArcadePhysicsSystem();
		mzph().setPhysicsArcadeGravityY(750);

		mzph().setSkipQuadTree(false);
	};

	PhaserGame.prototype.preload = function() {
		console.log("running preload");

		mzph().setCrossOriginLoadAnonymous();

		mzph().loadImage('trees', 'assets/trees.png');
		mzph().loadImage('clouds', 'assets/clouds.png');
		mzph().loadImage('platform', 'assets/platform.png');
		mzph().loadImage('ice-platform', 'assets/ice-platform.png');
		mzph().loadSpritesheet('dude', 'assets/dude.png', 32, 48);
	};

	PhaserGame.prototype.create = function() {
		console.log("running create");

		mzph().setStageBackgroundColor('#2f9acc');

		this.sky = mzph().addTileSprite(0, 0, 640, 480, 'clouds');

		mzph(this.sky).setFixedToCamera();

		mzph().addSprite('trees');

		this.platforms = mzph().addPhysicsGroup();

		var platformInitY = 64;
		var platformCount = 19;
		var platformXSpacing = 200;
		var platformYSpacing = 104;

		var x = 0;
		var y = platformInitY;

		for (var i = 0; i < platformCount; i++) {
			var type = i % 2 === 1 ? 'platform' : 'ice-platform';
			var platform = mzph(this.platforms).createInGroup(x, y, type);

			//  Set a random speed between 50 and 200
			mzph(platform).setVelocityX(mzph().randomBetween(100, 150));

			//  Inverse it?
			if (Math.random() > 0.5) {
				mzph(platform).invertVelocityX();
			}

			x += platformXSpacing;

			if (x >= 600) {
				x = 0;
			}

			y += platformYSpacing;
		}

		mzph(this.platforms).setAllowGravityToAll(false);
		mzph(this.platforms).setImmovableToAll(true);

		// this.player = this.add.sprite(320, 1952, 'dude');
		this.player = mzph().addSprite(320, 1952, 'dude');

		mzph(this.player).enableArcadePhysicsOn();

		// this.player.body.collideWorldBounds = true;
		mzph(this.player.body).setBodyCollideWorldBounds();
		mzph(this.player).setBodySize(20, 32, 5, 16);

		mzph(this.player).addAnimation('left', [0, 1, 2, 3], 10, true);
		mzph(this.player).addAnimation('turn', [4], 20, true);
		mzph(this.player).addAnimation('right', [5, 6, 7, 8], 10, true);

		// this.camera.follow(this.player);
		mzph(this.player).cameraFollow();

		this.cursors = mzph().createCursorKeys();
	};

	PhaserGame.prototype.wrapPlatform = function(platform) {
		// se resetea la posicion de la plataforma si es necesario

		if (mzph(platform).getVelocityX() < 0 && platform.x <= -160) {
			platform.x = 640;
		} else if (mzph(platform).getVelocityX() > 0 && platform.x >= 640) {
			platform.x = -160;
		}

	};

	PhaserGame.prototype.setFriction = function(player, platform) {
		if (platform.key === 'ice-platform') {
			// player.body.x -= platform.body.x - platform.body.prev.x;
			mzph(player).augmentBodyX( - (mzph(platform).getBodyX() - mzph(platform).getPrevBodyX()));
		}
	};

	PhaserGame.prototype.update = function() {
		// this.sky.tilePosition.y = -(mzph().getCameraY() * 0.7);

		this.platforms.forEach(this.wrapPlatform, this);

		mzph().arcadeCollide(this.player, this.platforms, this.setFriction, null, this);

		//  Do this AFTER the collide check, or we won't have blocked/touching set
		var standing = mzph( this.player ).isStanding();

		mzph(this.player).setVelocityX(0);

		if ( mzph().leftIsDown() ) {
			mzph(this.player).augmentVelocityX(-200);

			if (this.facing !== 'left') {
				mzph(this.player).playAnimation('left');
				this.facing = 'left';
			}
		} else if ( mzph().rightIsDown() ) {
			mzph(this.player).setVelocityX(200);

			if (this.facing !== 'right') {
				mzph(this.player).playAnimation('right');
				this.facing = 'right';
			}
		} else {
			if (this.facing !== 'idle') {
				mzph(this.player).stopAnimation();

				if (this.facing === 'left') {
					mzph(this.player).frameAnimation(0);
				} else {
					mzph(this.player).frameAnimation(5);
				}

				this.facing = 'idle';
			}
		}

		//  No longer standing on the edge, but were
		//  Give them a 250ms grace period to jump after falling
		if (!standing && this.wasStanding) {
			this.edgeTimer = this.time.time + 250;
		}

		//  Allowed to jump?
		if ((standing || this.time.time <= this.edgeTimer) && this.cursors.up.isDown && this.time.time > this.jumpTimer) {
			mzph(this.player).setVelocityY(-500);
			this.jumpTimer = mzph().getGameTimeTime() + 750;
		}

		this.wasStanding = standing;

		var playerPos = {
			x: this.player.x,
			y: this.player.y
		};
		var playerBodyPos = {
			x: this.player.body.x,
			y: this.player.body.y
		};
		console.log("player pos=" + playerPos.x + " , body pos=" + playerBodyPos.x);
	};

	mzph().addGameState('game', PhaserGame, true);
})();