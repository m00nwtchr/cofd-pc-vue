<template>
	<label for="splat">Splat:</label>
	<select v-model.number="splat" id="splat">
		<option v-for="(el, key) in SPLATS" :key="key" :value="key">{{ $t(el.name) }}</option>
	</select>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { SPLATS, EnumSplat, createCharacter, Character } from "../definitions";
import { useStore } from "../store";


export default defineComponent({
	name: "NewCharacter",
	components: {
	},
	data() {
		return {
			// store: useStore(),

			splat: EnumSplat.MORTAL,

			SPLATS
		};
	},
	computed: {
	},
	methods: {
	},

});
</script>

<style lang="scss" scoped>
@import "../style/vars.scss";
</style>