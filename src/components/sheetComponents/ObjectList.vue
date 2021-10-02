<template>
	<!-- <teleport :to="teleport" :disabled="!teleport"> -->
	<div class="list" :id="name.toLowerCase() + '-list'">
		<h3 class="separator w-100">{{ name }}</h3>
		<!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->
		<div style="margin:0" v-for="(item, i) in visibleArr" :key="i" class="row w-100">
			<div v-for="(attr) in attrs" :key="attr" :class="{ [`${attr}-col`]: true }" class="col w-100">
				<i v-if="i === 0" class="subtitle" style="text-transform: capitalize;">{{ camelPad(attr) }}</i>
				<!-- eslint-disable-next-line vue/no-mutating-props -->
				<input
					@input="doInput(item, attr, i);"
					:type="(typeof item[attr])"
					v-model.number="item[attr]"
					class="line col-12"
					style="max-width: 370px"
				/>
			</div>
		</div>
	</div>
	<!-- </teleport> -->
</template>

<script lang="ts">
/* eslint-disable vue/no-mutating-props */

import { defineComponent } from "vue";
export default defineComponent({
	name: "ObjectList",
	props: {
		"items": {
			required: true,
			type: Array
		},
		"itemFactory": {
			required: false,
			type: Function
		},
		"name": {
			required: false,
			type: String,
			default: () => ""
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
			if (!this.items.includes(item)) {
				this.items.push(item);
			}

			if (this.mutable && Object.values(item).filter(el => !!el).length === 0) {
				console.log(item, this.items);
				// eslint-disable-next-line vue/no-mutating-props
				this.items.splice(i, 1);
			}
		},
		camelPad: (str: string) => str
			// Look for long acronyms and filter out the last letter
			.replace(/([A-Z]+)([A-Z][a-z])/g, " $1 $2")
			// Look for lower-case letters followed by upper-case letters
			.replace(/([a-z\d])([A-Z])/g, "$1 $2")
			// Look for lower-case letters followed by numbers
			.replace(/([a-zA-Z])(\d)/g, "$1 $2")
			.replace(/^./, s => s.toUpperCase())
			// Remove any white space left around the word
			.trim()
	},
	computed: {
		visibleArr() {
			const arr: any[] = [].concat(this.items as any);

			if (this.mutable) {
				arr.push(this.itemFactory ? new (this.itemFactory as any)() : {});
				console.log(arr);
			}

			return arr;
		},
		attrs(): string[] {
			const arr: any[] = this.visibleArr;

			if (this.itemFactory) {
				return Object.keys(new (this.itemFactory as any)());
			} else {
				return Object.keys(arr.reduce(
					(prev, val) => Object.assign({}, prev, val),
				{}));
			}
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
.list {
	margin-bottom: 10px;
}
</style>