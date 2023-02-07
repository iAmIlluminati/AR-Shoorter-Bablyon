var canvas = document.getElementById("renderCanvas");

var engine = null;
var scene = null;
var sceneToRender = null;

var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

     
var addPointerEvent=function(scene){
    scene.onPointerObservable.add((pointerInfo) => {
        if(pointerInfo && pointerInfo.pickInfo){
            switch (pointerInfo.type) {
       case BABYLON.PointerEventTypes.POINTERTAP:{
        pickedPoint(scene);
    }
    break;
            }
        }
    });
}

var pickedPoint = function (scene) {
    var ray = scene.createPickingRay(scene.pointerX, scene.pointerY, BABYLON.Matrix.Identity(), null);
    var hit = scene.pickWithRay(ray);
    if(hit.hit){
        var pickedPoint = hit.pickedPoint;
        ax = pickedPoint.x;
        ay = pickedPoint.y;
        az = pickedPoint.z;
        console.log("Sprite Position", pickedPoint);
    }
}

var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); };

var createScene = async function () {

    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 0, 0), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);


    // var playerEntity = BABYLON.MeshBuilder.CreateBox("box", {size: 1}, scene);
    // playerEntity.position = camera.position;
    // var playerMaterial = new BABYLON.StandardMaterial("playerMaterial", scene);
    // playerMaterial.transparency = true;
    // playerMaterial.alpha = 0.5;
    // playerEntity.material = playerMaterial;
    // // Tie the mesh to the camera entity
    // playerEntity.parent = camera;
    // playerEntity.checkCollisions = true;
  

    addPointerEvent(scene);
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 0, 0), scene);
    light.intensity = 10;    
    var xr = await scene.createDefaultXRExperienceAsync({
        uiOptions: {
            sessionMode: 'immersive-ar'
        },
        optionalFeatures: true,
    });
    await createSprite(scene,camera);
    // await createWorld(scene,camera);
    return scene;
};


window.initFunction = async function () {
    var asyncEngineCreation = async function () {
        try {
            return createDefaultEngine();
        } catch (e) {
            console.log("the available createEngine function failed. Creating the default engine instead");
            return createDefaultEngine();
        }
    }

    window.engine = await asyncEngineCreation();
    if (!engine) throw 'engine should not be null.';
    startRenderLoop(engine, canvas);
    window.scene = createScene();
};
initFunction().then(() => {scene.then(returnedScene => { sceneToRender = returnedScene; });});

// var loadScene= async function(){
//     await initFunction()
//     scene.then(returnedScene => {
//         createSprite(returnedScene).then((returnedScene2)=>{
//             sceneToRender = returnedScene;

//             console.log("Sprite created")
//         })

//     });
// }
// loadScene().then(()=>{
//     console.log("Scene loaded")
// })


// Resize
window.addEventListener("resize", function () {
    engine.resize();
});

