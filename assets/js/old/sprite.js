

var skins =[
  './assets/img/face1.png',
  // './assets/img/face2.png',
  // './assets/img/face3.png',
  // './assets/img/face4.png',

]


var modelCount = 0;
var modelLimit = 1;
var attackBallCount = 0;
var attackBallRemovedCount = 0;
var attackTime=2700;


var attackAttribute ={
    "geometry": "primitive: sphere",
    "material": "color: red",
    "id": "attack-ball0",
    "position": null,
    "scale": "0.01 0.01 0.01",
    "dynamic-body": "shape: sphere; mass: 0; sphereRadius: 0.3",
    "animation__position": null
 }

var materialUrl = skins[Math.floor(Math.random() * skins.length)];


var spriteAttribute ={
  "geometry": "primitive: box",
  "material": "src:url(" + materialUrl + ")",
  "position": "1.1 5.51 -5.2",
  "scale": "0.2 0.2 0.2",
  // "animation__position": 'property: position; to: 0.1 -0.51 0.2; dur: 700; dir: alternate; loop: true',
  // "animation__rotation": 'property: rotation; to: 2 -125 142; dur: 2700; dir: alternate; loop: true',
  "class": 'flying-object',
  "id": 'sprite0',
  "dynamic-body": "shape: box; mass: 0",
  "sprite-listener": ""
}


function spawnModel(position) {
  if (modelCount >= modelLimit) {
    return
  }
  modelCount++;
  spriteAttribute['material'] = "src:url(" + materialUrl + ")";
  spriteAttribute['position'] = "0.1 -0.51 0.2";
  spriteAttribute['animation__position'] = 'property: position; to: 0.1 -0.51 0.2; dur: 700; dir: alternate; loop: true';
  spriteAttribute['animation__rotation'] = 'property: rotation; to: 2 -125 142; dur: 2700; dir: alternate; loop: true';
  spriteAttribute['id'] = 'sprite' + modelCount;

  let newSprite = document.createElement('a-entity');
  newSprite=configureProperties(newSprite, spriteAttribute)
  aScene.appendChild(newSprite);
}
function  spawnAttack(position) {
  let targetPos = aCamera.object3D.position
  attackAttribute['id'] = "attack-ball" + attackBallCount;
  attackAttribute['position'] = position;
  attackAttribute['animation__position'] = 'property: position; to: ' + targetPos.x + ' ' + targetPos.y + ' ' + targetPos.z + '; dur: ' + attackTime + ';';

  let newAttack = document.createElement('a-entity');
  newAttack= configureProperties(newAttack, attackAttribute)
  aScene.appendChild(newAttack);
}

x = 0.1
y=-0.40
z=0.3

  
  setInterval(() => {
    spawnModel(x+" "+y+" "+z)
    x=x*1.5
    y=y*1.5
    z=z*1.5
  }, 1000);

  
  function removeSprite(id){
    document.querySelector("#"+id).parentNode.removeChild(document.querySelector("#"+id));
    modelCount--;
  }

  AFRAME.registerComponent('sprite-listener', {
    init: function () {
      setInterval(() => {
        let spritePosition= document.querySelector("#sprite"+modelCount).object3D.position
        spawnAttack(spritePosition)
        setTimeout(function(){
          document.querySelector("#attack-ball"+attackBallRemovedCount).parentNode.removeChild(document.querySelector("#attack-ball"+attackBallRemovedCount));
          attackBallRemovedCount++
        }, attackTime+200);
        attackBallCount++
      }, 1000);
    }
});
