<template>
  <div id="diceRoller">
    <!-- <div id="canvas"></div> -->
  </div>
</template>

<script lang="ts">
import { DiceRoller } from "@/DiceRoller";
import { defineComponent } from "vue";
import { WebGLDiceRoller } from "./3DDiceRoller";
// import { DiceRoller } from "./DiceRoller";

export default defineComponent({
	props: {
		// w:
	},
	computed: {
		canvasEl() {
			console.log(this.$el);
			return document.getElementById("diceRoller")?.children[0];
		},
	},
	data() {
		return {
			diceRoller: (null as unknown) as DiceRoller,
		};
	},
	mounted() {
		// eslint-disable-next-line quotes
		const img = document.createElement('img');
		img.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg";
		this.diceRoller = new DiceRoller(/*document.body, {
			// dimensions: {
			// x: 500,
			// y: 500,
			// },
			domElement: document.getElementById("app")as any// document.getElementById("charsheet") as any
		}*/);
		// this.diceRoller.roll(1);
	},
	methods: {},
});
</script>

<style lang="scss">
	.canvas {
		// pointer-events: none;
		// background-color:transparent;
		// position: fixed;
		// top: 0px;
		// left: 0px;
		// z-index: 1;
		
		width:100%;
		height:100%;
	}
</style>
