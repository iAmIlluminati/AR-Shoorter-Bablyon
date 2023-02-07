
var createWorld = async function (scene,camera) {
    var worldEntity = BABYLON.MeshBuilder.CreateBox("worldEntity", {size: 1}, scene);
    worldEntity.position = camera.position;
    worldEntity.isPickable = true;

    // Set the material of the worldEntity to be transparent
    var worldMaterial = new BABYLON.StandardMaterial("worldMaterial", scene);
    worldMaterial.alpha = 0;
    worldEntity.material = worldMaterial;
    worldEntity.actionManager = new BABYLON.ActionManager(scene);
    worldEntity.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function () {
        console.log("on world")
    }));
}
