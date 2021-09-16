<template>
<div id="skills" >
					<h2 class="separator col-sm-12" style="margin-bottom: 20px">
						{{ $t("character.skills") }}
					</h2>
					<div
						v-for="(cat, i) in SKILLS"
						:key="cat"
						class="block col col-12"
					>
						<h3 class="separator">
							{{
								$t(`character.cat.${Object.keys(skillCats)[i]}`)
							}}
						</h3>
						<i class="col-12 subtitle"
							>({{ Object.values(skillCats)[i] }} Unskilled)</i
						><br />

						<div
							style="font-style: italic; font-size: 10px; line-height: 10px"
							v-if="character.splat === EnumSplat.MAGE"
						>
							Rote<br />Skill
						</div>
						
						<span
							style="text-transform: capitalize"
							v-for="skill in cat"
							:key="skill"
						>
						
							<!-- <button v-if="character.splat === EnumSplat.MAGE" @click="toggleRoteSkill(skill)" class="sheet-box" :class="{'sheet-dot-full': character.roteSkills.includes(skill)}"></button> -->
							<button
								v-if="character.splat === EnumSplat.MAGE"
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
									// selected: $store.state.selectedTraits[skill] !== undefined,
									// specialties:
										// character.specialties[skill] &&
										// character.specialties[skill].length > 0
								}"
								@click="$emit('selectSkill', skill, character.skills)"
							>
								{{ $t(`character.skill.${skill}`) }}
							</span>

							<button
								class="dropdown-toggle material-icons"
								@click="specialtyDropDown(skill)"
							>
								<span v-if="specialtyDropSelect === skill"
									>arrow_drop_down</span
								>
								<span v-else>arrow_right</span>
							</button>

							<div class="sheet-dots">
								<button
									@click="setSkill(skill, n)"
									v-for="n in dotAttrMax"
									:key="n"
									class="sheet-dot"
									:class="{
										'sheet-dot-full':
											character.skills[skill] >= n,
										'sheet-dot-small': dotAttrMax > 5
									}"
								></button>
							</div>
							<br />

							<item-list
								v-if="specialtyDropSelect === skill"
								class="col-12"
								:items="character.specialties[skill]"
								:mutable="true"
							/>
						</span>
					</div>
					<br />
				</div>
</template>

<script lang="ts">
import { defineComponent, unref , isRef} from "vue";
import { EnumSplat, } from "../../definitions/Splat";

import ItemList from "./ItemList.vue";

import Character, {
	ATTRIBUTES,
	SKILLS
} from "../../definitions/Character";
export default defineComponent({
	name: "SkillSidebar",
	components: {
		ItemList
	},
	props: {
		"character": {
			required: true,
			type: Object
		}
	},
	data: () => ({
		SKILLS, ATTRIBUTES, EnumSplat,
		skillCats: { mental: -3, physical: -1, social: -1 } as {
			[index: string]: number;
		},
		specialtyDropSelect: null as string | null,

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
					this.character.specialties[skill] = [];
				}

				this.specialtyDropSelect = skill;
			}
		},
		setSkill(attr: string, val: number) {
			const character: Character = this.character;

			if (!character.skills) character.skills = {};

			// console.log(character.skills);

			character.skills[attr] =
				character.skills[attr] === val ? val - 1 : val;
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
</style>