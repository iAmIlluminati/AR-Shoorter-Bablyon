var aCamera = document.createElement('a-entity');
aCamera.setAttribute('static-body', '');
aCamera.setAttribute('camera', '');
aCamera.setAttribute('init-camera', '');
aCamera.setAttribute('look-controls', '');
// aCamera.setAttribute('collider-check', '');
document.querySelector('a-scene').appendChild(aCamera);

