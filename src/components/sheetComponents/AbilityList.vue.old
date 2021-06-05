<template>
	<div>
		<h3 class="separator col-sm-12">{{ abilityName }}</h3>
		<!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->
		<div style="margin:0" v-for="(ability, i) in visibleArr" :key="nameToKey(ability.name)" class="block row col-sm-12">
			<span class="line col-7" :class="{'selected': $parent.selectedTraits[nameOf(i)]}" @click="$parent.selectTrait(nameOf(i),{ability:true})">
				<input v-if="optionsMutable" @input="doInput(ability)" v-model="ability.name" :list="datalistFilter ? abilityName+'List' : ''" >
				<span v-else>{{ ability.name }}</span>
				
				<br>
				<div v-if="ability.getOptions && meritOptionDropSelect === nameOf(i)">
					<div>
						<span v-for="option in ability.getOptions()" :key="option">
							{{ option.name }}: 
							<select v-if="option.list" v-model="ability[option.name]">
								<option v-for="(val, key) in option.list" :key="key" :value="typeof key === 'number' ? val : key">{{ val }}</option>
							</select>
							<select v-else-if="option.lists" v-for="(list, i) in option.lists" :key="i" v-model="ability[option.name][i]">
								<option v-for="(val, key) in list" :key="key" :value="typeof key === 'number' ? val : key">{{ val }}</option>
							</select>
							<input  v-else :type="option.bool ? 'checkbox' : 'text'" v-model="ability[option.name]">
							<br>
						</span>
					</div>
				</div>
			</span>

			<div class="sheet-dots col-3">
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
			
			<span class="col-1 options-toggle" v-if="ability.getOptions && ability.getOptions().length > 0">
				<button
					class="dropdown-toggle material-icons"
					@click="meritOptionDropDown(nameOf(i))"
					>
						<span v-if="meritOptionDropSelect === nameOf(i)">arrow_drop_down</span>
						<span v-else>arrow_right</span>
				</button>

			</span>
		</div>
		
		<datalist v-if="datalistFilter" :id="abilityName+'List'">
			<option v-for="el in datalistFilter" :key="el">{{ el }}</option>
		</datalist>
	</div>
</template>

<script lang="ts">
import { Ability, nameToKey } from "../../definitions/Character";
import { defineComponent } from "vue";
import { isUniqBy, uniqByKeepFirst, uniqByKeepLast } from "../../Util";
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
		},
		"datalist": {
			required: false,
			default: undefined,
			type: Object
		}
	},
	data() {
		return {
			abilityArr: [] as Ability[],
			meritOptionDropSelect: null
		};
	},
	mounted() {
		// this.abilityArr = uniqBy(Object.values(this.abilities), el => el.name);
	
		this.abilityArr = Object.values(this.abilities);
	},
	methods: {
		nameToKey,
		setDots(ability: Ability, n: number) {
			ability.level = (ability.level === n ? n-1 : n);

			if ((this as any).$parent.character.splat===(this as any).$parent.EnumSplat.MAGE) {
				if ((this as any).$parent.subType.abilities.includes(this.nameOf(ability.name))) {
					if (ability.level === 0) ability.level = 1;
				}
			}

			if (this.optionsMutable && (ability as any).false && ability.name !== "" && ability.level > 0) {
				delete (ability as any).false;
				
				this.abilityArr.push(ability);
			}
		},
		doInput(ability: Ability) {
			if (this.optionsMutable && ability) {
				if ((ability as any).false) {
					if (ability.name !== "" && ability.level > 0) {
						delete (ability as any).false;
						
						this.abilityArr.push(ability);
					}
				} else {
					if (ability.name === "") {
						this.abilityArr.splice(this.abilityArr.indexOf(ability));
					}
				}
			}
		},
		meritOptionDropDown(name: string) {
			if ((this as any).meritOptionDropSelect === name) {
				(this as any).meritOptionDropSelect = null;
			} else {
				(this as any).meritOptionDropSelect = name;
			}
		},
		nameOf(i: number | string) {
			const entries = Object.entries(this.abilities);
			if (typeof i === "number") {
				if (entries[i]) {
					return nameToKey(entries[i][0]);
				} else {
					return "";
				}
			} else {
				return nameToKey(entries.filter(el => el[1].name === i)[0][0]);
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
		},
		datalistFilter() {
			// console.log(Object.keys((this as any).datalist));
			return Object.keys((this as any).datalist || {})
				.filter((el) => !(this as any).abilities[el])
				.map(el => (this as any).datalist[el]);
		}
	},
	watch: {
		abilityArr: {handler(newVal: Ability[]) {
			// (this as any).abilities = {};
			Object.keys(this.abilities).forEach(key => {
				delete this.abilities[key];
			});

			if (!isUniqBy(newVal, el=>el.name)) {
				this.abilityArr = uniqByKeepLast(newVal, el => el.name);
			}

			// console.log(newVal);
			newVal.forEach((el) => {
				// eslint-disable-next-line vue/no-mutating-props
				this.abilities[nameToKey(el.name)] = el;
			});
		}, deep:true},
		// abilities: {handler(newVal, oldVal) {
		// 	this.abilityArr = Object.values(newVal);
		// }, deep:true}
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
.options-toggle {
	height: 24px;
}
.options-toggle span {
	font-size: 24px !important;
}
</style>