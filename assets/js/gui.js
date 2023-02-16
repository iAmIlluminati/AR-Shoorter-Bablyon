var gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("myUI");

var pause_button = BABYLON.GUI.Button.CreateImageOnlyButton("pause_button", "https://img.icons8.com/ios/50/000000/pause.png");
pause_button.top = "20px";
pause_button.right = "0px";
pause_button.width = "200px";
pause_button.height = "200px";
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

gui.addControl(pause_button); 

