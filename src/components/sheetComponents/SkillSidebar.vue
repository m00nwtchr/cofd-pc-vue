<!-- eslint-disable vue/no-mutating-props -->
<template>
	<div id="skills">
		<h2 class="separator col-sm-12" style="margin-bottom: 20px">{{ $t("character.skills") }}</h2>
		<div v-for="(cat, i) in SKILLS" :key="i" class="block col col-12">
			<h3 class="separator">
				{{
					$t(`character.cat.${Object.keys(skillCats)[i]}`)
				}}
			</h3>

			<div class="cat-subheader">
				<span style="font-size:8pt;line-height:8pt;text-align:left;width:33.33333%;">
					<span v-if="(character instanceof MageCharacter)">
					Rote<br>
					Skill
					</span>
				</span>
				<span style="font-size:10pt;text-align:center;width:33.33333%;">({{ Object.values(skillCats)[i] }} unskilled)</span>
				<span style="width:33.33333%;"></span>
			</div>

			<div style="text-transform: capitalize" v-for="skill in cat" :key="skill">
				<button
					v-if="(character instanceof MageCharacter)"
					class="sheet-box"
					:class="{
						'sheet-dot-full': character.roteSkills.includes(
							skill
						)
					}"
					@click="character.roteSkills.includes(skill) ?
						character.roteSkills.splice(character.roteSkills.indexOf(skill)) :
						character.roteSkills.push(skill)
					"
				></button>

				<span
					:class="{
						selected: store.state.selectedTraits[skill] !== undefined,
						specialties:
						character.specialties[skill] &&
						character.specialties[skill].length > 0
					}"
					@click="$emit('selectSkill', skill, character.skills)"
				>{{ $t(`character.skill.${skill}`) }}</span>

				<button class="dropdown-toggle material-icons" @click="specialtyDropDown(skill)">
					<font-awesome-icon icon="caret-down" v-if="specialtyDropSelect === skill"/>
					<font-awesome-icon icon="caret-right" v-else />
				</button>

				<sheet-dots v-model="character.skills[skill]" :maxValue="dotAttrMax" />

				<item-list
					v-if="specialtyDropSelect === skill"
					class="col-12"
					:items="character.specialties[skill]"
					:mutable="true"
				/>
			</div>
		</div>
		<br>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Character, MageCharacter, EnumSplat, ATTRIBUTES, SKILLS, HasSkills } from "../../definitions";

import { useStore } from "../../store";

import ItemList from "./ItemList.vue";
import SheetDots from "./SheetDots.vue";

export default defineComponent({
	name: "SkillSidebar",
	components: {
		ItemList,
		SheetDots
	},
	emits: ["selectSkill"],
	props: {
		"character": {
			required: true,
			type: Object as PropType<Character & HasSkills>
		}
	},
	data: () => ({
		store: useStore(),

		SKILLS, ATTRIBUTES, EnumSplat,
		skillCats: { mental: -3, physical: -1, social: -1 } as {
			[key: string]: number;
		},
		specialtyDropSelect: null as string | null,
		MageCharacter
	}),
	methods: {
		specialtyDropDown(skill: string) {
			if (this.specialtyDropSelect === skill) {
				if (
					this.character.specialties[skill] &&
					this.character.specialties[skill].length === 0
				) {
					delete this.character.specialties[skill];
				}

				this.specialtyDropSelect = null;
			} else {
				if (!this.character.specialties[skill]) {
					// eslint-disable-next-line vue/no-mutating-props
					this.character.specialties[skill] = [];
				}

				this.specialtyDropSelect = skill;
			}
		},
		setSkill(attr: string, val: number) {
			if (!this.character.skills) this.character.skills = {};

			// console.log(character.skills);

			this.character.skills[attr] =
				this.character.skills[attr] === val ? val - 1 : val;
			// console.log(character.skills);
		},
	},
	computed: {
		dotAttrMax() {
			return this.$parent.dotAttrMax;
		},
	}
});
</script>

<style lang="scss" scoped>
.cat-subheader {
	display: flex;
	flex-flow: row wrap;
	font-style: italic;
	font-weight: normal;
}
.dropdown-toggle svg {
	width: 7px;
	margin-top: 3px;
	height: 15px;
}
</style>