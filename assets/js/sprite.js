const BULLET_RESPONSE_TIME = 1000;
var spritesList={
    "spritex":{"alive":true,"position":[0,0,0],"id:":"x"},

}
var spriteCounter = 0;
var createBullet = async function (scene,from, to) {
    // from = new BABYLON.Vector3(from._x,from._y,from._z)
    // to = new BABYLON.Vector3(to._x,to._y,to._z)
    //write a babylonjs code to load a gltf model from ./assets/models/bullet/scene.gltf at 
    //position from and set animation for it from posiion from to position to
    console.log("createBullet")
    // BABYLON.SceneLoader.ImportMesh("", "/assets/models/bullet/", "scene.gltf", scene, function (newMeshes) {
    //     var bullet = newMeshes[0];
    //     bullet.position = from;
    //     var bulletAnimation = new BABYLON.Animation("myAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    //     var keys = [];
    //     keys.push({
    //         frame: 0,
    //         value: bullet.position
    //     });
    //     keys.push({
    //         frame: 100,
    //         value: to
    //     });
        
    //     bulletAnimation.setKeys(keys);
        
    //     bullet.animations = [];
    //     bullet.animations.push(bulletAnimation);
    //     bullet.checkCollisions = true;
    //     scene.beginAnimation(bullet, 0, 100, false);
    //     setTimeout(() => {
    //         bullet.dispose();
    //     },5000)
    // });

    var bulletBallMaterial = new BABYLON.StandardMaterial("bulletBallMaterial", scene);
    bulletBallMaterial.emissiveColor = new BABYLON.Color3(0, 1, 0);  // set neon blue color
    bulletBallMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);  

    let bullet = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.1}, scene);
    // let bullet = await BABYLON.SceneLoader.ImportMesh("", "/assets/models/bullet/", "scene.gltf", scene)
    // const particleSystem = new BABYLON.ParticleSystem("particles", 200);
    bullet.material = bulletBallMaterial;

    // //Texture of each particle
    // particleSystem.particleTexture = new BABYLON.Texture("./assets/img/particle.png");
    // particleSystem.minSize = 0.3;
    // particleSystem.maxSize = 0.6;
    // particleSystem.emitter = bullet;
    // particleSystem.start();


    bullet.position = from;
    console.log(to)
        let bulletAnimation = new BABYLON.Animation("myAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        let keys = [];
        keys.push({
            frame: 0,
            value: bullet.position
        });
        keys.push({
            frame: 48,
            value: to
        });
        
        bulletAnimation.setKeys(keys);
        
        bullet.animations = [];
        bullet.animations.push(bulletAnimation);
        scene.beginAnimation(bullet, 0, 48, false);
        setTimeout(() => {
            bullet.dispose();
        },BULLET_RESPONSE_TIME)

    
}
var createSprite = async function (scene,camera) {
    var spriteMaterial = new BABYLON.StandardMaterial("spriteMaterial", scene);
    spriteMaterial.diffuseTexture = new BABYLON.Texture("./assets/img/face1.png", scene);

    var attackBallMaterial = new BABYLON.StandardMaterial("attackBallMaterial", scene);
    attackBallMaterial.emissiveColor = new BABYLON.Color3(1, 0, 0);  // set neon blue color
    attackBallMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);  

    let cameraPosition = camera.position;
    let position ={x:2,y:1,z:4}
    var sprite = BABYLON.MeshBuilder.CreateBox("sprite"+spriteCounter, {size: 1}, scene);
    sprite.position = new BABYLON.Vector3(position.x,position.y,position.z);
    sprite.material = spriteMaterial;
    //   Create a particle system
    sprite.isPickable = true;

    const particleSystem = new BABYLON.ParticleSystem("particles", 5);
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.2;

    //Texture of each particle
    particleSystem.particleTexture = new BABYLON.Texture("./assets/img/particle.png");
    particleSystem.emitter = sprite;
    particleSystem.start();

    sprite.actionManager = new BABYLON.ActionManager(scene);
	sprite.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function (evt) {
		var targetPosition= evt.additionalData.pickedPoint
        console.log(sprite)
        setTimeout(() => {
            sprite.dispose();
            console.log(sprite)
        },BULLET_RESPONSE_TIME)
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

        setTimeout(() => {
            attackBall.dispose();
        },5000)
    }, 3000);

    
}



