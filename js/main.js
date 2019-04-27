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
const cubeSize = 300
const cubiSize = cubeSize / 3 - 8
const stickerSize = cubeSize * 0.25
const cubeContainer = new THREE.Object3D();
let cubeMatrix = [];
const minCubi = -1, maxCubi = 1;

var sides = [
	{ name: "ROJO", normal: new THREE.Vector3(1, 0, 0), rotation: new THREE.Vector3(0, 1, 0), color: 0xdd3311, rotate: rotateRed },
	{ name: "NARANJA", normal: new THREE.Vector3(-1, 0, 0), rotation: new THREE.Vector3(0, 1, 0), color: 0xff9000, rotate: rotateOrange},
	{ name: "VERDE", normal: new THREE.Vector3(0, 1, 0), rotation: new THREE.Vector3(1, 0, 0), color: 0x11dd33, rotate: rotateGreen},
	{ name: "AMARILLO", normal: new THREE.Vector3(0, -1, 0), rotation: new THREE.Vector3(1, 0, 0), color: 0xffff00, rotate: rotateYellow},
	{ name: "AZUL", normal: new THREE.Vector3(0, 0, 1), rotation: new THREE.Vector3(0, 0, 0), color: 0x5533dd, rotate: rotateBlue},
	{ name: "VIOLETA", normal: new THREE.Vector3(0, 0, -1), rotation: new THREE.Vector3(0, 0, 0), color: 0xdd11dd, rotate: rotatePurple}
];

let controls = {
	menu: 100,
	solved: 100
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

	initMouseTracking();

	console.log(scene)
}

function newCube() {
	const notVisible = (v) => v > minCubi && v < maxCubi;
	for (let i = minCubi; i <= maxCubi; i++) {
		cubeMatrix[i] = [];
		for (let j = minCubi; j <= maxCubi; j++) {
			cubeMatrix[i][j] = [];
			for (let k = minCubi; k <= maxCubi; k++) {
				if (notVisible(i) && notVisible(j) && notVisible(k)) {
					continue;
				}
				const cubi = getCubi();
				addStickers(cubi, i, j, k);
				cubi.position.set(i * cubeSize / 3, j * cubeSize / 3, k * cubeSize / 3);
				const cubiWrapper = new THREE.Object3D();
				cubiWrapper.colors = cubi.colors;
				cubiWrapper.add(cubi);
				cubeContainer.add(cubiWrapper);
				cubeMatrix[i][j][k] = cubiWrapper;
			}
		}
	}
	scene.add(cubeContainer);
}

function addStickers(cubi, i, j, k) {
	cubi.colors = [];
	if (i == maxCubi) {
		addStickerSide(cubi, sides[0]);
	} else if (i == minCubi) {
		addStickerSide(cubi, sides[1]);
	}

	if (j == maxCubi) {
		addStickerSide(cubi, sides[2]);
	} else if (j == minCubi) {
		addStickerSide(cubi, sides[3]);
	}

	if (k == maxCubi) {
		addStickerSide(cubi, sides[4]);
	} else if (k == minCubi) {
		addStickerSide(cubi, sides[5]);
	}
}

function addStickerSide(cubi, side) {
	const distSticker = cubiSize / 2 + 1;
	const sticker = roundedRectShape(stickerSize, stickerSize, 20, side.color);
	sticker.position.copy(side.normal).multiplyScalar(distSticker);
	sticker.setRotationFromAxisAngle(side.rotation, deg2rad(90));
	cubi.add(sticker);
	cubi.colors.push(side.color);
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
	/*
	gui.add(this, 'rotateRed').name('Rotar Rojo');
	gui.add(this, 'rotateGreen').name('Rotar Verde');
	gui.add(this, 'rotateBlue').name('Rotar Azul');
	gui.add(this, 'rotateOrange').name('Rotar Naranja');
	gui.add(this, 'rotateYellow').name('Rotar Amarillo');
	gui.add(this, 'rotatePurple').name('Rotar Violeta');
	*/
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

	gui.add(controls, 'solved').name('Percentage solved').listen();
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
	raycastUpdate();

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
			rotateAroundWorldAxis(rotationGetter(axisA, axisB), rotationVector, rotationDirecction * deg2rad(90) / rotationDuration);
		}
	}
	if (rotationFrames == rotationDuration) {
		rotationFrames = 0;
		inRotation = false;
	}
}

function rotateRed() {
	if (inRotation) { return; }
	inRotation = true;

	rotationVector = new THREE.Vector3(1, 0, 0);
	const i = maxCubi
	rotationGetter = (j, k) => cubeMatrix[i][j][k];
	let rotationSetter = (j, k, cubi) => { cubeMatrix[i][j][k] = cubi };

	for (let times = 0; times < maxCubi - minCubi; times++) {
		rotateMatrix(rotationGetter, rotationSetter, -rotationDirecction);
	}
}

function rotateGreen() {
	if (inRotation) { return; }
	inRotation = true;

	rotationVector = new THREE.Vector3(0, 1, 0);
	const j = maxCubi
	rotationGetter = (i, k) => cubeMatrix[i][j][k];
	let rotationSetter = (i, k, cubi) => { cubeMatrix[i][j][k] = cubi };

	for (let times = 0; times < maxCubi - minCubi; times++) {
		rotateMatrix(rotationGetter, rotationSetter, rotationDirecction);
	}
}

function rotateBlue() {
	if (inRotation) { return; }
	inRotation = true;

	rotationVector = new THREE.Vector3(0, 0, 1);
	const k = maxCubi
	rotationGetter = (i, j) => cubeMatrix[i][j][k];
	let rotationSetter = (i, j, cubi) => { cubeMatrix[i][j][k] = cubi };

	for (let times = 0; times < maxCubi - minCubi; times++) {
		rotateMatrix(rotationGetter, rotationSetter, -rotationDirecction);
	}
}

function rotateOrange() {
	if (inRotation) { return; }
	inRotation = true;

	rotationVector = new THREE.Vector3(-1, 0, 0);
	const i = minCubi
	rotationGetter = (j, k) => cubeMatrix[i][j][k];
	let rotationSetter = (j, k, cubi) => { cubeMatrix[i][j][k] = cubi };

	for (let times = 0; times < maxCubi - minCubi; times++) {
		rotateMatrix(rotationGetter, rotationSetter, rotationDirecction);
	}
}

function rotateYellow() {
	if (inRotation) { return; }
	inRotation = true;

	rotationVector = new THREE.Vector3(0, -1, 0);
	const j = minCubi
	rotationGetter = (i, k) => cubeMatrix[i][j][k];
	let rotationSetter = (i, k, cubi) => { cubeMatrix[i][j][k] = cubi };

	for (let times = 0; times < maxCubi - minCubi; times++) {
		rotateMatrix(rotationGetter, rotationSetter, -rotationDirecction);
	}
}

function rotatePurple() {
	if (inRotation) { return; }
	inRotation = true;

	rotationVector = new THREE.Vector3(0, 0, -1);
	const k = minCubi
	rotationGetter = (i, j) => cubeMatrix[i][j][k];
	let rotationSetter = (i, j, cubi) => { cubeMatrix[i][j][k] = cubi };

	for (let times = 0; times < maxCubi - minCubi; times++) {
		rotateMatrix(rotationGetter, rotationSetter, rotationDirecction);
	}
}

function rotateMatrix(getter, setter, direcction = 1) {
	let axisA = maxCubi, axisB = maxCubi, addAxisA = 0, addAxisB = direcction;
	const temp = getter(axisA, axisB);
	const maxLoop = (maxCubi - minCubi + 1) ** 2 - (maxCubi - minCubi - 1) ** 2 - 2;
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
	controls.solved = percentageSolved();
}

function percentageSolved() {
	const notVisible = (v) => v != minCubi && v != maxCubi;
	const cubiNotVisible = (i, j, k) => notVisible(i) && notVisible(j) && notVisible(k);
	const notValid = (v) => v < minCubi || v > maxCubi;
	const cubiNotValid = (i, j, k) => notValid(i) || notValid(j) || notValid(k) || cubiNotVisible(i, j, k);
	let totalPercentage = 0;
	let cubis = 0;
	for (let i = minCubi; i <= maxCubi; i++) {
		for (let j = minCubi; j <= maxCubi; j++) {
			for (let k = minCubi; k <= maxCubi; k++) {
				if (cubiNotVisible(i, j, k)) {
					continue;
				}
				cubis++;
				const cubiColors = cubeMatrix[i][j][k].colors;
				let adjacent = 0;
				let percentage = 0;
				if (!cubiNotValid(i - 1, j, k)) {
					adjacent++;
					percentage += compareColors(cubiColors, cubeMatrix[i - 1][j][k].colors);
				}
				if (!cubiNotValid(i + 1, j, k)) {
					adjacent++;
					percentage += compareColors(cubiColors, cubeMatrix[i + 1][j][k].colors);
				}
				if (!cubiNotValid(i, j - 1, k)) {
					adjacent++;
					percentage += compareColors(cubiColors, cubeMatrix[i][j - 1][k].colors);
				}
				if (!cubiNotValid(i, j + 1, k)) {
					adjacent++;
					percentage += compareColors(cubiColors, cubeMatrix[i][j + 1][k].colors);
				}
				if (!cubiNotValid(i, j, k - 1)) {
					adjacent++;
					percentage += compareColors(cubiColors, cubeMatrix[i][j][k - 1].colors);
				}
				if (!cubiNotValid(i, j, k + 1)) {
					adjacent++;
					percentage += compareColors(cubiColors, cubeMatrix[i][j][k + 1].colors);
				}
				totalPercentage += percentage / adjacent;
			}
		}
	}
	return totalPercentage / cubis;
}
function compareColors(referenceColors, testColors) {
	const maxColors = Math.min(referenceColors.length, testColors.length);
	let colorMaches = 0;
	for (const referenceColor of referenceColors) {
		for (const testColor of testColors) {
			if (referenceColor === testColor) {
				colorMaches++;
			}
		}
	}

	return maxColors === colorMaches ? 100 : 0;
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

//----------------------Mouse Position----------------------------

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
var mouseBall;

function initMouseTracking() {
	window.addEventListener('mousedown', onMouseDown, true);
	window.addEventListener('mousemove', onMouseMove, true);

	mouseBall = new THREE.Mesh(new THREE.SphereGeometry(5, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
	mouseBall.name = "mouseBall";
	scene.add(mouseBall);

	for (const side of sides) {
		createMousePlane(side);
	}

}

function createMousePlane(side) {
	const plane = new THREE.Mesh(
		new THREE.PlaneGeometry(cubeSize, cubeSize, 1),
		new THREE.MeshBasicMaterial({ color: side.color, side: THREE.DoubleSide, opacity: 0.0, transparent: true }));

	plane.position.copy(side.normal).multiplyScalar(cubeSize / 2);
	plane.setRotationFromAxisAngle(side.rotation, deg2rad(90));

	plane.color = side.name;
	plane.name = "mousePlane";
	plane.side = side;
	scene.add(plane);
	return plane;
}

function onMouseMove(event) {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

function raycastUpdate() {
	if (!mouse.x && !mouse.y) { return; }
	raycaster.setFromCamera(mouse, camera);
	const intersects = raycaster.intersectObjects(scene.children, true);
	for (const intersection of intersects) {
		if (intersection.object.name != "mouseBall" && intersection.object.type == "Mesh") {
			mouseBall.position.copy(intersection.point);
			break;
		}
	}
}
function onMouseDown(event) {
	if (inRotation) {return;}
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
	raycaster.setFromCamera(mouse, camera);
	const intersects = raycaster.intersectObjects(scene.children, true);
	for (const intersection of intersects) {
		if (intersection.object.name == "mousePlane") {
			mouseBall.position.copy(intersection.point);
			if (event.button == 0) {
				rotationDirecction = 1;
				intersection.object.side.rotate();
			} else if (event.button == 2) {
				rotationDirecction = -1;
				intersection.object.side.rotate();
			}

			break;
		}
	}
}

//---------------------------------Init----------------------------

init();
animate();