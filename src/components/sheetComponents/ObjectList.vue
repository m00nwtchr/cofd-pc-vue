<template>
	<!-- <teleport :to="teleport" :disabled="!teleport"> -->
		<div class="conditions">
			<h3 class="separator col-sm-12">{{ name }}</h3>
			<!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->
			<div style="margin:0" v-for="(item, i) in visibleArr" :key="i" class="col-sm-12 row">
				<div v-for="(attr) in attrs" :key="attr" class="col" :style="{ width: (100/attrs.length) + '%' }">
					<i v-if="i === 0" class="subtitle" style="text-transform: capitalize;">{{ camelPad(attr) }}</i>
					<!-- eslint-disable-next-line vue/no-mutating-props -->
					<input @input="doInput(item, attr, i);" :type="(typeof item[attr])" :value="item[attr]" class="line col-12" style="max-width: 370px">
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
	name: "ObjectList",
	props: {
		"items": {
			required: true,
			type: Array
		},
		"name": {
			required: false,
			type: String
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
	beforeMount() {
		console.log(this.items);
	},	
	methods: {
		doInput(item: any, attr: string, i: number) {
			if (this.mutable && !item || item[attr]  === "") {
				// eslint-disable-next-line vue/no-mutating-props
				this.items.splice(i, 1);
			}
		},
		camelPad(str: string){ return str
			// Look for long acronyms and filter out the last letter
			.replace(/([A-Z]+)([A-Z][a-z])/g, " $1 $2")
			// Look for lower-case letters followed by upper-case letters
			.replace(/([a-z\d])([A-Z])/g, "$1 $2")
			// Look for lower-case letters followed by numbers
			.replace(/([a-zA-Z])(\d)/g, "$1 $2")
			.replace(/^./, function(str){ return str.toUpperCase(); })
			// Remove any white space left around the word
			.trim();
		}
		
	},
	computed: {
		visibleArr(): Ability[] {
			const arr: any[] = [].concat(this.items as any);

			if (this.mutable) {
				//arr.push({});
			}

			return arr as Ability[];
		},
		attrs() {
			return Object.keys((this as any).items.reduce((prev: any, val: any) => Object.assign({}, prev, val)));
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