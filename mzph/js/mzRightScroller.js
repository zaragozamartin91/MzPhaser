$(document).ready(function() {
	WORLD_SIZE = {
		x: 2000,
		y: 1000
	};
	GAME_SIZE = {
		x: $(window).width() * 0.6,
		y: $(window).height() * 0.6
	};
	PLAYER_VELOCITY = {
		x: 200,
		y: 0
	};
	TILE_VELOCITY = {
		x: 1,
		y: 0
	};

	game = mzph().newGame(GAME_SIZE.x, GAME_SIZE.y, 'game');

	var PhaserGame = function() {
		this.player = {};
		this.platforms = {};
		this.sky = {};

		this.player.facing = 'left';
		this.edgeTimer = 0; //cuenta limite de tiempo para saltar despues de caer del eje
		this.jumpTimer = 0;

		this.player.wasStanding = false;
		this.cursors = null;
	};

	PhaserGame.prototype.init = function() {
		console.log("running init");

		mzph().setRenderSessionRoundPixels();
		mzph().resizeWorld(WORLD_SIZE.x, WORLD_SIZE.y);
		mzph().startArcadePhysicsSystem();
		mzph().setPhysicsArcadeGravityY(750);

		mzph().disableSkipQuadTree();
	};

	PhaserGame.prototype.preload = function() {
		console.log("running preload");

		mzph().setCrossOriginLoadAnonymous();

		mzph().loadImage('trees', 'assets/treesBig.png');
		mzph().loadImage('clouds', 'assets/cloudsBig.png');
		mzph().loadImage('platform', 'assets/platform.png');
		mzph().loadImage('ice-platform', 'assets/ice-platform.png');
		mzph().loadSpritesheet('dude', 'assets/zero_z1standardframes.gif', 44, 47);
		mzph().loadSpritesheet('littleYellowEnemy', 'assets/littleYellow.png', 40, 24);
	};

	PhaserGame.prototype.createEnemies = function() {
		this.littleYellowEnemies = mzph().addPhysicsGroup();
		var enemyArray = [];

		enemyArray.push(mzph(this.littleYellowEnemies).createInGroup(0, 200 - 50, 'littleYellowEnemy'));
		enemyArray.push(mzph(this.littleYellowEnemies).createInGroup(300, 500 - 50, 'littleYellowEnemy'));
		enemyArray.push(mzph(this.littleYellowEnemies).createInGroup(600, 400 - 50, 'littleYellowEnemy'));
		enemyArray.push(mzph(this.littleYellowEnemies).createInGroup(700, 250 - 50, 'littleYellowEnemy'));

		enemyArray.forEach(function(enemy) {
			mzph(enemy).resizeBody(0.9);
			mzph(enemy).addAnimation('idleRight', [5], 5, false);
			mzph(enemy).addAnimation('idleLeft', [0], 5, false);
			mzph(enemy).addAnimation('runLeft', [3, 4], 7, true);
			mzph(enemy).addAnimation('runRight', [1, 2], 7, true);
		});
	};

	PhaserGame.prototype.createPlatforms = function() {
		this.platforms = mzph().addPhysicsGroup();
		//CREAMOS LAS PLATAFORMAS DE PRUEBA
		mzph(this.platforms).createInGroup(0, 200, 'platform');
		mzph(this.platforms).createInGroup(300, 500, 'platform');
		mzph(this.platforms).createInGroup(600, 400, 'platform');
		mzph(this.platforms).createInGroup(700, 250, 'platform');
		//FIN DE PLATAFORMAS DE PRUEBA
		mzph(this.platforms).setAllowGravityToAll(false);
		mzph(this.platforms).setImmovableToAll(true);
		mzph(this.platforms).setAllowGravityToAll(false);
		mzph(this.platforms).setImmovableToAll(true);
	};

	PhaserGame.prototype.createPlayer = function() {
		this.player = mzph().addSprite(0, 0, 'dude');
		mzph(this.player).enableArcadePhysicsOn();
		mzph(this.player.body).setBodyCollideWorldBounds();
		// mzph(this.player).setBodySize(39, 42);
		mzph(this.player).resizeBody(0.8);
		mzph(this.player).addAnimation('idleRight', [0, 1, 2, 3, 4, 5, 6], 5, true);
		mzph(this.player).addAnimation('idleLeft', [58, 57, 56, 55, 54, 53, 52], 5, true);
		mzph(this.player).addAnimation('runLeft', [77, 76, 75, 74, 73, 72, 71, 70, 69], 10, true);
		mzph(this.player).addAnimation('runRight', [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], 10, true);
		mzph(this.player).addAnimation('jumpLeft', [90, 89, 88, 87, 86, 85, 84, 83, 82, 81, 80, 79], 5, false);
		mzph(this.player).addAnimation('jumpRight', [26, 27, 28, 29, 30, 31, 32, 33, 34, 35], 5, false);

		mzph(this.player).cameraFollow();
	};

	PhaserGame.prototype.createBackground = function() {
		mzph().setStageBackgroundColor('#2f9acc');
		this.sky = mzph().addTileSprite(0, 0, 640, 480, 'clouds');
		mzph(this.sky).setFixedToCamera();
		this.trees = mzph().addTileSprite(0, 200, 2000, 1000, 'trees');
	};

	PhaserGame.prototype.create = function() {
		console.log("running create");

		this.createBackground();

		this.createPlatforms();

		this.createEnemies();

		this.createPlayer();

		mzph().createCursorKeys();
	};


	PhaserGame.prototype.movePlayer = function() {
		//  Do this AFTER the collide check, or we won't have blocked/touching set
		this.player.standing = mzph(this.player).isStanding();

		mzph(this.player).setVelocityX(0);
		if (mzph().leftIsDown()) {
			mzph(this.player).augmentVelocityX(-PLAYER_VELOCITY.x);

			if (this.player.standing) {
				mzph(this.player).playAnimation('runLeft');
			} else {
				mzph(this.player).playAnimation('jumpLeft');
			}

			this.player.facing = 'left';

			// con esto desplazamos el fondo de los arboles 
			mzph(this.trees).augmentTilePositionX(TILE_VELOCITY.x);
		} else if (mzph().rightIsDown()) {
			mzph(this.player).setVelocityX(PLAYER_VELOCITY.x);

			if (this.player.standing) {
				mzph(this.player).playAnimation('runRight');
			} else {
				mzph(this.player).playAnimation('jumpRight');
			}

			this.player.facing = 'right';

			// con esto desplazamos el fondo de los arboles 
			mzph(this.trees).reduceTilePositionX(TILE_VELOCITY.x);
		} else {
			// if no key is being pressed

			if (this.player.facing === 'left') {
				if (this.player.standing) {
					mzph(this.player).playAnimation('idleLeft');
				} else {
					mzph(this.player).playAnimation('jumpLeft');
				}
			} else {
				if (this.player.standing) {
					mzph(this.player).playAnimation('idleRight');
				} else {
					mzph(this.player).playAnimation('jumpRight');
				}
			}
		}

		//  No longer this.player.standing on the edge, but were
		//  Give them a 250ms grace period to jump after falling
		if (!this.player.standing && this.player.wasStanding) {
			this.edgeTimer = mzph().getGameTimeTime() + 250;
		}

		if (mzph().upIsDown()) {
			//  Allowed to jump?
			if ((this.player.standing || mzph().getGameTimeTime() <= this.edgeTimer) && this.jumpTimer < mzph().getGameTimeTime()) {
				mzph(this.player).setVelocityY(-500);
				this.jumpTimer = mzph().getGameTimeTime() + 750;
			}
		}

		this.player.wasStanding = this.player.standing;

	};


	PhaserGame.prototype.update = function() {
		mzph().arcadeCollide(this.player, this.platforms);

		mzph().arcadeCollide(this.littleYellowEnemies, this.platforms);

		this.movePlayer();
	};

	mzph().addGameState('game', PhaserGame, true);
});