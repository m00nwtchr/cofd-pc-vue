<template>
	<div>
		<h3 v-if="abilityName" class="separator col-sm-12">{{ abilityName }}</h3>
		<!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->
		
		<div :class="{'row': horizontal}">
			<div style="margin:0" v-for="(ability, key) in visible" :key="ability" class="block row" :class="{
				'col-sm-12': !horizontal,
				['col-sm-'+Math.floor(12/Object.keys(visible).length)]: horizontal
			}">
				<span class="line col-7" :class="{'selected': $parent.selectedTraits[key]}" @click="$parent.selectTrait(key,{ability:true})">
					<input v-if="optionsMutable && !ability.key" @change="doInput(ability, key)" v-model="ability.name" :list="datalistFilter ? abilityName+'List' : ''" >
					<span v-else>{{ ability.name }}</span>
					
					<br>
					<div v-if="ability.getOptions && meritOptionDropSelect === key">
						<div>
							<span v-for="option in ability.getOptions()" :key="option">
								{{ option.name }}:
								<select v-if="option.list" v-model="ability[option.name]">
									<option v-for="(val, key) in option.list" :key="key" :value="typeof key === 'number' ? val : key">{{ val }}</option>
								</select>
								<select v-else-if="option.lists" v-for="(list, i) in option.lists" :key="i" :v-model="ability[option.name][i]">
									<option v-for="(val, key) in list" :key="key" :value="typeof key === 'number' ? val : key">{{ val }}</option>
								</select>
								<input  v-else :type="option.bool ? 'checkbox' : 'text'" v-model="ability[option.name]">
								<br>
							</span>
						</div>
					</div>
				</span>

				<div class="col-5 row" style="flex-wrap:nowrap">
					<div class="sheet-dots">
						<button class="sheet-dot" :class="{
							'sheet-dot-full': ability.level >=n,
							'missing-dot':    dotRanges[key] && n <= dotRanges[key].min,
							'dot-limit':      dotRanges[key] && n > dotRanges[key].max,
						}" @click="setDots(ability, n)" v-for="n in 5" :key="n"></button>
					</div>
					<div class="options-toggle" v-if="ability.getOptions && ability.getOptions().length > 0">
						<!-- {{ability.getOptions && ability.getOptions().length > 0}} -->

						<button
							class="dropdown-toggle material-icons"
							@click="meritOptionDropDown(key)"
							>
								<span v-if="meritOptionDropSelect === key">arrow_drop_down</span>
								<span v-else>arrow_right</span>
						</button>
					</div>
				</div>
			</div>
			
			<datalist v-if="datalistFilter" :id="abilityName+'List'">
				<option v-for="el in datalistFilter" :key="el">{{ el }}</option>
			</datalist>
		</div>
	</div>
</template>

<script lang="ts">
import { Ability, nameToKey } from "../../definitions/Character";
import { defineComponent, unref , isRef} from "vue";
import { uniqByKeepLast } from "../../Util";
import Merit from "@/definitions/Merit";
export default defineComponent({
	name: "AbilityList",
	props: {
		"abilities": {
			required: true,
			type: Object
		},
		"abilityName": {
			required: false,
			type: String
		},
		"optionsMutable": {
			required: false,
			default: true,
			type: Boolean
		},
		"length": {
			required: false,
			type: Number
		},
		"datalist": {
			required: false,
			default: undefined,
			type: Object
		},
		"dotRanges": {
			required: false,
			default: () => ({}),
			type: Object
		},
		"horizontal": {
			type: Boolean,
			default: () => false
		}
	},
	data() {
		return {
			meritOptionDropSelect: null
		};
	},
	methods: {
		isRef,
		unref,
		nameToKey,
		setDots(ability: Ability, n: number) {
			ability.level = (ability.level === n ? n-1 : n);

			// if ((this as any).$parent.character.splat===(this as any).$parent.EnumSplat.MAGE) {
			// 	if ((this as any).$parent.subType.abilities.includes(this.nameOf(ability.name))) {
			// 		if (ability.level === 0) ability.level = 1;
			// 	}
			// }

			// if (this.optionsMutable && (ability as any).false && ability.name !== "" && ability.level > 0) {
			// 	delete (ability as any).false;
				
			// 	this.abilityArr.push(ability);
			// }
		},
		doInput(ability: Ability, key: string) {
			if (this.optionsMutable && ability) {
				delete this.abilities[key];

				// eslint-disable-next-line vue/no-mutating-props
				this.abilities[nameToKey(unref(ability.name))] = ability;
			}
		},
		meritOptionDropDown(name: string) {
			if ((this as any).meritOptionDropSelect === name) {
				(this as any).meritOptionDropSelect = null;
			} else {
				(this as any).meritOptionDropSelect = name;
			}
		}
	},
	computed: {
		visible(): {[key: string]: Ability | Merit} {
			const abl = uniqByKeepLast(Object.entries(this.abilities), el=>el[1].name)
				.map(el => ({
					[el[0]]: el[1]	
				}))
				.reduce((prevVal, val) => Object.assign(prevVal, val), {});

			return Object.keys(abl).length >= (this.length || Number.MAX_SAFE_INTEGER) ? abl : {
				...abl,
				...(this.optionsMutable ? {
					"NEW": {name: "", level: 0}
				} : {})
			};
		},
		datalistFilter() {
			return Object.keys((this as any).datalist || {})
				.filter((el) => !(this as any).abilities[el])
				.map(el => (this as any).datalist[el]);
		},
		optsRow() {
			type n = Ability | Merit;
			return !!(Object.values((this as any).abilities) as any[]).find((el) => el.getOptions && el.getOptions().length > 0);
		}
	}
});
</script>

<style lang="scss" scoped>
.sheet-dots {
	padding: 0px;
	white-space: nowrap;
	width: fit-content;
}
.dot-limit {
	background-color: grey;
}
.missing-dot {
	background-color: red;
}
.options-toggle {
	height: 24px;
	width: fit-content;
}
.options-toggle span {
	font-size: 24px !important;
}
</style>