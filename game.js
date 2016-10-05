var game = new Phaser.Game(1800, 900, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

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
    game.load.image('splash','assets/splash.png');

    game.load.spritesheet('bad-wizard', 'assets/bad-wizard.png', 64, 64);
    game.load.spritesheet('dude', 'assets/wizard.png', 46, 80);
    game.load.spritesheet('fireball', 'assets/fireball.png', 50,30);
}

var backgrounds,
	obstacles, 
	leftWall, 
	topWall, 
	bottomWall, 
	player,  
	scroll, 
	score, 
	timer,
	worldspeed,
	background,
	background2,
	cliffHeight,
	fireballs,
	wizards,
	wizardfireballs,
	stars,
	scoreBoard,
	cursors,
	gameStarted,
	splashScreen;

function create() {
	gameStarted = false;	
	spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	//init global variables
	worldspeed = -150;
	cliffHeight = 255;

    addMoon();
    addStars();
	initializeGroups();
	addBoundaries();
	addStartMessage();
}

function update() {
	game.physics.arcade.collide(stars,leftWall,resetStarPos);

	if(gameStarted){
		updateGame();
	}
	else{
		if(spaceBar.isDown){
			startGame();
		}
	}
}

var startGame = function(){
	//init background objects / object groups
	score = 0;
	timer = 0;

	addBackground();
	game.physics.startSystem(Phaser.Physics.ARCADE);
	removeExtraStars();
    createPlayer();
    splashScreen.destroy();

	cursors = game.input.keyboard.createCursorKeys();

	scoreBoard = game.add.text(15, 15, "Score: " + timer * (score + 1), {
        font: "65px Arial",
        fill: "#DDDDDD",
        align: "center",
    });

    gameStarted = true;
}

var updateGame = function(){
	if(player.alive){
			timer ++;
			if(timer % 75 === 0){
				addRandomObstacles();
			}

			if(timer % 65 === 0 && random(1,3) === 1){	
				addRandomEnemies();
			}

			if(timer % 300 === 0 && random(0,1) === 0 || timer === 200){
				addScroll();
			}
		}		

		bindCollisions();

		playerControls();
		castSpells();
		fireSparkles();	

		backgroundcheck();
		scoreBoard.setText("Score: " + Math.floor((timer / 10) + (score * 100)));
}

var bindCollisions = function(){
	game.physics.arcade.collide(player, obstacles);
	game.physics.arcade.collide(fireballs,obstacles,flip);
	game.physics.arcade.collide(fireballs,player,killPlayer);
	game.physics.arcade.collide(wizardfireballs,player,killPlayer);
	game.physics.arcade.collide(wizards,player,killPlayer);

	game.physics.arcade.collide(fireballs,topWall);
	game.physics.arcade.collide(fireballs,bottomWall);

	game.physics.arcade.collide(leftWall,player);
	game.physics.arcade.collide(topWall,player);

	game.physics.arcade.collide(fireballs,leftWall,destroyObj2);
	game.physics.arcade.collide(leftWall,wizardfireballs,destroyObj2);
	game.physics.arcade.collide(obstacles,wizardfireballs,destroyObj2);
	game.physics.arcade.collide(wizards,leftWall,destroyObj2);

	game.physics.arcade.collide(obstacles,scrolls,destroyObj2);
	game.physics.arcade.collide(obstacles,wizards,destroyObj2);
	game.physics.arcade.collide(player,scrolls,collectScroll);	
}

var addBoundaries = function(){
	leftWall = game.add.sprite(-5, 0, 'invis');
	leftWall.scale.setTo(1,game.world.height/32);
	game.physics.arcade.enable(leftWall);	
	leftWall.body.immovable = true;

	topWall = game.add.sprite(0,cliffHeight - 50,'invis');
	topWall.scale.setTo(game.world.width,1);
	game.physics.arcade.enable(topWall);	
	topWall.body.immovable = true;

	bottomWall = game.add.sprite(0,game.world.height,'ground');
	bottomWall.scale.setTo(game.world.width,1);
	game.physics.arcade.enable(bottomWall);
	bottomWall.body.immovable = true;
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
	backgrounds = game.add.group();
	splashScreen = game.add.group();
	obstacles = game.add.group();
	fireballs = game.add.group();
	scrolls = game.add.group();
	wizards = game.add.group();
	wizardfireballs = game.add.group();
}

var destroyGroups = function(){
	backgrounds.destroy();
	obstacles.destroy();
	fireballs.destroy();
	scrolls.destroy();
	wizards.destroy();
	wizardfireballs.destroy();
}

var killPlayer = function(){
	player.kill();
	gameStarted = false;

	destroyGroups();
	scoreBoard.destroy();
}

var createPlayer = function(){
	player = game.add.sprite(950, 550, 'dude');
    game.physics.arcade.enable(player);		
	player.body.collideWorldBounds = true;	
	player.animations.add('walk');
	player.animations.play('walk',5,true);
	player.flipped = false;
	player.body.width -= 3;
	player.body.height -= 50;
	player.anchor.setTo(.5, .5);
	player.body.offset.y = 40;
	player.alpha = 0;
	game.add.tween(player).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 0, false);
}

var playerControls = function(){
	var max = 250;
	var accel = 15;

	var x = player.body.velocity.x;
	var y = player.body.velocity.y;


	if (cursors.left.isDown)
    {
    	if(!player.flipped){
    		player.flipped = true;
    		player.scale.x *= -1;
    	}
    	if(x > (max * -1) + worldspeed)
        	player.body.velocity.x += -accel;
    }
    else if (cursors.right.isDown)
    {
    	if(player.flipped){
    		player.flipped = false;
    		player.scale.x *= -1;
    	}
    	if(x < max)
        	player.body.velocity.x += accel;
    }
    else{
    	if(x > 0 + worldspeed){
			var vel = player.body.velocity.x;
			vel > accel ? player.body.velocity.x -= accel : player.body.velocity.x = worldspeed;
    	}    		 		
    	else if( x < 0 - worldspeed){
    		var vel = player.body.velocity.x;
    		vel < (accel * -1) + worldspeed ? player.body.velocity.x += accel : player.body.velocity.x = worldspeed;
    	}
    }

    if (cursors.up.isDown)
    {
    	if(y > (max * -1))
        	player.body.velocity.y += -accel;
    }
    else if (cursors.down.isDown){
    	if(y < max)
    		player.body.velocity.y += accel;
    }
    else{
    	if(y > 0){
    		player.body.velocity.y -= accel;	    		
    	}
    		
    	else if( y < 0){
    		player.body.velocity.y += accel;
    	}
    }
}

var addStartMessage = function(){
	var splashImage = game.add.sprite(game.world.width / 2 - 500, game.world.height / 5, 'splash')

	var startMessage = game.add.text(game.world.width / 3, game.world.height / 2 + 300, "Press space to start!", {
        font: "65px Arial",
        fill: "#DDDDDD",
        align: "center",
    });

    startMessage.alpha = .2;
	game.add.tween(startMessage).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 0, -1, true);

	splashScreen.add(startMessage);
	splashScreen.add(splashImage);
}

random = function(min,max){
	var x = Math.floor(Math.random() * (max - min + 1)) + min;
	return x;
}

