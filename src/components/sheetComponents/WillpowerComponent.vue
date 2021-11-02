<template>
	<div>
		<h3 class="separator col-sm-12">{{ $t("character.trait.willpower") }}</h3>
		<div class="wp-container">
			<div class="sheet-dots">
				<button
					v-for="n in character.maxWillpower + character.spentWillpowerDots"
					:key="n"
					@click="
					$parent.setTrait(
						'spentWillpowerDots',
						character.maxWillpower + character.spentWillpowerDots - n,
						{
							off: -1
						}
					)
					"
					class="sheet-dot"
					:class="{
						'sheet-dot-full':
							character.maxWillpower >=
							n
					}"
				></button>
			</div>
			<div class="sheet-boxes">
				<button
					v-for="n in character.maxWillpower"
					:key="n"
					class="sheet-box"
					@click="$parent.setTrait('willpower', n)"
					:class="{
						'sheet-dot-full': character.willpower >= n
					}"
				></button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
/* eslint-disable vue/no-mutating-props */

import { defineComponent, PropType } from "vue";
import { Character } from "../../definitions";
export default defineComponent({
	name: "WillpowerComponent",
	props: {
		"character": {
			required: true,
			type: Object as PropType<Character>
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