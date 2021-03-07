<template>
	<div>
		<header class="col-12">
			<div>{{ character.name }}</div>
		</header>
		
		<!-- <teleport v-if="character.splat !== EnumSplat.VAMPIRE" :to="`#${EnumSplat[character.splat].toLowerCase()}-conditions`"> -->
		<!-- </teleport> -->
		<div class="charsheet" :class="{
			['charsheet-'+(EnumSplat && EnumSplat[character.splat]).toLowerCase()]: true
		}">
			<!-- <fab /> -->

			<div id="infoBar" class="bar row col-12">
				<div class="block col-sm-4">
					{{ splat && splat.nameName }}: <input v-model="character.name" /><br />
					<span v-if="character.splat === EnumSplat.MORTAL">
						Age: <input v-model.number="character.age" type="number" /><br />
						Player: <input v-model="character.player" /><br />
					</span>
					<span v-else>
						Player: <input v-model="character.player" /><br />
						Chronicle: <input v-model="character.chronicle" /><br />
					</span>
				</div>
				<div class="block col-sm-4">
					{{ splat && splat.virtueAnchorName }}:
					<input v-model="character.virtueAnchor" /><br />
					{{ splat && splat.viceAnchorName }}:
					<input v-model="character.viceAnchor" /><br />
					Concept: <input v-model="character.concept" /><br />
				</div>
				<div class="block col-sm-4">
					<span v-if="character.splat === EnumSplat.MORTAL">
						{{ splat && splat.subTypeName }}:
						<input v-model="character.chronicle" /><br />
						{{ splat && splat.legacyName }}:
						<input v-model="character.faction" /><br />
					</span>
					<span v-else>
						{{ splat && splat.subTypeName }}:
						<input v-model="character.subType" /><br />
						{{ splat && splat.legacyName }}:
						<input v-model="character.legacy" /><br />
					</span>

					{{ splat && splat.orgName }}:
					<input v-model="character.organization" /><br />
				</div>
			</div>
			<div class="separator col-12"><h2>Attributes</h2></div>
			<div id="attrBar" class="bar row col-12">
				<div id="attr-cats" style="text-align:right;" class="block col-sm-2">
					Power<br />
					Finesse<br />
					Resistance<br />
				</div>
				<div class="attr-proper row col-sm-10">
					<div v-for="attrCat in attributeNames" :key="attrCat" class="block col-sm-4">
						<span style="text-transform: capitalize" v-for="attr in attrCat" :key="attr">
							{{ attr }}
							<div class="sheet-dots">
								<button @click="setAttr(attr, n)" v-for="n in attrMax" :key="n" :class="{'sheet-dot':true,'sheet-dot-full':character.baseAttributes[attr]>=n,'sheet-dot-small':attrMax>5}"></button>
							</div>
							<br>
						</span>
					</div>
				</div>		
			</div>
			<div class="row col-12">
				<div id="skills" class="bar col col-sm-4">
					<h2 class="separator col-sm-12" style="margin-bottom: 20px">Skills</h2>
					<div v-for="(cat,i) in skills" :key="cat" class="block col col-12">
						<h3 class="separator">{{Object.keys(skillCats)[i]}}</h3>
						<i class="col-12 subtitle">({{ Object.values(skillCats)[i] }} unskilled)</i><br>

						<div style="font-style: italic;font-size: 10px;line-height: 10px;" v-if="character.splat === EnumSplat.MAGE">
							Rote<br/>Skill
						</div>
						<span style="text-transform: capitalize" v-for="skill in cat" :key="skill">
							<button v-if="character.splat === EnumSplat.MAGE" @click="toggleRoteSkill(skill)" class="sheet-box" :class="{'sheet-dot-full': character.roteSkills.includes(skill)}"></button>
							{{ skill.replaceAll("_", " ") }}
							<div class="sheet-dots">
								<button @click="setSkill(skill, n)" v-for="n in attrMax" :key="n" class="sheet-dot" :class="{'sheet-dot-full': character.skills[skill] >= n,'sheet-dot-small':attrMax>5}"></button>
							</div>
							<br>
						</span>
					</div>
					<br>		
				</div>

				<div id="traits" class="bar col-sm-8">
					<h2 class="separator col-sm-12" style="margin-bottom: 20px">Other Traits</h2>
					<div class="row col-12">
						<div class="col col-sm-7">

							<ability-list v-if="splat && splat.abilityName" :abilities="character.abilities" :optionsMutable="!splat.finiteAbilities" :abilityName="splat.abilityName" id="ability" class="block" />

							<ability-list :abilities="character.merits" abilityName="Merits" id="merits" class="block" />

							<div id="werewolf-conditions"> </div>

							<div id="minorTraits" class="block col col-12">
								<span v-if="character.splat !== EnumSplat.WEREWOLF">
									Size: <input v-model.number="character.size" type="number" /><br>
									Speed: {{ character.speed }}<br>
									Defense: {{ character.defense }}<br>
									<!-- Armor: <input v-model="character.armor" /><br> -->
									Armor: {{ character.armor ? character.armor.general+"/"+character.armor.ballistic : "" }}<br>
									Initative Mod: {{ initative }}<br>
								</span>
								<span style="float:left;">Beats:</span>
								<div style="float:left;">
									<span v-for="n in 5" :key="n">
										<button class="sheet-box" @click="setTrait('beats', n)" :class="{'sheet-dot-full': character.beats >= n}"></button>
									</span>
								</div>
								<span style="clear:both;"></span>
										<br>
								Experience: <input v-model="character.experience" /><br>
								<div v-if="(splat && splat.alternateBeatName) && !splat.alternateBeatOptional">
									<span style="float:left;">{{ splat.alternateBeatName }} Beats:</span> 
									<div style="float:left;">
										<span v-for="n in 5" :key="n">
											<button class="sheet-box" @click="setTrait('alternateBeats', n)" :class="{'sheet-dot-full': character.alternateBeats >= n}"></button>
										</span>
										</div>
										<span style="clear:both;"></span>
										<br>
									{{ splat.alternateBeatName }} Experience: <input v-model="character.alternateExperience" /><br>
								</div>
							</div>

						</div>
						<div class="col col-sm-5">
							<health-component id="health" class="col-12" style="margin-bottom: 15px" :maxHealth="character.maxHealth" :healthTrack="character.healthTrack" name="Health">
								<i class="subtitle" style="margin-bottom: 5px" v-if="character.splat === EnumSplat.WEREWOLF">(EEE)</i>
							</health-component>

							<div id="willpower" class="col-12" style="margin-bottom: 15px">
								<h3 class="separator col-sm-12">Willpower</h3>
								<div class="sheet-dots" style="margin-top:-10px;">
									<button v-for="n in maxWillpower" :key="n" @click="setTrait('spentWillpowerDots', maxWillpower-n, {off:-1})" class="sheet-dot" :class="{'sheet-dot-full': maxWillpower-character.spentWillpowerDots >= n}"></button>
								</div>
								<div class="sheet-boxes" :style="{'margin-left': (character.spentWillpowerDots*-15)+'px'}" style="margin-top:-7px;">
									<button v-for="n in maxWillpower-character.spentWillpowerDots" :key="n" class="sheet-box" @click="setTrait('willpower', n)" :class="{'sheet-dot-full': character.willpower >= n}"></button>
								</div>							
							</div>
							<div v-if="splat && splat.powerTraitName" class="col-12" id="powerTrait" style="margin-bottom: 15px">
								<h3 class="separator col-sm-12">{{ splat.powerTraitName }}</h3>
								<div class="sheet-dots" style="margin-top:-10px;">
									<button v-for="n in 10" :key="n" class="sheet-dot" @click="setTrait('power', n, {min: 1})" :class="{'sheet-dot-full': character.power >= n}"></button>
								</div>
							</div>						
							<div v-if="splat && splat.fuelTraitName" class="col-12" id="fuelTrait" style="margin-bottom: 15px">
								<h3 class="separator col-sm-12">{{ splat.fuelTraitName }}</h3>
								<div class="sheet-boxes" style="margin-top:-10px;">
									<span v-for="n in maxFuel" :key="n">
										<button class="sheet-box" @click="setTrait('fuel', n)" :class="{'sheet-dot-full': character.fuel >= n}"></button>
										<br v-if="n%10===0">
									</span>
								</div>
							</div>
							<integrity-component v-if="splat && splat.integrityTraitName" :character="character" :splat="splat" class="col-12" id="integrityTrait" />
						
							<div class="col-12" v-if="character.splat===EnumSplat.WEREWOLF" style="color: black;" id="kuruth-triggers">
								<h3 class="separator col-sm-12">Kuruth Trigers</h3>
								<!-- <div class="row col-12"> -->
									<!-- <div style="color:black;" class="col-12"> -->
								Passive: <br>
								<input class="line" style="width:70%;" v-model="character.kuruthTriggers.passive"><br>
								Common: <br>
								<input class="line" style="width:70%;" v-model="character.kuruthTriggers.common"><br>
								Specific: <br>
								<input class="line" style="width:70%;" v-model="character.kuruthTriggers.specific">
									<!-- </div> -->
								<!-- </div> -->
							</div>
							
							<item-list class="col-12" name="Conditions" :items="character.conditions" :mutable="true"  />
						</div>
					</div>
				</div>

				<div id="werewolf-forms" class="row col w-100" v-if="character.splat===EnumSplat.WEREWOLF">
					<div v-for="(form) in splat.forms"
						:key="form" style="text-align:left;width:100%" class="col-sm">
						<h4 @click="character.currentForm = form.name.toLowerCase()" :class="{'form-active': currentForm.name.toLowerCase() === form.name.toLowerCase()}" class="separator col-sm-12">{{ form.name }}</h4>
						<i class="subtitle">({{ form.desc }})</i>
						
						<div>
							Strength: {{ character.attributes.strength         - currentForm.strengthMod     + form.strengthMod }}<br>
							Dexterity: {{ character.attributes.dexterity       - currentForm.dexterityMod    + form.dexterityMod }}<br>
							Stamina: {{ character.attributes.stamina           - currentForm.staminaMod      + form.staminaMod }}<br>
							Manipulation: {{ character.attributes.manipulation - currentForm.manipulationMod + form.manipulationMod }}<br>

							<br>

							Size: <input v-if="form.name==='Hishu'" v-model.number="sizeMinusForm" type="number" />
							<span v-else>{{ character.size - currentForm.sizeMod + form.sizeMod }}</span><br>
							Defense: {{ formDefense(form) }}<br>
							Initative: {{ initative - currentForm.dexterityMod + form.dexterityMod }}<br>
							<!-- Armor: <input v-model="character.armor" /><br> -->
							Speed: {{ character.speed - currentForm.strengthMod - currentForm.dexterityMod - currentForm.speedMod + form.strengthMod + form.dexterityMod + form.speedMod }}<br>
							Armor: {{ character.armor ? character.armor.general+"/"+character.armor.ballistic : "" }}<br>
							Perception: {{ perception - currentForm.perceptionMod + form.perceptionMod }} <br>
							<span v-if="form.name==='Gauru'">Kuruth Limit: {{ character.attributes.stamina - currentForm.staminaMod + character.power }}</span><br>

							<div style="line-height: 15px;" class="form-traits">
								<span v-for="(trait,i) in form.traits" :key="i">
									<br >
									<i class="subtitle" >{{trait}}</i>
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>


	</div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from "vue";

import { Splat, SPLATS, EnumSplat, Form } from "../definitions/Splat";
import Character, { Ability, Attributes } from "../definitions/Character";

import AbilityList from "@/components/sheetComponents/AbilityList.vue";
import HealthComponent from "@/components/sheetComponents/HealthComponent.vue";
import IntegrityComponent from "@/components/sheetComponents/IntegrityComponent.vue";
import ItemList from "@/components/sheetComponents/ItemList.vue";

// import fab from "vue-fab";

import deepmerge from "deepmerge";

// <div class="sheet-dots">
// 	<button @click="setAttr('intelligence', n)" v-for="n in attrMax" :key="n" class="sheet-dot"></button>
// </div>

interface CharacterViewData {
	characters: { [index: string]: Character };
	character: Character;
	attributeNames: string[][];
	skills: string[][];
	skillCats: {[index: string]: number};
	attributes: Attributes;
}

const x = defineComponent({
	name: "CharacterView",
	components: {
		"AbilityList": AbilityList,
		"HealthComponent": HealthComponent,
		"IntegrityComponent": IntegrityComponent,
		"ItemList": ItemList,
		// "fab": fab
	},
	computed: {
		id (): string {
			return this.$route.params.id as string;
		},
		splat (): Splat {
			// console.log(EnumSplat[this.character.splat]);
			return SPLATS[this.character.splat];
		},
		// attributes(): Attributes {
		// 	return {
		// 		intelligence: this.character.attributes.intelligence,
		// 		wits: this.character.attributes.wits,
		// 		resolve: this.character.attributes.resolve,

		// 		strength : this.character.attributes.strength  + this.getNum("this.currentForm.strengthMod") + this.getNum("this.character.abilities.vigor.level"),
		// 		dexterity: this.character.attributes.dexterity + this.getNum("this.currentForm.dexterityMod"),
		// 		stamina  : this.character.attributes.stamina   + this.getNum("this.currentForm.staminaMod")  + this.getNum("this.character.abilities.resilience.level"),

		// 		presence: this.character.attributes.presence,
		// 		manipulation: this.character.attributes.manipulation + this.getNum("this.currentForm.manipulationMod"),
		// 		composure: this.character.attributes.composure,
		// 	};
		// },		
		attrMax() {
			// console.log(this.splat);
			return (this as any).character.power > 5 ? ((this as any).character as Character).power : 5;
		},
		maxWillpower() {
			return (this as any).character.attributes.resolve + (this as any).character.attributes.composure;
		},
		// defense() {
		// 	return Math.min((this as any).character.attributes.dexterity, (this as any).character.attributes.wits) + ((this as any).character.skills.athletics || 0);
		// },
		initative() {
			return (this as any).character.attributes.dexterity + (this as any).character.attributes.composure;
		},
		maxFuel() {
			const character: Character = this.character;
			return character.power === 0 ? (this as any).character.splat === EnumSplat.VAMPIRE ? (this as any).attributes.stamina : 0 : character.power >= 5 ? character.power >= 9 ? character.power === 10 ? 75 : (50) : (10 + (character.power-4)*5) : (10 + character.power - 1);
		},
		perception() {
			return (this as any).character.attributes.resolve+(this as any).character.attributes.composure+((this as any).currentForm.perceptionMod || 0);
		},
		// abilities(): {[index: string]: Ability} {
		// 	const character: Character = this.character;
		// 	const obj: {[index: string]: Ability} = {};
		// 	// character.abilityArr.forEach(el => {
		// 	// 	obj[el.name.toLowerCase()] = {level: el.level, name: el.name};
		// 	// });
		// 	return obj;
		// },
		currentForm(): Form {
			return (this as any).splat.forms && (this as any).character.currentForm ? (this as any).splat.forms[(this as any).character.currentForm] : {
				name: "",
				desc: "",
				dexterityMod: 0,
				manipulationMod: 0,
				perceptionMod: 0,
				sizeMod: 0,
				staminaMod:0,
				strengthMod:0,
				speedMod: 0,
				traits: []
			};
		}
	},
	methods: {
		setAttr(attr: string, val: number) {
			const character: Character = (this as any).character;

			// if (!character.attributes)
			// 	(character.attributes as any) = {};

			(character.baseAttributes as any)[attr] = ((character.attributes as any)[attr] === val && val !== 1) ? val-1 : val;
		},
		setSkill(attr: string, val: number) {
			const character: Character = (this as any).character;

			if (!character.skills)
				character.skills = {};


			// console.log(character.skills);

			character.skills[attr] = (character.skills[attr] === val) ? val-1 : val;
			// console.log(character.skills);

		},
		setTrait(trait: string, val: number, opts: {off?: number; min?: number}) {
			const character: any = (this as any).character;

			// eslint-disable-next-line prefer-const
			let {off, min} = opts || {};

			off = off || 1;

			character[trait] = (character[trait] === val) ? val-off : val;
			
			// console.log(character[trait], min);
			character[trait] = Math.max(min || 0, character[trait]);
		},
		toggleRoteSkill(skill: string) {
			const roteSkills = this.character.roteSkills; 
			if (roteSkills.includes(skill)) {
				roteSkills.splice(roteSkills.indexOf(skill), 1);
			} else { 
				roteSkills.push(skill);
			}
		},
		getNum(val: string): number {
			try {
				return eval(val) || 0;
			} catch(e) {
				return 0;
			}
		},
		formDefense(form: Form) {
			return Math.min((this as any).character.attributes.dexterity - (this as any).currentForm.dexterityMod + form.dexterityMod, (this as any).character.attributes.wits) + ((this as any).character.skills.athletics || 0);
			// return (this as any).character.defense - (this as any).currentForm.dexterityMod + form.dexterityMod;
		},
	},
	data() {
		return {
			characters: null as any,
			character: null as any,
			sizeMinusForm: null as any,
			EnumSplat,

			attributeNames: [
				["intelligence", "wits"        , "resolve"],
				["strength"    , "dexterity"   , "stamina"],
				["presence"    , "manipulation", "composure"],
			],
			skills: [
				["academics", "computer", "crafts", "investigation", "medicine", "occult", "politics", "science"],
				["athletics", "brawl", "drive", "firearms", "larceny", "stealth", "survival", "weaponry"],
				["animal_ken", "empathy", "expression", "intimidation", "persuasion", "socialize", "streetwise", "subterfuge"],
			],
			skillCats: {"mental": -3, "physical": -1, "social": -1}
		};
	},
	beforeMount() {
		(window as any).vue = this;
		this.characters = JSON.parse(localStorage.characters) || {};

		this.character = this.characters[this.id];
		// const blankChara = new Character({splat: this.character.splat});

		// this.character = Object.assign({}, blankChara, this.character);

		// this.character = toRefs(new Character(this.character));
		this.character = new Character(this.character);

		// this.character.abilityArr = Object.values(this.abilities);

		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this;
		this.sizeMinusForm = computed({
			get() {
				return self.character.size - self.currentForm.sizeMod;	
			},
			set(val) {
				self.character.size = val;
			}
		});

		this.characters[this.id] = this.character;
	},
	watch: {
		characters: {
			handler(newVal, oldVal) {
				// (this as any).characters[(this as any).id] = newVal;
				localStorage.characters = JSON.stringify(newVal);
			},
			deep: true,
		}
		// attrMax: function(newVal, oldVal) {
		// 	if (newVal > 5) {
		// 		$(".sheet-dot").attr("11");
		// 	} 
		// }
		// $route: function(newRoute): any {
		// }
	},
});

export default x;
</script>

<style lang="scss">

$xs-max: 575.98px;
$sm-min: 576px;
$sm-max: 767.98px;

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
}

.block {
	text-align: left;
	overflow: hidden;

	width: 100%;

	margin-bottom: 15px;

	@media (max-width: $xs-max) {
		margin: auto;
		margin-top: 15px;
		width: 60%;
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

	margin-top: 0px;
	// margin-bottom: 15px;
}

.block .sheet-dots {
	float: right;
}

button.sheet-dot {
	-moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    border-radius: 50%;
}

button.sheet-dot-full {
	background: $accent;
}

.sheet-dot,
.sheet-box {
	$radius: 15px;

    width: $radius;
    height: $radius;

    padding: 0;
    border: solid 1px #000000;
    line-height: 11px;
    background-color: #efefef;

	margin-right: 1px;
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

button.sheet-dot-small {
	$radius: 12px;

	width: $radius;
	height: $radius;
}

#minorTraits {
	font-size: 14.2pt;
}

.subtitle {
	margin-top:-13px;
	// margin-bottom:-10px;
	display:block;
	text-align:center;

	font-size: 8pt;

	color: black;
}

</style>