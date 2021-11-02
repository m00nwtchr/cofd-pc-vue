<template>
	<div>
		<h3 v-if="abilityName" class="separator col-sm-12">{{ abilityName }}</h3>
		<!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->

		<div :class="{ 'row': horizontal }">
			<div
				style="margin:0"
				v-for="(ability, key, i) in visible"
				:key="i"
				class="block row"
				:class="{
					'col-sm-12': !horizontal,
					['col-sm-' + Math.floor(12 / Object.keys(visible).length)]: horizontal
				}"
			>
				<span
					class="line col-7"
					:class="{ 'selected': store.state.selectedTraits[key] }"
					@click="$parent.selectTrait(key, abilities)"
				>
					<input
						v-if="optionsMutable && ability.name || key === 'NEW'"
						@input="doInput(ability, key)"
						v-model="ability.name"
						:list="datalistFilter ? abilityName + 'List' : ''"
					/>
					<span
						v-else
					>{{ ability.name || $t((translationKey ? translationKey : `splat.${EnumSplat[character.splat.enum].toLowerCase()}.ability.`) + key) }}</span>

					<br />
					<div v-if="(ability instanceof Merit) && meritOptionDropSelect === key">
						<div>
							<span v-for="option in ability.getOptions()" :key="option.name">
								{{ option.name }}:
								<select v-if="option.list" v-model="ability[option.name]">
									<option
										v-for="(val, key) in option.list"
										:key="key"
										:value="typeof key === 'number' ? val : key"
									>{{ val }}</option>
								</select>
								<select
									v-else-if="option.lists"
									v-for="(list, i) in option.lists"
									:key="i"
									v-model="ability[option.name][i]"
								>
									<option v-for="(val, key) in list" :key="key" :value="val">{{ val }}</option>
								</select>
								<input v-else :type="option.bool ? 'checkbox' : 'text'" v-model="ability[option.name]" />
								<br />
							</span>
						</div>
					</div>
				</span>

				<div class="col-5 row" style="flex-wrap:nowrap">
					<sheet-dots v-model="ability.level" />
					
					<div
						class="options-toggle"
						v-if="(ability instanceof Merit) && ability.getOptions().length > 0"
					>
						<!-- {{ability.getOptions && ability.getOptions().length > 0}} -->

						<button class="dropdown-toggle material-icons" @click="meritOptionDropDown(key)">
							<span v-if="meritOptionDropSelect === key">arrow_drop_down</span>
							<span v-else>arrow_right</span>
						</button>
					</div>
				</div>
			</div>

			<datalist v-if="datalistFilter" :id="abilityName + 'List'">
				<option v-for="el in datalistFilter" :key="el">{{ $t(el) }}</option>
			</datalist>
		</div>
	</div>
</template>

<script lang="ts">
import { nameToKey } from "../../definitions/Character";
import { Ability, Character, Merit, EnumSplat } from "../../definitions";

import { defineComponent, unref, isRef, PropType, watch } from "vue";
import { uniqByKeepLast } from "../../Util";
import { useStore } from "../../store";

import SheetDots from "./SheetDots.vue";

export default defineComponent({
	name: "AbilityList",
	components: {
		SheetDots
	},
	props: {
		"character": {
			required: true,
			type: Object as PropType<Character>,
		},
		"abilities": {
			required: true,
			type: Object as PropType<{ [key: string]: Ability }>
		},
		"abilityName": {
			required: false,
			type: String
		},
		"translationKey": {
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
			default: () => ({}),
			type: Object as PropType<{ [key: string]: string }>
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
	data: () => ({
		meritOptionDropSelect: "",
		store: useStore(),

		flag: true,

		EnumSplat,
		Merit
	}),
	methods: {
		isRef,
		unref,
		nameToKey,
		setDots(ability: Ability, n: number) {
			ability.level = (ability.level === n ? n - 1 : n);

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
			if (this.optionsMutable && ability && this.flag) {
				this.flag = false;
				delete this.abilities[key];

				// eslint-disable-next-line vue/no-mutating-props

				if (key !== "") {
					this.abilities[nameToKey(ability.name)] = ability;
				}
			} else {
				this.flag = true;
			}
		},
		meritOptionDropDown(name: string) {
			if (this.meritOptionDropSelect === name) {
				this.meritOptionDropSelect = "";
			} else {
				this.meritOptionDropSelect = name;
			}
		}
	},
	mounted() {
		const fun = (val: any, oldVal: any) => {
			Object.keys(this.abilities).forEach(key => {
				if (key === "") {
					delete this.abilities[key];
				}
			});
		};

		fun(null, null);
		watch(() => this.abilities, fun, { deep: true });
	},
	computed: {
		visible(): { [key: string]: Ability | Merit } {
			const abl = uniqByKeepLast(Object.entries(this.abilities), el => el[1].name || el[0])
				.map(el => ({
					[el[0]]: el[1]
				}))
				.reduce((prevVal, val) => Object.assign(prevVal, val), {});

			return Object.keys(abl).length >= (this.length || Number.MAX_SAFE_INTEGER) ? abl : {
				...abl,
				...(this.optionsMutable ? {
					"NEW": { name: "", level: 0 }
				} : {})
			};
		},
		datalistFilter(): string[] {
			return Object.keys(this.datalist || {})
				.filter((el) => !this.abilities[el])
				.map(el => this.datalist[el]);
		},
		optsRow(): any {
			type n = Ability | Merit;
			return !!(Object.values(this.abilities) as any[]).find((el) => el.getOptions && el.getOptions().length > 0);
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

input {
	width: 100%;
}
</style>