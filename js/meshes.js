const textureLoader = new THREE.TextureLoader();
function roundedRectShape( width, height, radius, color ) {
	let ctx = new THREE.Shape();
	let x = -width/2;
	let y = -height/2;
	ctx.moveTo( x, y + radius );
	ctx.lineTo( x, y + height - radius );
	ctx.quadraticCurveTo( x, y + height, x + radius, y + height );
	ctx.lineTo( x + width - radius, y + height );
	ctx.quadraticCurveTo( x + width, y + height, x + width, y + height - radius );
	ctx.lineTo( x + width, y + radius );
	ctx.quadraticCurveTo( x + width, y, x + width - radius, y );
	ctx.lineTo( x + radius, y );
	ctx.quadraticCurveTo( x, y, x, y + radius );
	let geometry = new THREE.ShapeBufferGeometry(ctx);;
	let mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: color, side: THREE.DoubleSide } ) );
	return mesh;
}
function lineCircle(radius) {
	let segmentCount = 32,
		geometry = new THREE.Geometry(),
		material = new THREE.LineBasicMaterial({ color: 0x00FF00 });

	for (let i = 0; i <= segmentCount; i++) {
		let theta = (i / segmentCount) * Math.PI * 2;
		geometry.vertices.push(new THREE.Vector3(Math.cos(theta) * _radius, 0, Math.sin(theta) * _radius));
	}

	return new THREE.Line(geometry, material);
}
function meshEarth(radius) {
	let segments = 32;
	let map = textureLoader.load('textures/earth.jpg');
	map.minFilter = THREE.LinearFilter;
	let mesh = new THREE.Mesh(
		new THREE.SphereGeometry(radius, segments, segments),
		new THREE.MeshPhongMaterial({
			map: map, specular: 0x111111, shininess: 1,
			bumpMap: map, bumpScale: 0.02, specularMap: map
		})
	);
	return mesh;
}
function lineEarthAxis() {
	let material = new THREE.LineDashedMaterial({
		color: 0x0000FF, linewidth: 1, dashSize: 50, gapSize: 10,
	});

	let geometry = new THREE.Geometry();
	geometry.vertices.push(
		new THREE.Vector3(0, -200, 0),
		new THREE.Vector3(0, 200, 0)
	);

	let line = new THREE.Line(geometry, material);
	line.computeLineDistances();
	return line;
}
function lineEarthToGU() {
	let material = new THREE.LineDashedMaterial({
		color: 0x00FFFF, linewidth: 1, dashSize: 50, gapSize: 10,
	});

	let geometry = new THREE.Geometry();
	geometry.vertices.push(
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(200, 0, 0)
	);

	let line = new THREE.Line(geometry, material);
	line.computeLineDistances();
	return line;
}

function meshAstro(radius) {
	let segments = 32;
	let map = textureLoader.load('textures/sun.jpg');
	map.minFilter = THREE.LinearFilter;
	let mesh = new THREE.Mesh(
		new THREE.SphereGeometry(radius, segments, segments),
		new THREE.MeshPhongMaterial({
			map: map, specular: 0x111111, shininess: 1, specularMap: map
		})
	);
	return mesh;
}

function meshGuidedUnitBase() {
	let mesh = new THREE.Mesh(
		new THREE.BoxGeometry(2, 2, 2),
		new THREE.MeshPhongMaterial({ color: 0xbbbbbb })
	);
	mesh.position.set(0, -0.5, 0);
	return mesh;
}

function meshGuidedUnitArm() {
	let meshOne = new THREE.Mesh(new THREE.BoxGeometry(2, 0.5, 0.5));
	meshOne.rotation.set(0, 0, deg2rad(45));
	meshOne.position.set(1.5, 0.5, 0);
	let meshTwo = new THREE.Mesh(new THREE.BoxGeometry(2, 0.5, 0.5));
	meshTwo.position.set(3.03, 1.13, 0);

	let singleGeometry = new THREE.Geometry();
	
	meshOne.updateMatrix();
	singleGeometry.merge(meshOne.geometry, meshOne.matrix);
	
	meshTwo.updateMatrix();
	singleGeometry.merge(meshTwo.geometry, meshTwo.matrix);

	let mesh = new THREE.Mesh(
		singleGeometry,
		new THREE.MeshPhongMaterial({ color: 0x0088FF })
	);

	return mesh;
}

function meshGuidedUnitHand() {
	let mesh = new THREE.Mesh(
		new THREE.TorusBufferGeometry(0.75, 0.2, 5, 7, Math.PI * 3 / 2), //radius, tube, radialSegments, tubularSegments, arc 
		new THREE.MeshPhongMaterial({ color: 0xFF2211 })
	);
	mesh.rotation.set(deg2rad(90), deg2rad(-90), deg2rad(45));
	return mesh;
}
function lineGuidedUnitVision() {
	let material = new THREE.LineDashedMaterial({
		color: 0xff0000, linewidth: 1, dashSize: 50, gapSize: 10,
	});
	let geometry = new THREE.Geometry();
	geometry.vertices.push(
		new THREE.Vector3(-1, 0, 0),
		new THREE.Vector3(1000, 0, 0)
	);
	let visionLine = new THREE.Line(geometry, material);
	visionLine.computeLineDistances();
	return visionLine;
}
function lineGuidedUnitSetVision() {
	let material = new THREE.LineDashedMaterial({
		color: 0xff5500, linewidth: 1, dashSize: 50, gapSize: 10,
	});
	let geometry = new THREE.Geometry();
	geometry.vertices.push(
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(1000, 0, 0)
	);
	let visionLine = new THREE.Line(geometry, material);
	visionLine.computeLineDistances();
	return visionLine;
}