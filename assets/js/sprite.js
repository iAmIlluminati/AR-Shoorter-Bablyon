const BULLET_RESPONSE_TIME = 300;
const SPRITE_ATTACK_RATE = 3000;
const SPRITE_ATTACK_SPEED = 3000;
var GLOBAL_STATE=0;
var SCORE=0;
//1-Running
//0-Pause/Stopped


var SPRITE_ID = 0;
var currentAvailableSprite = 0;
const MAX_NUMBER_OF_SPRITES = 2;

var spritesList={
    "spritex":{"alive":false,"position":[0,0,0],"id:":"x","attack":false},

}



var createNewPosition = function(){
    return {x:Math.random()*5+2,y:Math.random()*5+1,z:Math.random()*5+4}
}

var createBullet = async function (scene,from, to) {
    if(GLOBAL_STATE==0){return;}
    
    
    
    
    
    
    var bulletBallMaterial = new BABYLON.StandardMaterial("bulletBallMaterial", scene);
    bulletBallMaterial.emissiveColor = new BABYLON.Color4(1, 0, 0, 1)  // set neon blue color
    bulletBallMaterial.diffuseColor = new BABYLON.Color4(1, 1, 0, 1)  


    let bullet = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.1}, scene);
    bullet.material = bulletBallMaterial;

    bullet.position = from;
    // console.log(to)
        let bulletAnimation = new BABYLON.Animation("myAnimation", "position", 24, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        let keys = [];
        keys.push({
            frame: 0,
            value: bullet.position
        });
        keys.push({
            frame: 24*BULLET_RESPONSE_TIME/1000,
            value: to
        });
        
        bulletAnimation.setKeys(keys);
        
        bullet.animations = [];
        bullet.animations.push(bulletAnimation);
        scene.beginAnimation(bullet, 0, 24*BULLET_RESPONSE_TIME/1000, false);
        setTimeout(() => {
            bullet.dispose();
        },BULLET_RESPONSE_TIME)

    
}
var createSprite = async function (scene,camera) {
    if(currentAvailableSprite>=MAX_NUMBER_OF_SPRITES){return}
    var spriteMaterial = new BABYLON.StandardMaterial("spriteMaterial", scene);
    spriteMaterial.diffuseTexture = new BABYLON.Texture("./assets/img/face"+Math.ceil(Math.random()*4)+".png", scene);
    currentAvailableSprite++;

    let position = createNewPosition()
    let positionVector = new BABYLON.Vector3(position.x,position.y,position.z);
    var sprite = BABYLON.MeshBuilder.CreateBox("sprite"+SPRITE_ID, {size: 1}, scene);

    sprite.position = positionVector;

    sprite.material = spriteMaterial;
    sprite.isPickable = true;
    console.log("sprite created")

    // Create the explosion particle system
    var explosionParticleSystem = new BABYLON.ParticleSystem("particles", 200, scene);
    explosionParticleSystem.particleTexture = new BABYLON.Texture("./assets/img/flare.png", scene);
    explosionParticleSystem.emitter = sprite;
    explosionParticleSystem.minEmitBox = new BABYLON.Vector3(-0.25, -0.25, -0.25); // set the range of the particles
    explosionParticleSystem.maxEmitBox = new BABYLON.Vector3(0.25, 0.25, 0.25);
    explosionParticleSystem.color1 = new BABYLON.Color4(1, 0, 0, 1); // set the color of the particles
    explosionParticleSystem.color2 = new BABYLON.Color4(1, 1, 0, 1);
    explosionParticleSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0);
    explosionParticleSystem.minSize = 0.2; // set the size of the particles
    explosionParticleSystem.maxSize = 0.5;
    explosionParticleSystem.minLifeTime = 0.3; // set the lifetime of the particles
    explosionParticleSystem.maxLifeTime = 1.5;
    explosionParticleSystem.emitRate = 200; // set the rate of the particles
    explosionParticleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0); // set the gravity of the particles
    explosionParticleSystem.direction1 = new BABYLON.Vector3(-1, 1, 0); // set the direction of the particles
    explosionParticleSystem.direction2 = new BABYLON.Vector3(1, 1, 0);
    explosionParticleSystem.minAngularSpeed = 0;
    explosionParticleSystem.maxAngularSpeed = Math.PI;
    explosionParticleSystem.minEmitPower = 1;
    explosionParticleSystem.maxEmitPower = 2;
    explosionParticleSystem.updateSpeed = 0.005;


    var spriteRotationAnimation1 = new BABYLON.Animation("spriteRotationAnimation", "rotation.y", 24, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);    
    var keys1 = [];
    keys1.push({ frame: 0, value: 0 });
    keys1.push({ frame: 150, value: 2 * Math.PI });
    spriteRotationAnimation1.setKeys(keys1);
    sprite.animations.push(spriteRotationAnimation1);
    scene.beginAnimation(sprite, 0, 200, true);


    var spriteRotationAnimation2 = new BABYLON.Animation("spriteRotationAnimation", "rotation.x", 24, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);    
    var keys2 = [];
    keys2.push({ frame: 0, value: 0 });
    keys2.push({ frame: 150, value: 2 * Math.PI });
    spriteRotationAnimation2.setKeys(keys2);
    sprite.animations.push(spriteRotationAnimation2);
    scene.beginAnimation(sprite, 0, 200, true);

    spritesList["sprite"+SPRITE_ID]={"alive":true,"position":position,"id:":SPRITE_ID,"attack":false}
    SPRITE_ID++;

    sprite.actionManager = new BABYLON.ActionManager(scene);
	sprite.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function (evt) {
        console.log(evt)
        //The sprite can collide with either bullet or player, so if it is player in attack mode then reduce health 
        if(GLOBAL_STATE==0){return;}
        var targetPosition= evt.additionalData.pickedPoint

        const bulletSound = new BABYLON.Sound("bullet", "./assets/sounds/bullet.mp3", scene, function () {  
            bulletSound.play();
        });
        createBullet(scene,scene.activeCamera.position,targetPosition).then(()=>{
            console.log("Bullet Created")
        });
        setTimeout(() => {
            const explodeSound = new BABYLON.Sound("explode", "./assets/sounds/explode.wav", scene, function () {  
                explodeSound.play();
            });
            if(spritesList[sprite.id]["alive"]&&sprite.isVisible){
                spritesList[sprite.id]["alive"]=false;
                currentAvailableSprite--;
                SCORE++;
            }
            sprite.isVisible=false;
            explosionParticleSystem.start();

     
            setTimeout(() => { 
                sprite.dispose();
             }, 1000);
       
        },BULLET_RESPONSE_TIME)
	}));    
}
var loadScene = async function (scene,camera) {
    setInterval(() => {
        createSprite(scene,camera);
        updateScore(SCORE);

    }, 1000);
}


var createPlayer = async function (scene,camera) {
    var playerEntity = BABYLON.MeshBuilder.CreateBox("playerEntity", {size: 0.25}, scene);


    playerEntity.position = scene.activeCamera.position;
    playerEntity.isPickable = true;

    // Tie the mesh to the camera entity
    playerEntity.parent = scene.activeCamera;
    playerEntity.isVisible = false;
   
}

var shootFromSprite = async function (scene,camera) {
    if(GLOBAL_STATE==1){return;}

    var attackBallMaterial = new BABYLON.StandardMaterial("attackBallMaterial", scene);
    attackBallMaterial.emissiveColor = new BABYLON.Color3(1, 0, 0);  // set neon blue color
    // attackBallMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);  

    setInterval(() => {
        let cameraPosition = scene.activeCamera.position;
        // console.log(scene.activescene.activeCamera.position)
        if(GLOBAL_STATE==0){return;}
        for(let  key in spritesList){
            if(spritesList[key]["alive"]==true){
                console.log("shoot")
                let attackBall = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.1}, scene);
                attackBall.position = new BABYLON.Vector3(spritesList[key]['position'].x,spritesList[key]['position'].y,spritesList[key]['position'].z); 
               
                attackBall.material = attackBallMaterial;
            
                var animationBox = new BABYLON.Animation("myAnimation", "position", 24, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
                var keys = [];
                keys.push({
                    frame: 0,
                    value: attackBall.position
                });
                keys.push({
                    frame: 24*SPRITE_ATTACK_SPEED/1000,
                    value: cameraPosition
                });
                
                animationBox.setKeys(keys);
                
                attackBall.animations = [];
                attackBall.animations.push(animationBox);
                attackBall.checkCollisions = true;
                attackBall.actionManager = new BABYLON.ActionManager(scene);

                attackBall.actionManager.registerAction(
                    new BABYLON.ExecuteCodeAction(
                        {
                            trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                            parameter: scene.getMeshByName("playerEntity"),
                        },
                        () => {
                            console.log("shoot by sprite lol"); // need to use copy or else they will be both pointing at the same thing & update together
                        },
                    ),
                )    
                scene.beginAnimation(attackBall, 0, 24*SPRITE_ATTACK_SPEED/1000, false);
            
                setTimeout(() => {
                    attackBall.dispose();
                },5000)
                            
            }else{
                delete spritesList[key]
            }
        }
    
    
    }, SPRITE_ATTACK_RATE);
}


