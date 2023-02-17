const BULLET_RESPONSE_TIME = 2000;
const SPRITE_ATTACK_RATE = 3000;
const SPRITE_ATTACK_SPEED = 3000;
var GLOBAL_STATE=1;
var SPRITE_ID=0;
var SCORE=0;
//1-Running
//0-Pause/Stopped
var spriteCounter = 0;
var currentAvailableSprite = 0;
const MAX_NUMBER_OF_SPRITES = 2;


// var startGameMovements = function(){
//     GLOBAL_STATE=1;
// }

var spritesList={
    "spritex":{"alive":false,"position":[0,0,0],"id:":"x"},

}
var createNewPosition = function(){
    return {x:Math.random()*2+2,y:Math.random()*2+1,z:Math.random()*2+4}
}

var createBullet = async function (scene,from, to) {
    if(GLOBAL_STATE==0){return;}
    
    var bulletBallMaterial = new BABYLON.StandardMaterial("bulletBallMaterial", scene);
    bulletBallMaterial.emissiveColor = new BABYLON.Color3(0, 1, 0);  // set neon blue color
    bulletBallMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);  

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
    if(currentAvailableSprite>=MAX_NUMBER_OF_SPRITES){return}
    var spriteMaterial = new BABYLON.StandardMaterial("spriteMaterial", scene);
    spriteMaterial.diffuseTexture = new BABYLON.Texture("./assets/img/face1.png", scene);


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
    currentAvailableSprite++;

    sprite.actionManager = new BABYLON.ActionManager(scene);
	sprite.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function (evt) {
        if(GLOBAL_STATE==0){return;}
        // var targetPosition= evt.additionalData.pickedPoint
        setTimeout(() => {
            sprite.dispose();
            updateScore(SCORE);
            if(spritesList[sprite.id]["alive"]){
                spritesList[sprite.id]["alive"]=false;
                currentAvailableSprite--;
                SCORE++;
            }
        },BULLET_RESPONSE_TIME)
	}));    
}
var loadScene = async function (scene,camera) {
    setInterval(() => {
        if(GLOBAL_STATE==0){return;}
        createSprite(scene,camera);
    }, 1000);
}


var createPlayer = async function (scene,camera) {
    var playerEntity = BABYLON.MeshBuilder.CreateBox("playerEntity", {size: 0.25}, scene);
    playerEntity.position = camera.position;
    playerEntity.isPickable = true;
    // Tie the mesh to the camera entity
    playerEntity.parent = camera;
    playerEntity.isVisible = false;
   
}

var shootFromSprite = async function (scene,camera) {
    var attackBallMaterial = new BABYLON.StandardMaterial("attackBallMaterial", scene);
    attackBallMaterial.emissiveColor = new BABYLON.Color3(1, 0, 0);  // set neon blue color
    attackBallMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);  

    setInterval(() => {
        let cameraPosition = camera.position;
        console.log(cameraPosition)
        if(GLOBAL_STATE==0){return;}
        for(let  key in spritesList){
            if(spritesList[key]["alive"]==true){
                console.log("shoot")
                let attackBall = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.1}, scene);
                attackBall.position = new BABYLON.Vector3(spritesList[key]['position'].x,spritesList[key]['position'].y,spritesList[key]['position'].z); 
               
                attackBall.material = attackBallMaterial;
            
                var animationBox = new BABYLON.Animation("myAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
                var keys = [];
                keys.push({
                    frame: 0,
                    value: attackBall.position
                });
                keys.push({
                    frame: 150,
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
                scene.beginAnimation(attackBall, 0, 150, false);
            
                setTimeout(() => {
                    attackBall.dispose();
                },5000)
                            
            }else{
                delete spritesList[key]
            }
        }
    
    
    }, SPRITE_ATTACK_RATE);
}


