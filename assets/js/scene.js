var canvas = document.getElementById("renderCanvas");

var engine = null;
var globalScene=null;
var globalCamera=null;
var globalLight=null;
var globalXR=null;
var sceneToRender = null;
var globalPlane=null;
var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

     


var setPlaneFilter =async function (type="menu"){

        // Define a gray color
        var planeColor = null;
        planeColor = new BABYLON.Color3(1, 1, 1);

        if(type=="menu")
        planeColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        if(type=="attack")
        planeColor = new BABYLON.Color3(1, 0, 0);

    
        // // Create a new material with the gray color and a transparency of 0.5
        var planeMaterial = new BABYLON.StandardMaterial("planeMaterial", globalScene);
        planeMaterial.diffuseColor = planeColor;
        planeMaterial.alpha = 0;    
        // Apply the material to the plane
        globalPlane.material = planeMaterial;
    
}

var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); };

var createScene = async function () {

    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 0, 0), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    globalCamera=camera    
 
    const available = await BABYLON.WebXRSessionManager.IsSessionSupportedAsync('immersive-ar');

    if (!available) {
        alert('immersive-ar WebXR session mode is not available in your browser.');
    }

    // addPointerEvent(scene,camera);
    
    var btn = document.querySelector(".playButton")
    var xrButton = new BABYLON.WebXREnterExitUIButton(btn, "immersive-ar", "local-floor");


    var xr = await scene.createDefaultXRExperienceAsync({
        uiOptions: {
            sessionMode: 'immersive-ar',
            customButtons: [xrButton]
        },
        optionalFeatures: false,
    });

    xr.teleportation.detach();

      

    await loadScene(scene,camera);
    await spriteAttack(scene);
    await checkAttackCollision(scene);
    globalScene=scene;
    globalXR=xr;
    



    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 0, 0), scene);
    light.intensity = 2;   
    globalLight=light;


        // Add the post-process to the camera
        // camera.attachPostProcess(postProcess);


    // Create a plane with width and height of 1
    // var plane = BABYLON.MeshBuilder.CreatePlane("plane", {width: 10, height: 10});

    // globalPlane=plane;
    // // Set the position of the plane to be the same as the camera
    // plane.position.copyFrom(camera.position);
    // plane.position.z+=2

    // await setPlaneFilter();
    
    // scene.addMesh(plane);

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




