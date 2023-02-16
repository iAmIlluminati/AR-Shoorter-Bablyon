const BULLET_RESPONSE_TIME = 2000;
var GLOBAL_STATE=1;
var SPRITE_ID=0;
//1-Running
//0-Pause/Stopped
var spriteCounter = 0;
var currentSprite = 0;
const MAX_NUMBER_OF_SPRITES = 4;
var spritesList={
    "spritex":{"alive":true,"position":[0,0,0],"id:":"x"},

}
var createNewPosition = function(){
    return {x:Math.random()*10+2,y:Math.random()*10+1,z:Math.random()*10+4}
}

var createBullet = async function (scene,from, to) {
    if(GLOBAL_STATE==0){return;}
    
    var bulletBallMaterial = new BABYLON.StandardMaterial("bulletBallMaterial", scene);
    bulletBallMaterial.emissiveColor = new BABYLON.Color3(0, 1, 0);  // set neon blue color
    bulletBallMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);  

    let bullet = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.1}, scene);
    bullet.material = bulletBallMaterial;

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
    if(GLOBAL_STATE==0){return;}
    if(currentSprite>=MAX_NUMBER_OF_SPRITES){return}
    var spriteMaterial = new BABYLON.StandardMaterial("spriteMaterial", scene);
    spriteMaterial.diffuseTexture = new BABYLON.Texture("./assets/img/face1.png", scene);

    var attackBallMaterial = new BABYLON.StandardMaterial("attackBallMaterial", scene);
    attackBallMaterial.emissiveColor = new BABYLON.Color3(1, 0, 0);  // set neon blue color
    attackBallMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);  

    let cameraPosition = camera.position;
    let position = createNewPosition()
    var sprite = BABYLON.MeshBuilder.CreateBox("sprite"+spriteCounter, {size: 1}, scene);
    sprite.position = new BABYLON.Vector3(position.x,position.y,position.z);
    sprite.material = spriteMaterial;
    //   Create a particle system
    sprite.isPickable = true;

    const particleSystem = new BABYLON.ParticleSystem("particles", 25);
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.2;

    //Texture of each particle
    particleSystem.particleTexture = new BABYLON.Texture("./assets/img/particle.png");
    particleSystem.emitter = sprite;
    particleSystem.start();
    
    spritesList["sprite"+spriteCounter]={"alive":true,"position":position,"id:":spriteCounter}
    spriteCounter++;
    currentSprite++;

    sprite.actionManager = new BABYLON.ActionManager(scene);
	sprite.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function (evt) {
		var targetPosition= evt.additionalData.pickedPoint
        setTimeout(() => {
            sprite.dispose();
            spritesList[sprite.id]["alive"]=false;
        },BULLET_RESPONSE_TIME)
	}));

    setInterval(() => {
        if(GLOBAL_STATE==0){return;}
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
var loadScene = async function (scene,camera) {
    setInterval(() => {
        createSprite(scene,camera);
    }, 1000);
}


