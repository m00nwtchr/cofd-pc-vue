import * as THREE from "three";
import * as CANNON from "cannon";

import {DOMContext, DOMElement } from "three-dom-elements";

import { DiceRoller } from "../../../DiceRoller";
import { Vector3 } from "three";

const DICE_MESH_FACTORY: { [key: string]: () => THREE.Mesh } = {};

interface Options {
	dimensions?: THREE.Vec2;
	domElement?: HTMLElement;
}

export class WebGLDiceRoller extends DiceRoller {

	w!: number;
	h!: number;

	config: {
		useShadows: boolean;

		spotLightColor: number | string;
		deskColor: number | string;
	} = {
		useShadows: true,

		spotLightColor: 0xefdfd5,
		deskColor: 0xdfdfdf,
	};

	scene: THREE.Scene;
	camera!: THREE.PerspectiveCamera;
	renderer: THREE.WebGLRenderer;

	domContext!: DOMContext;
	domElement?: DOMElement;

	spotLight!: THREE.SpotLight;

	box: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;
	box2: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;


	// box;

	aspect!: number;

	cw!: number;
	ch!: number;
	scale!: number;
	wh!: number;
	desk!: THREE.Mesh;
	helper!: THREE.CameraHelper;

	domCanvasContainer: HTMLElement;

	constructor(container: HTMLElement, opts: Options) {
		super();

		// if (document.getElementById())
		this.domCanvasContainer = document.createElement("div");
		this.domCanvasContainer.className = "canvas";
		container.appendChild(this.domCanvasContainer);

		this.camera = new THREE.PerspectiveCamera(45,0,0.01,10);
		this.scene = new THREE.Scene();

		this.renderer = new THREE.WebGLRenderer({ 
			antialias: true,
			alpha: true
		});
		// this.renderer.setClearColor(0, 0);
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
		this.domCanvasContainer.appendChild(this.renderer.domElement);

		// if (opts.domElement) {
		// 	console.log(opts.domElement);
		// 	this.domContext = new DOMContext(this.camera);
		// 	this.domCanvasContainer.appendChild(this.domContext.domElement);

		// 	this.domElement = new DOMElement(this.domContext, opts.domElement);
		// 	this.domElement.receiveShadow = this.config.useShadows;
		// 	this.scene.add(this.domElement);

		// 	// const img = document.createElement("img");
		// 	// img.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg";
			
		// 	// this.scene.add(new DOMElement(this.domContext, img));
		// }
		if(opts.domElement) {
			this.domContext = new DOMContext(this.camera);
			this.domCanvasContainer.appendChild(this.domContext.domElement);
		
			this.domElement = new DOMElement(this.domContext, opts.domElement);
			this.domElement.receiveShadow = this.config.useShadows;
		}

		this.__reinit(container, opts);

		window.onresize = () => {
			this.__reinit(container, opts);
		};

		this.scene.add(new THREE.AmbientLight(0xf0f5fb, 0.5));

		this.box = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100), new THREE.MeshBasicMaterial( { color: 0x00ff00 } ));
		// this.box.position.y = 0.5;
		// this.box.position.x = 0.8;
		this.box.position.z=2;
		this.box.receiveShadow = true;
		this.box.castShadow = true;
		this.scene.add(this.box);

		this.box2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial( { color: 0xff0000 } ));
		(window as any).diceRoller = this;

		this.renderer.setAnimationLoop(this.__animation.bind(this));
	}

	private __reinit(container: HTMLElement, opts?: Options) {
		this.cw = container.clientWidth/2;
		this.ch = container.clientHeight/2;

		if (opts?.dimensions) {
			this.w = opts?.dimensions.x;
			this.h = opts?.dimensions.y;
		} else {
			this.w = this.cw;
			this.h = this.ch;
		}

		// this.w = dimensions.x || this.cw;
		// this.h = dimensions.y || this.ch;

		this.aspect = Math.min(this.cw / this.w, this.ch / this.h);
		this.scale = Math.sqrt(this.w * this.w + this.h * this.h) / 13;

		this.renderer.setSize(this.cw * 2, this.ch * 2);
		this.wh = this.ch / this.aspect / Math.tan(10 * Math.PI / 180);

		// if (this.camera) this.scene.remove(this.camera);
		// this.camera = new THREE.PerspectiveCamera(20, this.cw / this.ch, 1, this.wh * 1.3);
		this.camera.aspect = this.cw/this.ch;
		this.camera.near = 1;
		this.camera.far = this.wh*1.3;

		this.camera.updateProjectionMatrix();

		this.camera.position.z = 2;
	
		// if (this.domContext) {
		// this.domContext.domElement.remove();
		// }
		// if (this.domElement) this.scene.remove(this.domElement);

		if (this.domContext) {
			this.domContext.setSize(this.cw * 2, this.ch * 2);
		}
		
		const mw = Math.max(this.w, this.h);
		if (this.spotLight) this.scene.remove(this.spotLight);
		this.spotLight = new THREE.SpotLight(this.config.spotLightColor, 0.8);
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

		// if (this.helper) this.scene.remove(this.helper);
		// this.helper = new THREE.CameraHelper( this.spotLight.shadow.camera );
		// this.scene.add( this.helper );

		if (this.desk) this.scene.remove(this.desk);
		this.desk = new THREE.Mesh(
			new THREE.PlaneGeometry(this.w * 2, this.h * 2, 1, 1),
			new THREE.MeshPhongMaterial({ color: this.config.deskColor })
		);
		this.desk.receiveShadow = this.config.useShadows;

		if (opts?.domElement && this.domElement) {
			// if (this.domElement) this.scene.remove(this.domElement);

			// this.domElement = new DOMElement(this.domContext, opts.domElement);
			// this.domElement.size = new Vector3(this.w * 2, this.h * 2, 1);
			// this.domElement.size = new Vector3(this.w * 2, this.h * 2, 1);
			// this.domElement.setPosition();
			// this.scene.add(this.domElement);

			// const img = document.createElement("img");
			// img.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg";
			
			// this.scene.add(new DOMElement(this.domContext, img));
		}

		this.scene.add(this.desk);
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

	private __animation(time: number) {
		// console.log(this);

		if (this.domContext) {
			this.domContext.update();
		}

		const mov1 = Math.random()*0.05;
		const mov2 = Math.random()*0.05;

		// this.box2.rotation.x-=mov1;
		// this.box2.rotation.y+=mov1;
		// this.box.rotation.y+=mov2;
		// this.box2.rotation.x-=mov2;
		// this.box.position.z--;
		this.renderer.render(this.scene, this.camera);
	}

}