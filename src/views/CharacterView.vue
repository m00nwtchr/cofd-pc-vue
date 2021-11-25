<template>
	<header class="col-12">
		<div>{{ character.name }}</div>
	</header>

	<!-- <dice-roller></dice-roller> -->

	<floating-action-menu
		:items="[
			{
				// name: 'Roll Selected',
				icon: 'dice-d20',
				action: rollSelected
			},
			{
				// name: 'Roll Selected',
				icon: $route.query.data ? 'file-import' : 'file-export',
				action: $route.query.data ? importCharacter : exportCharacter
			}
		]"
	></floating-action-menu>
	<!-- <div>
		<button class="fab" @click="rollSelected()">Roll Selected</button>
		<modal-component
			modalWidth="80%"
			modalHeight="80%"
			v-if="character.splat === EnumSplat.MAGE"
			value="Cast Spell"
			title="Improvised Spellcasting"
		>
			<spell-calculator :character="character" class="col-12" />
		</modal-component>
	</div>-->

	<!-- <teleport v-if="character.splat !== EnumSplat.VAMPIRE" :to="`#${EnumSplat[character.splat].toLowerCase()}-conditions`"> -->
	<!-- </teleport> -->
	<div
		id="charsheet"
		:class="{
			[`charsheet-${EnumSplat[character.splat.enum].toLowerCase()}`]: true
		}"
	>
		<!-- <fab /> -->
		<span v-if="store.state.debug">
			{<span 
				:key="val[0]"
				v-for="val in Object.entries(store.state.selectedTraits)"
			>{{ val[0] }}: {{ val[1]() }},</span>}
		</span>
		<!-- {{  }} -->
		<div id="page-1">
			<div id="infoBar" class="bar row">
				<!-- <datalist> </datalist> -->

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
						<label>
							{{ $t(character.splat.virtueAnchorName) }}:
							<input v-model="virtueAnchor" list="virtueAnchors"/>
						</label>
						<br />
						<label>
							{{ $t(character.splat.viceAnchorName) }}:
							<input v-model="viceAnchor" list="viceAnchors"/>
						</label>
					<br />
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
						<br>
						<label v-if="hasMixin(character, HasLegacy)">
							{{ $t(character.splat.legacyName) }}:
							<input v-model="character.legacy"/>
						</label>
						<br>
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
								@click="selectTrait(attr, character.attributes)"
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
			<div class="row" style="margin-top:15px">
				<skill-sidebar @selectSkill="selectTrait" :character="character" class="col col-sm-4"></skill-sidebar>

				<div id="traits" class="col-sm-8">
					<h2 class="separator col-sm-12" style="margin-bottom: 20px">{{ $t("character.other_traits") }}</h2>
					<div class="row">
						<div class="col col-sm-7">
							<ability-list
								v-if="hasMixin(character, IsSupernatural)"
								:character="character"
								v-model:abilities="character.abilities"
								:optionsMutable="!character.splat.finiteAbilities"
								:abilityName="$t(character.splat.abilityName)"
								:datalist="character.splat.abilities"
								id="ability"
								class="block"
								@select="selectTrait"
							/>

							<ability-list
								v-if="hasMixin(character, HasMerits)"
								:character="character"
								v-model:abilities="character.merits"
								abilityName="Merits"
								id="merits"
								class="block"
								:min="10"
								@select="selectTrait"
							/>

							<span v-if="(character instanceof WerewolfCharacter)">
								<item-list
									class="col-12 block"
									name="Aspirations"
									:items="character.aspirations"
									:mutable="true"
									:min="4"
								/>

								<div class="block">
									<h3 class="separator col-sm-12">Hunter's Aspect</h3>
									<input class="line w-100" type="text" v-model="character.huntersAspect" />
								</div>

								<item-list
									class="col-12 block"
									name="Conditions"
									:items="character.conditions"
									:mutable="true"
									:min="3"
								/>
							</span>

							<div id="minorTraits" class="block col col-12">
								<span v-if="!(character instanceof WerewolfCharacter)">
									{{ $t("character.trait.size") }}:
									<input v-model.number="character.size" type="number" />
									<br />
									{{ $t("character.trait.speed") }}:
									{{ character.speed }}
									<br />
									{{ $t("character.trait.defense") }}:
									{{ character.defense }}
									<br />
									<!-- {{ $t("character.trait.armor") }}: <input v-model="character.armor" /><br> -->
									{{ $t("character.trait.armor") }}:
									{{
										character.armor
											? character.armor.general +
											"/" +
											character.armor.ballistic
											: ""
									}}
									<br />
									{{ $t("character.trait.initative") }}:
									{{ character.initative }}
									<br />
								</span>
								<span style="float: left; margin-right: 5px">{{ $t("character.trait.beats") }}:</span>
								<span v-if="hasMixin(character, EarnsBeats)">
									<div style="float: left; margin-right: 10px">
										<sheet-dots
											v-model.number="character.beats"
											:boxes="true"
											@update:modelValue="updateBeats()"
										/>
									</div>
									<!-- <span style="clear: both"></span> -->
									<br />
									{{ $t("character.trait.experience") }}:
									<input
										v-model.number="character.experience"
										type="number"
									/>
								</span>
								<br />
								<div
									v-if="hasMixin(character, EarnsAlternativeBeats) &&
										character.splat.alternateBeatName &&
										character.splat.alternateBeatDefault
									"
								>
									<span style="float: left; margin-right: 5px">
										{{
											$t(character.splat.alternateBeatName, { x: $t("character.trait.beats") })
										}}:
									</span>
									<div style="float: left">
										<sheet-dots
											v-model.number="character.alternateBeats"
											:boxes="true"
											@update:modelValue="updateBeats(true)"
										/>
									</div>
									<span style="clear: both"></span>
									<br />
									{{
										$t(character.splat.alternateBeatName, { x: $t("character.trait.experience") })
									}}:
									<input v-model.number="character.alternateExperience" type="number"/>
									<br />
								</div>
							</div>
						</div>
						<div class="col col-sm-5" >
							<health-component
								id="health"
								class="col-12 block"
								:name="$t('character.trait.health')"
								v-model:healthTrack="character.healthTrack"
								:maxHealth="character.maxHealth"
								:woundPenalty="hasMixin(character, HasWoundPenalties) ? character.woundPenalty : 0"
							>
								<!-- <i class="subtitle" style="margin-bottom: 5px" v-if="character.splat === EnumSplat.WEREWOLF">(EEE)</i> -->
							</health-component>

							<willpower-component id="willpower" :character="character" class="col-12 block" />
							<!-- </willpower-component> -->
							<!-- <div id="willpower" class="col-12 block">

							</div>-->

							<div
								v-if="hasMixin(character, IsSupernatural)"
								class="col-12 block"
								id="powerTrait"
								style="text-align: center;"
							>
								<h3
									:class="{
										selected: store.state.selectedTraits['power']
									}"
									@click="selectTrait('power', character)"
									class="separator col-sm-12"
									style="white-space: nowrap"
								>{{ $t(character.splat.powerTraitName) }}</h3>
								<sheet-dots v-model.number="character.power" :maxValue="10" />
							</div>
							<div v-if="hasMixin(character, HasFuel)" class="col-12 block" id="fuelTrait">
								<h3 class="separator col-sm-12">{{ $t(character.splat.fuelTraitName) }}</h3>
								<sheet-dots
									v-model="character.fuel"
									:maxValue="character.maxFuel"
									:boxes="true"
									:breakI="10"
								/>
							</div>

							<integrity-component
								v-if="character.splat.integrityTraitName"
								:character="character"
								class="col-12 block"
								id="integrityTrait"
								@select="selectTrait"
							/>

							<div
								class="col-12"
								v-if="character.splat.enum === EnumSplat.WEREWOLF"
								style="color: black; white-space: nowrap; text-align: left;"
								id="kuruth-triggers"
							>
								<h3 class="separator col-sm-12">Kuruth Triggers</h3>
								<!-- <div class="row col-12"> -->
								<!-- <div style="color:black;" class="col-12"> -->
								Passive:
								<input class="line" style="width: 70%" v-model="character.kuruthTriggers.passive" />
								<br />Common:
								<input class="line" style="width: 70%" v-model="character.kuruthTriggers.common" />
								<br />Specific:
								<input class="line" style="width: 70%" v-model="character.kuruthTriggers.specific" />
								<!-- </div> -->
								<!-- </div> -->
							</div>

							<!-- <br> -->

							<span v-if="!(character instanceof WerewolfCharacter)">
								<item-list
									class="col-12 block"
									name="Conditions"
									:items="character.conditions"
									:mutable="true"
									:min="6"
								/>
								<!-- <br> -->

								<item-list
									class="col-12 block"
									name="Aspirations"
									:items="character.aspirations"
									:mutable="true"
									:min="6"
								/>
							</span>

							<!-- <br v-if="character.splat.enum === EnumSplat.MAGE"> -->

							<item-list
								v-if="(character instanceof MageCharacter)"
								class="col-12"
								name="Obsessions"
								:items="character.obsessions"
								:mutable="true"
								:min="6"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div id="page-2">
			<mage-traits
				v-if="(character instanceof MageCharacter)"
				:character="character"
				class="row col-12"
			></mage-traits>

			<werewolf-traits v-if="(character instanceof WerewolfCharacter)" :character="character"></werewolf-traits>

			<div id="vampire-traits" v-if="(character instanceof VampireCharacter)" class="row col-12"></div>
		</div>
		<!-- <object-list :items="character.weapons" name=""></object-list> -->
	</div>
</template>

<script lang="ts" setup>
import { computed, defineComponent, onBeforeMount, reactive, readonly, Ref, unref, watch } from "vue";
import { encode, decode } from "base2048";
import { Buffer } from "buffer";

import { key, useStore } from "../store";
import { useRouter, useRoute } from 'vue-router'

import { hasMixin } from "ts-mixer";

import {
	ATTRIBUTES,
	Attributes,
	MageCharacter,
	SKILLS,
	EnumSplat,
	fromJSON,

	Character,

	MortalCharacter,
	VampireCharacter,
	WerewolfCharacter,

	HasWoundPenalties,
	HasVirtueViceAnchors,
	IsSupernatural,
	HasFuel,
	EarnsBeats,
	EarnsAlternativeBeats,
	HasOrganization,
	HasLegacy,
	HasMerits
} from "../definitions";

import AbilityList from "../components/sheetComponents/AbilityList.vue";
import HealthComponent from "../components/sheetComponents/HealthComponent.vue";
import IntegrityComponent from "../components/sheetComponents/IntegrityComponent.vue";
import WillpowerComponent from "../components/sheetComponents/WillpowerComponent.vue";
import SheetDots from "../components/sheetComponents/SheetDots.vue";

import ItemList from "../components/sheetComponents/ItemList.vue";
import ObjectList from "../components/sheetComponents/ObjectList.vue";
import DiceRollerComponent from "../components/sheetComponents/diceRoller/DiceRoller.vue";

import SkillSidebar from "../components/sheetComponents/SkillSidebar.vue";
import WerewolfTraits from "../components/splats/WerewolfTraits.vue";
import MageTraits from "../components/splats/MageTraits.vue";

import ModalComponent from "../components/ModalComponent.vue";
import FloatingActionMenu from "../components/FloatingActionMenu.vue";

import SpellCalculator from "../components/sheetComponents/SpellCalculator.vue";

import { DiceRoller } from "../DiceRoller";
import { v4 as uuidv4 } from "uuid";
// import { SupernaturalCharacter } from "@/definitions/Character";
// import { get, set } from "lodash";
// import g from "../i18n";
// const { te } = g.global;
import { useI18n } from "vue-i18n";

const { t, te } = useI18n();

const route = useRoute();
const router = useRouter();
const store = useStore();

const roller = new DiceRoller();

const characters = computed(() => store.state.characters);

const id = computed(() => route.params.id as string);

const CACHE: {
	[key: string]: Character
} = {};

const character = computed(() => {
	let data = characters.value[id.value];

	if (CACHE[id.value]) {
		return CACHE[id.value];
	}

	if (!data && route.query.data) {
		let routeData = route.query.data as string;

		data = JSON.parse(decodeURI(routeData));
	}

	const obj = reactive(fromJSON(data));
	
	if (!route.query.data)
		CACHE[id.value] = obj as any;

	return obj;
});

let flag = true;
watch(character, (val) => {
	if (route.query.data) return;
	console.log("UPDATE");
	if (flag) {
		flag = false;
		if (id.value)
			store.commit("UPDATE_CHARACTER", { id: id.value, val });
	} else {
		flag = true;
	}
}, { deep: true });

onBeforeMount(() => {
	Object.assign(window, {
		character, roller
	});
});

const virtueAnchor = computed({
	get(): string {
		if (hasMixin(character.value, HasVirtueViceAnchors)) {
			const x = (character.value.splat.virtueAnchor || (() => ""))(character.value.virtueAnchor);
			return te(x) ? t(x) : character.value.virtueAnchor;
		}
		return "";
	},
	set(val: string) {
		if (hasMixin(character.value, HasVirtueViceAnchors)) {
			const x = (character.value.splat.virtueAnchor || (() => ""))(val.toLowerCase());

			if (character.value.splat.virtueAnchors.includes(x)) {
				character.value.virtueAnchor = val.toLowerCase();
			} else {
				character.value.virtueAnchor = val;
			}
		}
	}
});

const viceAnchor = computed({
	get(): string {
		if (hasMixin(character.value, HasVirtueViceAnchors)) {
			const x = (character.value.splat.viceAnchor || (() => ""))(character.value.viceAnchor);
			return te(x) ? t(x) : character.value.viceAnchor;
		}
		return "";
	},
	set(val: string) {
		if (hasMixin(character.value, HasVirtueViceAnchors)) {
			const x = (character.value.splat.viceAnchor || (() => ""))(val.toLowerCase());

			if (character.value.splat.viceAnchors.includes(x)) {
				character.value.viceAnchor = val.toLowerCase();
			} else {
				character.value.viceAnchor = val;
			}
		}
	}
});

const baseAttributes = computed({
	get(): Attributes {
		return character.value._attributes;
	},
	set(val: Attributes) {
		character.value._attributes = val;
	}
})

const dotsOverFive = computed(() => false);

const dotAttrMax = computed(() => Math.min(
	attrMax.value,
	dotsOverFive.value ? 10 : 5
));

const attrMax = computed(() => hasMixin(character.value, IsSupernatural) ?
	character.value.power > 5 ?
		character.value.power : 5
	: 5
);

async function rollSelected(opts: any) {
	const vals = Object.values(store.state.selectedTraits).map(el => el());
	if (vals.length === 0) return 0;

	const dice = vals.reduce((prev, val) => prev + val);
	const result = await roller.roll(dice, opts);

	alert(`Rolled ${dice} dice, got ${result} successes`);
}

function selectTrait(name: string, obj: any) {
	if (obj[name] !== undefined && typeof (obj[name].level || obj[name]) === "number") {
		if (store.state.selectedTraits[name] !== undefined) {
			store.commit("UNSELECT_TRAIT", name);
		} else if (name) {
			if (Object.keys(store.state.selectedTraits).length === 3) {
				store.commit("UPDATE_SELECTED", {});
			}

			store.commit({
				type: "SELECT_TRAIT",
				name,
				value: () => obj[name] && typeof obj[name].level === "number" ? obj[name].level : obj[name]
			});
		}
	}
}

function updateBeats(alt = false) {
	if (!alt && hasMixin(character.value, EarnsBeats)) {
		if (character.value.beats === 5) {
			character.value.beats = 0;
			character.value.experience++;
		}
	} else if (hasMixin(character.value, EarnsAlternativeBeats)) {
		if (character.value.alternateBeats === 5) {
			character.value.alternateBeats = 0;
			character.value.alternateExperience++;
		}
	}
}

function exportCharacter() {
	if (navigator.clipboard) {
		const txt = encodeURI(JSON.stringify(character));

		navigator.clipboard.writeText(`${document.location.origin + document.location.pathname}#/character/?data=${txt}`);
	}
}
function importCharacter() {
	const data = JSON.parse(decodeURI(route.query.data as string));

	data.id = uuidv4();

	store.commit("UPDATE_CHARACTER", {
		id: data.id,
		val: data
	});

	router.push({ name: "character", params: { id: data.id } });
}
</script>

<style lang="scss">
@import "../style/vars.scss";

$xs-max: 575.98px;
$sm-min: 576px;
$sm-max: 767.98px;

#charsheet {
	padding: 20px;
}

header {
	margin-top: 0px;
	min-height: 35px;
	text-align: left;
	// background-color: $s-dark;
	// border-bottom: 1px solid;

	width: 100%;

	$spread: -10px;

	-webkit-box-shadow: 0px 6px 17px $spread rgba(0, 0, 0, 0.34);
	box-shadow: 0px 6px 17px $spread rgba(0, 0, 0, 0.34);

	div {
		margin-left: 15px;
		padding-top: 5px;
		margin-bottom: 5px;
		// shadow
	}
}

select {
	// width: 100%;
}

input {
	background-color: transparent;
	border: none;
	color: inherit;
}

input:focus {
	outline: none;
}

.bar {
	white-space: nowrap;
	margin-top: 15px;
	padding-left: 15px;
	padding-right: 15px;
}

.block {
	text-align: left;
	overflow: hidden;

	width: 100%;

	margin-bottom: 15px;

	@media (max-width: $xs-max) {
		margin: auto;
		margin-top: 15px;
		// width: 60%;
	}
}

.block.col-sm-2 {
	@media (max-width: $xs-max) {
		display: none;
	}
}

.separator {
	text-transform: uppercase;
	text-align: center;

	// margin-top: 10px;
	margin-bottom: 0px;
	// margin-bottom: 0px;

	// margin-bottom: 15px;
}

.attr-proper,
#skills {
	.sheet-dots {
		float: right;
	}
}

#skills .sheet-dot {
	@media (min-width: $sm-min) and (max-width: $sm-max) {
		$radius: 11px;

		width: $radius;
		height: $radius;
	}
	@media (max-width: $xs-max) {
		$radius: 11px;

		width: $radius;
		height: $radius;
	}
}

#skills .sheet-dot-small {
	@media (min-width: $sm-min) and (max-width: $sm-max) {
		$radius: 8px;

		width: $radius;
		height: $radius;
	}
	@media (max-width: $xs-max) {
		$radius: 5px;

		width: $radius;
		height: $radius;
	}
}

#attrBar .sheet-dot {
	@media (min-width: $sm-min) and (max-width: $sm-max) {
		$radius: 11px;

		width: $radius;
		height: $radius;
	}
	@media (max-width: $xs-max) {
		$radius: 11px;

		width: $radius;
		height: $radius;
	}
}

#attrBar .sheet-dot-small {
	@media (min-width: $sm-min) and (max-width: $sm-max) {
		$radius: 6px;

		width: $radius;
		height: $radius;
	}
	@media (max-width: $xs-max) {
		$radius: 5px;

		width: $radius;
		height: $radius;
	}
}

// button.sheet-dot-small {
// 	$radius: 12px;

// 	width: $radius;
// 	height: $radius;
// }

#minorTraits {
	font-size: 14.2pt;
	white-space: nowrap;
}

.subtitle {
	line-height: 5px;
	// margin-top: -13px;
	// margin-bottom: 5px;
	display: block;
	text-align: center;

	font-size: 10pt;
	font-family: "Goudy Old style";

	color: black;
}

#rotes {
	text-align: center;
	#rote-level input {
		width: 220%;
	}
	input {
		width: 100%;
		margin-left: 10px;
	}
}

.attr-input {
	border: 1px solid black;
	border-radius: 10px;
	background-color: #484747;
	color: white;
}

.dropdown-toggle {
	border: none;

	background-color: transparent;

	height: 100%;
	// padding-bottom: -10px;

	vertical-align: center;
	text-align: center;

	span {
		// : 10px;
		font-size: 14pt;
	}
}

.dropdown-toggle::after {
	display: none !important;
	// padding-top: 10px;
}

.specialties {
	$color: green;

	color: green;
	// fill: black;
	// stroke: red;
	// stroke-width: 3;
	// text-shadow: 2px 0 0 $color, -2px 0 0 $color, 0 2px 0 $color, 0 -2px 0 $color, 1px 1px $color, -1px -1px 0 $color, 1px -1px 0 $color, -1px 1px 0 $color;
}

#fuelTrait {
	text-align: center;
}
</style>