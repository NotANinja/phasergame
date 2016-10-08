'use strict';
var scenery = window.scenery || {};
scenery.addStars = function(){
	game.stars = game.add.group();
	for(var i = 0; i < game.world.width / 20; i ++){

		var star = this.CreateStar(i * 20, random(0,game.world.height),1.5,game.worldspeed / 2, random(16775215,16777215));
		game.stars.add(star);

		var star = this.CreateStar(i * 20 + 5,  random(0,game.world.height), 1, game.worldspeed / 10, random(16775215,16775315));
		game.stars.add(star);

		star = game.add.sprite(i * 80 + 25, random(0,game.world.height), 'star');
		game.stars.add(star);
	}
}

scenery.CreateStar = function(xPosition,yPosition,scale,speed,tint){
	var star = game.add.sprite(xPosition, yPosition, 'star');
	star.scale.setTo(scale,scale);
	game.physics.arcade.enable(star);
	star.body.velocity.x = speed;
	star.vel = star.body.velocity.x;
	star.tint = tint;

	return star
}

scenery.backgroundcheck = function(){
	var children = game.backgrounds.children;

	if(children[0].x <= -game.world.width){
		children[0].x += 2 *game.world.width;
	}
	else if(children[1].x <= -game.world.width){
		children[1].x += 2 * game.world.width;
	}
}

scenery.addBackground = function(){
	var background = game.add.sprite(0, 0, 'bg');
	game.physics.arcade.enable(background);
	background.body.velocity.x = game.worldspeed;
	background.alpha = 0;
	game.add.tween(background).to( { alpha: 1 }, 700, Phaser.Easing.Linear.None, true, 0, 0, false);

	//resize for smaller viewports
	background.scale.setTo(game.world.width / 1800, 1);
	game.backgrounds.add(background);

	var background2 = game.add.sprite(game.world.width, 0, 'bg');
	game.physics.arcade.enable(background2);
	background2.body.velocity.x = game.worldspeed;
	background2.alpha = 0;
	game.add.tween(background2).to( { alpha: 1 }, 700, Phaser.Easing.Linear.None, true, 0, 0, false);

	//resize for smaller viewports
	background2.scale.setTo(game.world.width / 1800, 1);
	game.backgrounds.add(background2);
}

scenery.resetStarPos = function(leftwall,star){
	star.x = game.world.width - 50;
	star.body.velocity.x = star.vel;
}

scenery.addMoon = function(){
	game.add.sprite(1500, -50, 'moon');
}