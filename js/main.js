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

	addCircle();

	for (let i = -1; i <= 1; i++) {
		for (let j = -1; j <= 1; j++) {
			for (let k = -1; k <= 1; k++) {
				if (i == 0 && j == 0 && k == 0) {
					continue;
				}
				let cubi = getCubi();
				addStickers(cubi, i, j, k);
				cubi.position.set(i * cubeSize / 3, j * cubeSize / 3, k * cubeSize / 3);
				cubeContainer.add(cubi);
			}
		}
	}
	scene.add(cubeContainer);
	initStats();
	initControls();

	console.log(scene)
}

function addStickers(cubi, i, j, k) {
	const distSticker = cubiSize/2+1;
	
	if (i == 1) {
		let sticker = roundedRectShape(stickerSize, stickerSize, 20, 0xdd3311);
		sticker.position.set(distSticker, 0, 0);
		sticker.rotation.set(0, deg2rad(90), 0);
		cubi.add(sticker);
	} else if (i == -1) {
		let sticker = roundedRectShape(stickerSize, stickerSize, 20, 0xff9000);
		sticker.position.set(-distSticker, 0, 0);
		sticker.rotation.set(0, deg2rad(90), 0);
		cubi.add(sticker);
	}

	if (j == 1) {
		let sticker = roundedRectShape(stickerSize, stickerSize, 20, 0x11dd33);
		sticker.position.set(0, distSticker, 0);
		sticker.rotation.set(deg2rad(90), 0, 0);
		cubi.add(sticker);
	} else if (j == -1) {
		let sticker = roundedRectShape(stickerSize, stickerSize, 20, 0xffff00);
		sticker.position.set(0, -distSticker, 0);
		sticker.rotation.set(deg2rad(90), 0, 0);
		cubi.add(sticker);
	}

	if (k == 1) {
		let sticker = roundedRectShape(stickerSize, stickerSize, 20, 0x5533dd);
		sticker.position.set(0, 0, distSticker);
		cubi.add(sticker);
	} else if (k == -1) {
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
		_radius = 100 + 1.5,
		geometry = new THREE.Geometry(),
		material = new THREE.LineBasicMaterial({ color: 0x00FF00 });

	for (let i = 0; i <= segmentCount; i++) {
		let theta = (i / segmentCount) * Math.PI * 2;
		geometry.vertices.push(new THREE.Vector3(Math.cos(theta) * _radius, 0, Math.sin(theta) * _radius));
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