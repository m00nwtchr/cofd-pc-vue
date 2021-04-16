<template>
	<div>
		<h3 class="separator col-sm-12">{{ abilityName }}</h3>
		<!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->
		<div style="margin:0" v-for="(ability, i) in visibleArr" :key="i" class="block row col-sm-12">
			<span class="line col-7" :class="{'selected': $parent.selectedTraits[nameOf(i)]}" @click="$parent.selectTrait(nameOf(i),{ability:true})">
				<input v-if="optionsMutable" @input="doInput(ability)" v-model="ability.name">
				<span v-else>{{ ability.name }}</span>
			</span>
			<div class="sheet-dots col-5">
				<button class="sheet-dot" :class="{'sheet-dot-full':ability.level>=n,
					'dot-limit': !optionsMutable && $parent.character.splat===$parent.EnumSplat.MAGE &&
						(
							(!$parent.subType.abilities.includes(nameOf(i)) && n == 5) 
							|| ($parent.subType.inferiorArcanum === nameOf(i) && n >= 3)
						),
					'missing-dot': $parent.character.splat===$parent.EnumSplat.MAGE &&
						(
							($parent.subType.abilities.includes(nameOf(i)) && n == 1) 
						)	
					}" @click="setDots(ability, n)" v-for="n in 5" :key="n"></button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
/* eslint-disable vue/no-mutating-props */

import { Ability } from "@/definitions/Character";
import { defineComponent } from "vue";
export default defineComponent({
	name: "AbilityList",
	props: {
		"abilities": {
			required: true,
			type: Object
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
	data() {return {
		abilityArr: []
	} as {abilityArr: Ability[]};},
	beforeMount() {
		this.abilityArr = Object.values(this.abilities);
	},
	methods: {
		setDots(ability: Ability, n: number) {
			ability.level = (ability.level === n ? n-1 : n);

			if ((this as any).$parent.character.splat===(this as any).$parent.EnumSplat.MAGE) {
				if ((this as any).$parent.subType.abilities.includes(this.nameOf(ability.name))) {
					if (ability.level === 0) ability.level = 1;
				}
			}

			if (this.optionsMutable && (ability as any).false && ability.name !== "" && ability.level > 0) {
				delete (ability as any).false;
				
				// eslint-disable-next-line vue/no-mutating-props
				this.abilityArr.push(ability);
			}
		},
		doInput(ability: Ability) {
			if (this.optionsMutable &&  ability && (ability as any).false && ability.name !== "" && ability.level > 0) {
				delete (ability as any).false;
				
				// eslint-disable-next-line vue/no-mutating-props
				this.abilityArr.push(ability);
			}
			if (!(ability as any).false && this.optionsMutable && ability && ability.name === "") {
				// eslint-disable-next-line vue/no-mutating-props
				this.abilityArr.splice(this.abilityArr.indexOf(ability), 1);
			}
		},
		nameOf(i: number | string) {
			const entries = Object.entries(this.abilities);
			if (typeof i === "number") {
				if (entries[i]) {
					return entries[i][0].toLowerCase();
				} else {
					return "";
				}
			} else {
				return entries.filter(el => el[1].name === i)[0][0].toLowerCase();
			}
		}
	},
	computed: {
		visibleArr(): Ability[] {
			const arr: any[] = [].concat(this.abilityArr as any);

			if (this.optionsMutable) {
				arr.push({name: "", level: 0, false: true});
			}

			return arr as Ability[];
		}
	},
	watch: {
		abilityArr: {handler(newVal, oldVal) {
			// (this as any).abilities = {};

			newVal.forEach((el: Ability) => {
				this.abilities[el.name.toLowerCase()] = el;
			});
		}, deep:true}
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
.sheet-dots {
	padding: 0px;
}
.dot-limit {
	background-color: grey;
}
.missing-dot {
	background-color: red;
}
</style>