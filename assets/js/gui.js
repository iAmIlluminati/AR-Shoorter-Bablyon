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



// var header=null
var slider=null
// var grid = new BABYLON.GUI.Grid();
// gui.addControl(grid);
// grid.addColumnDefinition(0.25);
// grid.addColumnDefinition(0.25);
// grid.addColumnDefinition(0.25);
// grid.addColumnDefinition(0.25);
// grid.addRowDefinition(0.25);
// grid.addRowDefinition(0.25);
// grid.addRowDefinition(0.25);
// grid.addRowDefinition(0.25);



var addHealthbar = function(isClamped, row, col) {
    // var panel = new BABYLON.GUI.StackPanel();
    // panel.width = "800px";
    // grid.addControl(panel, row, col);
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

    gui.addControl(slider);

}

addHealthbar(true, 2, 0);

var updateHealth = async function (health) {
    //value of health ranges from 0-1
    slider.value = health* Math.PI*2;;
}