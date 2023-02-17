var canvas = document.getElementById("renderCanvas");

var engine = null;
var globalScene=null;
var globalCamera=null;
var sceneToRender = null;

var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

     
// var addPointerEvent=function(scene,camera){
//     scene.onPointerObservable.add((pointerInfo) => {
//         if(pointerInfo && pointerInfo.pickInfo){
//             switch (pointerInfo.type) {
//        case BABYLON.PointerEventTypes.POINTERTAP:{
//         pickedPoint(scene,camera);
//     }
//     break;
//             }
//         }
//     });
// }

// var pickedPoint = function (scene,camera) {
//     var ray = scene.createPickingRay(scene.pointerX, scene.pointerY, BABYLON.Matrix.Identity(), null);
//     var hit = scene.pickWithRay(ray);
//     if(hit.hit){
//         var pickedPoint = hit.pickedPoint;
//         ax = pickedPoint.x;
//         ay = pickedPoint.y;
//         az = pickedPoint.z;
//         console.log(camera)
//         createBullet(scene,camera.position,new BABYLON.Vector3(ax,ay,az)).then(()=>{
//             console.log("Bullet Created")
//         });

//     }
// }

var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); };

var createScene = async function () {

    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 0, 0), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    glocalCamera=camera    
 

    // addPointerEvent(scene,camera);
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 0, 0), scene);
     
    light.intensity = 10;   
    
    var btn = document.createElement("button"); // Create a <button> element
    var t = document.createElement('img');
    t.src = './assets/gui/play.png';
    t.style="height: 250px; width: 250px;"; // Set image dimensions
    btn.appendChild(t); // Append the image to <button>
    btn.style.display = "flex"; // Set button display to flex
    btn.style.justifyContent = "center"; // Center horizontally
    btn.style.alignItems = "center"; // Center vertically
    btn.style.position = "absolute";
    btn.style.top = "50%"; // Set top to 50%
    btn.style.left = "50%"; // Set left to 50%
    btn.style.transform = "translate(-50%, -50%)"; // Move back 50% of width and height
    btn.style.backgroundColor = "transparent"; // Set background color to transparent
    btn.style.border = "none"; // Remove border
    document.body.appendChild(btn); // Append <button> to the body
    var xrButton = new BABYLON.WebXREnterExitUIButton(btn, "immersive-ar", "local-floor");


    var xr = await scene.createDefaultXRExperienceAsync({
        uiOptions: {
            sessionMode: 'immersive-ar',
            customButtons: [xrButton]
        },
        optionalFeatures: false,
    });


      

    await loadScene(scene,camera);
    await createPlayer(scene,camera);
    await shootFromSprite(scene,camera);
    // await  addHealthbar(false, true, false, 2, 0);
    globalScene=scene;
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




