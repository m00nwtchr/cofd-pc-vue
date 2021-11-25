<template>
	<div>
		<h3 v-if="abilityName" class="separator col-sm-12">{{ abilityName }}</h3>
		<!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->

		<div :class="{ 'row': horizontal }">
			<div
				style="margin:0"
				v-for="([key, ability], i) in visible"
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
					@click="emit('select', key, abilities)"
				>
					<input
						v-if="optionsMutable && ability.name || key === 'NEW'"
						@change="doInput(ability, key, i)"
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

<script lang="ts" setup>
import { nameToKey } from "../../definitions/Character";
import { Ability, Character, Merit, EnumSplat } from "../../definitions";

import { defineComponent, unref, isRef, PropType, watch, ref, onMounted, computed } from "vue";
import { uniqByKeepLast } from "../../Util";
import { useStore } from "../../store";

import SheetDots from "./SheetDots.vue";

const store = useStore();

// eslint-disable-next-line no-undef
const emit = defineEmits(["update:abilities", "select"]);
// eslint-disable-next-line no-undef
const props = defineProps({
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
});

const meritOptionDropSelect = ref("");

const map = computed({
	get() {
		return Object.entries(props.abilities);
	},
	set(val: [string, Ability][]) {
		emit("update:abilities", Object.fromEntries(val));
	}
});

const visible = computed(() => {
	// const abl = uniqByKeepLast(Object.entries(this.abilities), el => el[1].name || el[0])
	// 	.map(el => ({
	// 		[el[0]]: el[1]
	// 	}))
	// 	.reduce((prevVal, val) => Object.assign(prevVal, val), {});

	// return Object.keys(abl).length >= (this.length || Number.MAX_SAFE_INTEGER) ? abl : {
	// 	...abl,
	// 	...(this.optionsMutable ? {
	// 		"NEW": { name: "", level: 0 }
	// 	} : {})
	// };

	let arr = [
		...map.value
	];

	if (props.optionsMutable) {
		arr.push(["NEW", { name: "", level: 0 }]);
	}

	return arr;
});

const datalistFilter = computed(() =>
	Object.keys(props.datalist || {})
		.filter((el) => !props.abilities[el])
		.map(el => props.datalist[el]));

function setDots(ability: Ability, n: number) {
	ability.level = (ability.level === n ? n - 1 : n);
}

function doInput(ability: Ability, key: string, i: number) {
	if (props.optionsMutable && ability) {
		if (typeof ability.name === "string") {
			if (!map.value[i]) {
				console.log("ADD");
				map.value = [...map.value, [nameToKey(ability.name), ability]]
				// map.value.push([nameToKey(ability.name), ability]);
			} else {
				map.value[i][0] = nameToKey(ability.name);
				map.value = [...map.value];
			}
		}

		if (!ability.name) {
			map.value.splice(i, 1);
			map.value = [...map.value];
		}
	}
}

function meritOptionDropDown(name: string) {
	if (meritOptionDropSelect.value === name) {
		meritOptionDropSelect.value = "";
	} else {
		meritOptionDropSelect.value = name;
	}
}

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