var gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("myUI");

var pause_button = BABYLON.GUI.Button.CreateImageOnlyButton("pause_button", "./assets/gui/pause.png");
pause_button.top = "140px";
pause_button.left = "-40px";
pause_button.width = "100px";
pause_button.height = "100px";
pause_button.cornerRadius = 20;
pause_button.thickness = 0;
pause_button.horizontalAlignment= BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
pause_button.verticalAlignment= BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
pause_button.onPointerClickObservable.add(function () {
   if(GLOBAL_STATE==0){
        // engine.unpause();
        GLOBAL_STATE=1;
   }
    else{
        // engine.pause();
        GLOBAL_STATE=0;
    }
});


var score_text = new BABYLON.GUI.TextBlock();
score_text.text = "Kills : 0";
score_text.color = "white";
score_text.fontSize = 50;
score_text.top = "140px";
score_text.left = "40px";
score_text.textHorizontalAlignment= BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
score_text.textVerticalAlignment= BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP


var updateScore = async function (score) {
    score_text.text = "Kills : "+score;
}



var slider=null




var addHealthbar = function(isClamped, row, col) {
    slider = new BABYLON.GUI.Slider();
    slider.minimum = 0;
    slider.maximum = 2 * Math.PI;
    slider.isThumbClamped = isClamped;
    slider.isVertical = false;
    slider.displayThumb = false;
    slider.height = "50px";
    slider.width = "500px";
    slider.color = "red";
    slider.value = 1 * Math.PI*2;
    slider.verticalAlignment= BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
    slider.horizontalAlignment= BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    slider.left = "40px";
    slider.top = "210px";


}

addHealthbar(true, 2, 0);

var updateHealth = async function (health) {
    //value of health ranges from 0-1
    slider.value = health* Math.PI*2;;
}

var addTheGameGUI = function(){
    gui.addControl(score_text);  
    gui.addControl(pause_button); 
    gui.addControl(slider);
}


function onXRSessionStart(session) {
    console.log('XR session started.');
  }
  
  function onXRSessionEnd(session) {
    console.log('XR session ended.');
  }
  
//   if (navigator.xr) {
//     console.log(navigator.xr);
//     navigator.xr.addEventListener('ondevicechange', onXRSessionStart);
//     navigator.xr.addEventListener('visibilitychange', onXRSessionEnd);
//   }

// Resize
window.addEventListener("resize", function () {
    engine.resize();
    if(engine.isFullscreen){
        addTheGameGUI();
        GLOBAL_STATE=1
    }

    
});



// console.log(navigator.xr);  
// if (navigator.xr) {
//     navigator.xr.addEventListener('xrstatechange', (event) => {
//       console.log(`XR state changed: ${event.state}`);
//     });
//   }
//   console.log('immersivechange event fired');

// window.addEventListener('visibilitychange', event => {
//     console.log(`visibilitychange fired: ${document.visibilityState}`);
//     if (event && event.target) {
//       if (event.target === window && window.navigator.xr) {
//         if (window.navigator.xr.isPresenting) {
//             GLOBAL_STATE=1;
//             addTheGameGUI();
//             console.log('User entered immersive AR mode');
//         } else {
//           console.log('User exited immersive AR mode');
//         }
//       }
//     }
//   });




