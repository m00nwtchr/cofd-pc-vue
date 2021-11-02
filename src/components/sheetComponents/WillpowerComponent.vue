<template>
	<div>
		<h3 class="separator col-sm-12">{{ $t("character.trait.willpower") }}</h3>
		<div class="wp-container">
			<sheet-dots
				:modelValue="character.maxWillpower"
				@update:modelValue="updateSpentDots" 
				:maxValue="character.maxWillpower + character.spentWillpowerDots" 
			/>
			<sheet-dots 
				v-model.number="character.willpower" 
				:maxValue="character.maxWillpower" 
				:boxes="true"
			/>
		</div>
	</div>
</template>

<script lang="ts">
/* eslint-disable vue/no-mutating-props */

import { defineComponent, PropType } from "vue";
import { Character } from "../../definitions";

import SheetDots from "./SheetDots.vue";

export default defineComponent({
	name: "WillpowerComponent",
	components: {
		SheetDots
	},
	props: {
		"character": {
			required: true,
			type: Object as PropType<Character>
		}
	},
	methods: {
		updateSpentDots(val: number) {
			this.character.spentWillpowerDots = this.character.maxWillpower + this.character.spentWillpowerDots - val;
		}
	}
});
</script>

<style lang="scss" scoped>
.wp-container {
	margin: auto;
	width: fit-content;

	line-height: 13px;
}
</style>