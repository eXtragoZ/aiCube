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
const minCubi = -1, maxCubi = 1;

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
	const notVisible = (v) => v > minCubi && v < maxCubi;
	for (let i = minCubi; i <= maxCubi; i++) {
		cubeMatrix[i] = []
		for (let j = minCubi; j <= maxCubi; j++) {
			cubeMatrix[i][j] = []
			for (let k = minCubi; k <= maxCubi; k++) {
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
	const distSticker = cubiSize / 2 + 1;

	if (i == maxCubi) {
		let sticker = roundedRectShape(stickerSize, stickerSize, 20, 0xdd3311);
		sticker.position.set(distSticker, 0, 0);
		sticker.rotation.set(0, deg2rad(90), 0);
		cubi.add(sticker);
	} else if (i == minCubi) {
		let sticker = roundedRectShape(stickerSize, stickerSize, 20, 0xff9000);
		sticker.position.set(-distSticker, 0, 0);
		sticker.rotation.set(0, deg2rad(90), 0);
		cubi.add(sticker);
	}

	if (j == maxCubi) {
		let sticker = roundedRectShape(stickerSize, stickerSize, 20, 0x11dd33);
		sticker.position.set(0, distSticker, 0);
		sticker.rotation.set(deg2rad(90), 0, 0);
		cubi.add(sticker);
	} else if (j == minCubi) {
		let sticker = roundedRectShape(stickerSize, stickerSize, 20, 0xffff00);
		sticker.position.set(0, -distSticker, 0);
		sticker.rotation.set(deg2rad(90), 0, 0);
		cubi.add(sticker);
	}

	if (k == maxCubi) {
		let sticker = roundedRectShape(stickerSize, stickerSize, 20, 0x5533dd);
		sticker.position.set(0, 0, distSticker);
		cubi.add(sticker);
	} else if (k == minCubi) {
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
	gui.add(this, 'rotateBlue').name('Rotar Azul');
	gui.add(this, 'rotateOrange').name('Rotar Naranja');
	gui.add(this, 'rotateYellow').name('Rotar Amarillo');
	gui.add(this, 'rotatePurple').name('Rotar Violeta');
	
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
	logic(delta);

	cameraControls.update(clock.getDelta());

	stats.update();
	renderer.render(scene, camera);

	requestAnimationFrame(animate);
}

function logic(time) {
	if (inRotation) {
		rotateAnimate();
	}
}

let inRotation = false;
let rotationFrames = 0;
let rotationDuration = 4;
let rotationVector = new THREE.Vector3(1, 0, 0);
let rotationGetter = () => null;
let rotationDirecction = 1;
function rotateAnimate() {
	rotationFrames++;

	for (let axisA = minCubi; axisA <= maxCubi; axisA++) {
		for (let axisB = minCubi; axisB <= maxCubi; axisB++) {
			rotateAroundWorldAxis(rotationGetter(axisA, axisB), rotationVector, rotationDirecction*deg2rad(90)/rotationDuration);
		}
	}
	if (rotationFrames == rotationDuration) {
		rotationFrames = 0;
		inRotation = false;
	}
}

function rotateRed() {
	if (inRotation) {return;}
	inRotation = true;

	rotationVector = new THREE.Vector3(1, 0, 0);
	rotationDirecction = 1
	const i = maxCubi
	rotationGetter = (j, k) => cubeMatrix[i][j][k];
	let rotationSetter = (j, k, cubi) => {cubeMatrix[i][j][k] = cubi};

	rotateMatrix(rotationGetter, rotationSetter, -1);
	rotateMatrix(rotationGetter, rotationSetter, -1);
}

function rotateGreen() {
	if (inRotation) {return;}
	inRotation = true;

	rotationVector = new THREE.Vector3(0, 1, 0);
	rotationDirecction = 1
	const j = maxCubi
	rotationGetter = (i, k) => cubeMatrix[i][j][k];
	let rotationSetter = (i, k, cubi) => {cubeMatrix[i][j][k] = cubi};

	rotateMatrix(rotationGetter, rotationSetter, 1);
	rotateMatrix(rotationGetter, rotationSetter, 1);
}

function rotateBlue() {
	if (inRotation) {return;}
	inRotation = true;

	rotationVector = new THREE.Vector3(0, 0, 1);
	rotationDirecction = 1
	const k = maxCubi
	rotationGetter = (i, j) => cubeMatrix[i][j][k];
	let rotationSetter = (i, j, cubi) => {cubeMatrix[i][j][k] = cubi};

	rotateMatrix(rotationGetter, rotationSetter, -1);
	rotateMatrix(rotationGetter, rotationSetter, -1);
}

function rotateOrange() {
	if (inRotation) {return;}
	inRotation = true;

	rotationVector = new THREE.Vector3(1, 0, 0);
	rotationDirecction = 1
	const i = minCubi
	rotationGetter = (j, k) => cubeMatrix[i][j][k];
	let rotationSetter = (j, k, cubi) => {cubeMatrix[i][j][k] = cubi};

	rotateMatrix(rotationGetter, rotationSetter, -1);
	rotateMatrix(rotationGetter, rotationSetter, -1);
}

function rotateYellow() {
	if (inRotation) {return;}
	inRotation = true;

	rotationVector = new THREE.Vector3(0, 1, 0);
	rotationDirecction = 1
	const j = minCubi
	rotationGetter = (i, k) => cubeMatrix[i][j][k];
	let rotationSetter = (i, k, cubi) => {cubeMatrix[i][j][k] = cubi};

	rotateMatrix(rotationGetter, rotationSetter, 1);
	rotateMatrix(rotationGetter, rotationSetter, 1);
}

function rotatePurple() {
	if (inRotation) {return;}
	inRotation = true;

	rotationVector = new THREE.Vector3(0, 0, 1);
	rotationDirecction = 1
	const k = minCubi
	rotationGetter = (i, j) => cubeMatrix[i][j][k];
	let rotationSetter = (i, j, cubi) => {cubeMatrix[i][j][k] = cubi};

	rotateMatrix(rotationGetter, rotationSetter, -1);
	rotateMatrix(rotationGetter, rotationSetter, -1);
}

function rotateMatrix(getter, setter, direcction = 1) {
	let axisA = 1, axisB = 1, addAxisA = 0, addAxisB = direcction;
	const temp = getter(axisA, axisB);
	const maxLoop = (maxCubi - minCubi + 1)**2 - 1*1 - 2;
	for (let n = 0; n <= maxLoop; n++) {
		if (axisB + addAxisB < minCubi || axisB + addAxisB > maxCubi) {
			if (axisA == maxCubi) {
				addAxisB = 0, addAxisA = -1;
			} else {
				addAxisB = 0, addAxisA = 1;
			}
		}
		if (axisA + addAxisA < minCubi || axisA + addAxisA > maxCubi) {
			if (axisB == maxCubi) {
				addAxisB = -1, addAxisA = 0;
			} else {
				addAxisB = 1, addAxisA = 0;
			}
		}
		let newAxisA = axisA + addAxisA
		let newAxisB = axisB + addAxisB
		//console.log(`axisA ${axisA}, axisB ${axisB}`);
		setter(axisA, axisB, getter(newAxisA, newAxisB));
		axisA = newAxisA, axisB = newAxisB;
		if (n == maxLoop) {
			setter(axisA, axisB, temp);
		}
	}
}

function rotateAroundWorldAxis(obj, axis, radians) {
	let rotWorldMatrix = new THREE.Matrix4();
	rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
	rotWorldMatrix.multiply(obj.matrix);  // pre-multiply
	obj.matrix = rotWorldMatrix;
	obj.setRotationFromMatrix(obj.matrix);
	if (Math.abs(obj.rotation.x) < 0.0001) {
		obj.rotation.x = 0
	}
	if (Math.abs(obj.rotation.y) < 0.0001) {
		obj.rotation.y = 0
	}
	if (Math.abs(obj.rotation.z) < 0.0001) {
		obj.rotation.z = 0
	}
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