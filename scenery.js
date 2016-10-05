var addStars = function(){
	stars = game.add.group();
	for(var i = 0; i < game.world.width / 20; i ++){

		var star = CreateStar(i * 20, random(0,game.world.height),1.5,worldspeed / 2, random(16775215,16777215));
		stars.add(star);

		var star = CreateStar(i * 20 + 5,  random(0,game.world.height), 1, worldspeed / 10, random(16775215,16775315));
		stars.add(star);

		star = game.add.sprite(i * 80 + 25, random(0,game.world.height), 'star');
		stars.add(star);
	}
}

var CreateStar = function(xPosition,yPosition,scale,speed,tint){
	var star = game.add.sprite(xPosition, yPosition, 'star');
	star.scale.setTo(scale,scale);
	game.physics.arcade.enable(star);
	star.body.velocity.x = speed;
	star.vel = star.body.velocity.x;
	star.tint = tint;

	return star
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
	background.alpha = 0;
	game.add.tween(background).to( { alpha: 1 }, 700, Phaser.Easing.Linear.None, true, 0, 0, false);
	backgrounds.add(background);

	background2 = game.add.sprite(game.world.width, 0, 'bg');
	game.physics.arcade.enable(background2);
	background2.body.velocity.x = worldspeed;
	background2.alpha = 0;
	game.add.tween(background2).to( { alpha: 1 }, 700, Phaser.Easing.Linear.None, true, 0, 0, false);
	backgrounds.add(background2);
}

var resetStarPos = function(leftwall,star){
	star.x = game.world.width - 50;
	star.body.velocity.x = star.vel;
}

var addMoon = function(){
	game.add.sprite(1500, -50, 'moon');
}

var removeExtraStars = function(){
	for(var i = 0; i < stars.children.length; i++){
		if(stars.children[i].position.y > cliffHeight){
			console.log('stargone');
			stars.children[i].kill();
		}
	}
}