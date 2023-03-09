const BULLET_RESPONSE_TIME = 300;
const SPRITE_ATTACK_RATE = 10000;
const SPRITE_ATTACK_SPEED = 15000;
var GLOBAL_STATE=0;
var SCORE=0;
//1-Running
//0-Pause/Stopped


var SPRITE_ID = 0;
var currentAvailableSprite = 0;
const MAX_NUMBER_OF_SPRITES = 2;

var spritesList={
    // "spritex":{"alive":false,"position":[0,0,0],"id:":"x","attack":false},

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
    // console.log("sprite created")

    // Create the explosion particle system
    let explosionParticleSystem = new BABYLON.ParticleSystem("particles", 200, scene);
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

    spritesList["sprite"+SPRITE_ID]={"alive":true,"position":position,"id:":SPRITE_ID,"attack":false, "ref":sprite}
    SPRITE_ID++;

    sprite.actionManager = new BABYLON.ActionManager(scene);
	sprite.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function (evt) {
        // console.log(evt)
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

var spriteAttack = async function (scene) {
    setInterval(() => {
        if(GLOBAL_STATE==0){return;}
        let angrySpriteDict = null
        for(i in spritesList){
            if(spritesList[i]["attack"]==false){
                spritesList[i]["attack"]=true;
                angrySpriteDict = spritesList[i];
                break;
            }
        }
        if(angrySpriteDict==null){return;}
        let angrySprite = angrySpriteDict["ref"];
        let cameraPosition = scene.activeCamera.position;
        // console.log("attack by", angrySprite, "from", angrySprite.position, "to", cameraPosition)

        var animationBox = new BABYLON.Animation("myAnimation2", "position", 24, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        var keys = [];
        keys.push({
            frame: 0,
            value: angrySprite.position
        });
        keys.push({
            frame: 24*SPRITE_ATTACK_SPEED/1000,
            value: cameraPosition
        });
        
        animationBox.setKeys(keys);
        angrySprite.animations = [];
        angrySprite.animations.push(animationBox);
        scene.beginAnimation(angrySprite, 0, 24*SPRITE_ATTACK_SPEED/1000, false);

    }, SPRITE_ATTACK_RATE);
}

var checkAttackCollision = async function (scene) {
    setInterval(() => {
        if(GLOBAL_STATE==0){return;}
        let cameraPosition = scene.activeCamera.position;
        for(let  key in spritesList){
            if(spritesList[key]["alive"]==true&&spritesList[key]["attack"]==true){
                let spritePosition = spritesList[key]["ref"].position;
                if(Math.abs(cameraPosition.x-spritePosition.x)<0.1 && Math.abs(cameraPosition.z-spritePosition.z)<0.1){
               
                    // Create the explosion particle system (DUPLICATE)
                    let explosionParticleSystem = new BABYLON.ParticleSystem("particles", 200, scene);
                    explosionParticleSystem.particleTexture = new BABYLON.Texture("./assets/img/flare.png", scene);
                    explosionParticleSystem.emitter = spritesList[key]["ref"];
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
                                  
                    const explodeSound = new BABYLON.Sound("explode", "./assets/sounds/explode.wav", scene, function () {  
                        explodeSound.play();
                    });
                    console.log(spritesList[key])
                    if(spritesList[key]["alive"]&&spritesList[key]['ref'].isVisible){
                        spritesList[key]["alive"]=false;
                        currentAvailableSprite--;
                        SCORE++;
                        hitTakenHealth().then(()=>{
                            console.log("hit taken")
                        })
                    }
                    spritesList[key]['ref'].isVisible=false;
                    explosionParticleSystem.start()

                    
             
                    setTimeout(() => { 
                        spritesList[key]["ref"].dispose();
                     }, 1000);
                }
            }
        }
    }, 300);
}
