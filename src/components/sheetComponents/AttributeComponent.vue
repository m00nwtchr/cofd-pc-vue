<template>
	<div class="separator col-12">
		<h2>{{ $t("character.attributes") }}</h2>
	</div>
	<div id="attrBar" class="bar row">
		<div id="attr-cats" style="text-align: right" class="block col-sm-2">
			{{ $t("character.attribute.power") }}
			<br />
			{{ $t("character.attribute.finesse") }}
			<br />
			{{ $t("character.attribute.resistance") }}
			<br />
		</div>
		<div class="attr-proper row col-sm-10">
			<div v-for="(attrCat,i) in ATTRIBUTES" :key="i" class="block col-sm-4">
				<span style="text-transform: capitalize" v-for="attr in attrCat" :key="attr">
					<span
						:class="{ selected: store.state.selectedTraits[attr] }"
						@click="emit('select', attr, character.attributes)"
					>{{ $t(`character.attribute.${attr}`) }}</span>
					<input
						v-if="!dotsOverFive && attrMax > 5"
						v-model.number="baseAttributes[attr]"
						type="number"
						style="width: 35px"
						class="attr-input"
					/>
					<sheet-dots v-model="baseAttributes[attr]" :maxValue="dotAttrMax" />
					<br />
				</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useStore } from "../../store";

import { hasMixin } from "ts-mixer";

import {
	Character,

	ATTRIBUTES,
	IsSupernatural,
	Attributes,
} from "../../definitions";

import SheetDots from "./SheetDots.vue";

const store = useStore();

const props = defineProps<{
	character: Character;
}>();
const emit = defineEmits(["select"]);

const baseAttributes = computed({
	get() {
		return props.character._attributes;
	},
	set(val: Attributes) {
		props.character._attributes = val;
	}
});

const dotsOverFive = computed(() => false);

const attrMax = computed(() => hasMixin(props.character, IsSupernatural) ?
	props.character.power > 5 ?
		props.character.power : 5
	: 5
);

const dotAttrMax = computed(() => Math.min(
	attrMax.value,
	dotsOverFive.value ? 10 : 5
));
</script>