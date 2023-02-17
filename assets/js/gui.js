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

gui.addControl(pause_button); 

var score_text = new BABYLON.GUI.TextBlock();
score_text.text = "Kills : 0";
score_text.color = "white";
score_text.fontSize = 50;
score_text.top = "140px";
score_text.left = "40px";
score_text.textHorizontalAlignment= BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
score_text.textVerticalAlignment= BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
gui.addControl(score_text);  


var updateScore = async function (score) {
    score_text.text = "Kills : "+score;
}