<template>
  <div id="diceRoller">
    <div id="canvas"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { DiceRoller } from "./DiceRoller";

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
			diceRoller: null as unknown as DiceRoller,
		};
	},
	mounted() {
		(this.diceRoller = new DiceRoller(this.canvasEl as any, {
			w: 200,
			h: 200,
		})),
		this.diceRoller.throwDice("1d4");
	},
	methods: {},
});
</script>
