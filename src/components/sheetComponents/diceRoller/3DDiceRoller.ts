import * as THREE from "three";
import * as CANNON from "cannon";
import { DiceRoller } from "./DiceRoller";

const DICE_MESH_FACTORY: { [key: string]: () => THREE.Mesh } = {};

export class WebGLDiceRoller extends DiceRoller {

	w: number;
	h: number;

	config: any;

	scene: THREE.Scene;
	camera: THREE.Camera;
	renderer: THREE.WebGLRenderer;

	spotLight: THREE.SpotLight;

	box: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;
	box2: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;


	// box;

	constructor() {
		super();

		this.scene = new THREE.Scene();

		this.w = window.innerWidth;
		this.h = window.innerHeight;

		this.camera = new THREE.PerspectiveCamera(20, this.w / this.h, 0.01, 10);
		this.camera.position.z = 1;

		this.renderer = new THREE.WebGLRenderer({ 
			antialias: true,
			alpha: true
		});
		
		this.renderer.setClearColor(0, 0);
		this.renderer.setSize(this.w, this.h);
		this.renderer.setAnimationLoop(this.__animation.bind(this));


		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
		
		const stl = this.renderer.domElement.style as any;

		stl["pointer-events"] = "none";
		stl["background-color"] = "transparent";
		stl["position"] = "fixed";
		stl["top"] = "0px";
		stl["left"] = "0px";
		stl["z-index"] = "1";

		document.body.prepend(this.renderer.domElement);
	
		this.scene.add(new THREE.AmbientLight());

		this.box = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), new THREE.MeshBasicMaterial( { color: 0x00ff00 } ));
		// this.box.position.y = 0.5;
		// this.box.position.x = 0.8;
		// this.box.position.z = -0.2;
		this.box.receiveShadow = true;
		this.box.castShadow = true;
		this.scene.add(this.box);

		this.box2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), new THREE.MeshBasicMaterial( { color: 0xff0000 } ));
		// this.box2.position.y = -0.5;
		// this.box2.position.x = 0.8;
		this.box2.receiveShadow = true;
		this.box2.castShadow = true;
		this.scene.add(this.box2);

		const mw = Math.max(this.w, this.h);

		// if (this.spotLight) this.scene.remove(this.spotLight);
		this.spotLight = new THREE.SpotLight(0xefdfd5, 2.0);

		// this.spotLight.position.set(-mw / 2, mw / 2, mw * 2);
		// this.spotLight.target.position.set(0, 0, 0);

		// this.spotLight.distance = mw * 5;
		this.spotLight.castShadow = true;

		// this.spotLight.shadow.camera.near = mw / 10;
		// this.spotLight.shadow.camera.far = mw * 5;
		// this.spotLight.shadow.camera.fov = 50;

		// this.spotLight.shadow.bias = 0.001;
		// // this.spotLight.shadowDarkness = 1.1;
		// this.spotLight.shadow.mapSize.width = 1024;
		// this.spotLight.shadow.mapSize.height = 1024;
		this.spotLight.shadow.mapSize.width = 512; // default
		this.spotLight.shadow.mapSize.height = 512; // default
		this.spotLight.shadow.camera.near = 0.5; // default
		this.spotLight.shadow.camera.far = 500; // default
		this.spotLight.shadow.focus = 1; // default
		
		this.scene.add(this.spotLight);

		const helper = new THREE.CameraHelper( this.spotLight.shadow.camera );
		this.scene.add( helper );
	}

	async roll(dice: number, opts: {
		again: number;
		bonus: number;
		treshold: number;
		values: boolean;
	}): Promise<number[] | number> {
		const res = await super.roll(dice, opts);



		return res;
	}

	__animation(time: number) {
		// console.log(this);

		const mov1 = Math.random()*0.05;
		const mov2 = Math.random()*0.05;

		this.box2.rotation.x-=mov1;
		this.box2.rotation.y+=mov1;
		this.box.rotation.y+=mov2;
		this.box2.rotation.x-=mov2;
		this.renderer.render(this.scene, this.camera);
	}

}