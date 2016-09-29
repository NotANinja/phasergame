window.onload = function(){
	var game = new Phaser.Game(1800, 900, Phaser.AUTO, '', { preload: preload, create: create, update: update });

	function preload() {
		game.load.image('sky', 'assets/sky.png');
	    game.load.image('ground', 'assets/platform.png');
	    game.load.image('fireball', 'assets/fireball.png');
	    game.load.image('bg','assets/dank.png');
	    game.load.image('scroll','assets/scroll.png');
	    game.load.spritesheet('dude', 'assets/bad-wizard.png', 32, 48);
	}

	function create() {
		game.physics.startSystem(Phaser.Physics.ARCADE);

		var sky = game.add.sprite(0, 0, 'bg');

		platforms = game.add.group();
		platforms.enableBody = true;

		leftWall = game.add.sprite(0, 0, 'ground');
		leftWall.scale.setTo(1,game.world.height/32);
		game.physics.arcade.enable(leftWall);	
		leftWall.body.immovable = true;

		topWall = game.add.sprite(0,-32,'ground');
		topWall.scale.setTo(game.world.width,1);
		game.physics.arcade.enable(topWall);	
		topWall.body.immovable = true;

		bottomWall = game.add.sprite(0,game.world.height,'ground');
		bottomWall.scale.setTo(game.world.width,1);
		game.physics.arcade.enable(bottomWall);
		bottomWall.body.immovable = true;

	    player = game.add.sprite(32, game.world.height - 150, 'dude');
	    game.physics.arcade.enable(player);		
		player.body.collideWorldBounds = true;



		enemies = game.add.group();
		scrolls = game.add.group();
		


		cursors = game.input.keyboard.createCursorKeys();

		timer = 0;
	}

	function update() {
		timer ++;
		game.physics.arcade.collide(player, platforms);
		game.physics.arcade.collide(enemies,platforms,flip);
		game.physics.arcade.collide(enemies,player);
		game.physics.arcade.collide(enemies,topWall);
		game.physics.arcade.collide(enemies,bottomWall);

		game.physics.arcade.collide(leftWall,player);
		game.physics.arcade.collide(enemies,leftWall,killobj2);
		game.physics.arcade.collide(platforms,scrolls,killobj2);


		playerControls();

		//add a random terrain obstacle every 300 ticks (with 5 seconds randomness built in)
		// if((timer % 150 === 0 && random(0,1) === 1) || timer % 300 === 0){
		// 	addRandomPlatforms();	
		// }
		if(timer % 150 === 0)
			addRandomPlatforms();

		if(timer % 175 === 0){	
			addRandomEnemies();
		}

		if(timer % 20 === 0){
			addScroll();
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

	var killobj2 = function(obj1,obj2){
		console.log(obj2)
		obj2.kill();
	}

	var addScroll = function(){
		var scroll = game.add.sprite(game.world.width,random(0,game.height),'scroll');
		game.physics.arcade.enable(scroll);
		scroll.body.velocity.x = -150;
		scroll.scale.setTo(1.5,1.5);
		scrolls.add(scroll);
	}

	var addRandomPlatforms = function(){
			//var clusterOrigin = random(0,game.height - 300);
				var platform = game.add.sprite(random(game.width,game.width+100),random(0,game.height),'ground');
				platform.scale.setTo(random(3,10),random(5,10));
				game.physics.arcade.enable(platform);
				platform.enableBody = true;
				platform.body.immovable = true;
				platform.body.velocity.x = -150;

				platforms.add(platform);
	}

	var addRandomEnemies = function(){
		for(var i = 0; i < random(1,10); i++){
			var enemy = game.add.sprite(random(game.width+150, game.width+500),random(0,game.height),'fireball');
			game.physics.arcade.enable(enemy);

			enemy.body.bounce.y = 1;
			enemy.body.velocity.y = -100;
			enemy.body.bounce.x = 1;
			enemy.body.velocity.x = random(-300,-500);

			enemy.body.maxVelocity.x = 500;

			enemy.flipped = false;

			enemies.add(enemy);
		}
	}

	var playerControls = function(){
		var max = 250;
		var accel = 30;
		var naturalDecel = 5;

		var x = player.body.velocity.x;
		var y = player.body.velocity.y;


		if (cursors.left.isDown)
	    {
	    	
	    	if(x > (max * -1))
	        	player.body.velocity.x += -accel;
	    }
	    else if (cursors.right.isDown)
	    {
	    	if(x < max)
	        	player.body.velocity.x += accel;
	    }
	    else{
	    	if(x > 0)
	    		player.body.velocity.x -= naturalDecel;	    		
	    	else if( x < 0)
	    		player.body.velocity.x += naturalDecel;
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
	    	if(y > 0)
	    		player.body.velocity.y -= naturalDecel;
	    	else if( y < 0)
	    		player.body.velocity.y += naturalDecel;
	    }
	}

	random = function(min,max){
		var x = Math.floor(Math.random() * (max - min + 1)) + min;
		return x;
	}
};

