$(document).ready(function() {
	WORLD_SIZE = {
		x: 2000,
		y: 1000
	};
	GAME_SIZE = {
		x: 640,
		y: 480
	};
	TILE_VELOCITY = {
		x: 1,
		y: 0
	};
	GRAVITY = {
		x: 0,
		y: 750
	};
	LITTLE_YELLOW_ENEMY_VELOCITY = {
		x: 20,
		y: 0
	};

	PLAYER_JUMP_POWER = {
		x: 0,
		y: -500
	};
	PLAYER_VELOCITY = {
		x: 200,
		y: 0
	};
	PLAYER_RESET_SPOT = {
		x: 0,
		y: 0
	};
	PLAYER_DASH_INTERVAL = 500;
	PLAYER_EDGE_JUMP_TIME_INTERVAL = 250;
	PLAYER_JUMP_TIME_INTERVAL = 750;
	PLAYER_DASH_TIME = 400;
	PLAYER_DASH_VELOCITY = {
		x: PLAYER_VELOCITY.x * 1.5,
		y: PLAYER_VELOCITY.y * 3
	};

	game = mzph().newGame(GAME_SIZE.x, GAME_SIZE.y, 'game');

	var PhaserGame = function() {
		this.player = {};
		this.platformGroup = {};

		this.littleYellowEnemyGroup = {}; // grupo de enemigos amarillos
		this.invisibleEdgeGroup = {}; // borde invisible de plataformas para que los enemigos no se caigan

		this.sky = {};

		this.edgeTimer = 0; //cuenta limite de tiempo para saltar despues de caer del eje
		this.jumpTimer = 0; //cuenta el limite de tiempo hasta que el jugador pueda saltar nuevamente

		this.player.facing = 'left';
		this.player.wasStanding = false;
		this.updateCycle = 0;
	};

	PhaserGame.prototype.init = function() {
		console.log("running init");

		mzph().setRenderSessionRoundPixels();
		mzph().resizeWorld(WORLD_SIZE.x, WORLD_SIZE.y);
		mzph().startArcadePhysicsSystem();
		mzph().setPhysicsArcadeGravityY(GRAVITY.y);

		mzph().disableSkipQuadTree();
	};

	PhaserGame.prototype.preload = function() {
		console.log("running preload");

		mzph().setCrossOriginLoadAnonymous();

		mzph().loadImage('target', 'assets/target.png');
		mzph().loadImage('trees', 'assets/treesMedium.png');
		mzph().loadImage('clouds', 'assets/cloudsBig.png');
		mzph().loadImage('platform', 'assets/platform.png');
		mzph().loadImage('ice-platform', 'assets/ice-platform.png');

		// mzph().loadSpritesheet('dude', 'assets/zero_z1standardframes.gif', 44, 47); CREACION DE ZERO
		// mzph().loadSpritesheet('dude', 'assets/megamanOldSimple.png', 36, 36, 112); // CREACION DE MEGAMAN
		mzph().loadSpritesheet('dude', 'assets/megamanOldGrid.png', 39, 39, 18 * 11);

		mzph().loadSpritesheet('littleYellowEnemy', 'assets/littleYellow.png', 40, 24);

		mzph().loadSpritesheet('dudeExplosion', 'assets/megamanExplosionGrid.png', 79, 80);
	};

	PhaserGame.prototype.createEnemies = function() {
		console.log("Creating enemies...");

		this.littleYellowEnemyGroup = mzph().addPhysicsGroup();
		var littleYellowEnemyGroup = this.littleYellowEnemyGroup;

		this.invisibleEdgeGroup = mzph().addPhysicsGroup();
		var invisibleEdgeGroup = this.invisibleEdgeGroup;

		var i = 0;
		this.platformGroup.children.forEach(function(platform) {
			if (i > 0) {
				var platformWidth = mzph(platform).getBodyWidth();
				var platformHeight = mzph(platform).getBodyHeight();
				var posX = mzph(platform).getBodyX();
				var posY = mzph(platform).getBodyY();

				mzph(littleYellowEnemyGroup).createInGroup(posX + platformWidth * 0.45, posY - 50, 'littleYellowEnemy');
				mzph(invisibleEdgeGroup).createInGroup(posX - 10, posY - platformHeight);
				mzph(invisibleEdgeGroup).createInGroup(posX + platformWidth - 10, posY - platformHeight);
			}

			i++;
		});


		this.littleYellowEnemyGroup.forEach(function(enemy) {
			mzph(enemy).setAnchor(0.5, 0.5);
			mzph(enemy).resizeBodyWidth(0.5);
		});

		mzph(invisibleEdgeGroup).setAllowGravityToAll(false);
		mzph(invisibleEdgeGroup).setImmovableToAll(true);


		this.littleYellowEnemyGroup.children.forEach(function(enemy) {
			mzph(enemy).resizeBody(0.9);
			mzph(enemy).addAnimation('idleRight', [5], 5, false);
			mzph(enemy).addAnimation('idleLeft', [0], 5, false);
			mzph(enemy).addAnimation('runRight', [3, 4], 7, true);
			mzph(enemy).addAnimation('runLeft', [1, 2], 7, true);
			// VER DE AGREGAR OBJETOS INVISIBLES EN LAS PLATAFORMAS QUE PUEDAN COLISIONAR CON LOS ENEMIGOS PERO NO CON  EL JUGADOR PARA QUE LOS ENEMIGOS CAMINEN DE UN LADO A OTRO

			mzph(enemy).playAnimation('runRight');
			mzph(enemy).setVelocityX(LITTLE_YELLOW_ENEMY_VELOCITY.x);
			enemy.facing = 'right';
		});

	};

	PhaserGame.prototype.createPlatforms = function() {
		this.platformGroup = mzph().addPhysicsGroup();
		//CREAMOS LAS PLATAFORMAS DE PRUEBA
		mzph(this.platformGroup).createInGroup(0, 200, 'platform');
		mzph(this.platformGroup).createInGroup(300, 400, 'platform');
		mzph(this.platformGroup).createInGroup(600, 500, 'platform');
		mzph(this.platformGroup).createInGroup(700, 250, 'platform');
		//FIN DE PLATAFORMAS DE PRUEBA
		mzph(this.platformGroup).setAllowGravityToAll(false);
		mzph(this.platformGroup).setImmovableToAll(true);
	};

	PhaserGame.prototype.createPlayerMegaman = function() {
		this.player = mzph().addSprite(0, 0, 'dude');

		mzph(this.player).enableArcadePhysicsOn();
		mzph(this.player.body).setBodyCollideWorldBounds();
		mzph(this.player).resizeBody(0.95);
		mzph(this.player).addAnimation('idleLeft', [62, 61], 3, true);
		mzph(this.player).addAnimation('idleRight', [0, 1], 3, true);
		mzph(this.player).addAnimation('runRight', [7, 8, 9, 10], 8, true);
		mzph(this.player).addAnimation('runLeft', [69, 68, 67, 66], 8, true);
		mzph(this.player).addAnimation('jumpLeft', [65], 5, false);
		mzph(this.player).addAnimation('jumpRight', [11], 5, false);


		mzph(this.player).cameraFollow();
	};


	PhaserGame.prototype.createPlayerZero = function() {
		this.player = mzph().addSprite(0, 0, 'dude');
		mzph(this.player).enableArcadePhysicsOn();
		mzph(this.player.body).setBodyCollideWorldBounds();
		mzph(this.player).resizeBody(0.8);
		mzph(this.player).addAnimation('idleRight', [0, 1, 2, 3, 4, 5, 6], 5, true);
		mzph(this.player).addAnimation('idleLeft', [58, 57, 56, 55, 54, 53, 52], 5, true);
		mzph(this.player).addAnimation('runLeft', [77, 76, 75, 74, 73, 72, 71, 70, 69], 10, true);
		mzph(this.player).addAnimation('runRight', [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], 10, true);
		mzph(this.player).addAnimation('jumpLeft', [90, 89, 88, 87, 86, 85, 84, 83, 82, 81, 80, 79], 5, false);
		mzph(this.player).addAnimation('jumpRight', [26, 27, 28, 29, 30, 31, 32, 33, 34, 35], 5, false);

		mzph(this.player).cameraFollow();
	};

	PhaserGame.prototype.createPlayerMegamanComplex = function() {
		this.player = mzph().addSprite(0, 0, 'dude');

		mzph(this.player).enableArcadePhysicsOn();
		mzph(this.player.body).setBodyCollideWorldBounds();
		mzph(this.player).resizeBody(0.95);
		mzph(this.player).addAnimation('idleLeft', [120, 119, 118], 3, true);
		mzph(this.player).addAnimation('idleRight', [0, 1, 2], 3, true);
		mzph(this.player).addAnimation('runRight', [3, 4, 5, 6, 7, 8, 9], 8, true);
		mzph(this.player).addAnimation('runLeft', [117, 116, 115, 114, 113, 112, 111], 8, true);
		mzph(this.player).addAnimation('jumpLeft', [128, 127, 126, 125, 124], 5, false);
		mzph(this.player).addAnimation('jumpRight', [14, 15, 16, 17, 18], 5, false);
		mzph(this.player).addAnimation('dashRight', [22, 23, 24, 25, 26], 8, false);
		mzph(this.player).addAnimation('dashLeft', [142, 141, 140, 139, 138], 8, false);

		mzph(this.player).setAnchor(0.5, 0.5);
		mzph(this.player).resizeBody(0.6, 0.6);

		mzph(this.player).cameraFollow();
	};


	PhaserGame.prototype.createDudeExplosion = function(x, y) {
		this.dudeExplosion = mzph().addSprite(0, 0, 'dudeExplosion');
		mzph(this.dudeExplosion).addAnimation('explode', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]);
		mzph(this.dudeExplosion).addAnimation('notExplode', [17]);
		mzph(this.dudeExplosion).setInvisible();

		mzph(this.dudeExplosion).setAnchor(0.5, 0.5);
	};



	PhaserGame.prototype.createBackground = function() {
		mzph().setStageBackgroundColor('#2f9acc');
		this.sky = mzph().addTileSprite(0, 0, 800, 600, 'clouds');
		mzph(this.sky).setFixedToCamera();
		this.trees = mzph().addTileSprite(0, 100, 800, 600, 'trees');
		mzph(this.trees).setFixedToCamera();
	};

	PhaserGame.prototype.createGameStateText = function() {
		var stateText = game.add.text(game.centerX, game.centerY, 'Click sobre la pantalla \npara reiniciar ', {
			font: '50px Arial',
			fill: '#fff'
		});
		stateText.anchor.setTo(0, 0);
		stateText.visible = false;
		mzph(stateText).setFixedToCamera();
		this.stateText = stateText;
	};

	PhaserGame.prototype.createPlayerDash = function() {
		this.player.dash = {};
		this.player.dash.key = mzph().addSpacebarKey();
		this.player.dash.timer = mzph().getGameTimeTime();
		this.player.dash.now = false;
		mzph(this.player.dash.key).onKeyDownAddListener(this.triggerPlayerDash, this);
	};

	PhaserGame.prototype.create = function() {
		console.log("running create");

		this.createBackground();

		this.createPlatforms();

		this.createEnemies();

		this.createDudeExplosion();

		this.createPlayerMegamanComplex();

		mzph().createCursorKeys();

		this.createGameStateText();

		this.createPlayerDash();
	};

	PhaserGame.prototype.playerReadyToDash = function() {
		// si el tiempo de juego supera al timer limite de dash, se ejecuta la logica de dash...
		var playerJustDashedMidair = this.player.dash.midAir;
		return this.player.dash.timer < mzph().getGameTimeTime() && !playerJustDashedMidair;
	};

	PhaserGame.prototype.triggerPlayerDash = function() {
		// si el jugador esta dasheando, no se dispara el dash
		var playerIsDashingNow = this.player.dash.now;
		var playerIsMidair = !this.player.standing;

		if (playerIsDashingNow) {
			return;
		}

		if (this.playerReadyToDash()) {
			this.player.dash.now = true;

			if (playerIsMidair) {
				this.player.dash.midAir = true;
			}

			if (this.player.facing === 'left') {
				mzph(this.player).playAnimation('dashLeft');
				mzph(this.player).setVelocityX(-PLAYER_DASH_VELOCITY.x);
			}

			if (this.player.facing === 'right') {
				mzph(this.player).playAnimation('dashRight');
				mzph(this.player).setVelocityX(PLAYER_DASH_VELOCITY.x);
			}

			this.player.dash.remain = mzph().getGameTimeTime() + PLAYER_DASH_TIME; // tiempo de permanencia en estado de dash
			this.player.dash.timer = mzph().getGameTimeTime();
		}
	};

	PhaserGame.prototype.playerReadyToJump = function() {
		return (this.player.standing || mzph().getGameTimeTime() <= this.edgeTimer) && this.jumpTimer < mzph().getGameTimeTime();
	};

	PhaserGame.prototype.killPlayerDash = function() {
		console.log("KILLING DASH");
		this.player.dash.jumping = false;
		this.player.dash.midAir = false;
		this.player.dash.now = false;
	};

	PhaserGame.prototype.playerMove = function() {


		this.player.standing = mzph(this.player).isStanding();
		if (this.player.standing) {
			this.player.dash.midAir = false;
			this.player.dash.jumping = false;
		}

		var playerIsMidair = !this.player.standing;
		var playerDashing = this.player.dash.now;
		var playerNotDashing = !this.player.dash.now;
		var playerFacingLeft = this.player.facing === 'left';
		var playerFacingRight = this.player.facing === 'right';
		var playerDahsedAndJumped = this.player.dash.jumping;
		var playerStillX = mzph(this.player).getVelocityX() === 0;

		if (playerFacingLeft) {
			if (playerNotDashing) {
				if (playerIsMidair) {
					mzph(this.player).playAnimation('jumpLeft');
				} else {
					if (playerStillX) {
						mzph(this.player).playAnimation('idleLeft');
					} else {
						mzph(this.player).playAnimation('runLeft');
					}
				}
			}
		}

		if (playerFacingRight) {
			if (playerNotDashing) {
				if (playerIsMidair) {
					mzph(this.player).playAnimation('jumpRight');
				} else {
					if (playerStillX) {
						mzph(this.player).playAnimation('idleRight');
					} else {
						mzph(this.player).playAnimation('runRight');
					}
				}
			}
		}

		if (mzph().leftIsDown()) {
			if (playerNotDashing || playerFacingRight) {
				mzph(this.player).setVelocityX(-PLAYER_VELOCITY.x);
				this.player.facing = 'left';
				this.killPlayerDash();

			}

			// con esto desplazamos el fondo de los arboles 
			mzph(this.trees).augmentTilePositionX(TILE_VELOCITY.x);
		} else if (mzph().rightIsDown()) {
			if (playerNotDashing || playerFacingLeft) {
				mzph(this.player).setVelocityX(PLAYER_VELOCITY.x);
				this.player.facing = 'right';
				this.killPlayerDash();
			}


			// con esto desplazamos el fondo de los arboles 
			mzph(this.trees).reduceTilePositionX(TILE_VELOCITY.x);
		} else {
			// if no cursor is being pressed
			if (playerStillX || (playerNotDashing && !playerDahsedAndJumped)) {
				mzph(this.player).resetVelocityX();
				if (playerFacingLeft) {} else {}
			}
		}

		//  No longer this.player.standing on the edge, but were
		//  Give them a 250ms grace period to jump after falling
		var playerIsNotStandingButWasStandingBefore = !this.player.standing && this.player.wasStanding;
		if (playerIsNotStandingButWasStandingBefore) {
			this.edgeTimer = mzph().getGameTimeTime() + PLAYER_EDGE_JUMP_TIME_INTERVAL;
		}

		if (mzph().upIsDown()) {
			//  Allowed to jump?
			if (this.playerReadyToJump()) {
				mzph(this.player).setVelocityY(PLAYER_JUMP_POWER.y);
				this.jumpTimer = mzph().getGameTimeTime() + PLAYER_JUMP_TIME_INTERVAL;
				this.player.dash.jumping = true;
			}
		}

		this.player.wasStanding = this.player.standing;
	};


	PhaserGame.prototype.enemyRebound = function(enemy, edge) {
		if (enemy.facing === 'right') {
			mzph(enemy).setVelocityX(-LITTLE_YELLOW_ENEMY_VELOCITY.x);
			mzph(enemy).playAnimation('runLeft');
			enemy.facing = 'left';
			return;
		}

		if (enemy.facing === 'left') {
			mzph(enemy).setVelocityX(LITTLE_YELLOW_ENEMY_VELOCITY.x);
			mzph(enemy).playAnimation('runRight');
			enemy.facing = 'right';
			return;
		}
	};


	PhaserGame.prototype.restartPlayer = function() {
		mzph(this.player).reset(PLAYER_RESET_SPOT.x, PLAYER_RESET_SPOT.y);
		this.player.justRevived = true;
		mzph(this.stateText).setInvisible();
	};

	PhaserGame.prototype.playerDies = function() {
		//mzph().cameraNotFollowAnything();

		var posX = mzph(this.player).getBodyX();
		var posY = mzph(this.player).getBodyY();

		mzph(this.dudeExplosion).reset(posX, posY);
		mzph(this.dudeExplosion).playAnimation('explode', 30, false);

		this.player.body.x = 0;
		this.player.body.y = 0;
		mzph(this.player).kill();
		// mzph(this.player).reset(0, 0);

		mzph(this.stateText).setVisible(true);
		//the "click to restartPlayer" handler
		game.input.onTap.addOnce(this.restartPlayer, this);
	};

	PhaserGame.prototype.playerHit = function(player, enemy) {
		this.playerDies();
	};

	PhaserGame.prototype.playerShouldBeDashing = function() {
		return this.player.dash.now && (mzph().getGameTimeTime() < this.player.dash.remain);
	};

	PhaserGame.prototype.playerDash = function() {
		var playerNotDashingWhileJumping = !this.player.dash.jumping;
		var playerDashingMidair = this.player.dash.midAir;

		if (this.playerShouldBeDashing()) {
			if (playerNotDashingWhileJumping || playerDashingMidair) {
				mzph(this.player).setVelocityY(0);
			}
		} else {
			this.player.dash.now = false;
		}
	};

	PhaserGame.prototype.playerShouldMove = function() {
		return !this.player.dash.now;
	};

	PhaserGame.prototype.update = function() {
		if (this.player.justRevived) {
			this.updateCycle = 0;
			this.player.justRevived = false;
		}
		if (this.updateCycle < 10) {
			mzph(this.player).reset(PLAYER_RESET_SPOT.x, PLAYER_RESET_SPOT.y);
		}

		if (this.player.justRevived) {
			this.player.justRevived = false;
		}

		mzph().arcadeCollide(this.player, this.platformGroup);
		mzph().arcadeOverlap(this.player, this.littleYellowEnemyGroup, this.playerHit, null, this);
		mzph().arcadeCollide(this.littleYellowEnemyGroup, this.platformGroup);
		mzph().arcadeCollide(this.littleYellowEnemyGroup, this.invisibleEdgeGroup, this.enemyRebound);

		this.playerMove();
		this.playerDash();

		if (this.updateCycle < 100) {
			this.updateCycle++;
		}
	};

	PhaserGame.prototype.render = function() {
		mzph().showDebugBodyInfo(this.player, 32, 32);

		mzph().renderDebugBodyBounds(this.player);
		this.littleYellowEnemyGroup.forEach(function(enemy) {
			mzph().renderDebugBodyBounds(enemy);
		});

		this.invisibleEdgeGroup.forEach(function(edge) {
			mzph().renderDebugBodyBounds(edge);
		});
	};


	mzph().addGameState('game', PhaserGame, true);
});