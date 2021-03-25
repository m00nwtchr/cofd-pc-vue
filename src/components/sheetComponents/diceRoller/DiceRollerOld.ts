import * as THREE from "three";
import * as CANNON from "cannon";
import { Random } from "@/RandomUtil";

// interface DiceRollerConfig

function fromAxisAngle(axis: CANNON.Vec3, angle: number) {
	const quat = new CANNON.Quaternion();
	quat.setFromAxisAngle(axis, angle);

	return quat;
}

// function makeGeom(vertices: THREE.Vector3[], faces, radius, tab, af) {
// 	// const geom = new THREE.PolyhedronGeometry();
// 	const g = {
// 		faces: [],
// 		vertices: [] as THREE.Vector3[]
// 	};
// 	for (let i = 0; i < vertices.length; ++i) {
// 		const vertex = vertices[i].multiplyScalar(radius);
// 		vertex.index = g.vertices.push(vertex) - 1;
// 	}
// 	for (let i = 0; i < faces.length; ++i) {
// 		const ii = faces[i], fl = ii.length - 1;
// 		const aa = Math.PI * 2 / fl;
// 		for (let j = 0; j < fl - 2; ++j) {
// 			g.faces.push(new THREE.Face3(ii[0], ii[j + 1], ii[j + 2], [g.vertices[ii[0]],
// 				g.vertices[ii[j + 1]], g.vertices[ii[j + 2]]], 0, ii[fl] + 1));
// 			geom.faceVertexUvs[0].push([
// 				new THREE.Vector2((Math.cos(af) + 1 + tab) / 2 / (1 + tab),
// 					(Math.sin(af) + 1 + tab) / 2 / (1 + tab)),
// 				new THREE.Vector2((Math.cos(aa * (j + 1) + af) + 1 + tab) / 2 / (1 + tab),
// 					(Math.sin(aa * (j + 1) + af) + 1 + tab) / 2 / (1 + tab)),
// 				new THREE.Vector2((Math.cos(aa * (j + 2) + af) + 1 + tab) / 2 / (1 + tab),
// 					(Math.sin(aa * (j + 2) + af) + 1 + tab) / 2 / (1 + tab))]);
// 		}
// 	}
// 	geom.computeFaceNormals();
// 	geom.boundingSphere = new THREE.Sphere(new THREE.Vector3(), radius);
// 	return geom;
// }

// function createGeom(vertices: number[][], faces: number[][], radius: number, tab: number, af: number, chamfer: number) {
// 	const vectors = new Array(vertices.length);
// 	for (let i = 0; i < vertices.length; ++i) {
// 		vectors[i] = (new THREE.Vector3).fromArray(vertices[i]).normalize();
// 	}
// 	const cg = chamfer_geom(vectors, faces, chamfer);
// 	const geom = make_geom(cg.vectors, cg.faces, radius, tab, af);
// 	//var geom = make_geom(vectors, faces, radius, tab, af); // Without chamfer
// 	geom.cannon_shape = create_shape(vectors, faces, radius);
// 	return geom;
// }

function createShape(vertices: number[][], faces: number[][], radius: number) {
	const vectors = new Array(vertices.length);
	for (let i = 0; i < vertices.length; ++i) {
		vectors[i] = (new THREE.Vector3).fromArray(vertices[i]).normalize();
	}
	const cv = new Array(vectors.length), cf = new Array(faces.length);
	for (let i = 0; i < vectors.length; ++i) {
		const v = vectors[i];
		cv[i] = new CANNON.Vec3(v.x * radius, v.y * radius, v.z * radius);
	}
	for (let i = 0; i < faces.length; ++i) {
		cf[i] = faces[i].slice(0, faces[i].length - 1);
	}
	return new CANNON.ConvexPolyhedron(cv, cf);
}

// function createShape(vertices: THREE.Vector3[], faces: number[][], radius: number) {
// 	const cv = new Array(vertices.length), cf = new Array(faces.length);
// 	for (let i = 0; i < vertices.length; ++i) {
// 		const v = vertices[i];
// 		cv[i] = new CANNON.Vec3(v.x * radius, v.y * radius, v.z * radius);
// 	}
// 	for (let i = 0; i < faces.length; ++i) {
// 		cf[i] = faces[i].slice(0, faces[i].length - 1);
// 	}
// 	return new CANNON.ConvexPolyhedron(cv, cf);
// }

interface DieMesh extends THREE.Mesh {
	dieType: string;
	body: CANNON.Body;
	cannonShape: CANNON.ConvexPolyhedron;
	stopped?: boolean | number;
}

const GEOMETRY: {[key: string]: THREE.PolyhedronGeometry} = {};
const MATERIAL: {[key: string]: THREE.MeshBasicMaterial} = {};

const DIE_FACTORIES: {
	// [index: string]: {
	// 	geometry: (radius: number) => THREE.BufferGeometry;
	// 	materials: (self: DiceRoller, size: number, margin: number, labels: string[]) => void;
	// };
	[index: string]: (self: DiceRoller) => DieMesh;	
} = {
	"d4": (self: DiceRoller) => {
		const vertices = [[1, 1, 1], [-1, -1, 1], [-1, 1, -1], [1, -1, -1]];
		const faces = [[1, 0, 2, 1], [0, 1, 3, 2], [0, 3, 2, 3], [1, 2, 3, 4]];
		
		const radius = self.config.scale * 1.2;

		if (!GEOMETRY["d4"]) {
			GEOMETRY["d4"] = new THREE.TetrahedronGeometry(radius);
			(GEOMETRY["d4"] as any).cannonShape = createShape(vertices, faces, radius);
		}

		return new THREE.Mesh(GEOMETRY["d4"]) as unknown as DieMesh;
		// geometry(radius: number) {
		// 	// const vertices = [[1, 1, 1], [-1, -1, 1], [-1, 1, -1], [1, -1, -1]];
		// 	// const faces = [[1, 0, 2, 1], [0, 1, 3, 2], [0, 3, 2, 3], [1, 2, 3, 4]];
		// 	// return createGeom(vertices, faces, radius, -0.1, Math.PI * 7 / 6, 0.96);
		// 	return new THREE.TetrahedronGeometry(radius);
		// },
		// materials(self: DiceRoller, size: number, margin: number, labels: string[]) {
		// 	// function create_d4_text(text: string, color: string | number, backColor: string | number) {
		// 	// 	const canvas = document.createElement("canvas");
		// 	// 	const context = canvas.getContext("2d");
		// 	// 	const ts = calc_texture_size(size + margin) * 2;
		// 	// 	canvas.width = canvas.height = ts;
		// 	// 	context.font = (ts - margin) / 1.5 + "pt Arial";
		// 	// 	context.fillStyle = back_color;
		// 	// 	context.fillRect(0, 0, canvas.width, canvas.height);
		// 	// 	context.textAlign = "center";
		// 	// 	context.textBaseline = "middle";
		// 	// 	context.fillStyle = color;
		// 	// 	for (const i in text) {
		// 	// 		context.fillText(text[i], canvas.width / 2,
		// 	// 			canvas.height / 2 - ts * 0.3);
		// 	// 		context.translate(canvas.width / 2, canvas.height / 2);
		// 	// 		context.rotate(Math.PI * 2 / 3);
		// 	// 		context.translate(-canvas.width / 2, -canvas.height / 2);
		// 	// 	}
		// 	// 	const texture = new THREE.Texture(canvas);
		// 	// 	texture.needsUpdate = true;
		// 	// 	return texture;
		// 	// }
		// 	// const materials = [];
		// 	// for (let i = 0; i < labels.length; ++i)
		// 	// 	materials.push(new THREE.MeshPhongMaterial(Object.assign(
		// 	// 		{},
		// 	// 		self.config.materialOptions,
		// 	// 		{ map: create_d4_text(labels[i], self.config.labelColor, self.config.diceColor) })));
		// 	// return materials;
		// }
	}
};

/**
 * Based on http://a.teall.info/dice/
 */
export class DiceRoller {
	config: {
		w?: number;
		h?: number;

		useAdaptiveTimeStep: boolean;
		animateSelector: boolean;
		useShadows: boolean;
		frameRate: number;

		gravity: number;

		materialOptions: {
			specular: number | string;
			color: number | string;
			shininess: number;
			shading: THREE.Shading;
		};

		ambientLightColor: number | string;
		spotLightColor: number | string;
		selectorBackColors: {
			color:  number | string;
			shininess: number;
			emissive:  number | string;
		};
		deskColor: number | string;

		diceColor: number | string;
		labelColor: number | string;

		scale: number;
	} = {
		useAdaptiveTimeStep: true,
		animateSelector: true,
		useShadows: true,
		frameRate: 1 / 60,

		gravity: -9.8 * 80,

		materialOptions: {
			specular: 0x172022,
			color: 0xf0f0f0,
			shininess: 40,
			shading: THREE.FlatShading,
		},

		ambientLightColor: 0xf0f5fb,
		spotLightColor: 0xefdfd5,
		selectorBackColors: {
			color: 0x404040,
			shininess: 0,
			emissive: 0x858787
		},
		deskColor: 0xdfdfdf,

		diceColor: 0x202020,
		labelColor: 0xaaaaaa,

		scale: 50,
	};

	w: number;
	h: number;
	cw!: number;
	ch!: number;
	wh!: number;

	aspect!: number;

	lastTime = 0;
	running = 0;
	rolling = false;

	callback?: (values: number[]) => void;

	diceBodyMaterial: CANNON.Material;
	deskBodyMaterial: CANNON.Material;
	barrierBodyMaterial: CANNON.Material;

	camera!: THREE.Camera;
	scene: THREE.Scene;
	renderer: THREE.WebGLRenderer;
	world: CANNON.World;

	spotLight!: THREE.SpotLight;
	desk!: THREE.Mesh;

	dice: DieMesh[];

	random: Random;

	knownTypes = ["d4", "d6", "d8", "d10", "d12", "d20", "d100"];
	diceFaceRange = {
		"d4": [1, 4], "d6": [1, 6], "d8": [1, 8], "d10": [0, 9],
		"d12": [1, 12], "d20": [1, 20], "d100": [0, 9]
	};
	diceMass: {[index: string]: number} = { "d4": 300, "d6": 300, "d8": 340, "d10": 350, "d12": 350, "d20": 400, "d100": 350 };
	diceInertia: {
		[index: string]: number;
	} = {
		"d4": 5, "d6": 13, "d8": 10, "d10": 9, "d12": 8, "d20": 6, "d100": 9
	};

	iteration = 0;

	constructor(container: HTMLElement, opts: any) {
		this.config = Object.assign(this.config, opts);

		this.dice = [];

		delete (this.config as any).random;

		this.random = opts.random || new Random();

		this.w = this.config.w || container.clientWidth / 2;
		this.h = this.config.h || container.clientHeight / 2;

		this.scene = new THREE.Scene();
		this.world = new CANNON.World();

		this.renderer = new THREE.WebGLRenderer({ antialias: true });

		container.appendChild(this.renderer.domElement);

		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFShadowMap;

		this.renderer.setClearColor(0xffffff, 1);

		this.reinit(container);

		this.world.gravity.set(0, 0, this.config.gravity);
		this.world.broadphase = new CANNON.NaiveBroadphase();
		this.world.solver.iterations = 16;

		this.scene.add(new THREE.AmbientLight(this.config.ambientLightColor));

		this.diceBodyMaterial = new CANNON.Material("dice_body_material");
		this.deskBodyMaterial = new CANNON.Material("desk_body_material");
		this.barrierBodyMaterial = new CANNON.Material("barrier_body_material");

		this.world.addContactMaterial(new CANNON.ContactMaterial(
			this.deskBodyMaterial,
			this.diceBodyMaterial,
			{ friction: 0.01, restitution: 0.5 }
		));

		this.world.addContactMaterial(new CANNON.ContactMaterial(
			this.barrierBodyMaterial,
			this.diceBodyMaterial,
			{ friction: 0, restitution: 1.0 }
		));

		this.world.addContactMaterial(new CANNON.ContactMaterial(
			this.diceBodyMaterial,
			this.diceBodyMaterial,
			{ friction: 0, restitution: 0.5 }
		));

		this.world.addBody(new CANNON.Body({
			type: 0,
			shape: new CANNON.Plane(),
			material: this.deskBodyMaterial,
		}));

		// Barrier
		{
			this.world.addBody(new CANNON.Body({
				type: 0,
				shape: new CANNON.Plane(),
				material: this.barrierBodyMaterial,
				quaternion: fromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2),
				position: new CANNON.Vec3(0, this.h * 0.93, 0)
			}));

			this.world.addBody(new CANNON.Body({
				type: 0,
				shape: new CANNON.Plane(),
				material: this.barrierBodyMaterial,
				quaternion: fromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2),
				position: new CANNON.Vec3(0, -this.h * 0.93, 0)
			}));

			this.world.addBody(new CANNON.Body({
				type: 0,
				shape: new CANNON.Plane(),
				material: this.barrierBodyMaterial,
				quaternion: fromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI / 2),
				position: new CANNON.Vec3(this.w * 0.93, 0, 0)
			}));

			this.world.addBody(new CANNON.Body({
				type: 0,
				shape: new CANNON.Plane(),
				material: this.barrierBodyMaterial,
				quaternion: fromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2),
				position: new CANNON.Vec3(-this.w * 0.93, 0, 0)
			}));
		}

		this.renderer.render(this.scene, this.camera);
	}

	reinit(container: HTMLElement) {
		this.cw = container.clientWidth / 2;
		this.ch = container.clientHeight / 2;

		this.aspect = Math.min(this.cw / this.w, this.ch / this.h);

		this.config.scale = Math.sqrt(this.w * this.w + this.h * this.h) / 13;

		this.renderer.setSize(this.cw * 2, this.ch * 2);

		this.wh = this.ch / this.aspect / Math.tan(10 * Math.PI / 180);

		if (this.camera) this.scene.remove(this.camera);
		this.camera = new THREE.PerspectiveCamera(20, this.cw / this.ch, 1, this.wh * 1.3);
		this.camera.position.z = this.wh;

		const mw = Math.max(this.w, this.h);
		if (this.spotLight) this.scene.remove(this.spotLight);
		this.spotLight = new THREE.SpotLight(this.config.spotLightColor, 2.0);

		this.spotLight.position.set(-mw / 2, mw / 2, mw * 2);
		this.spotLight.target.position.set(0, 0, 0);

		this.spotLight.distance = mw * 5;
		this.spotLight.castShadow = true;

		this.spotLight.shadow.camera.near = mw / 10;
		this.spotLight.shadow.camera.far = mw * 5;
		this.spotLight.shadow.camera.fov = 50;

		this.spotLight.shadow.bias = 0.001;
		// this.spotLight.shadowDarkness = 1.1;
		this.spotLight.shadow.mapSize.width = 1024;
		this.spotLight.shadow.mapSize.height = 1024;

		this.scene.add(this.spotLight);

		if (this.desk) this.scene.remove(this.desk);
		this.desk = new THREE.Mesh(
			new THREE.PlaneGeometry(this.w * 2, this.h * 2, 1, 1),
			new THREE.MeshPhongMaterial({ color: this.config.deskColor })
		);
		this.desk.receiveShadow = this.config.useShadows;

		this.scene.add(this.desk);
	}

	roll(vectors: any, values?: number[]) {
		return new Promise<number[]>((resolve, reject) => {
			this.prepareDiceForRoll(vectors);
			// if (values != undefined && values.length) {
			// 	this.use_adapvite_timestep = false;
			// 	var res = this.emulate_throw();
			// 	this.prepare_dices_for_roll(vectors);
			// 	for (var i in res)
			// 		shift_dice_faces(this.dices[i], values[i], res[i]);
			// }
			this.callback = resolve;
			// this.running = (new Date()).getTime();
			// this.last_time = 0;
			this.__animate(this.running);
		});
	}

	clear() {
		this.running = -1;
		let die;
		while ((die = this.dice.pop() as any)) {
			this.scene.remove(die);
			if (die.body) this.world.remove(die.body);
		}
		// if (this.pane) this.scene.remove(this.pane);
		this.renderer.render(this.scene, this.camera);
		setTimeout(() => { this.renderer.render(this.scene, this.camera); }, 100);
	}

	getDiceValue(die: any) {
		const vector = new THREE.Vector3(0, 0, die.dieType == "d4" ? -1 : 1);
		let closestFace, closestAngle = Math.PI * 2;
		for (let i = 0, l = die.geometry.faces.length; i < l; ++i) {
			const face = die.geometry.faces[i];
			if (face.materialIndex == 0) continue;
			const angle = face.normal.clone().applyQuaternion(die.body.quaternion).angleTo(vector);
			if (angle < closestAngle) {
				closestAngle = angle;
				closestFace = face;
			}
		}
		let matindex = closestFace.materialIndex - 1;
		if (die.dieType == "d100") matindex *= 10;
		if (die.dieType == "d10" && matindex == 0) matindex = 10;
		return matindex;
	}

	getDiceValues(dice: any[]) {
		const values = [];
		for (let i = 0, l = dice.length; i < l; ++i) {
			values.push(this.getDiceValue(dice[i]));
		}
		return values;
	}

	checkIfThrowFinished () {
		let res = true;
		const e = 6;
		if (this.iteration < 10 / this.config.frameRate) {
			for (let i = 0; i < this.dice.length; ++i) {
				const dice = this.dice[i];
				if (dice.stopped === true) continue;
				const a = dice.body.angularVelocity, v = dice.body.velocity;
				if (Math.abs(a.x) < e && Math.abs(a.y) < e && Math.abs(a.z) < e &&
                    Math.abs(v.x) < e && Math.abs(v.y) < e && Math.abs(v.z) < e) {
					if (dice.stopped) {
						if (this.iteration - dice.stopped > 3) {
							dice.stopped = true;
							continue;
						}
					}
					else dice.stopped = this.iteration;
					res = false;
				}
				else {
					dice.stopped = undefined;
					res = false;
				}
			}
		}
		return res;
	}

	__animate(threadId: number) {
		const time = (new Date()).getTime();
		let timeDiff = (time - this.lastTime) / 1000;
		if (timeDiff > 3) timeDiff = this.config.frameRate;
		++this.iteration;
		if (this.config.useAdaptiveTimeStep) {
			while (timeDiff > this.config.frameRate * 1.1) {
				this.world.step(this.config.frameRate);
				timeDiff -= this.config.frameRate;
			}
			this.world.step(timeDiff);
		}
		else {
			this.world.step(this.config.frameRate);
		}
		for (const i in this.scene.children) {
			const interact = this.scene.children[i] as any;
			if (interact.body != undefined) {
				interact.position.copy(interact.body.position);
				interact.quaternion.copy(interact.body.quaternion);
			}
		}
		this.renderer.render(this.scene, this.camera);
		this.lastTime = this.lastTime ? time : (new Date()).getTime();
		if (this.running == threadId && this.checkIfThrowFinished()) {
			this.running = -1;
			if (this.callback) this.callback.call(this, this.getDiceValues(this.dice));
		}
		if (this.running == threadId) {
			((tid, uat) => {
				if (!uat && timeDiff < this.config.frameRate) {
					setTimeout(() => { requestAnimationFrame(() => { this.__animate(tid); }); },
						(this.config.frameRate - timeDiff) * 1000);
				}
				else requestAnimationFrame(() => { this.__animate(tid); });
			})(threadId, this.config.useAdaptiveTimeStep);
		}
	}

	createDie(type: string, pos: CANNON.Vec3, velocity: CANNON.Vec3, angle: CANNON.Vec3, axis: {x: number; y: number; z: number; a: number}) {
		const die = DIE_FACTORIES[type](this);
		die.castShadow = true;
		die.dieType = type;
		die.body = new CANNON.Body({
			mass: this.diceMass[type],
			shape: (die.geometry as any).cannonShape,
			material: this.diceBodyMaterial
		});
		die.body.position.set(pos.x, pos.y, pos.z);
		die.body.quaternion.setFromAxisAngle(new CANNON.Vec3(axis.x, axis.y, axis.z), axis.a * Math.PI * 2);
		die.body.angularVelocity.set(angle.x, angle.y, angle.z);
		die.body.velocity.set(velocity.x, velocity.y, velocity.z);
		die.body.linearDamping = 0.1;
		die.body.angularDamping = 0.1;
		this.scene.add(die);
		this.dice.push(die);
		this.world.addBody(die.body);
	}

	prepareDiceForRoll(vectors: any) {
		this.clear();
		this.iteration = 0;
		for (const i in vectors) {
			this.createDie(vectors[i].set, vectors[i].pos, vectors[i].velocity,
				vectors[i].angle, vectors[i].axis);
		}
	}

	parseNotation(notation: string) {
		const no = notation.split("@");
		const dr0 = /\s*(\d*)([a-z]+)(\d+)(\s*(\+|-)\s*(\d+)){0,1}\s*(\+|$)/gi;
		const dr1 = /(\b)*(\d+)(\b)*/gi;

		const ret: { set: string[]; constant: number; result: number[]; error: boolean } = {
			set: [],
			constant: 0,
			result: [],
			error: false
		};
		let res;
		while ((res = dr0.exec(no[0])) !== null) {
			const command = res[2];
			if (command != "d") { ret.error = true; continue; }
			let count = parseInt(res[1]);
			if (res[1] == "") count = 1;
			const type = "d" + res[3];
			if (this.knownTypes.indexOf(type) == -1) { ret.error = true; continue; }
			while (count--) ret.set.push(type);
			if (res[5] && res[6]) {
				if (res[5] == "+") ret.constant += parseInt(res[6]);
				else ret.constant -= parseInt(res[6]);
			}
		}
		while ((res = dr1.exec(no[1])) !== null) {
			ret.result.push(parseInt(res[2]));
		}
		return ret;
	}

	throwDice(notationStr: string, requestResults?: number[]) {
		return new Promise((resolve, reject) => {
			const uat = this.config.useAdaptiveTimeStep;
			const notation = this.parseNotation(notationStr);

			this.random.ensureRnd().then((random) => {
				const vector = new THREE.Vector2((random.randomFloat() * 2 - 1) * this.w, -(random.randomFloat() * 2 - 1) * this.h);
				const dist = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
				const boost = (random.randomFloat() + 3) * dist;

				vector.x /= dist; vector.y /= dist;

				if (notation.set.length == 0) return;
				const vectors = this.generateVectors(notation, vector, boost);
				this.rolling = true;

				// this.clear();
				this.roll(vectors, requestResults || notation.result).then((result) => {
					resolve({
						notation,
						result
					});
					this.rolling = false;
					this.config.useAdaptiveTimeStep = uat;
				});
			});
		});
	}

	generateVectors(notation: any, vector: THREE.Vector2, boost: number) {
		const vectors = [];
		for (const i in notation.set) {
			const rndArr = this.random.randomFloatArray(7);

			const vec = this.makeRandomVector(vector);
			const pos = {
				x: this.w * (vec.x > 0 ? -1 : 1) * 0.9,
				y: this.h * (vec.y > 0 ? -1 : 1) * 0.9,
				z: rndArr[0] * 200 + 200
			};
			const projector = Math.abs(vec.x / vec.y);
			if (projector > 1.0) pos.y /= projector; else pos.x *= projector;
			const velvec = this.makeRandomVector(vector);
			const velocity = { x: velvec.x * boost, y: velvec.y * boost, z: -10 };
			const inertia = this.diceInertia[notation.set[i]];
			const angle = {
				x: -(rndArr[1] * vec.y * 5 + inertia * vec.y),
				y: rndArr[2] * vec.x * 5 + inertia * vec.x,
				z: 0
			};
			const axis = { x: rndArr[3], y: rndArr[4], z: rndArr[5], a: rndArr[6] };
			vectors.push({ set: notation.set[i], pos: pos, velocity: velocity, angle: angle, axis: axis });
		}
		return vectors;
	}

	makeRandomVector(vector: THREE.Vector2): THREE.Vector2 {
		const randomAngle = this.random.randomFloat() * Math.PI / 5 - Math.PI / 5 / 2;
		const vec = {
			x: vector.x * Math.cos(randomAngle) - vector.y * Math.sin(randomAngle),
			y: vector.x * Math.sin(randomAngle) + vector.y * Math.cos(randomAngle)
		};
		if (vec.x == 0) vec.x = 0.01;
		if (vec.y == 0) vec.y = 0.01;
		return new THREE.Vector2(vec.x, vec.y);
	}
}