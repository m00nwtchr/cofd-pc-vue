<template>
	<div :class="`sheet-${boxes ? 'boxes' : 'dots'}`">
		<span v-for="n in maxValue" :key="n">
			<button
				@click="value = n"
				:class="{
					[`sheet-${boxes ? 'box' : 'dot'}`]: true,
					'sheet-dot-full': value >= n,
				}"
			></button>
			<br v-if="breakI && n % breakI === 0" />
			<!-- 'sheet-dot-small': maxValue > 5 -->
		</span>
	</div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = withDefaults(defineProps<{
	modelValue: number;
	maxValue?: number;
	boxes?: boolean;
	breakI?: number;
	// setVal?: boolean;
}>(), {
	maxValue: 5,
	boxes: false,
	breakI: 0,
	// setVal: true,
});

const emit = defineEmits(["update:modelValue", "handle"]);

const value = computed({
	get() {
		return props.modelValue;
	},
	set(value: number) {
		emit('update:modelValue', props.modelValue === value ? value-1 : value);
	}
});
</script>

<style lang="scss">
@import "../../style/vars.scss";

button.sheet-dot {
	-moz-border-radius: 50%;
	-webkit-border-radius: 50%;
	border-radius: 50%;
}

button.sheet-dot-full {
	background: $accent !important;
}

button.sheet-dot-small {
	$radius: 12px;

	width: $radius;
	height: $radius;
}

.sheet-dot,
.sheet-box {
	$radius: 15px;

	width: $radius;
	height: $radius;

	padding: 0;
	border: solid 1px #000000;
	line-height: 11px;
	background-color: #efefef;

	margin-right: 1px;
}
</style>