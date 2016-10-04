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
	var tree = game.add.sprite(random(game.width,game.width+10),random(cliffHeight,game.world.height - 160),'tree');
			game.physics.arcade.enable(tree);
			tree.enableBody = true;
			tree.body.immovable = true;
			tree.body.velocity.x = worldspeed;

			obstacles.add(tree);
}

var addSpire = function(){
	var spire = game.add.sprite(random(game.width,game.width+100),random(cliffHeight,game.height - 50),'spire');
			spire.scale.setTo(1,random(50,125) / 100);
			game.physics.arcade.enable(spire);
			spire.enableBody = true;
			spire.body.immovable = true;
			spire.body.velocity.x = worldspeed;

			obstacles.add(spire);
}