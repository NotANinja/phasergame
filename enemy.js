'use strict';
var enemy = window.enemy || {};

enemy.addRandomEnemies = function(){
	this.addFireballs();
	this.addBadWizards();
}

enemy.addBadWizards = function(){
	var count = 0;
	if(game.score >= 5 && random(0,1) === 1){
		count = 1;
	}if(game.score >= 10 && random(0,1) === 1){
		count = 2;
	}

	for(var i = 0; i < count; i++){
		var enemy = game.add.sprite(random(game.width+150, game.width+500),random(game.cliffHeight,game.height-64),'bad-wizard');
		game.physics.arcade.enable(enemy);
		enemy.body.bounce.x = 1;
		enemy.body.immovable = true;
		enemy.body.velocity.x = game.worldspeed;

		enemy.animations.add('suck');
		enemy.animations.play('suck',5,true);
		enemy.lifespan = 30 * 1000;

		enemy.castFireball = function(){
			var fireball = game.add.sprite(this.position.x, this.position.y,'fireball');
			game.physics.arcade.enable(fireball);
			fireball.body.velocity.x =  this.body.velocity.x -100;
			fireball.tint = parseInt('00FFFF',16);
			fireball.body.bounce.x = 1;
			fireball.lifespan = 5000;
			game.wizardfireballs.add(fireball);
		}

		game.wizards.add(enemy);
	}
}

enemy.addFireballs = function(){
	var count = 0;
	if(game.score < 3){
		count = random(0,1);
	} else if(game.score >= 3 && game.score < 10){
		count = random(0,2);
	}else if(game.score >= 10){
		count = random(0,4);
	}

	for(var i = 0; i < count; i++){
		let enemy = game.add.sprite(game.width,random(game.cliffHeight,game.height),'fireball');
		game.physics.arcade.enable(enemy);

		enemy.body.bounce.y = 1;
		enemy.body.velocity.y = -200;
		enemy.body.bounce.x = 1;
		enemy.body.velocity.x = random(game.worldspeed * 2,game.worldspeed * 3);

		enemy.body.maxVelocity.x = 500;

		enemy.flipped = false;

		enemy.lifespan = 60 * 1000;

		enemy.scale.setTo(1.5,1.5);

		enemy.animations.add('fire');
		enemy.animations.play('fire',10,true);

		enemy.anchor.setTo(.1, 0.5);
		enemy.body.width -= 3;

		game.fireballs.add(enemy);
	}
}

enemy.fireSparkles = function(){
	for(var i = 0; i < game.fireballs.children.length; i++){
		if(random(0,10) === 0){
			var ball = game.fireballs.children[i];
			var x = ball.flipped ? ball.position.x - 70 : ball.position.x + 50;

			var s = game.add.sprite(
				x,
				random(ball.position.y + 10,ball.position.y + 25),
				'smoke');
			game.physics.arcade.enable(s);
			s.body.velocity.x = random(-23,23);
			s.body.velocity.y = random(-23,23);
			s.scale.setTo(6,6);
			s.alpha = random(20,50) / 100;;
			s.lifespan = 1000;
		}
	}
}

enemy.castSpells = function(){
	for(var i = 0; i < game.wizards.children.length; i++){
		if(random(0,100) === 1){
			game.wizards.children[i].castFireball();
		}
	}
}

enemy.addScroll = function(){
	var scroll = game.add.sprite(game.world.width,random(game.cliffHeight,game.height - 50),'scroll');
	game.physics.arcade.enable(scroll);
	scroll.body.velocity.x = game.worldspeed;
	game.scrolls.add(scroll);
}

enemy.collectScroll = function(player,scroll){
	scroll.kill();
	game.score ++;
}