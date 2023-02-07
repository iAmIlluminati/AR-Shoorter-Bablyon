var gunAttribute={
    "gltf-model": './assets/models/gun/scene.gltf',
    "id": "gun",
    "position": "0 -0.71 0.1",
    "rotation": "0 0 0",
    "scale": "0.3 0.3 0.3",
    "animation__rotate": "property: rotation; to: 3 1 1; dur: 700;dir: alternate; loop: true"
}

function createGun(){
    let newGun = document.createElement('a-entity');
    newGun= configureProperties(newGun, gunAttribute)
    aCamera.appendChild(newGun);
}


function createPlayer(){
    const playerBody = document.createElement('a-entity');
    playerBody.setAttribute('init-player-body', '');
    playerBody.setAttribute('static-body', 'shape:box');
    playerBody.setAttribute('geometry', 'primitive: box');
    playerBody.setAttribute('position', '0 0 0');
    playerBody.setAttribute('scale', '0.1 0.1 0.1');
    aPlayer=playerBody
    aCamera.appendChild(playerBody);
}    

function createRaycast(){
    const raycaster = document.createElement('a-entity');
    raycaster.setAttribute('raycaster', 'objects: .collidable');
    raycaster.setAttribute('position', '0 -0.9 0');
    raycaster.setAttribute('rotation', '90 0 0');
    aCamera.appendChild(raycaster);
}