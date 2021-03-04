<template>
	<div>
		<h3 class="separator col-sm-12">{{ abilityName }}</h3>
		<!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->
		<div style="margin:0" v-for="(ability, i) in visibleArr" :key="i" class="block row col-sm-12">
			<input @input="doInput(ability)" v-model="ability.name" class="line col-7">
			<div class="sheet-dots col-5">
				<button @click="setDots(ability, n)" v-for="n in 5" :key="n" :class="{'sheet-dot':true,'sheet-dot-full':ability.dots>=n}"></button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Ability } from "@/definitions/Character";
import { defineComponent } from "vue";
export default defineComponent({
	name: "AbilityList",
	props: {
		"abilityArr": {
			required: true,
			type: Array
		},
		"abilityName": {
			required: true,
			type: String
		},
		"optionsMutable": {
			required: false,
			default: true,
			type: Boolean
		}		
	},
	methods: {
		setDots(ability: Ability, n: number) {
			ability.dots = (ability.dots === n ? n-1 : n);

			if (this.optionsMutable && (ability as any).false && ability.name !== "" && ability.dots > 0) {
				delete (ability as any).false;
				
				// eslint-disable-next-line vue/no-mutating-props
				this.abilityArr.push(ability);
			}
		},
		doInput(ability: Ability) {
			console.log("E");
			if (this.optionsMutable &&  ability && (ability as any).false && ability.name !== "" && ability.dots > 0) {
				delete (ability as any).false;
				
				// eslint-disable-next-line vue/no-mutating-props
				this.abilityArr.push(ability);
			}
			if (this.optionsMutable &&  ability && ability.name === "") {
				// eslint-disable-next-line vue/no-mutating-props
				this.abilityArr.splice(this.abilityArr.indexOf(ability), 1);
			}
		}
	},
	computed: {
		visibleArr(): Ability[] {
			const arr: any[] = [...this.abilityArr];

			if (this.optionsMutable) {
				arr.push({name: "", dots: 0, false: true});
			}

			return arr as Ability[];
		}
	},
	watch: {
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
input.line {
	border-bottom: 1px solid;
	// margin-top: -15px !important;
	padding: 0px;
	height: 20px;
}

.sheet-dots {
	padding: 0px;
}
</style>