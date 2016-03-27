game = game || null;
mzphaser = null;

/**
 * Envuelve un objeto de phaser en un manejador MzPhaser.
 * @param  {object} phaserObject - Objeto de phaser a manipular
 * @return {MzPhaser}               instancia de MzPhaser que wrapea a phaserObject.
 */
function mzph(phaserObject) {
	if (phaserObject) {
		return new MzPhaser(phaserObject, game);
	}

	mzphaser = mzphaser || new MzPhaser(null, game);
	return mzphaser;
}

/**
 * Manejador simplificado de Phaser.
 * @param {object} phaserObject Objeto de phaser a manejar.
 * @param {Phaser.Game} gg           Instancia de juego de phaser.
 */
function MzPhaser(phaserObject, gg) {
	this.phaserObject = phaserObject;
	this.game = gg || game;
}

/**
 * Crea un juego nuevo de phaser.
 * @param  {number} canvasWidth  ancho de canvas.
 * @param  {number} canvasHeight alto de canvas.
 * @param  {string} drawDivId    Id de division o de canvas donde dibujar en html.
 * @return {Phaser.Game}              Nuevo juego phaser.
 */
MzPhaser.prototype.newGame = function(canvasWidth, canvasHeight, drawDivId) {
	drawDivId = drawDivId || '';
	game = new Phaser.Game(canvasWidth, canvasHeight, Phaser.CANVAS, drawDivId);
	this.game = game;
	return game;
};

/** 
The Date.now() value when the time was last updated.
 */
MzPhaser.prototype.getGameTimeTime = function() {
	return this.game.time.time;
};

/** 
Returns a random integer between and including min and max. This method is an alias for RandomDataGenerator.integerInRange.

min	number - The minimum value in the range.
max	number - The maximum value in the range.
 */
MzPhaser.prototype.randomBetween = function(min, max) {
	return this.game.rnd.between(min, max);
};
MzPhaser.prototype.rndBetween = function(min, max) {
	return this.game.rnd.between(min, max);
};

/** 
Adds a new State into the StateManager. You must give each State a unique key by which you'll identify it. The State can be 
either a Phaser.State object (or an object that extends it), a plain JavaScript object or a function. If a function is given 
a new state object will be created by calling it.

key	string - A unique key you use to reference this state, i.e. "MainMenu", "Level1".
state	Phaser.State | object | function - The state you want to switch to.
autoStart	boolean	<optional> false - If true the State will be started immediately after adding it.
 */
MzPhaser.prototype.addGameState = function(key, state, autoStart) {
	return this.game.state.add(key, state, autoStart);
};


MzPhaser.prototype.setStageBackgroundColor = function(color) {
	this.game.stage.backgroundColor = color;
};

/** 
Gets or sets the current width of the game world. The world can never be smaller than the game (canvas) dimensions.
 */
MzPhaser.prototype.getWorldWidth = function() {
	return this.game.world.width;
};

/** 
Gets or sets the current height of the game world. The world can never be smaller than the game (canvas) dimensions.
 */
MzPhaser.prototype.getWorldHeight = function() {
	return this.game.world.height;
};


MzPhaser.prototype.resizeWorld = function(width, height) {
	return this.game.world.resize(width, height);
};


/** 
The current Game Width in pixels.
Do not modify this property directly: use Phaser.ScaleManager#setGameSize - eg. game.scale.setGameSize(width, height) - instead.
 */
MzPhaser.prototype.getGameWidth = function() {
	return this.game.game.width;
};

/** 
The current Game Height in pixels.
Do not modify this property directly: use Phaser.ScaleManager#setGameSize - eg. game.scale.setGameSize(width, height) - instead.
 */
MzPhaser.prototype.getGameHeight = function() {
	return this.game.height;
};


/** 
Carga una imagen.

x	number	<optional> 0 - The x coordinate of the Image. The coordinate is relative to any parent container this Image may be in.
y	number	<optional> 0 - The y coordinate of the Image. The coordinate is relative to any parent container this Image may be in.
key	string | Phaser.RenderTexture | Phaser.BitmapData | Phaser.Video | PIXI.Texture	<optional> - The image used as a texture by
	this display object during rendering. If a string Phaser will get for an entry in the Image Cache. Or it can be an instance 
	of a RenderTexture, BitmapData, Video or PIXI.Texture.
frame	string | number	<optional> - If a Texture Atlas or Sprite Sheet is used this allows you to specify the frame to be used. 
	Use either an integer for a Frame ID or a string for a frame name.
group	Phaser.Group	<optional> - Optional Group to add the object to. If not specified it will be added to the World group.
 */
MzPhaser.prototype.loadImage = function(key, url, overwrite) {
	return this.game.load.image(key, url, overwrite);
};

/** 
Adds a Sprite Sheet to the current load queue.
To clarify the terminology that Phaser uses: A Sprite Sheet is an image containing frames, usually of an animation, that are 
all equal dimensions and often in sequence. For example if the frame size is 32x32 then every frame in the sprite sheet will 
be that size. Sometimes (outside of Phaser) the term "sprite sheet" is used to refer to a texture atlas. A Texture Atlas 
works by packing together images as best it can, using whatever frame sizes it likes, often with cropping and trimming the frames 
in the process. Software such as Texture Packer, Flash CC or Shoebox all generate texture atlases, not sprite sheets. If you've 
got an atlas then use Loader.atlas instead.
The key must be a unique String. It is used to add the image to the Phaser.Cache upon successful load.
Retrieve the file via Cache.getImage(key). Sprite sheets, being image based, live in the same Cache as all other Images.
The URL can be relative or absolute. If the URL is relative the Loader.baseURL and Loader.path values will be prepended to it.
If the URL isn't specified the Loader will take the key and create a filename from that. For example if the key is "alien" and 
no URL is given then the Loader will set the URL to be "alien.png". It will always add .png as the extension. If you do 
not desire this action then provide a URL.

key	string - Unique asset key of the sheet file.
url	string - URL of the sprite sheet file. If undefined or null the url will be set to <key>.png, i.e. if key was "alien" 
	then the URL will be "alien.png".
frameWidth	number - Width in pixels of a single frame in the sprite sheet.
frameHeight	number - Height in pixels of a single frame in the sprite sheet.
frameMax	number	<optional> -1 - How many frames in this sprite sheet. If not specified it will divide the whole image into 
	frames.
margin	number	<optional> 0 - If the frames have been drawn with a margin, specify the amount here.
spacing	number	<optional> 0 - If the frames have been drawn with spacing between them, specify the amount here.
 */
MzPhaser.prototype.loadSpritesheet = function(key, url, frameWidth, frameHeight, frameMax, margin, spacing) {
	return this.game.load.spritesheet(key, url, frameWidth, frameHeight, frameMax, margin, spacing);
};


/** 
Updates the size of this world and sets World.x/y to the given values The Camera bounds and Physics bounds (if set) are also updated to match the new World bounds.
x	number	Top left most corner of the world.
y	number	Top left most corner of the world.
width	number	New width of the game world in pixels.
height	number	New height of the game world in pixels.
 */
MzPhaser.prototype.setWorldBounds = function(x, y, width, height) {
	return this.game.world.setBounds(x, y, width, height);
};


/** PHYSICS METHODS--------------------------------------------------------------------------------------------------------------------- */


/** 
 * system	number	-	The physics system to start: Phaser.Physics.ARCADE, Phaser.Physics.P2JS, 
 	Phaser.Physics.NINJA or Phaser.Physics.BOX2D.El valor por defecto es Phaser.Physics.ARCADE.
 */
MzPhaser.prototype.startPhysicsSystem = function(system) {
	system = system || Phaser.Physics.ARCADE;
	return this.game.physics.startSystem(system);
};

MzPhaser.prototype.startArcadePhysicsSystem = function() {
	return this.startPhysicsSystem(Phaser.Physics.ARCADE);
};

/** 
object1	Phaser.Sprite | Phaser.Group | Phaser.Particles.Emitter | Phaser.TilemapLayer | array - The first object or array of 
	objects to check. Can be Phaser.Sprite, Phaser.Group, Phaser.Particles.Emitter, or Phaser.TilemapLayer.
object2	Phaser.Sprite | Phaser.Group | Phaser.Particles.Emitter | Phaser.TilemapLayer | array - The second object or array 
	of objects to check. Can be Phaser.Sprite, Phaser.Group, Phaser.Particles.Emitter or Phaser.TilemapLayer.
collideCallback	function	<optional> null	- An optional callback function that is called if the objects collide. The two 
	objects will be passed to this function in the same order in which you specified them, unless you are colliding Group vs. 
	Sprite, in which case Sprite will always be the first parameter.
processCallback	function	<optional> null	- A callback function that lets you perform additional checks against the two 
	objects if they overlap. If this is set then collision will only happen if processCallback returns true. The two 
	objects will be passed to this function in the same order in which you specified them.
callbackContext	object	<optional> - The context in which to run the callbacks.
 */
MzPhaser.prototype.arcadeCollide = function(object1, object2, collideCallback, processCallback, callbackContext) {
	return this.game.physics.arcade.collide(object1, object2, collideCallback, processCallback, callbackContext);
};

// Establece los valores de gravedad para la fisica Arcade
MzPhaser.prototype.setPhysicsArcadeGravityX = function(gx) {
	this.game.physics.arcade.gravity.x = gx;
};
MzPhaser.prototype.setPhysicsArcadeGravityY = function(gy) {
	this.game.physics.arcade.gravity.y = gy;
};

// The crossOrigin value applied to loaded images. Very often this needs to be set to 'anonymous'.
MzPhaser.prototype.setCrossOriginLoadAnonymous = function() {
	this.game.load.crossOrigin = 'anonymous';
};


MzPhaser.prototype.setRenderSessionRoundPixels = function() {
	this.game.renderer.renderSession.roundPixels = true;
};

/** 
This will create an Arcade Physics body on the given game object or array of game objects.

object	object | array | Phaser.Group - The game object to create the physics body on. Can also be an array or Group of objects, 
	a body will be created on every child that has a body property.
children	boolean	<optional> true	- Should a body be created on all children of this object? If true it will recurse down 
	the display list as far as it can go.
 */
MzPhaser.prototype.enableArcadePhysicsOn = function(object, children) {
	if (!object && !children) return this.game.physics.arcade.enable(this.phaserObject);
	return this.game.physics.arcade.enable(object, children);
};
MzPhaser.prototype.enablePhysicsOn = function(object, children) {
	if (!object && !children) return this.game.physics.arcade.enable(this.phaserObject);
	return this.game.physics.arcade.enable(object, children);
};



/** 
Given the rotation (in radians) and speed calculate the velocity and return it as a Point object, or set it to the given point 
object. One way to use this is: velocityFromRotation(rotation, 200, sprite.velocity) which will set the values directly to the 
sprites velocity and not create a new Point object.

rotation	number - The angle in radians.
speed	number	<optional> 60 - The speed it will move, in pixels per second sq.
point	Phaser.Point | object	<optional> - The Point object in which the x and y properties will be set to the calculated 
	velocity. SI point ES NULO O INDEFINIDO -> SE INTENTA APLICAR LA VELOCIDAD DE ROTACION SOBRE this.phaserObject.body.velocity.
 */
MzPhaser.prototype.arcadeVelocityFromRotation = function(rotation, speed, point) {
	if (point) {
		return this.game.physics.arcade.velocityFromRotation(rotation, speed, point);
	}

	if (this.phaserObject) {
		return this.game.physics.arcade.velocityFromRotation(rotation, speed, mzph(this.phaserObject).getSpriteBodyVelocity());
	}

	return this.game.physics.arcade.velocityFromRotation(rotation, speed);
};

/** 
Checks for overlaps between two game objects. The objects can be Sprites, Groups or Emitters. You can perform Sprite vs. 
Sprite, Sprite vs. Group and Group vs. Group overlap checks. Unlike collide the objects are NOT automatically separated or 
have any physics applied, they merely test for overlap results. Both the first and second parameter can be arrays of objects, 
of differing types. If two arrays are passed, the contents of the first parameter will be tested against all contents of the 
2nd parameter. NOTE: This function is not recursive, and will not test against children of objects passed (i.e. Groups within 
Groups).

object1	Phaser.Sprite | Phaser.Group | Phaser.Particles.Emitter | array - The first object or array of objects to check. 
	Can be Phaser.Sprite, Phaser.Group or Phaser.Particles.Emitter.
object2	Phaser.Sprite | Phaser.Group | Phaser.Particles.Emitter | array - The second object or array of objects to check. 
	Can be Phaser.Sprite, Phaser.Group or Phaser.Particles.Emitter.
overlapCallback	function	<optional> null	- An optional callback function that is called if the objects overlap. The two 
	objects will be passed to this function in the same order in which you specified them, unless you are checking Group 
	vs. Sprite, in which case Sprite will always be the first parameter.
processCallback	function	<optional> null	- A callback function that lets you perform additional checks against the two 
	objects if they overlap. If this is set then overlapCallback will only be called if this callback returns true.
callbackContext	object	<optional> - The context in which to run the callbacks.
 */
MzPhaser.prototype.arcadeOverlap = function(object1, object2, overlapCallback, processCallback, callbackContext) {
	return this.game.physics.arcade.overlap(object1, object2, overlapCallback, processCallback, callbackContext);
};
MzPhaser.prototype.overlap = function(object2, overlapCallback, processCallback, callbackContext) {
	return this.game.physics.arcade.overlap(this.phaserObject, object2, overlapCallback, processCallback, callbackContext);
};

/** 
If true the QuadTree will not be used for any collision. QuadTrees are great if objects are well spread out in your game, 
otherwise they are a performance hit. If you enable this you can disable on a per body basis via Body.skipQuadTree.
SI NO SE PASA UN PARAMETRO, SE ASUME ESTABLECER true.
 */
MzPhaser.prototype.setSkipQuadTree = function(skip) {
	if (skip === undefined) this.game.physics.arcade.skipQuadTree = true;
	else this.game.physics.arcade.skipQuadTree = skip;
};
MzPhaser.prototype.disableSkipQuadTree = function() {
	return this.setSkipQuadTree(false);
};



/** 
Allow this Body to be influenced by gravity? Either world or local.
 */
MzPhaser.prototype.setAllowGravity = function(allow) {
	allow = (allow === undefined) ? true : allow;
	if (this.phaserObject.body) this.phaserObject.body.allowGravity = allow;
	else his.phaserObject.allowGravity = allow;
};

/** 
An immovable Body will not receive any impacts from other bodies.
 */
MzPhaser.prototype.setImmovable = function(allow) {
	allow = (allow === undefined) ? true : allow;
	if (this.phaserObject.body) this.phaserObject.body.immovable = allow;
	else his.phaserObject.immovable = allow;
};

/** END PHYSICS METHODS--------------------------------------------------------------------------------------------------------------------- */



/** SPRITE METHODS-------------------------------------------------------------------------------------------------------------- */


// Create a new Sprite with specific position and sprite sheet key.
/** x	number	- The x coordinate of the sprite. The coordinate is relative to any parent container this sprite 
	may be in.
y	number - The y coordinate of the sprite. The coordinate is relative to any parent container this sprite may be in.
key	string | Phaser.RenderTexture | Phaser.BitmapData | Phaser.Video | PIXI.Texture	- The image used as a texture by this
	display object during rendering. If a string Phaser will get for an entry in the Image Cache. Or it can be an instance 
	of a RenderTexture, BitmapData, Video or PIXI.Texture.
frame	string | number	- If a Texture Atlas or Sprite Sheet is used this allows you to specify the frame to be used. Use 
	either an integer for a Frame ID or a string for a frame name.
group	Phaser.Group - Optional Group to add the object to. If not specified it will be added to the World group. */
MzPhaser.prototype.addSprite = function(x, y, key, frame, group) {
	return this.game.add.sprite(x, y, key, frame, group);
};


/** 
Creates a new TileSprite object

x	number - The x coordinate of the TileSprite. The coordinate is relative to any parent container this TileSprite may be in.
y	number - The y coordinate of the TileSprite. The coordinate is relative to any parent container this TileSprite may be in.
width	number - The width of the TileSprite.
height	number - The height of the TileSprite.
key	string | Phaser.RenderTexture | Phaser.BitmapData | Phaser.Video | PIXI.Texture - The image used as a texture by this display 
	object during rendering. If a string Phaser will get for an entry in the Image Cache. Or it can be an instance of a 
	RenderTexture, BitmapData, Video or PIXI.Texture.
frame	string | number	<optional> - If a Texture Atlas or Sprite Sheet is used this allows you to specify the frame to be 
	used. Use either an integer for a Frame ID or a string for a frame name.
group	Phaser.Group	<optional> - Optional Group to add the object to. If not specified it will be added to the World group
 */
MzPhaser.prototype.addTileSprite = function(x, y, width, height, key, frame, group) {
	return this.game.add.tileSprite(x, y, width, height, key, frame, group);
};
/** 
 *  Desplaza la imagen para dar ilusion de scrolling.
 */
MzPhaser.prototype.augmentTilePositionX = function(x) {
	this.phaserObject.tilePosition.x += x;
};
MzPhaser.prototype.reduceTilePositionX = function(x) {
	this.phaserObject.tilePosition.x -= x;
};
MzPhaser.prototype.augmentTilePositionY = function(y) {
	this.phaserObject.tilePosition.y += y;
};
MzPhaser.prototype.reduceTilePositionY = function(y) {
	this.phaserObject.tilePosition.y -= y;
};

/** 
This moves the Game Object to the given x/y world coordinates and sets fresh, exists, visible and renderable to true.

x	number - The x coordinate (in world space) to position the Game Object at.
y	number - The y coordinate (in world space) to position the Game Object at.
health	number	<optional> 1 - The health to give the Game Object if it has the Health component.
 */
MzPhaser.prototype.reset = function(x, y, health) {
	return this.phaserObject.reset(x, y, health);
};
MzPhaser.prototype.resetSprite = function(x, y, health) {
	return this.phaserObject.reset(x, y, health);
};


MzPhaser.prototype.setSpritePosX = function(x) {
	this.phaserObject.x = x;
};
MzPhaser.prototype.setSpritePosY = function(y) {
	this.phaserObject.y = y;
};
MzPhaser.prototype.setPosX = function(x) {
	this.phaserObject.x = x;
};
MzPhaser.prototype.setPosY = function(y) {
	this.phaserObject.y = y;
};


MzPhaser.prototype.getPosX = function(x) {
	return this.phaserObject.x;
};
MzPhaser.prototype.getPosY = function(y) {
	return this.phaserObject.y;
};

MzPhaser.prototype.isStanding = function() {
	return this.phaserObject.body.blocked.down || this.phaserObject.body.touching.down;
};
MzPhaser.prototype.bodyBlockedDown = function() {
	return this.phaserObject.body.blocked.down;
};
MzPhaser.prototype.bodyTouchingDown = function() {
	return this.phaserObject.body.touching.down;
};


MzPhaser.prototype.getBodyX = function() {
	return this.phaserObject.body.x;
};
MzPhaser.prototype.getBodyY = function() {
	return this.phaserObject.body.y;
};
MzPhaser.prototype.getPrevBodyX = function() {
	return this.phaserObject.body.prev.x;
};
MzPhaser.prototype.getPrevBodyY = function() {
	return this.phaserObject.body.prev.y;
};


MzPhaser.prototype.setBodyX = function(x) {
	this.phaserObject.body.x = x;
};
MzPhaser.prototype.setBodyY = function(y) {
	this.phaserObject.body.y = y;
};
MzPhaser.prototype.augmentBodyX = function(x) {
	this.phaserObject.body.x += x;
};
MzPhaser.prototype.augmentBodyY = function(y) {
	this.phaserObject.body.y += y;
};


MzPhaser.prototype.setSpriteAlpha = function(alpha) {
	this.phaserObject.alpha = alpha;
};


/** 
The rotation of the object in radians.
 */
MzPhaser.prototype.setSpriteRotation = function(rot) {
	this.phaserObject.rotation = rot;
};
MzPhaser.prototype.getSpriteRotation = function() {
	return this.phaserObject.rotation;
};
MzPhaser.prototype.setRotation = function(rot) {
	this.phaserObject.rotation = rot;
};
MzPhaser.prototype.getRotation = function() {
	return this.phaserObject.rotation;
};



/** 
The angle property is the rotation of the Game Object in degrees from its original orientation.
Values from 0 to 180 represent clockwise rotation; values from 0 to -180 represent counterclockwise rotation.
Values outside this range are added to or subtracted from 360 to obtain a value within the range. For example, the statement 
player.angle = 450 is the same as player.angle = 90.
If you wish to work in radians instead of degrees you can use the property rotation instead. Working in radians is slightly 
faster as it doesn't have to perform any calculations.
 */
MzPhaser.prototype.setSpriteAngle = function(angle) {
	this.phaserObject.angle = angle;
};
MzPhaser.prototype.getSpriteAngle = function() {
	return this.phaserObject.angle;
};
MzPhaser.prototype.setAngle = function(angle) {
	this.phaserObject.angle = angle;
};
MzPhaser.prototype.getAngle = function() {
	return this.phaserObject.angle;
};
MzPhaser.prototype.augmentAngle = function(angle) {
	this.phaserObject.angle += angle;
};

/**
 * Retorna la velovidad del cuerpo de un sprite.
 * @return {object} velovidad del cuerpo de un sprite en coordenadas x:y
 */
MzPhaser.prototype.getSpriteBodyVelocity = function() {
	if (this.phaserObject.body) return this.phaserObject.body.velocity;
	else return this.phaserObject.velocity;
};
MzPhaser.prototype.getVelocity = function() {
	if (this.phaserObject.body) return this.phaserObject.body.velocity;
	else return this.phaserObject.velocity;
};
MzPhaser.prototype.getVelocityX = function() {
	if (this.phaserObject.body) return this.phaserObject.body.velocity.x;
	else return this.phaserObject.velocity.x;
};
MzPhaser.prototype.getVelocityY = function() {
	if (this.phaserObject.body) return this.phaserObject.body.velocity.y;
	else return this.phaserObject.velocity.y;
};

/** Establece la velocidad del cuerpo de un sprite */
MzPhaser.prototype.setVelocityX = function(vx) {
	this.phaserObject.body.velocity.x = vx;
};
MzPhaser.prototype.setVelocityY = function(vy) {
	this.phaserObject.body.velocity.y = vy;
};
MzPhaser.prototype.augmentVelocityX = function(vx) {
	this.phaserObject.body.velocity.x += vx;
};
MzPhaser.prototype.augmentVelocityY = function(vy) {
	this.phaserObject.body.velocity.y += vy;
};
MzPhaser.prototype.reduceVelocityX = function(vx) {
	this.phaserObject.body.velocity.x -= vx;
};
MzPhaser.prototype.reduceVelocityY = function(vy) {
	this.phaserObject.body.velocity.y -= vy;
};
MzPhaser.prototype.resetVelocityX = function() {
	this.phaserObject.body.velocity.x = 0;
};
MzPhaser.prototype.resetVelocityY = function() {
	this.phaserObject.body.velocity.y = 0;
};


/** 
Invierte la velocidad de un cuerpo.
 */
MzPhaser.prototype.invertVelocityX = function() {
	this.phaserObject.body.velocity.x *= -1;
};
MzPhaser.prototype.invertVelocityY = function() {
	this.phaserObject.body.velocity.y *= -1;
};

/**
Retorna el cuerpo de un sprite.
@return { Phaser.Physics.Arcade.Body | Phaser.Physics.P2.Body | Phaser.Physics.Ninja.Body} Cuerpo del sprite.
body is the Game Objects physics body. Once a Game Object is enabled for physics you access all associated properties and 
methods via it.
By default Game Objects won't add themselves to any physics system and their body property will be null.
To enable this Game Object for physics you need to call game.physics.enable(object, system) where object is this object and 
system is the Physics system you are using. If none is given it defaults to Phaser.Physics.Arcade.
 */
MzPhaser.prototype.getSpriteBody = function() {
	return this.phaserObject.body;
};

/** 
A Body can be set to collide against the World bounds automatically and rebound back into the World if this is set to 
true. Otherwise it will leave the World. Should the Body collide with the World bounds?
 */
MzPhaser.prototype.setBodyCollideWorldBounds = function(collide) {
	collide = collide === undefined ? true : collide;
	if (this.phaserObject.body) this.phaserObject.body.collideWorldBounds = collide;
	else this.phaserObject.collideWorldBounds = collide;
};

/** 
You can modify the size of the physics Body to be any dimension you need. So it could be smaller or larger than the parent 
Sprite. You can also control the x and y offset, which is the position of the Body relative to the top-left of the Sprite.

width	number - The width of the Body.
height	number - The height of the Body.
offsetX	number	<optional> - The X offset of the Body from the Sprite position.
offsetY	number	<optional> - The Y offset of the Body from the Sprite position
 */
MzPhaser.prototype.setBodySize = function(width, height, offsetX, offsetY) {
	if (this.phaserObject.body) this.phaserObject.body.setSize(width, height, offsetX, offsetY);
	else this.phaserObject.setSize(width, height, offsetX, offsetY);
};

MzPhaser.prototype.resizeBody = function(factor) {
	var width = this.getBodyWidth() * factor;
	var height = this.getBodyHeight() * factor;

	return this.setBodySize(width, height);
};

MzPhaser.prototype.getBodyWidth = function() {
	if (this.phaserObject.body) {
		return this.phaserObject.body.width;
	} else {
		return this.phaserObject.width;
	}
};

MzPhaser.prototype.getBodyHeight = function() {
	if (this.phaserObject.body) {
		return this.phaserObject.body.height;
	} else {
		return this.phaserObject.height;
	}
};

/** 
Destroy this DisplayObject. Removes all references to transformCallbacks, its parent, the stage, filters, bounds, 
mask and cached Sprites.
 */
MzPhaser.prototype.destroy = function() {
	return this.phaserObject.destroy();
};

/** 
Kills a Game Object. A killed Game Object has its alive, exists and visible properties all set to false.
It will dispatch the onKilled event. You can listen to events.onKilled for the signal.
Note that killing a Game Object is a way for you to quickly recycle it in an object pool, it doesn't destroy the object or 
free it up from memory.
If you don't need this Game Object any more you should call destroy instead
 */
MzPhaser.prototype.kill = function() {
	return this.phaserObject.kill();
};

/** 
Adds a new animation under the given key. Optionally set the frames, frame rate and loop. Animations added in this way 
are played back with the play function.

name	string - The unique (within this Sprite) name for the animation, i.e. "run", "fire", "walk".
frames	Array	<optional> null	- An array of numbers/strings that correspond to the frames to add to this animation and in 
	which order. e.g. [1, 2, 3] or ['run0', 'run1', run2]). If null then all frames will be used.
frameRate	number	<optional> 60 - The speed at which the animation should play. The speed is given in frames per second.
loop	boolean	<optional> false - Whether or not the animation is looped or just plays once.
useNumericIndex	boolean	<optional> true	- Are the given frames using numeric indexes (default) or strings?
 */
MzPhaser.prototype.addAnimation = function(name, frames, frameRate, loop, useNumericIndex) {
	return this.phaserObject.animations.add(name, frames, frameRate, loop, useNumericIndex);
};

/** 
Plays an Animation.
The animation should have previously been created via animations.add.
If the animation is already playing calling this again won't do anything. If you need to reset an already running animation 
do so directly on the Animation object itself or via AnimationManager.stop

name	string - The name of the animation to be played, e.g. "fire", "walk", "jump". Must have been previously created 
	via 'AnimationManager.add'.
frameRate	number	<optional> null	- The framerate to play the animation at. The speed is given in frames per second. 
	If not provided the previously set frameRate of the Animation is used.
loop	boolean	<optional> false - Should the animation be looped after playback. If not provided the previously set 
	loop value of the Animation is used.
killOnComplete	boolean	<optional> false - If set to true when the animation completes (only happens if loop=false) 
	the parent Sprite will be killed
 */
MzPhaser.prototype.play = function(name, frameRate, loop, killOnComplete) {
	return this.phaserObject.play(name, frameRate, loop, killOnComplete);
};
MzPhaser.prototype.playAnimation = function(name, frameRate, loop, killOnComplete) {
	return this.phaserObject.play(name, frameRate, loop, killOnComplete);
};

MzPhaser.prototype.playAnimation = function(name, frameRate, loop, killOnComplete) {
	return this.phaserObject.play(name, frameRate, loop, killOnComplete);
};

/** 
Detiene la animacion del sprite.
 */
MzPhaser.prototype.stopAnimation = function() {
	return this.phaserObject.animations.stop();
};

/** 
Establece el frame a animar
 */
MzPhaser.prototype.frameAnimation = function(frameIndex) {
	this.phaserObject.frame = frameIndex;
};

/** END SPRITE METHODS-------------------------------------------------------------------------------------------------------------- */


/** GROUP METHODS-------------------------------------------------------------------------------------------------------------- */


/**
parent	any	<optional> - The parent Group or DisplayObjectContainer that will hold this group, if any. If set to null the 
	Group won't be added to the display list. If undefined it will be added to World by default.
name	string	<optional> 'group' - A name for this Group. Not used internally but useful for debugging.
addToStage	boolean	<optional> false - If set to true this Group will be added directly to the Game.Stage instead of Game.World.
enableBody	boolean	<optional> false - If true all Sprites created with Group.create or Group.createMulitple will have a physics 
	body created on them. Change the body type with physicsBodyType.
physicsBodyType	number	<optional> 0 - If enableBody is true this is the type of physics body that is created on new Sprites. 
	Phaser.Physics.ARCADE, Phaser.Physics.P2, Phaser.Physics.NINJA, etc.
 */
MzPhaser.prototype.addGroup = function(parent, name, addToStage, enableBody, physicsBodyType) {
	return this.game.add.group(parent, name, addToStage, enableBody, physicsBodyType);
};

/** 
A Group is a container for display objects that allows for fast pooling, recycling and collision checks.
A Physics Group is the same as an ordinary Group except that is has enableBody turned on by default, so any Sprites it creates
are automatically given a physics body

physicsBodyType	number	<optional> Phaser.Physics.ARCADE - If enableBody is true this is the type of physics body that is 
	created on new Sprites. Phaser.Physics.ARCADE, Phaser.Physics.P2JS, Phaser.Physics.NINJA, etc.
parent	any	<optional> - The parent Group or DisplayObjectContainer that will hold this group, if any. If set to null the 
	Group won't be added to the display list. If undefined it will be added to World by default.
name	string	<optional> 'group' - A name for this Group. Not used internally but useful for debugging.
addToStage	boolean	<optional> false - If set to true this Group will be added directly to the Game.Stage instead of Game.World.
 */
MzPhaser.prototype.addPhysicsGroup = function(physicsBodyType, parent, name, addToStage) {
	return this.game.add.physicsGroup(physicsBodyType, parent, name, addToStage);
};

/** 
Agrega un elemento a un grupo.

x	number - The x coordinate to display the newly created Sprite at. The value is in relation to the group.x point.
y	number - The y coordinate to display the newly created Sprite at. The value is in relation to the group.y point.
key	string | Phaser.RenderTexture | Phaser.BitmapData | Phaser.Video | PIXI.Texture	<optional> - This is the image or texture 
	used by the Sprite during rendering. It can be a string which is a reference to the Cache Image entry, or an instance of a 
	RenderTexture, BitmapData, Video or PIXI.Texture.
frame	string | number	<optional> - If this Sprite is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
exists	boolean	<optional> true	- The default exists state of the Sprite.
 */
MzPhaser.prototype.create = function(x, y, key, frame, exists) {
	return this.phaserObject.create(x, y, key, frame, exists);
};
MzPhaser.prototype.createInGroup = function(x, y, key, frame, exists) {
	return this.phaserObject.create(x, y, key, frame, exists);
};


/** 
Establece un mismo valor de propiedad para todos los elementos de un grupo.

key	string - The property, as a string, to be set. For example: 'body.velocity.x'
value	any - The value that will be set.
checkAlive	boolean	<optional> false - If set then only children with alive=true will be updated. This includes any Groups 
	that are children.
checkVisible	boolean	<optional> false - If set then only children with visible=true will be updated. This includes any 
	Groups that are children.
operation	integer	<optional> 0 - Controls how the value is assigned. A value of 0 replaces the value with the new one. A 
	value of 1 adds it, 2 subtracts it, 3 multiplies it and 4 divides it.
force	boolean	<optional> false - If force is true then the property will be set on the child regardless if it already exists 
	or not. If false and the property doesn't exist, nothing will be set.
 */
MzPhaser.prototype.setAll = function(key, value, checkAlive, checkVisible, operation, force) {
	return this.phaserObject.setAll(key, value, checkAlive, checkVisible, operation, force);
};
MzPhaser.prototype.setPropertyToAllInGroup = function(key, value, checkAlive, checkVisible, operation, force) {
	return this.phaserObject.setAll(key, value, checkAlive, checkVisible, operation, force);
};


/** 
Allow this Body to be influenced by gravity? Either world or local.
 */
MzPhaser.prototype.setAllowGravityToAll = function(allow) {
	allow = (allow === undefined) ? true : allow;
	this.phaserObject.setAll('body.allowGravity', allow);
};

/** 
An immovable Body will not receive any impacts from other bodies.
 */
MzPhaser.prototype.setImmovableToAll = function(allow) {
	allow = (allow === undefined) ? true : allow;
	this.phaserObject.setAll('body.immovable', allow);
};


/**END GROUP METHODS-------------------------------------------------------------------------------------------------------------- */


/** BITMAP METHODS ------------------------------------------------------------------------------------------------------------------- */


/** 
Agrega/crea un mapa de bits.

width	number	<optional> 256	- The width of the BitmapData in pixels.
height	number	<optional> 256	- The height of the BitmapData in pixels.
key	string	<optional> ''	- Asset key for the BitmapData when stored in the Cache (see addToCache parameter).
addToCache	boolean	<optional> false - Should this BitmapData be added to the Game.Cache? If so you can retrieve it with 
	Cache.getBitmapData(key)
 */
MzPhaser.prototype.addBitmapData = function(width, height, key, addToCache) {
	return this.game.add.bitmapData(width, height, key, addToCache);
};


/** 
Dibuja sobre un bitmap.

source	Phaser.Sprite | Phaser.Image | Phaser.Text	- The Sprite, Image or Text object to draw onto this BitmapData.
x	number	<optional> 0 - The x coordinate to translate to before drawing. If not specified it will default to source.x.
y	number	<optional> 0 - The y coordinate to translate to before drawing. If not specified it will default to source.y.
width	number	<optional> - The new width of the Sprite being copied. If not specified it will default to source.width.
height	number	<optional> - The new height of the Sprite being copied. If not specified it will default to source.height.
blendMode	string	<optional> null	- The composite blend mode that will be used when drawing. The default is no blend mode at all. 
	This is a Canvas globalCompositeOperation value such as 'lighter' or 'xor'.
roundPx	boolean	<optional> false - Should the x and y values be rounded to integers before drawing? This prevents anti-aliasing 
	in some instances.
 */
MzPhaser.prototype.draw = function(source, x, y, width, height, blendMode, roundPx) {
	return this.phaserObject.draw(source, x, y, width, height, blendMode, roundPx);
};
MzPhaser.prototype.drawOnBitmap = function(source, x, y, width, height, blendMode, roundPx) {
	return this.draw(source, x, y, width, height, blendMode, roundPx);
};

/** 
Actualiza un mapa de bits.

x	number	<optional> 0 - The x coordinate of the top-left of the image data area to grab from.
y	number	<optional> 0 - The y coordinate of the top-left of the image data area to grab from.
width	number	<optional> 1 - The width of the image data area.
height	number	<optional> 1 - The height of the image data area.
 */
MzPhaser.prototype.update = function(x, y, width, height) {
	return this.phaserObject.update(x, y, width, height);
};
MzPhaser.prototype.updateBitmap = function(x, y, width, height) {
	return this.phaserObject.update(x, y, width, height);
};


/** 
Creates a new Phaser.Image object, assigns this BitmapData to be its texture, adds it to the world then returns it.

x	number	<optional> 0 - The x coordinate to place the Image at.
y	number	<optional> 0 - The y coordinate to place the Image at.
anchorX	number	<optional> 0 - Set the x anchor point of the Image. A value between 0 and 1, where 0 is the top-left and 1 
	is bottom-right.
anchorY	number	<optional> 0 - Set the y anchor point of the Image. A value between 0 and 1, where 0 is the top-left and 1 
	is bottom-right.
scaleX	number	<optional> 1 - The horizontal scale factor of the Image. A value of 1 means no scaling. 2 would be twice the 
	size, and so on.
scaleY	number	<optional> 1 - The vertical scale factor of the Image. A value of 1 means no scaling. 2 would be twice the 
	size, and so on.
 */
MzPhaser.prototype.addToWorld = function(x, y, anchorX, anchorY, scaleX, scaleY) {
	return this.phaserObject.addToWorld(x, y, anchorX, anchorY, scaleX, scaleY);
};
MzPhaser.prototype.addBitmapToWorld = function(x, y, anchorX, anchorY, scaleX, scaleY) {
	return this.phaserObject.addToWorld(x, y, anchorX, anchorY, scaleX, scaleY);
};

/** 
Get the color of a specific pixel in the context into a color object. If you have drawn anything to the BitmapData since it 
was created you must call BitmapData.update to refresh the array buffer, otherwise this may return out of date color values, 
or worse - throw a run-time error as it tries to access an array element that doesn't exist.

x	number - The x coordinate of the pixel to be set. Must lay within the dimensions of this BitmapData.
y	number - The y coordinate of the pixel to be set. Must lay within the dimensions of this BitmapData.
out	object	<optional> - An object into which 4 properties will be created: r, g, b and a. If not provided 
	a new object will be created.
 */
MzPhaser.prototype.getPixel = function(x, y, out) {
	return this.phaserObject.getPixel(x, y, out);
};
MzPhaser.prototype.getBitmapPixel = function(x, y, out) {
	return this.phaserObject.getPixel(x, y, out);
};

/** 
Sets the blend mode to 'destination-out'.
 */
MzPhaser.prototype.blendDestinationOut = function() {
	return this.phaserObject.blendDestinationOut();
};

/** 
Draws a filled Circle to the BitmapData at the given x, y coordinates and radius in size.

x	number - The x coordinate to draw the Circle at. This is the center of the circle.
y	number - The y coordinate to draw the Circle at. This is the center of the circle.
radius	number - The radius of the Circle in pixels. The radius is half the diameter.
fillStyle	string	<optional> - If set the context fillStyle will be set to this value before the circle is drawn.
 */
MzPhaser.prototype.circle = function(x, y, radius, fillStyle) {
	return this.phaserObject.circle(x, y, radius, fillStyle);
};
MzPhaser.prototype.circleBitmap = function(x, y, radius, fillStyle) {
	return this.phaserObject.circle(x, y, radius, fillStyle);
};

/** 
Resets the blend mode (effectively sets it to 'source-over')
 */
MzPhaser.prototype.blendReset = function() {
	return this.phaserObject.blendReset();
};
MzPhaser.prototype.blendResetBitmap = function() {
	return this.phaserObject.blendReset();
};

/** END BITMAP METHODS ------------------------------------------------------------------------------------------------------------------- */


/** EMITTER METHODS ------------------------------------------------------------------------------------------------------------------- */


/** 
x	number	<optional> 0 - The x coordinate within the Emitter that the particles are emitted from.
y	number	<optional> 0 - The y coordinate within the Emitter that the particles are emitted from.
maxParticles	number	<optional> 50 - The total number of particles in this emitter.
 */
MzPhaser.prototype.addEmitter = function(x, y, maxParticles) {
	return this.game.add.emitter(x, y, maxParticles);
};

/** 
Establece la velocidad angular de las particulas. Si se invoca sin parametros -> las particulas no rotaran.

min	number	<optional> 0 - The minimum value for this range.
max	number	<optional> 0 - The maximum value for this range.
 */
MzPhaser.prototype.setRotation = function(min, max) {
	return this.phaserObject.setRotation(min, max);
};
MzPhaser.prototype.setEmitterRotation = function(min, max) {
	return this.phaserObject.setRotation(min, max);
};

/** 
generates a new set of particles for use by this emitter

keys	array | string - A string or an array of strings that the particle sprites will use as their texture. If an array one 
	is picked at random.
frames	array | number	<optional> 0 - A frame number, or array of frames that the sprite will use. If an array one is picked 
	at random.
quantity	number	<optional> - The number of particles to generate. If not given it will use the value of Emitter.maxParticles. 
	If the value is greater than Emitter.maxParticles it will use Emitter.maxParticles as the quantity.
collide	boolean	<optional> false - If you want the particles to be able to collide with other Arcade Physics bodies then set 
	this to true.
collideWorldBounds	boolean	<optional> false - A particle can be set to collide against the World bounds automatically and 
	rebound back into the World if this is set to true. Otherwise it will leave the World.
 */
MzPhaser.prototype.makeParticles = function(keys, frames, quantity, collide, collideWorldBounds) {
	return this.phaserObject.makeParticles(keys, frames, quantity, collide, collideWorldBounds);
};
MzPhaser.prototype.makeEmitterParticles = function(keys, frames, quantity, collide, collideWorldBounds) {
	return this.phaserObject.makeParticles(keys, frames, quantity, collide, collideWorldBounds);
};


/** 
min	number	<optional> 0 - The minimum value for this range.
max	number	<optional> 0 - The maximum value for this range.
 */
MzPhaser.prototype.setXSpeed = function(min, max) {
	return this.phaserObject.setXSpeed(min, max);
};
MzPhaser.prototype.setYSpeed = function(min, max) {
	return this.phaserObject.setYSpeed(min, max);
};
MzPhaser.prototype.setEmitterXSpeed = function(min, max) {
	return this.phaserObject.setXSpeed(min, max);
};
MzPhaser.prototype.setEmitterYSpeed = function(min, max) {
	return this.phaserObject.setYSpeed(min, max);
};

/** 
Change the emitters center to match the center of any object with a center property, such as a Sprite. If the object doesn't 
have a center property it will be set to object.x + object.width / 2

object	object | Phaser.Sprite | Phaser.Image | Phaser.TileSprite | Phaser.Text | PIXI.DisplayObject - The object that you wish 
	to match the center with
 */
MzPhaser.prototype.at = function(object) {
	return this.phaserObject.at(object);
};
MzPhaser.prototype.emitterAt = function(object) {
	return this.phaserObject.at(object);
};

/** 
Call this function to emit the given quantity of particles at all once (an explosion).

lifespan	number	<optional> 0 - How long each particle lives once emitted in ms. 0 = forever.
quantity	number	<optional> 0 - How many particles to launch.
 */
MzPhaser.prototype.explode = function(lifespan, quantity) {
	this.phaserObject.explode(lifespan, quantity);
};
MzPhaser.prototype.emitterExplode = function(lifespan, quantity) {
	this.phaserObject.explode(lifespan, quantity);
};


/** END EMITTER METHODS ------------------------------------------------------------------------------------------------------------------- */



/** 
The anchor sets the origin point of the texture. The default is 0,0 this means the texture's origin is the top left Setting 
than anchor to 0.5,0.5 means the textures origin is centered Setting the anchor to 1,1 would mean the textures origin points 
will be the bottom right corner
 */
MzPhaser.prototype.setAnchor = function(x, y) {
	return this.phaserObject.anchor.set(x, y);
};


/** 
The visibility of the object.
 */
MzPhaser.prototype.setVisible = function(vis) {
	if (vis === undefined) vis = true;
	this.phaserObject.visible = vis;
};
MzPhaser.prototype.setInvisible = function() {
	this.setVisible(false);
};

/** 
Crea un nuevo objeto de texto.

x	number	<optional> 0 - The x coordinate of the Text. The coordinate is relative to any parent container this text may be in.
y	number	<optional> 0 - The y coordinate of the Text. The coordinate is relative to any parent container this text may be in.
text	string	<optional> '' - The text string that will be displayed.
style	object	<optional> - The style object containing style attributes like font, font size , etc.
group	Phaser.Group 	<optional> - Optional Group to add the object to. If not specified it will be added to the World group.
 */
MzPhaser.prototype.addText = function(x, y, text, style, group) {
	return this.game.add.text(x, y, text, style, group);
};


/** 
x	number	<optional> 0 - The shadowOffsetX value in pixels. This is how far offset horizontally the shadow effect will be.
y	number	<optional> 0 - The shadowOffsetY value in pixels. This is how far offset vertically the shadow effect will be.
color	string	<optional> 'rgba(0,0,0,1)' - The color of the shadow, as given in CSS rgba or hex format. Set the alpha 
	component to 0 to disable the shadow.
blur	number	<optional> 0 - The shadowBlur value. Make the shadow softer by applying a Gaussian blur to it. A number 
	from 0 (no blur) up to approx. 10 (depending on scene).
shadowStroke	boolean	<optional> true	- Apply the drop shadow to the Text stroke (if set).
shadowFill	boolean	<optional> true	- Apply the drop shadow to the Text fill (if set).
 */
MzPhaser.prototype.setShadow = function(x, y, color, blur, shadowStroke, shadowFill) {
	return this.phaserObject.setShadow(x, y, color, blur, shadowStroke, shadowFill);
};
MzPhaser.prototype.setTextShadow = function(x, y, color, blur, shadowStroke, shadowFill) {
	return this.phaserObject.setShadow(x, y, color, blur, shadowStroke, shadowFill);
};


/** KEYBOARD METHODS------------------------------------------------------------------------------------------------------------------ */

/** 
Creates and returns an object containing 4 hotkeys for Up, Down, Left and Right.
 */
MzPhaser.prototype.createCursorKeys = function() {
	MzPhaser.cursors = this.game.input.keyboard.createCursorKeys();
	return MzPhaser.cursors;
};
MzPhaser.prototype.createKeyboardCursorKeys = function() {
	MzPhaser.cursors = this.game.input.keyboard.createCursorKeys();
	return MzPhaser.cursors;
};


/** 
Crea una nueva tecla.

keycode	integer	- The keycode of the key. Ejemplo: Phaser.Keyboard.SPACEBAR.
 */
MzPhaser.prototype.addKey = function(keycode) {
	return this.game.input.keyboard.addKey(keycode);
};
MzPhaser.prototype.addKeyboardKey = function(keycode) {
	return this.game.input.keyboard.addKey(keycode);
};

/** 
Add an event listener for this signal.

listener	function - The function to call when this Signal is dispatched.
listenerContext	object	<optional> - The context under which the listener will be executed (i.e. the object that should 
	represent the this variable).
priority	number	<optional> - The priority level of the event listener. Listeners with higher priority will be executed 
	before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were 
	added (default = 0)
args	any	<optional> <repeatable> (none) - Additional arguments to pass to the callback (listener) function. They will be 
	appended after any arguments usually dispatched.
 */
MzPhaser.prototype.onDownAdd = function(listener, listenerContext, priority, args) {
	return this.phaserObject.onDown.add(listener, listenerContext, priority, args);
};
MzPhaser.prototype.onKeyDownAddListener = function(listener, listenerContext, priority, args) {
	return this.phaserObject.onDown.add(listener, listenerContext, priority, args);
};


MzPhaser.prototype.leftIsDown = function() {
	return MzPhaser.cursors.left.isDown;
};
MzPhaser.prototype.rightIsDown = function() {
	return MzPhaser.cursors.right.isDown;
};
MzPhaser.prototype.upIsDown = function() {
	return MzPhaser.cursors.up.isDown;
};
MzPhaser.prototype.downIsDown = function() {
	return MzPhaser.cursors.down.isDown;
};

/** END KEYBOARD METHODS------------------------------------------------------------------------------------------------------------------ */



/** 
x	number	<optional> 0 - The horizontal position of this Point.
y	number	<optional> 0 - The vertical position of this Point.
 */
MzPhaser.prototype.newPoint = function(x, y) {
	return new Phaser.Point(x, y);
};

/** 
Rotates this Point around the x/y coordinates given to the desired angle.

x	number - The x coordinate of the anchor point.
y	number - The y coordinate of the anchor point.
angle	number - The angle in radians (unless asDegrees is true) to rotate the Point to.
asDegrees	boolean	<optional> false - Is the given angle in radians (false) or degrees (true)?
distance	number	<optional> - An optional distance constraint between the Point and the anchor.
 */
MzPhaser.prototype.rotate = function(x, y, angle, asDegrees, distance) {
	return this.phaserObject.rotate(x, y, angle, asDegrees, distance);
};
MzPhaser.prototype.rotatePoint = function(x, y, angle, asDegrees, distance) {
	return this.phaserObject.rotate(x, y, angle, asDegrees, distance);
};


/** 
Sets this tween to be a to tween on the properties given. A to tween starts at the current value and tweens to the 
destination value given.

properties	object - An object containing the properties you want to tween, such as Sprite.x or Sound.volume. Given as a 
	JavaScript object.
duration	number	<optional> 1000	- Duration of this tween in ms. Or if Tween.frameBased is true this represents the number 
	of frames that should elapse.
ease	function | string	<optional> null	- Easing function. If not set it will default to Phaser.Easing.Default, which is 
	Phaser.Easing.Linear.None by default but can be over-ridden.
autoStart	boolean	<optional> false - Set to true to allow this tween to start automatically. Otherwise call Tween.start().
delay	number	<optional> 0 - Delay before this tween will start in milliseconds. Defaults to 0, no delay.
repeat	number	<optional> 0 - Should the tween automatically restart once complete? If you want it to run forever set as -1. 
	This only effects this induvidual tween, not any chained tweens.
yoyo	boolean	<optional> false - A tween that yoyos will reverse itself and play backwards automatically. A yoyo'd tween 
	doesn't fire the Tween.onComplete event, so listen for Tween.onLoop instead.
 */
MzPhaser.prototype.addTweenTo = function(properties, duration, ease, autoStart, delay, repeat, yoyo) {
	return this.game.add.tween(this.phaserObject).to(properties, duration, ease, autoStart, delay, repeat, yoyo);
};

/** 
Tell the camera which sprite to follow.

style	number	<optional> - Leverage one of the existing "deadzone" presets. If you use a custom deadzone, ignore this 
	parameter and manually specify the deadzone after calling follow().
target	Phaser.Sprite | Phaser.Image | Phaser.Text <optional> - The object you want the camera to track. Set to null to 
	not follow anything. SI NO SE INDICA UN TARGET, SE ASUME this.phaserObject COMO OBJETIVO.
 */
MzPhaser.prototype.cameraFollow = function(style, target) {
	if (target) return this.game.camera.follow(target, style);
	else return this.game.camera.follow(this.phaserObject, style);
};


MzPhaser.prototype.getCameraX = function() {
	return this.game.camera.x;
};
MzPhaser.prototype.getCameraY = function() {
	return this.game.camera.y;
};


/** 
Hace que la camara no siga a nada...
 */
MzPhaser.prototype.cameraNotFollowAnything = function() {
	return mzph().cameraFollow();
};

/** 
Marca a un objeto como fijo a la camara.
 */
MzPhaser.prototype.setFixedToCamera = function() {
	this.phaserObject.fixedToCamera = true;
};