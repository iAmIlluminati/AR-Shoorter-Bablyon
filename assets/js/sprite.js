var createSprite = async function (scene) {
    let position ={x:2,y:1,z:4}
    var sprite = BABYLON.MeshBuilder.CreateBox("sprite"+0, {size: 1}, scene);
    sprite.position = new BABYLON.Vector3(position.x,position.y,position.z);
    var material = new BABYLON.StandardMaterial("material", scene);
    material.diffuseTexture = new BABYLON.Texture("./assets/img/face1.png", scene);
    sprite.material = material;
    //   Create a particle system
    sprite.isPickable = true;

    const particleSystem = new BABYLON.ParticleSystem("particles", 10);

    //Texture of each particle
    particleSystem.particleTexture = new BABYLON.Texture("./assets/img/flare.png");
    particleSystem.emitter = sprite;
    particleSystem.start();

}



