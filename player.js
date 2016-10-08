'use strict';
var player = window.player || {};

player.create = function(){
	game.player = game.add.sprite(950, 550, 'dude');
    game.physics.arcade.enable(game.player);		
	game.player.body.collideWorldBounds = true;	
	game.player.animations.add('walk',[0,1,2,3]);
	game.player.animations.add('death',[4,5]);
	game.player.animations.play('walk',5,true);
	game.player.flipped = false;
	game.player.body.width -= 3;
	game.player.body.height -= 50;
	game.player.anchor.setTo(.5, .5);
	game.player.body.offset.y = 40;

	game.player.alpha = 0;
	game.add.tween(game.player).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 0, false);
}

player.bindControls = function(){
	var max = 270;
	var accel = 20;

	var x = game.player.body.velocity.x;
	var y = game.player.body.velocity.y;


	if (game.cursors.left.isDown)
    {
    	if(!game.player.flipped){
    		game.player.flipped = true;
    		game.player.scale.x *= -1;
    	}
    	if(x > (max * -1) + game.worldspeed)
        	game.player.body.velocity.x += -accel;
    }
    else if (game.cursors.right.isDown)
    {
    	if(game.player.flipped){
    		game.player.flipped = false;
    		game.player.scale.x *= -1;
    	}
    	if(x < max)
        	game.player.body.velocity.x += accel;
    }
    else{
    	if(x > 0 + game.worldspeed){
			var vel = game.player.body.velocity.x;
			vel > accel ? game.player.body.velocity.x -= accel : game.player.body.velocity.x = game.worldspeed;
    	}    		 		
    	else if( x < 0 - game.worldspeed){
    		var vel = game.player.body.velocity.x;
    		vel < (accel * -1) + game.worldspeed ? game.player.body.velocity.x += accel : game.player.body.velocity.x = game.worldspeed;
    	}
    }

    if (game.cursors.up.isDown)
    {
    	if(y > (max * -1))
        	game.player.body.velocity.y += -accel;
    }
    else if (game.cursors.down.isDown){
    	if(y < max)
    		game.player.body.velocity.y += accel;
    }
    else{
    	if(y > 0){
    		game.player.body.velocity.y -= accel;	    		
    	}
    		
    	else if( y < 0){
    		game.player.body.velocity.y += accel;
    	}
    }
}