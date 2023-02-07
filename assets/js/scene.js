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

     


var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); };

var createScene = async function () {

    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 0, 0), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 1;    
    const xr = await scene.createDefaultXRExperienceAsync({
        uiOptions: {
            sessionMode: 'immersive-ar'
        },
        optionalFeatures: true,
    });

    scene.onPointerObservable.add((e) => {
        if (e.type === BABYLON.PointerEventTypes.POINTERUP) {
            const multiPickInfo = scene.multiPick(scene.pointerX, scene.pointerY)
            if (multiPickInfo.length > 1) {
                multiPickInfo.slice(1).forEach(pickInfo => {
                    if (pickInfo.pickedMesh?.renderingGroupId === 1) {
                        pickInfo.pickedMesh.rotate(BABYLON.Axis.Y, -0.2, BABYLON.Space.WORLD)
                    }
                })
            }
        }
    })

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

var loadScene= async function(){
    await initFunction()
    scene.then(returnedScene => {
        createSprite(returnedScene).then((returnedScene2)=>{
            sceneToRender = returnedScene;

            console.log("Sprite created")
        })

    });
}
loadScene().then(()=>{
    console.log("Scene loaded")
})


// Resize
window.addEventListener("resize", function () {
    engine.resize();
});

