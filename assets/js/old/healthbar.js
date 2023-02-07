var healthBarMain=null
var healthBarRed=null
var healthBarWhite=null
var healthBarWidth=3
var singleAttackWidth=healthBarWidth/20
AFRAME.registerComponent("init-health-bar", {
	init: function () {
		healthBarMain = this.el
	},
});
AFRAME.registerComponent("init-health-bar-red", {
	init: function () {
		healthBarRed = this.el
        healthBarRed.setAttribute("width",healthBarWidth)
	},
});
AFRAME.registerComponent("init-health-bar-white", {
	init: function () {
		healthBarWhite = this.el
        healthBarWhite.setAttribute("width",healthBarWidth)

	},
});

function AttackOnHealth(){
    if(healthBarRed.getAttribute("width")-singleAttackWidth>0){
    healthBarRed.setAttribute("width",healthBarRed.getAttribute("width")-singleAttackWidth)
    healthBarWhite.setAttribute("position",(healthBarWhite.getAttribute("position").x+singleAttackWidth/2)+" "+healthBarWhite.getAttribute("position").y+" "+healthBarWhite.getAttribute("position").z)
    healthBarMain.setAttribute("position",(healthBarMain.getAttribute("position").x-singleAttackWidth/2)+" "+healthBarMain.getAttribute("position").y+" "+healthBarMain.getAttribute("position").z)
    }
}

function createHealthBar() {
	var entityEl = document.createElement('a-entity');
	entityEl.setAttribute('init-health-bar', '');
	entityEl.setAttribute('position', '0 4.5 -8');
  
	var redBox = document.createElement('a-box');
	redBox.setAttribute('init-health-bar-red', '');
	redBox.setAttribute('color', 'red');
	redBox.setAttribute('depth', '0');
	redBox.setAttribute('height', '0.4');
	redBox.setAttribute('width', '3');
  
	var whiteBox = document.createElement('a-box');
	whiteBox.setAttribute('init-health-bar-white', '');
	whiteBox.setAttribute('color', 'white');
	whiteBox.setAttribute('depth', '0');
	whiteBox.setAttribute('height', '0.4');
	whiteBox.setAttribute('width', '3');
	whiteBox.setAttribute('position', '0 0 0');
  
	redBox.appendChild(whiteBox);
	entityEl.appendChild(redBox);
  
	aCamera.appendChild(entityEl);
  }