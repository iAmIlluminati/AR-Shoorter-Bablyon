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

     
var addPointerEvent=function(scene,camera){
    scene.onPointerObservable.add((pointerInfo) => {
        if(pointerInfo && pointerInfo.pickInfo){
            switch (pointerInfo.type) {
       case BABYLON.PointerEventTypes.POINTERTAP:{
        pickedPoint(scene,camera);
    }
    break;
            }
        }
    });
}

var pickedPoint = function (scene,camera) {
    var ray = scene.createPickingRay(scene.pointerX, scene.pointerY, BABYLON.Matrix.Identity(), null);
    var hit = scene.pickWithRay(ray);
    if(hit.hit){
        var pickedPoint = hit.pickedPoint;
        ax = pickedPoint.x;
        ay = pickedPoint.y;
        az = pickedPoint.z;
        // console.log("Sprite Position", pickedPoint);
        createBullet(scene,camera.position,new BABYLON.Vector3(ax,ay,az)).then(()=>{
            console.log("Bullet Created")
        });

    }
}

var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); };

var createScene = async function () {

    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 0, 0), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
        
 

    addPointerEvent(scene,camera);
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 0, 0), scene);
     
    light.intensity = 10;    
    var xr = await scene.createDefaultXRExperienceAsync({
        uiOptions: {
            sessionMode: 'immersive-ar'
        },
        optionalFeatures: true,
    });
    await loadScene(scene,camera);
    await createPlayer(scene,camera);
    await shootFromSprite(scene,camera);

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



// Resize
window.addEventListener("resize", function () {
    engine.resize();
});

