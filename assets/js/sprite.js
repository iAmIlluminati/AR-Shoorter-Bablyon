

var createSprite = async function (scene,camera, playerEntity) {
    var spriteMaterial = new BABYLON.StandardMaterial("spriteMaterial", scene);
    spriteMaterial.diffuseTexture = new BABYLON.Texture("./assets/img/face1.png", scene);

    var attackBallMaterial = new BABYLON.StandardMaterial("attackBallMaterial", scene);
    attackBallMaterial.emissiveColor = new BABYLON.Color3(1, 0, 0);  // set neon blue color
    attackBallMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);  

    let cameraPosition = playerEntity.position;
    let position ={x:2,y:1,z:4}
    var sprite = BABYLON.MeshBuilder.CreateBox("sprite"+0, {size: 1}, scene);
    sprite.position = new BABYLON.Vector3(position.x,position.y,position.z);
    sprite.material = spriteMaterial;
    //   Create a particle system
    sprite.isPickable = true;

    const particleSystem = new BABYLON.ParticleSystem("particles", 10);

    //Texture of each particle
    particleSystem.particleTexture = new BABYLON.Texture("./assets/img/flare.png");
    particleSystem.emitter = sprite;
    particleSystem.start();

    sprite.actionManager = new BABYLON.ActionManager(scene);
	sprite.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function () {
		console.log("sprite")
	}));

    setInterval(() => {
        let attackBall = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.1}, scene);
        attackBall.position = new BABYLON.Vector3(position.x, position.y, position.z);
       
        attackBall.material = attackBallMaterial;

        var animationBox = new BABYLON.Animation("myAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        var keys = [];
        keys.push({
            frame: 0,
            value: attackBall.position
        });
        keys.push({
            frame: 100,
            value: cameraPosition
        });
        
        animationBox.setKeys(keys);
        
        attackBall.animations = [];
        attackBall.animations.push(animationBox);
        attackBall.checkCollisions = true;


        scene.beginAnimation(attackBall, 0, 100, false);
        // Check for collision in each frame
        scene.registerBeforeRender(function () {
            var collisions = attackBall.intersectsMesh(playerEntity);
            if (collisions.length > 0) {
                console.log("Collision detected!"+collisions.length);
            }
        });

    }, 3000);

    
}



