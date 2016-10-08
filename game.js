'use strict';
window.onload = function(){
	var gameWidth = Math.min(Math.max(1000, $(window).width()), 1800);

	window.game = new Phaser.Game(gameWidth, 900, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });	

//declare game variables
	game.backgrounds;
	game.obstacles;
	game.leftWall; 
	game.topWall;
	game.bottomWall;
	game.player;
	scroll;
	game.score;
	game.timer;
	game.worldspeed;
	game.cliffHeight;
	game.fireballs;
	game.wizards;
	game.wizardfireballs;
	game.stars;
	game.scoreBoard;
	game.cursors;
	game.gameStarted;
	game.splashScreen;


function preload() {
    game.load.image('ground', 'assets/platform.png');
    game.load.image('bg','assets/bg-dark.png');
    game.load.image('scroll','assets/scroll.png');
    game.load.image('tree','assets/tree-dark.png');
    game.load.image('spire','assets/spire-dark.png');
    game.load.image('invis','assets/invis.png');
    game.load.image('star','assets/star.png');
    game.load.image('smoke','assets/smoke.png');
    game.load.image('moon','assets/moon.png');

    game.load.spritesheet('bad-wizard', 'assets/bad-wizard.png', 64, 64);
    game.load.spritesheet('dude', 'assets/wizard.png', 46, 80);
    game.load.spritesheet('fireball', 'assets/fireball.png', 50,30);
    game.load.spritesheet('splash','assets/splash.png',1000,540);
}

function create() {
	game.gameStarted = false;	
	game.spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	//init global variables
	game.worldspeed = -50 - (0.05 * gameWidth);
	game.cliffHeight = 255;

    scenery.addMoon();
    scenery.addStars();
	initializeGroups();
	addBoundaries();
	game.addSplashScreen();
}

function update() {
	game.physics.arcade.collide(game.stars,game.leftWall,scenery.resetStarPos);

	if(game.gameStarted){
		updateGame();
	}
	else{
		if(game.spaceBar.isDown){
			startGame();
		}
	}
}

var startGame = function(){
	//init background objects / object groups
	game.score = 0;
	game.timer = 0;
	if(game.scoreBoard != undefined){
		game.scoreBoard.destroy();
	}

	scenery.addBackground();
	game.physics.startSystem(Phaser.Physics.ARCADE);
    player.create();
    game.splashScreen.removeBetween(0);

	game.cursors = game.input.keyboard.createCursorKeys();

	game.scoreBoard = game.add.text(15, 15, "Score: " + game.timer * (game.score + 1), {
        font: "65px Arial",
        fill: "#DDDDDD",
        align: "center",
    });

    game.gameStarted = true;
}

var updateGame = function(){
	if(game.player.alive){
			game.timer ++;
			if(game.timer % 75 === 0){
				obstacle.addRandomObstacles();
			}

			if(game.timer % 65 === 0 && random(1,3) === 1){	
				enemy.addRandomEnemies();
			}

			if(game.timer % 300 === 0 && random(0,1) === 0 || game.timer === 200){
				enemy.addScroll();
			}
		}		

		bindCollisions();

		player.bindControls();
		enemy.castSpells();
		enemy.fireSparkles();	

		if(game.backgrounds.children.length > 1){
			scenery.backgroundcheck();
		}

		game.scoreBoard.setText("Score: " + Math.floor((game.timer / 10) + (game.score * 100)));
}

var bindCollisions = function(){
	game.physics.arcade.collide(game.player, game.obstacles);
	game.physics.arcade.collide(game.fireballs,game.obstacles,flip);
	game.physics.arcade.collide(game.fireballs,game.player,endGame);
	game.physics.arcade.collide(game.wizardfireballs,game.player,endGame);
	game.physics.arcade.collide(game.wizards,game.player,endGame);

	game.physics.arcade.collide(game.fireballs,game.topWall);
	game.physics.arcade.collide(game.fireballs,game.bottomWall);

	game.physics.arcade.collide(game.leftWall,game.player);
	game.physics.arcade.collide(game.topWall,game.player);

	game.physics.arcade.collide(game.fireballs,game.leftWall,destroyObj2);
	game.physics.arcade.collide(game.leftWall,game.wizardfireballs,destroyObj2);
	game.physics.arcade.collide(game.obstacles,game.wizardfireballs,destroyObj2);
	game.physics.arcade.collide(game.wizards,game.leftWall,destroyObj2);

	game.physics.arcade.collide(game.obstacles,game.scrolls,destroyObj2);
	game.physics.arcade.collide(game.obstacles,game.wizards,destroyObj2);
	game.physics.arcade.collide(game.player,game.scrolls,enemy.collectScroll);	
}

var addBoundaries = function(){
	game.leftWall = game.add.sprite(-5, 0, 'invis');
	game.leftWall.scale.setTo(1,game.world.height/32);
	game.physics.arcade.enable(game.leftWall);	
	game.leftWall.body.immovable = true;

	game.topWall = game.add.sprite(0,game.cliffHeight - 50,'invis');
	game.topWall.scale.setTo(game.world.width,1);
	game.physics.arcade.enable(game.topWall);	
	game.topWall.body.immovable = true;

	game.bottomWall = game.add.sprite(0,game.world.height,'ground');
	game.bottomWall.scale.setTo(game.world.width,1);
	game.physics.arcade.enable(game.bottomWall);
	game.bottomWall.body.immovable = true;
}

var flip = function(obj1,obj2){
	if(! obj1.flipped && obj1.body.velocity.x > 1){
		obj1.flipped = true;
		obj1.scale.x *= -1;
	}
	if(obj1.flipped && obj1.body.velocity.x < 1){
		obj1.flipped = false;
		obj1.scale.x *= -1;
	}
}

var destroyObj2 = function(obj1,obj2){
	obj2.destroy();
}

var initializeGroups = function(){
	game.backgrounds = game.add.group();
	game.splashScreen = game.add.group();
	game.obstacles = game.add.group();
	game.fireballs = game.add.group();
	game.scrolls = game.add.group();
	game.wizards = game.add.group();
	game.wizardfireballs = game.add.group();
}

var removeGameSprites = function(){
	//remove all game elements from groups
	game.player.kill();
	game.backgrounds.removeBetween(0);
	game.obstacles.removeBetween(0);
	game.fireballs.removeBetween(0);
	game.scrolls.removeBetween(0);
	game.wizards.removeBetween(0);
	game.wizardfireballs.removeBetween(0);
}

var endGame = function(){
	game.player.body.enable = false;
	game.player.animations.play('death',2,false);
	
	game.add.tween(game.obstacles).to( { alpha: 0 }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
	game.add.tween(game.fireballs).to( { alpha: 0 }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
	game.add.tween(game.scrolls).to( { alpha: 0 }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
	game.add.tween(game.wizards).to( { alpha: 0 }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
	game.add.tween(game.wizardfireballs).to( { alpha: 0 }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
	game.add.tween(game.backgrounds).to( { alpha: 0 }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
	var tween = game.add.tween(game.player).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
	
	tween.onComplete.add(removeGameSprites);	
	tween.onComplete.add(game.addSplashScreen);
	tween.onComplete.add(function(){
		game.gameStarted = false;
		game.obstacles.alpha = 1;
		game.	fireballs.alpha = 1;
		game.scrolls.alpha = 1;
		game.wizards.alpha = 1;
		game.wizardfireballs.alpha = 1;
		game.backgrounds.alpha = 1;
	});
}

game.addSplashScreen = function(){
	var splashImage = game.add.sprite(game.world.width / 2 - 500, game.world.height / 5, 'splash');
	splashImage.animations.add('splash');
	splashImage.animations.play('splash',10,true);
	splashImage.alpha = 0;
	game.add.tween(splashImage).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);

	var startMessage = game.add.text((game.world.width / 2) - 350, (game.world.height / 2) + 300, "Collect scrolls to get points. \nPress space to start!", {
        font: "65px Arial",
        fill: "#DDDDDD",
        align: "center",
    });

    startMessage.alpha = .2;
	game.add.tween(startMessage).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 0, -1, true);

	game.splashScreen.add(startMessage);
	game.splashScreen.add(splashImage);
}
};

var random = function(min,max){
	var x = Math.floor(Math.random() * (max - min + 1)) + min;
	return x;
}