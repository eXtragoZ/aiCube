let SCENE_WIDTH = window.innerWidth,
	SCENE_HEIGHT = window.innerHeight,
	CAMERA_VIEW_ANGLE = 45,
	CAMERA_ASPECT = SCENE_WIDTH / SCENE_HEIGHT,
	CAMERA_NEAR = 10,
	CAMERA_FAR = 10000;


let container, renderer, camera, scene, cube, stats, cameraControls;

const origin = new THREE.Vector3(0, 0, 0);

let clock = new THREE.Clock();
let timeLogic = 0;
let frameSpeed = 1 / 60;

let positionLine;
let astroLine = new THREE.Object3D();
let cubeSize = 300
let cubiSize = cubeSize / 3 - 8
let stickerSize = cubeSize * 0.25
let cubeContainer = new THREE.Object3D();
let cubeMatrix = [];

let controls = {
	menu: 100
};
let debug = false;

function init() {
	container = $('#container');
	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setSize(SCENE_WIDTH, SCENE_HEIGHT);
	container.append(renderer.domElement);

	camera = new THREE.PerspectiveCamera(CAMERA_VIEW_ANGLE, CAMERA_ASPECT, CAMERA_NEAR, CAMERA_FAR);
	camera.position.set(1000, 200, 200);

	cameraControls = new THREE.OrbitControls(camera, renderer.domElement);

	THREEx.WindowResize(renderer, camera, 1, 1);

	scene = new THREE.Scene();

	createLights();

	//addCircle();
	newCube()

	initStats();
	initControls();

	console.log(scene)
}

function newCube() {
	const min = -1, max = 1;
	const notVisible = (v) => v > min && v < max;
	for (let i = min; i <= max; i++) {
		cubeMatrix[i] = []
		for (let j = min; j <= max; j++) {
			cubeMatrix[i][j] = []
			for (let k = min; k <= max; k++) {
				if (notVisible(i) && notVisible(j) && notVisible(k)) {
					continue;
				}
				const cubi = getCubi();
				addStickers(cubi, i, j, k);
				cubi.position.set(i * cubeSize / 3, j * cubeSize / 3, k * cubeSize / 3);
				const cubiWrapper = new THREE.Object3D();
				cubiWrapper.add(cubi);
				cubeContainer.add(cubiWrapper);
				cubeMatrix[i][j][k] = cubiWrapper;
			}
		}
	}
	scene.add(cubeContainer);
}

function addStickers(cubi, i, j, k) {
	const min = -1, max = 1;
	const distSticker = cubiSize / 2 + 1;

	if (i == max) {
		let sticker = roundedRectShape(stickerSize, stickerSize, 20, 0xdd3311);
		sticker.position.set(distSticker, 0, 0);
		sticker.rotation.set(0, deg2rad(90), 0);
		cubi.add(sticker);
	} else if (i == min) {
		let sticker = roundedRectShape(stickerSize, stickerSize, 20, 0xff9000);
		sticker.position.set(-distSticker, 0, 0);
		sticker.rotation.set(0, deg2rad(90), 0);
		cubi.add(sticker);
	}

	if (j == max) {
		let sticker = roundedRectShape(stickerSize, stickerSize, 20, 0x11dd33);
		sticker.position.set(0, distSticker, 0);
		sticker.rotation.set(deg2rad(90), 0, 0);
		cubi.add(sticker);
	} else if (j == min) {
		let sticker = roundedRectShape(stickerSize, stickerSize, 20, 0xffff00);
		sticker.position.set(0, -distSticker, 0);
		sticker.rotation.set(deg2rad(90), 0, 0);
		cubi.add(sticker);
	}

	if (k == max) {
		let sticker = roundedRectShape(stickerSize, stickerSize, 20, 0x5533dd);
		sticker.position.set(0, 0, distSticker);
		cubi.add(sticker);
	} else if (k == min) {
		let sticker = roundedRectShape(stickerSize, stickerSize, 20, 0xdd11dd);
		sticker.position.set(0, 0, -distSticker);
		cubi.add(sticker);
	}
}

function getCubi() {
	let geometry = new THREE.CubeGeometry(cubiSize, cubiSize, cubiSize);
	let material = new THREE.MeshPhongMaterial({
		color: 0x555555, specular: 0x111111, shininess: 1
	});
	let cubi = new THREE.Mesh(geometry, material);
	return cubi;
}

function addCircle() {
	let segmentCount = 32,
		radius = 220,
		geometry = new THREE.Geometry(),
		material = new THREE.LineBasicMaterial({ color: 0x00FF00 });

	for (let i = 0; i <= segmentCount; i++) {
		let theta = (i / segmentCount) * Math.PI * 2;
		geometry.vertices.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
	}

	scene.add(new THREE.Line(geometry, material));
}
function initStats() {
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	stats.domElement.style.right = '0px';
	container.append(stats.domElement);
}
function initControls() {
	const gui = new dat.GUI({ closeOnTop: true });
	gui.add(this, 'rotateRed').name('Rotar Rojo');
	gui.add(this, 'rotateGreen').name('Rotar Verde');
	gui.add(controls, 'menu', [75, 100, 150, 200, 250, 300]).name('Tamaño Menu %').onChange(function () {
		$('.dg.main.a').css({
			'transform-origin': '0 0',
			'-webkit-transform': 'scale(' + controls.menu * 0.01 + ')',
			'-moz-transform': 'scale(' + controls.menu * 0.01 + ')',
			'-ms-transform': 'scale(' + controls.menu * 0.01 + ')',
			'-o-transform': 'scale(' + controls.menu * 0.01 + ')',
			'transform': 'scale(' + controls.menu * 0.01 + ')'
		});
	});
}
function createLights() {
	scene.add(new THREE.AmbientLight(0xffffff, 0.5));
	directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
	directionalLight.position.set(1, 2, 1)
	scene.add(directionalLight);
	directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
	directionalLight.position.set(-1, -2, -1)
	scene.add(directionalLight);
}

function animate() {
	let delta = clock.getElapsedTime();
	// logic(delta);

	cameraControls.update(clock.getDelta());

	stats.update();
	renderer.render(scene, camera);

	requestAnimationFrame(animate);
}

function logic(time) {
	if (controls.velocidad > 0) {
		earth.rotation.y = angularVelocityEarthSimulation * time;
		controls.rotacionTierra = normalizeAngle(rad2deg(earth.rotation.y));
		updateGuidedUnitArmPosition();
		updateCameraViewPosition();
		updateVisionLinePosition();
	}
}
let inRotation = false;
function rotateRed() {
	const min = -1, max = 1, i = 1;
	inRotation = !inRotation;
	for (let j = min; j <= max; j++) {
		for (let k = min; k <= max; k++) {
			rotateAroundWorldAxis(cubeMatrix[i][j][k], new THREE.Vector3(1, 0, 0), deg2rad(45));
		}
	}

	let axisA = 1, axisB = 1, addAxisA = 0, addAxisB = -1;
	const temp = cubeMatrix[1][axisA][axisB];
	const maxLoop = (max - min + 1)**2 - 1*1 - 2;
	for (let n = 0; n <= maxLoop; n++) {
		if (axisB + addAxisB < min || axisB + addAxisB > max) {
			if (axisA == max) {
				addAxisB = 0, addAxisA = -1;
			} else {
				addAxisB = 0, addAxisA = 1;
			}
		}
		if (axisA + addAxisA < min || axisA + addAxisA > max) {
			if (axisB == max) {
				addAxisB = -1, addAxisA = 0;
			} else {
				addAxisB = 1, addAxisA = 0;
			}
		}
		let newAxisA = axisA + addAxisA
		let newAxisB = axisB + addAxisB
		//console.log(`j ${j}, k ${k}`);
		cubeMatrix[1][axisA][axisB] = cubeMatrix[1][newAxisA][newAxisB];
		axisA = newAxisA, axisB = newAxisB;
		if (n == maxLoop) {
			cubeMatrix[1][axisA][axisB] = temp;
		}
	}
}



function rotateGreen() {
	const min = -1, max = 1, j = 1;
	inRotation = !inRotation;
	for (let i = min; i <= max; i++) {
		for (let k = min; k <= max; k++) {
			rotateAroundWorldAxis(cubeMatrix[i][j][k], new THREE.Vector3(0, 1, 0), deg2rad(45));
		}
	}


	let axisA = 1, axisB = 1, addAxisA = 0, addAxisB = 1;
	const temp = cubeMatrix[axisA][1][axisB];
	const maxLoop = (max - min + 1)**2 - 1*1 - 2;
	for (let n = 0; n <= maxLoop; n++) {
		if (axisB + addAxisB < min || axisB + addAxisB > max) {
			if (axisA == max) {
				addAxisB = 0, addAxisA = -1;
			} else {
				addAxisB = 0, addAxisA = 1;
			}
		}
		if (axisA + addAxisA < min || axisA + addAxisA > max) {
			if (axisB == max) {
				addAxisB = -1, addAxisA = 0;
			} else {
				addAxisB = 1, addAxisA = 0;
			}
		}
		let newAxisA = axisA + addAxisA
		let newAxisB = axisB + addAxisB
		//console.log(`j ${j}, k ${k}`);
		cubeMatrix[axisA][1][axisB] = cubeMatrix[newAxisA][1][newAxisB];
		axisA = newAxisA, axisB = newAxisB;
		if (n == maxLoop) {
			cubeMatrix[axisA][1][axisB] = temp;
		}
	}
}

function rotateAroundWorldAxis(obj, axis, radians) {
	let rotWorldMatrix = new THREE.Matrix4();
	rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
	rotWorldMatrix.multiply(obj.matrix);  // pre-multiply
	obj.matrix = rotWorldMatrix;
	obj.setRotationFromMatrix(obj.matrix);
}

function debugIndicator(x, y, z, color) {
	let indicator = new THREE.Mesh(
		new THREE.SphereGeometry(5, 8, 8),
		new THREE.MeshBasicMaterial({ color: color })
	);
	indicator.position.set(x, y, z);
	scene.add(indicator);
}

function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max) {
	return Math.random() * (max - min + 1) + min;
}
function deg2rad(degrees) {
	return degrees * (Math.PI / 180);
}
function rad2deg(radians) {
	return radians * (180 / Math.PI);
}
function normalizeAngle(degrees) {
	degrees = degrees % 360;
	return degrees > 180 ? degrees - 360 : degrees;
}

init();
animate();