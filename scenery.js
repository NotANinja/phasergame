var addStars = function(){
	stars = game.add.group();
	for(var i = 0; i < game.world.width / 80; i ++){
		var star = game.add.sprite(i * 80, random(0,cliffHeight), 'star');
		star.scale.setTo(1.5,1.5);
		game.physics.arcade.enable(star);
		star.body.velocity.x = worldspeed / 30;
		star.vel = star.body.velocity.x;
		star.tint = random(16775215,16777215);

		stars.add(star);

		star = game.add.sprite(i * 80 + 5, random(0,cliffHeight), 'star');
		star.scale.setTo(1,1);
		game.physics.arcade.enable(star);
		star.body.velocity.x = worldspeed / 60;
		star.vel = star.body.velocity.x;
		star.tint = random(16775215,16775315);

		stars.add(star);

		star = game.add.sprite(i * 80 + 25, random(0,cliffHeight), 'star');
		stars.add(star);
	}
}

var backgroundcheck = function(){
	if(background.x <= -game.world.width){
		background.x += 2 *game.world.width;
	}
	else if(background2.x <= -game.world.width){
		background2.x += 2 * game.world.width;
	}
}

var addBackground = function(){
	background = game.add.sprite(0, 0, 'bg');
	game.physics.arcade.enable(background);
	background.body.velocity.x = worldspeed;

	background2 = game.add.sprite(game.world.width, 0, 'bg');
	game.physics.arcade.enable(background2);
	background2.body.velocity.x = worldspeed;
}

var resetStarPos = function(leftwall,star){
	star.x = game.world.width - 50;
	star.body.velocity.x = star.vel;
}

var addMoon = function(){
	game.add.sprite(1500, -50, 'moon');
}