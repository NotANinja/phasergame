var obstacle = window.obstacle || {};
obstacle.addRandomObstacles = function(){
	var obstacleType = random(1,3);
	switch(obstacleType){
		case 1,2:
			this.addTree();
			break;
		case 3:
			this.addSpire();
		default:
			break;
	}				
}

obstacle.addTree = function(){
	var tree = game.add.sprite(random(game.width,game.width+10),random(game.cliffHeight,game.world.height - 160),'tree');
			game.physics.arcade.enable(tree);
			tree.enableBody = true;
			tree.body.immovable = true;
			tree.body.velocity.x = game.worldspeed;

			game.obstacles.add(tree);
}

obstacle.addSpire = function(){
	var spire = game.add.sprite(random(game.width,game.width+100),random(game.cliffHeight,game.height - 50),'spire');
			spire.scale.setTo(1,random(50,125) / 100);
			game.physics.arcade.enable(spire);
			spire.enableBody = true;
			spire.body.immovable = true;
			spire.body.velocity.x = game.worldspeed;

			game.obstacles.add(spire);
}