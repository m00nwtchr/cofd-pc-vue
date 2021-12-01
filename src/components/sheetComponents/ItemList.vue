<template>
	<div :class="{ 'row': cols > 1 }">
		<h3 v-if="name" class="separator">{{ name }}</h3>
		<div v-for="n in cols" :key="n" :class="{
			['col-sm-' + Math.floor(12 / cols)]: cols > 1
		}">
			<div style="margin:0" v-for="(i) in rows" :key="calc(i - 1, n)">
				<input @input="doInput(calc(i - 1, n))" v-model="items[calc(i - 1, n)]" class="line w-100" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = withDefaults(defineProps<{
	items: string[];
	name: string;
	cols?: number;
	mutable?: boolean;
	min?: number;
	max?: number;
}>(), {
	cols: 1,
	mutable: false,
	min: 1,
	max: Number.MAX_VALUE
});

const visibleArr = computed(() => {
	const arr = [...props.items];

	let ii = arr.length-1;
	for (const [i, el] of arr.reverse().entries()) {
		if (el) {
			arr.splice(ii);
			break;
		}

		ii = arr.length-i-1;
	}

	return arr;
});

const rows = computed(() =>
	Math.min(Math.ceil(
			Math.max(visibleArr.value.length, props.min) 
			/ props.cols
		) + 
		(props.mutable ? 1 : 0),
		props.max
	)
);

function doInput(i: number) {
	// if (!props.items[i]) props.items[i] = "";
	if (props.mutable && !props.items[i]) {
		props.items.splice(i, 1);
	}
}

function calc(i: number, n: number) {
	return props.cols * i + n - 1;
}
</script>
<style lang="scss" scoped>
</style>