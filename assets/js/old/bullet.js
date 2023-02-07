var bulletAliveTime = 4000;
var bulletTimePeriod = 1000;
var baseVelocity = 4.4/Math.PI;
var x=0.01
var bulletCount=0
var bulletRemovedCount=0
var aimerPos =[0,0,-1]
var aimerRot =[90,-90,0]

let factorPi = 180/Math.PI
var bulletAttribute ={
  "gltf-model": './assets/models/bullet/scene.gltf',
  "id": "bullet",
  "position": "0 0 0",
  "rotation": "0 270 0",
  "scale": "0.01 0.01 0.01",
  "class": "bullet",
  "velocity": "0 0 0",
  "bullet-listener": "",
  "shape__main":"shape:box;",
  "shape__handle":"shape:box;",
  "body":"type: dynamic; shape: none;mass:0;",
}


function fireBullet() {

    let position = aCamera.object3D.position;
    let rotation = aCamera.object3D.rotation;
    let cameraNormal = new THREE.Vector3(0, 0, -1);
    cameraNormal.applyEuler(new THREE.Euler(rotation.x, rotation.y, rotation.z));
    const velocity = new CANNON.Vec3(baseVelocity*cameraNormal.x,baseVelocity*cameraNormal.y,baseVelocity*cameraNormal.z);

    bulletAttribute['velocity']=velocity
    bulletAttribute['position']=position
    bulletAttribute['id']="bullet"+bulletCount

    let newBullet = document.createElement('a-entity');
    newBullet=configureProperties(newBullet, bulletAttribute);
    aScene.appendChild(newBullet);
}


  setInterval(() => {
    fireBullet()
    setTimeout(function(){
        document.querySelector("#bullet"+bulletRemovedCount).parentNode.removeChild(document.querySelector("#bullet"+bulletRemovedCount));
        bulletRemovedCount++
      }, bulletAliveTime);
    bulletCount++
  }, bulletTimePeriod);


AFRAME.registerComponent('bullet-listener', {
    init: function () {

    }
});

