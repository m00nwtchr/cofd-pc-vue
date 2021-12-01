<template>
	<div id="infoBar" class="bar row">
		<div class="block col-sm-4">
			{{ $t(character.splat.nameName) }}:
			<input v-model="character.name" />
			<br />
			<span v-if="character.splat.enum === EnumSplat.MORTAL">
				<label for="age">{{ $t("character.age") }}:</label>
				<input v-model.number="character.age" type="number" id="age" />
				<br />
				<label for="player">{{ $t("character.player") }}:</label>
				<input v-model="character.player" id="player" />
			</span>
			<span v-else>
				<label for="player">{{ $t("character.player") }}:</label>
				<input v-model="character.player" id="player" />
				<br />
				<label for="chronicle">{{ $t("character.chronicle") }}:</label>
				<input v-model="character.chronicle" id="chronicle" />
			</span>
		</div>
		<div class="block col-sm-4">
			<span v-if="hasMixin(character, HasVirtueViceAnchors)">
				<label>
					{{ $t(character.splat.virtueAnchorName) }}:
					<input v-model="virtueAnchor" list="virtueAnchors" />
				</label>
				<br />
				<label>
					{{ $t(character.splat.viceAnchorName) }}:
					<input v-model="viceAnchor" list="viceAnchors" />
				</label>
				<br />
			</span>
			<label for="concept">{{ $t("character.concept") }}:</label>
			<input v-model="character.concept" id="concept" />
		</div>
		<div class="block col-sm-4">
			<span v-if="character.splat.enum === EnumSplat.MORTAL">
				<label>
					{{ $t("character.chronicle") }}:
					<input v-model="character.chronicle" />
				</label>
				<br />
				<label>
					{{ $t(character.splat.legacyName) }}:
					<input v-model="character.faction" />
				</label>
				<br />
				<label v-if="hasMixin(character, HasOrganization)">
					{{ $t(character.splat.orgName) }}:
					<input v-model="character._organization" />
				</label>
				<br />
			</span>
			<span v-else>
				<label v-if="hasMixin(character, IsSupernatural)">
					{{ $t(character.splat.subTypeName) }}:
					<select v-model="character._subType">
						<option
							v-for="(el, key) in character.splat.subTypes"
							:key="key"
							:value="key"
						>{{ $t(el.name) }}</option>
						<option></option>
					</select>
				</label>
				<br />
				<label v-if="hasMixin(character, HasLegacy)">
					{{ $t(character.splat.legacyName) }}:
					<input v-model="character.legacy" />
				</label>
				<br />
				<label v-if="hasMixin(character, HasOrganization)">
					{{ $t(character.splat.orgName) }}:
					<select v-model="character._organization">
						<option
							v-for="(el, key) in character.splat.organizations"
							:key="key"
							:value="key"
						>{{ $t(el.name) }}</option>
						<option></option>
					</select>
				</label>
			</span>
		</div>

		<datalist id="organizations">
			<option
				v-for="(el, key) in character.splat.organizations"
				:key="key"
				:value="key"
			>{{ $t(el.name) }}</option>
		</datalist>

		<datalist id="subTypes">
			<option v-for="(el, key) in character.splat.subTypes" :key="key" :value="key">{{ $t(el.name) }}</option>
		</datalist>

		<datalist id="virtueAnchors">
			<option v-for="el in character.splat.virtueAnchors" :key="el" :value="$t(el)"></option>
		</datalist>

		<datalist id="viceAnchors">
			<option v-for="el in character.splat.viceAnchors" :key="el" :value="$t(el)"></option>
		</datalist>
	</div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { hasMixin } from "ts-mixer";

import {
	Character,
	EnumSplat,


	IsSupernatural,
	HasVirtueViceAnchors,
	HasOrganization,
	HasLegacy
} from "../../definitions";

import { useI18n } from "vue-i18n";

const { te, t } = useI18n();

const props = defineProps<{
	character: Character;
}>();


const virtueAnchor = computed({
	get(): string {
		if (hasMixin(props.character, HasVirtueViceAnchors)) {
			const x = (props.character.splat.virtueAnchor || (() => ""))(props.character.virtueAnchor);
			return te(x) ? t(x) : props.character.virtueAnchor;
		}
		return "";
	},
	set(val: string) {
		if (hasMixin(props.character, HasVirtueViceAnchors)) {
			const x = (props.character.splat.virtueAnchor || (() => ""))(val.toLowerCase());

			if (props.character.splat.virtueAnchors.includes(x)) {
				props.character.virtueAnchor = val.toLowerCase();
			} else {
				props.character.virtueAnchor = val;
			}
		}
	}
});

const viceAnchor = computed({
	get(): string {
		if (hasMixin(props.character, HasVirtueViceAnchors)) {
			const x = (props.character.splat.viceAnchor || (() => ""))(props.character.viceAnchor);
			return te(x) ? t(x) : props.character.viceAnchor;
		}
		return "";
	},
	set(val: string) {
		if (hasMixin(props.character, HasVirtueViceAnchors)) {
			const x = (props.character.splat.viceAnchor || (() => ""))(val.toLowerCase());

			if (props.character.splat.viceAnchors.includes(x)) {
				props.character.viceAnchor = val.toLowerCase();
			} else {
				props.character.viceAnchor = val;
			}
		}
	}
});


</script>