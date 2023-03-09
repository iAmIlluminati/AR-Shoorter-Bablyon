var gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("myUI");
var pause_button = BABYLON.GUI.Button.CreateImageOnlyButton("pause_button", "./assets/gui/pause.png");
pause_button.top = "140px";
pause_button.left = "-40px";
pause_button.width = "200px";
pause_button.height = "200px";
pause_button.cornerRadius = 20;
pause_button.thickness = 0;
pause_button.horizontalAlignment= BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
pause_button.verticalAlignment= BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP





var score_text = new BABYLON.GUI.TextBlock();
score_text.text = "Kills : 0";
score_text.color = "white";
score_text.fontSize = 50;
score_text.top = "140px";
score_text.left = "40px";
score_text.fontFamily = "PixelFont";
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


var pausedText=null
var exitButton=null
var pauseGrid=null
var pausedScreen = function(){
    // create the advanced texture

    pauseGrid = new BABYLON.GUI.Grid();
    pauseGrid.addRowDefinition(0.5, false);
    pauseGrid.addRowDefinition(0.5, false);
    pauseGrid.addRowDefinition(0.5, false);
    pauseGrid.addColumnDefinition(1, false);

    pauseGrid.height = "660px";
    pauseGrid.width = "900px";
    pauseGrid.background = "black";
    pauseGrid.cornerRadius = 70;
    // console.log(pauseGrid)
    // create the "Game Paused" text
    pausedText = new BABYLON.GUI.TextBlock();
    pausedText.text = "Game Paused";
    pausedText.color = "white";
    pausedText.fontSize = 70;
    pausedText.width= "750px";
    pausedText.fontFamily = "PixelFont";
    pauseGrid.addControl(pausedText, 0, 0);
    
    // create the "Resume" button
    var resumeButton = BABYLON.GUI.Button.CreateSimpleButton("resumeButton", "Resume");
    resumeButton.width = "500px";
    resumeButton.height = "170px";
    resumeButton.color = "white";
    resumeButton.cornerRadius = 10;
    resumeButton.fontSize = 50;
    resumeButton.background = "#4b4b4b";
    resumeButton.fontFamily = "PixelFont";
    resumeButton.onPointerClickObservable.add(function () {
        if(pauseGrid)
        gui.removeControl(pauseGrid);
        addTheGameGUI();
        GLOBAL_STATE=1;

    })
    pauseGrid.addControl(resumeButton, 1, 0);


    // create the "Exit" button
    exitButton = BABYLON.GUI.Button.CreateSimpleButton("exitButton", "Exit");
    exitButton.width = "500px";
    exitButton.height = "170px";
    exitButton.color = "white";
    exitButton.cornerRadius = 10;
    exitButton.fontSize = 50;
    exitButton.fontFamily = "PixelFont";
    exitButton.background = "#4b4b4b";
    exitButton.onPointerClickObservable.add(function () {
        if(pauseGrid)
        gui.removeControl(pauseGrid);
        GLOBAL_STATE=0;        
        SCORE=0;
        var link = document.createElement('a');
        link.href = '/menu';
        link.click()
    })

    pauseGrid.addControl(exitButton, 2, 0);

}


var gameOverText=null
var scoreText=null
var replayButton=null
var gameOverGrid=null
var exitButton2=null

var gameOverScreen = function(){
    // create the advanced texture

    gameOverGrid = new BABYLON.GUI.Grid();
    gameOverGrid.addRowDefinition(0.5, false);
    gameOverGrid.addRowDefinition(0.5, false);
    gameOverGrid.addRowDefinition(0.5, false);
    gameOverGrid.addRowDefinition(0.5, false);
    gameOverGrid.addColumnDefinition(1, false);

    gameOverGrid.height = "860px";
    gameOverGrid.width = "900px";
    gameOverGrid.background = "black";
    gameOverGrid.cornerRadius = 70;
    // console.log(gameOverGrid)
    // create the "Game Over" text
    gameOverText = new BABYLON.GUI.TextBlock();
    gameOverText.text = "Game Over";
    gameOverText.color = "white";
    gameOverText.fontSize = 70;
    gameOverText.width= "750px";
    gameOverText.fontFamily = "PixelFont";
    gameOverGrid.addControl(gameOverText, 0, 0);

   
    
    // create the "Replay" button
    var replayButton = BABYLON.GUI.Button.CreateSimpleButton("replayButton", "Replay");
    replayButton.width = "600px";
    replayButton.height = "170px";
    replayButton.color = "white";
    replayButton.cornerRadius = 10;
    replayButton.fontSize = 50;
    replayButton.background = "#4b4b4b";
    replayButton.fontFamily = "PixelFont";
    replayButton.onPointerClickObservable.add(function () {
        if(gameOverGrid)
        gui.removeControl(gameOverGrid);
        addTheGameGUI();
        GLOBAL_STATE=1;
        location.reload();

    })
    gameOverGrid.addControl(replayButton, 2, 0);


    // create the "Exit" button
    exitButton2 = BABYLON.GUI.Button.CreateSimpleButton("exitButton2", "Exit");
    exitButton2.width = "600px";
    exitButton2.height = "170px";
    exitButton2.color = "white";
    exitButton2.cornerRadius = 10;
    exitButton2.fontSize = 50;
    exitButton2.fontFamily = "PixelFont";
    exitButton2.background = "#4b4b4b";
    exitButton2.onPointerClickObservable.add(function () {
        if(gameOverGrid)
        gui.removeControl(gameOverGrid);
        GLOBAL_STATE=0;        
        SCORE=0;
        var link = document.createElement('a');
        link.href = '/menu';
        link.click()
    })

    gameOverGrid.addControl(exitButton2, 3, 0);

}



addHealthbar(true, 2, 0);
pausedScreen();

gameOverScreen();




var updateHealth = async function (health) {
    //value of health ranges from 0-1
    slider.value = health* Math.PI*2;;
}


var hitTakenHealth = async function () {
    await updateHealth(slider.value-1/100);
}

var addTheGameGUI = function(){
    gui.addControl(score_text);  
    gui.addControl(pause_button); 
    gui.addControl(slider);
}

var removeTheGameGUI = function(){
    gui.removeControl(score_text);  
    gui.removeControl(pause_button); 
    gui.removeControl(slider);
}


//call this function to show the gameover screen
var bringGameOverScreen = function(){

    removeTheGameGUI();
           // create the "Kill" text
      scoreText = new BABYLON.GUI.TextBlock();
      scoreText.text = "KILLS : "+SCORE;
      scoreText.color = "white";
      scoreText.fontSize = 70;
      scoreText.width= "750px";
      scoreText.fontFamily = "PixelFont";
      gameOverGrid.addControl(scoreText, 1, 0);
      gui.addControl(gameOverGrid);
}




    
pause_button.onPointerClickObservable.add(function () {
    if(GLOBAL_STATE==1){
        removeTheGameGUI();
        gui.addControl(pauseGrid);
        GLOBAL_STATE=0;
     }
 });



 var mapGrid=null;
 var positionMap = function () {
    mapGrid = new BABYLON.GUI.Grid();
    mapGrid.addRowDefinition(1, false);
    mapGrid.addColumnDefinition(1, false);
    
    var mapCircle = new BABYLON.GUI.Ellipse();
    mapCircle.width = "450px"
    mapCircle.height = "450px";
    mapCircle.color = "white";
    mapCircle.thickness = 10;
    mapCircle.background = "transparent";
    mapCircle.verticalAlignment= BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
    mapCircle.horizontalAlignment= BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
    mapCircle.right = "40px";
    mapCircle.top = "40px";





    mapGrid.addControl(mapCircle, 0, 0);

    gui.addControl(mapGrid);
}

positionMap()

// Resize
var countDown = 0;
window.addEventListener("resize", async function () {
    engine.resize();
    if(engine.isFullscreen){
        countDown = 4;        
        var countDownTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("countDownTexture");
        var countDownText = new BABYLON.GUI.TextBlock();
        countDownText.text = countDown;
        countDownText.fontSize = 196;
        countDownText.color = "white";
        countDownText.fontFamily = "PixelFont";
        countDownText.textHorizontalAlignment =
            BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        countDownText.textVerticalAlignment =
            BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        countDownTexture.addControl(countDownText);
        var intervalId = setInterval(function () {
            if (countDown > 0) {
                countDown--;
                countDownText.text = countDown;
                countDownTexture.update();
            } else {
                clearInterval(intervalId);
                countDownText.dispose();
                GLOBAL_STATE=1

            }
        }, 1000);

        addTheGameGUI();
    }else{
        removeTheGameGUI();
        GLOBAL_STATE=0
    }    
});




