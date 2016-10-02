window.onload = function(){
	var game = new Phaser.Game(1800, 900, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

	function preload() {
	    game.load.image('ground', 'assets/platform.png');
	    game.load.image('bg','assets/dank2.png');
	    game.load.image('scroll','assets/scroll.png');
	    game.load.image('tree','assets/tree.png');
	    game.load.image('spire','assets/spire.png');
	    game.load.image('invis','assets/invis.png');
	    game.load.image('star','assets/star2.png');
	    game.load.image('moon','assets/moon.png');

	    game.load.spritesheet('bad-wizard', 'assets/bad-wizard.png', 64, 64);
	    game.load.spritesheet('dude', 'assets/wizard.png', 46, 80);
	    game.load.spritesheet('fireball', 'assets/fireball.png', 50,30);
	}

	var obstacles, 
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
		wizards,
		wizardfireballs,
		stars;

	function create() {
		worldspeed = -350;
		cliffHeight = 255;
		score = 0;

		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		stars = game.add.group();
		addStars();

		background = game.add.sprite(0, 0, 'bg');
		game.physics.arcade.enable(background);
		background.body.velocity.x = worldspeed;

		background2 = game.add.sprite(1800, 0, 'bg');
		game.physics.arcade.enable(background2);
		background2.body.velocity.x = worldspeed;

		obstacles = game.add.group();
		obstacles.enableBody = true;

		leftWall = game.add.sprite(0, 0, 'ground');
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

	    player = game.add.sprite(950, 550, 'dude');
	    game.physics.arcade.enable(player);		
		player.body.collideWorldBounds = true;	
		player.animations.add('walk');
		player.animations.play('walk',5,true);
		player.flipped = false;	
		player.anchor.setTo(.5, 0);

		

		var moon = game.add.sprite(1500, -50, 'moon');

		enemies = game.add.group();
		scrolls = game.add.group();
		wizards = game.add.group();
		wizardfireballs = game.add.group();

		cursors = game.input.keyboard.createCursorKeys();

		timer = 0;
	}

	function update() {
		timer ++;
		game.physics.arcade.collide(player, obstacles);
		game.physics.arcade.collide(enemies,obstacles,flip);
		game.physics.arcade.collide(enemies,player,killPlayer);
		game.physics.arcade.collide(wizardfireballs,player,killPlayer);
		game.physics.arcade.collide(wizards,player,killPlayer);

		game.physics.arcade.collide(enemies,topWall);
		game.physics.arcade.collide(enemies,bottomWall);

		game.physics.arcade.collide(leftWall,player);
		game.physics.arcade.collide(topWall,player);

		game.physics.arcade.collide(enemies,leftWall,destroyObj2);
		game.physics.arcade.collide(leftWall,wizardfireballs,destroyObj2);
		game.physics.arcade.collide(obstacles,wizardfireballs,destroyObj2);
		game.physics.arcade.collide(wizards,leftWall,destroyObj2);

		game.physics.arcade.collide(obstacles,scrolls,destroyObj2);
		game.physics.arcade.collide(obstacles,wizards,destroyObj2);
		game.physics.arcade.collide(player,scrolls,collectScroll);

		game.physics.arcade.collide(stars,leftWall,resetStarPos);



		playerControls();
		castSpells();
		fireSparkles();

		if(timer % 150 === 0)
			addRandomObstacles();

		if(timer % 175 === 0 || timer === 5){	
			addRandomEnemies();
		}

		if(timer % 300 === 0 && random(0,1) === 0 || timer === 200){
			addScroll();
		}

		backgroundcheck();
	}

	var fireSparkles = function(){

	}

	var castSpells = function(){
		for(var i = 0; i < wizards.children.length; i++){
			if(random(0,300) === 1){
				wizards.children[i].castFireball();
			}
		}
	}

	var collectScroll = function(player,scroll){
		scroll.kill();
		score ++;
	}

	var resetStarPos = function(leftwall,star){
		star.x = game.world.width - 50;
		star.body.velocity.x = star.vel;
	}

	var backgroundcheck = function(){
		if(background.x <= -game.world.width){
			background.x += 2 *game.world.width;;
		}
		else if(background2.x <= -game.world.width){
			background2.x += 2 * game.world.width;
		}
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

	var killPlayer = function(){
		player.kill();
	}

	var addScroll = function(){
		var scroll = game.add.sprite(game.world.width,random(cliffHeight,game.height),'scroll');
		game.physics.arcade.enable(scroll);
		scroll.body.velocity.x = worldspeed;
		scrolls.add(scroll);
	}

	var addRandomObstacles = function(){
		var obstacle = random(1,3);
		switch(obstacle){
			case 1,2:
				addTree();
				break;
			case 3:
				addSpire();
			default:
				break;
		}				
	}

	var addTree = function(){
		var tree = game.add.sprite(random(game.width,game.width+100),random(cliffHeight,game.world.height),'tree');
				game.physics.arcade.enable(tree);
				tree.enableBody = true;
				tree.body.immovable = true;
				tree.body.velocity.x = worldspeed;

				obstacles.add(tree);
	}

	var addSpire = function(){
		var spire = game.add.sprite(random(game.width,game.width+100),random(cliffHeight,game.height),'spire');
				spire.scale.setTo(1,random(50,125) / 100);
				game.physics.arcade.enable(spire);
				spire.enableBody = true;
				spire.body.immovable = true;
				spire.body.velocity.x = worldspeed;

				obstacles.add(spire);
	}

	var addRandomEnemies = function(){
		addFireballs();
		addBadWizards();
	}

	var addBadWizards = function(){
		var count = 0;
		if(score >= 0 && random(0,1) === 1){
			count = 1;
		}if(score >= 10 && random(0,1) === 1){
			count = 2;
		}

		for(var i = 0; i < count; i++){
			var enemy = game.add.sprite(random(game.width+150, game.width+500),random(cliffHeight,game.height-64),'bad-wizard');
			game.physics.arcade.enable(enemy);
			enemy.body.bounce.x = 1;
			enemy.body.velocity.x = worldspeed;

			enemy.animations.add('suck');
			enemy.animations.play('suck',5,true);
			enemy.lifespan = 30 * 1000;

			enemy.castFireball = function(){
				var fireball = game.add.sprite(this.position.x, this.position.y,'fireball');
				game.physics.arcade.enable(fireball);
				fireball.body.velocity.x =  this.body.velocity.x -100;
				fireball.tint = parseInt('0000FF',16);
				fireball.body.bounce.x = 1;
				fireball.lifespan = 5000;
				wizardfireballs.add(fireball);
			}

			wizards.add(enemy);
		}
	}

	var addFireballs = function(){
		var count = random(1,2);

		for(var i = 0; i < count; i++){
			var enemy = game.add.sprite(random(game.width+150, game.width+500),random(0,game.height),'fireball');
			game.physics.arcade.enable(enemy);

			enemy.body.bounce.y = 1;
			enemy.body.velocity.y = -200;
			enemy.body.bounce.x = 1;
			enemy.body.velocity.x = random(worldspeed * 1.5,worldspeed * 2);

			enemy.body.maxVelocity.x = 500;

			enemy.flipped = false;

			enemy.lifespan = 60 * 1000;

			enemy.scale.setTo(1.5,1.5);

			enemy.animations.add('fire');
			enemy.animations.play('fire',10,true);

			enemies.add(enemy);
		}
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

	var addStars = function(){
		for(var i = 0; i < game.world.width / 20; i ++){
			var star = game.add.sprite(i * 20, random(0,cliffHeight), 'star');
			star.scale.setTo(1.5,1.5);
			game.physics.arcade.enable(star);
			star.body.velocity.x = worldspeed / 2;
			star.vel = star.body.velocity.x;
			star.tint = random(16775215,16777215);

			stars.add(star);

			star = game.add.sprite(i * 20 + 5, random(0,cliffHeight), 'star');
			star.scale.setTo(1,1);
			game.physics.arcade.enable(star);
			star.body.velocity.x = worldspeed / 3;
			star.vel = star.body.velocity.x;
			star.tint = random(16775215,16777215);

			stars.add(star);
		}
	}

	random = function(min,max){
		var x = Math.floor(Math.random() * (max - min + 1)) + min;
		return x;
	}
};

