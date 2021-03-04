<template>
	<div>
		<header class="col-12">
			<div>{{ character.name }}</div>
		</header>
		<div class="charsheet" :class="{
			['charsheet-'+(EnumSplat && EnumSplat[character.splat]).toLowerCase()]: true
		}">
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
				<div class="row col-sm-10">
					<div v-for="i in attributes.length" :key="i" class="block col-sm-4">
						<span style="text-transform: capitalize" v-for="j in attributes[i-1].length" :key="j">
							{{ attributes[i-1][j-1] }}
							<div class="sheet-dots">
								<button @click="setAttr(attributes[i-1][j-1], n)" v-for="n in attrMax" :key="n" :class="{'sheet-dot':true,'sheet-dot-full':character.attributes[attributes[i-1][j-1]]>=n,'sheet-dot-small':attrMax>5}"></button>
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
						<i class="col-12" style="margin-top:-5px;margin-bottom:-10px;display:block;text-align:center;">({{ Object.values(skillCats)[i] }} unskilled)</i><br>

						<div style="font-style: italic;font-size: 10px;line-height: 10px;" v-if="character.splat === EnumSplat.MAGE">
							Rote<br/>Skill
						</div>
						<span style="text-transform: capitalize" v-for="skill in cat" :key="skill">
							<button v-if="character.splat === EnumSplat.MAGE" @click="toggleRoteSkill(skill)" class="sheet-box" :class="{'sheet-dot-full': character.splatTraits[character.splat].roteSkills.includes(skill)}"></button>
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

							<ability-list v-if="splat && splat.abilityName" :abilityArr="character.splatTraits[character.splat].abilities" :optionsMutable="!splat.finiteAbilities" :abilityName="splat.abilityName" id="ability" class="block" />

							<ability-list :abilityArr="character.merits" abilityName="Merits" id="merits" class="block" />

							<div id="minorTraits" class="block col col-12">
								Size: <input v-model.number="character.size" type="number" /><br>
								Speed: {{ speed }}<br>
								Defense: {{ defense }}<br>
								<!-- Armor: <input v-model="character.armor" /><br> -->
								Armor: {{ character.armor ? character.armor.general+"/"+character.armor.ballistic : "" }}<br>
								Initative Mod: {{ initative }}<br>
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
							<div id="health" class="" style="margin-bottom: 15px">
								<h3 class="separator col-sm-12">Health</h3>
								<div class="sheet-dots" style="margin-top:-10px;">
									<button v-for="n in maxHealth" :key="n" class="sheet-dot" :class="{'sheet-dot-full': true}"></button>
								</div>
								<div class="sheet-boxes" style="margin-top:-7px;">
									<button v-for="n in maxHealth" :key="n" class="sheet-box" :class="{'sheet-dot-full': true}"></button>
								</div>
							</div>
							<div id="willpower" style="margin-bottom: 15px">
								<h3 class="separator col-sm-12">Willpower</h3>
								<div class="sheet-dots" style="margin-top:-10px;">
									<button v-for="n in maxWillpower" :key="n" @click="setTrait('spentWillpowerDots', maxWillpower-n, {off:-1})" class="sheet-dot" :class="{'sheet-dot-full': maxWillpower-character.spentWillpowerDots >= n}"></button>
								</div>
								<div class="sheet-boxes" :style="{'margin-left': (character.spentWillpowerDots*-15)+'px'}" style="margin-top:-7px;">
									<button v-for="n in maxWillpower-character.spentWillpowerDots" :key="n" class="sheet-box" @click="setTrait('willpower', n)" :class="{'sheet-dot-full': character.willpower >= n}"></button>
								</div>							
							</div>
							<div v-if="splat && splat.powerTraitName" id="powerTrait" style="margin-bottom: 15px">
								<h3 class="separator col-sm-12">{{ splat.powerTraitName }}</h3>
								<div class="sheet-dots" style="margin-top:-10px;">
									<button v-for="n in 10" :key="n" class="sheet-dot" @click="setTrait('power', n, {min: 1})" :class="{'sheet-dot-full': character.power >= n}"></button>
								</div>
							</div>						
							<div v-if="splat && splat.fuelTraitName" id="fuelTrait" style="margin-bottom: 15px">
								<h3 class="separator col-sm-12">{{ splat.fuelTraitName }}</h3>
								<div class="sheet-boxes" style="margin-top:-10px;">
									<span v-for="n in maxFuel" :key="n">
										<button class="sheet-box" @click="setTrait('fuel', n)" :class="{'sheet-dot-full': character.fuel >= n}"></button>
										<br v-if="n%10===0">
									</span>
								</div>
							</div>
							<div v-if="splat && splat.integrityTraitName" id="integrityTrait">
								<h3 class="separator col-sm-12">{{ splat.integrityTraitName }}</h3>
								<div class="sheet-dots" style="margin-top:-10px;">
									<button v-for="n in 10" :key="n" class="sheet-dot" @click="setTrait('integrityTrait', n)" :class="{'sheet-dot-full': character.integrityTrait >= n}"></button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

import { Splat, SPLATS, EnumSplat } from "../definitions/Splat";
import Character from "../definitions/Character";

import AbilityList from "@/components/sheetComponents/AbilityList.vue";

// <div class="sheet-dots">
// 	<button @click="setAttr('intelligence', n)" v-for="n in attrMax" :key="n" class="sheet-dot"></button>
// </div>

interface CharacterViewData {
	characters: { [index: string]: Character };
	character: Character;
	attributes: string[][];
	skills: string[][];
	skillCats: {[index: string]: number};
}

export default defineComponent({
	name: "CharacterView",
	components: {
		"AbilityList": AbilityList
	},
	computed: {
		id: function (): string {
			return this.$route.params.id as string;
		},
		splat: function (): Splat {
			console.log(EnumSplat[this.character.splat]);
			return SPLATS[this.character.splat];
		},
		attrMax: function() {
			console.log(this.splat);
			return (this as any).character.power > 5 ? ((this as any).character as Character).power : 5;
		},
		maxHealth: function() {
			const character: Character = this.character;
			console.log(character);
			return character && character.attributes.stamina + (character.size as number);
		},
		maxWillpower: function() {
			const character: Character = this.character;
			return character.attributes.resolve + character.attributes.composure;
		},		
		speed: function() {
			const character: Character = this.character;
			return character.attributes.strength + character.attributes.dexterity + 5;
		},
		defense: function() {
			const character: Character = this.character;
			return Math.min(character.attributes.dexterity, character.attributes.wits) + (character.skills.athletics || 0);
		},
		initative: function() {
			const character: Character = this.character;
			return character.attributes.dexterity + character.attributes.composure;
		},
		maxFuel: function() {
			const character: Character = this.character;
			return character.power === 0 ? (this as any).character.splat === EnumSplat.VAMPIRE ? character.attributes.stamina : 0 : character.power >= 5 ? character.power >= 9 ? character.power === 10 ? 75 : (50) : (10 + (character.power-4)*5) : (10 + character.power - 1);
		}
	},
	methods: {
		setAttr: function(attr: string, val: number) {
			const character: Character = (this as any).character;

			if (!character.attributes)
				(character.attributes as any) = {};

			character.attributes[attr] = (character.attributes[attr] === val && val !== 1) ? val-1 : val;
		},
		setSkill: function(attr: string, val: number) {
			const character: Character = (this as any).character;

			if (!character.skills)
				character.skills = {};


			console.log(character.skills);

			character.skills[attr] = (character.skills[attr] === val) ? val-1 : val;
			console.log(character.skills);

		},
		setTrait: function(trait: string, val: number, opts: {off?: number; min?: number}) {
			const character: any = (this as any).character;

			// eslint-disable-next-line prefer-const
			let {off, min} = opts || {};

			off = off || 1;

			character[trait] = (character[trait] === val) ? val-off : val;
			
			console.log(character[trait], min);
			character[trait] = Math.max(min || 0, character[trait]);
		},
		toggleRoteSkill: function(skill: string) {
			const roteSkills = this.character.splatTraits[EnumSplat.MAGE].roteSkills; 
			if (roteSkills.includes(skill)) {
				roteSkills.splice(roteSkills.indexOf(skill), 1);
			} else { 
				roteSkills.push(skill);
			}
		}
	},
	data() {
		return {
			characters: null as any,
			character: null as any,

			EnumSplat,

			attributes: [
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
		} as CharacterViewData;
	},
	beforeMount() {
		(window as any).vue = this;
		this.characters = JSON.parse(localStorage.characters) || {};
		this.character = this.characters[this.id];
		console.log(this.character);
	},
	watch: {
		characters: {
			handler(newVal, oldVal) {
				// (this as any).characters[(this as any).id] = newVal;
				localStorage.characters = JSON.stringify(newVal);
			},
			deep: true,
		},
		maxHealth: function() {
			// const delIs: number[] = [];
			// this.character.healthTrack.forEach((v,i) => {
			// 	if (i > this.maxHealth) {
			// 		delIs.push(i);
			// 	}
			// });
			if (this.character.healthTrack.length < this.maxHealth) {
				for (let iii = this.character.healthTrack.length; iii < this.maxHealth; iii++) {
					this.character.healthTrack.push(0);
				}
			}
			// delIs.forEach((v) => {
			// 	delete this.character.healthTrack[v];
			// });
			console.log(this.character.healthTrack.length);
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

</style>