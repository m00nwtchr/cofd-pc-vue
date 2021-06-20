<template>
	<!-- <teleport :to="teleport" :disabled="!teleport"> -->
		<div class="conditions" :class="{'row': cols > 1}">
			<h3 v-if="name" class="separator col-sm-12">{{ name }}</h3>
			<!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->
			<div v-for="n in cols" :key="n" :class="{
				['col-sm-'+Math.floor(12/cols)]: cols > 1
			}">
				<div style="margin:0" v-for="(item, i) in visibleArr" :key="i" class="col-sm-12">
					<!-- eslint-disable-next-line vue/no-mutating-props -->
					<input @input="doInput(item, calc(i,n))" v-model="items[calc(i,n)]" class="line col-12" style="max-width: 370px">
				</div>
			</div>
		</div>
	<!-- </teleport> -->
</template>

<script lang="ts">
/* eslint-disable vue/no-mutating-props */

import { Ability } from "@/definitions/Character";
import { defineComponent } from "vue";
export default defineComponent({
	name: "ItemList",
	props: {
		"items": {
			required: true,
			type: Array
		},
		"name": {
			required: false,
			type: String
		},
		"cols": {
			required: false,
			type: Number,
			default: () => 1
		},
		"mutable": {
			required: false,
			default: true,
			type: Boolean
		},
		"teleport": {
			required: false,
			type: String,
		}	
	},
	methods: {
		doInput(ability: string, i: number) {
			if (this.mutable && ability === "") {
				// eslint-disable-next-line vue/no-mutating-props
				this.items.splice(i, 1);
			}
		},
		calc(i: number, n: number) {
			return this.cols * i + n - 1;
		}
	},
	computed: {
		visibleArr(): Ability[] {
			const arr: any[] = [].concat(this.items as any);

			if (this.mutable) {
				arr.push("");
			}

			return arr as Ability[];
		}
	},
	watch: {
		// abilityArr: {handler(newVal, oldVal) {
		// 	// (this as any).abilities = {};

		// 	newVal.forEach((el: string) => {
		// 		this.items[el.name.toLowerCase()] = el;
		// 	});
		// }, deep:true}
		// abilities: {handler(newVal, oldVal) {

		// 	// console.log(newVal, oldVal);

		// 	const newW = Object.keys(newVal).filter(el => Object.keys(oldVal).includes(el))[0];
		// 	const old  = Object.keys(oldVal).filter(el => Object.keys(newVal).includes(el))[0];


		// 	this.abilities[newW] = this.abilities[old];
		// 	delete this.abilities[old];
		// }, deep: true}
		// abilityArr: {
		// 	handler(newArr, oldArr) {
		// 		newArr.forEach(el => {
		// 			if ((ability as any).false) {
		// 				delete (ability as any).false;
				
		// 				// eslint-disable-next-line vue/no-mutating-props
		// 				this.abilityArr.push(ability);
		// 			}
		// 		});
		// 	},
		// 	deep: true
		// }
	}
});

// <div id="merits" class="block">
// 	<h3 class="separator col-sm-12">Merits</h3>
// 	<div style="margin:0" v-for="(merit, i) in character.merits" :key="i" class="block row col-sm-12">
// 		<!-- <span style="text-transform: capitalize" v-for="j in attributes[i-1].length" :key="j"> -->
// 		<input v-model="merit.name" class="line col-7">
// 		<div class="sheet-dots col-5">
// 			<button @click="merit.dots = (merit.dots === n ? n-1 : n)" v-for="n in 5" :key="n" :class="{'sheet-dot':true,'sheet-dot-full':merit.dots>=n}"></button>
// 		</div>
// 		<!-- <br> -->
// 		<!-- </span> -->
// 	</div>
// </div> -->
</script>

<style lang="scss" scoped>
	.conditions {
		margin-bottom: 10px;
	}
</style>