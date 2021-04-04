<template>
	<div class="row">
		<div class="col-6">
			<div>
				<h5>Spell Details</h5>

				Arcanum:
				<select style="" v-model="arcanum">
					<option v-for="(entry) in arcana" :key="entry[0]" :value="entry[0]">{{ entry[1].name }}</option>
				</select><br>
				Level:
				<input type="number" style="width:60px" v-model.number="level">
				<br>

				Primary factor:
				<select v-model="primaryFactor">
					<option value="potency">Potency</option>
					<option value="duration">Duration</option>
				</select><br>
				<span style="font-size:8pt;font-style:italic;">Changing the primary factor costs 1 Reach</span>
				<br>
				Dice Mod: 
				<input type="number" style="width:60px" v-model.number="diceMod"><br>
				Withstand: 
				<input type="number" style="width:60px" v-model.number="withstand"><br>

			</div>
			<div>
				<h5>Paradox</h5>

				Paradox rolls (scene): 
				<input type="number" style="width:60px" v-model.number="paradoxRolls"><br>
				Sleeper Witnesses:
				<select v-model="sleepers">
					<option value="one">One</option>
					<option value="one">One</option>
					<option value="one">One</option>
				</select><br>
				Mana spent: 
				<input type="number" style="width:60px" v-model.number="manaSpent"><br>
				Ded. magical tool: 
				<input type="checkbox" style="width:60px" v-model="dedMagicalTool"><br>
				Paradox Mod.:
				<input type="number" style="width:60px" v-model.number="paradoxMod"><br>
				<br>
			</div>			
		</div>
		<div class="col-6">
			<div>
				<h5>Spell Factors</h5>

				Potency:
				<input type="number" style="width:60px" v-model.number="potency">
				/{{ freePotency }}
				<br>

				Duration:
				<select v-model="sleepers">
					<option value="one">One</option>
					<option value="one">One</option>
					<option value="one">One</option>
				</select><br>

				Scale:
				<select v-model="sleepers">
					<option value="one">One</option>
					<option value="one">One</option>
					<option value="one">One</option>
				</select><br>

				Casting Time:
				<select v-model="sleepers">
					<option value="one">One</option>
					<option value="one">One</option>
					<option value="one">One</option>
				</select><br>

				Range:
				<select v-model="sleepers">
					<option value="one">One</option>
					<option value="one">One</option>
					<option value="one">One</option>
				</select><br>

				Reach Mod:
				<input type="number" style="width:60px" v-model.number="reachMod"><br>

				Mana Mod:
				<input type="number" style="width:60px" v-model.number="manaMod"><br>

				Reach: {{ reach }}/{{ freeReach }}<br>

				{{dicePool}}

			</div>
		</div>		
	</div>
</template>

<script lang="ts">
/* eslint-disable vue/no-mutating-props */

import Character, { Ability } from "@/definitions/Character";
import { EnumSplat, SPLATS } from "../../definitions/Splat";


import { defineComponent } from "vue";

export default defineComponent({
	name: "SpellCalculator",
	props: {
		character: {
			required: true,
			type: Object
		}
	},
	data() {
		return {
			arcanum: "death",
			level: 1,
			primaryFactor: "potency",
			diceMod: 0,
			withstand: 0,

			paradoxRolls: 0,
			sleepers: "one",
			manaSpent: 0,
			dedMagicalTool: false,
			paradoxMod: 0,

			potency: 0,

			reachMod: 0,
			manaMod: 0,

			EnumSplat,
			SPLATS
		};
	},
	created() {
		this.level = this.arcanumLevel;
		// this.$parent.$on("e", () => {

		// });
	},
	mounted() {
		this.arcanum = this.arcana[0][0];
	},

	methods: {
		// calculateSpell() {
			
		// }
	},
	computed: {
		arcana() {
			const self = this as any;
			return Object.entries((self.character as Character).abilities).filter(entry => entry[1] && entry[1].level > 0);
		},
		arcanumLevel() {
			const self = this as any;

			return self.character.abilities[self.arcanum].level;
		},
		freePotency() {
			const self = this as any;


			return self.primaryFactor === "potency" ? self.arcanumLevel+1 : 1;
		},
		freeReach() {
			const self = this as any;

			return self.arcanumLevel-self.level+1;
		},
		reach() {
			const self = this as any;

			return self.reachMod;
		},
		manaNeeded() {
			const self = this as any;

			return self.manaSpent + self.manaMod;
		},
		dicePool() {
			const self = this as any;

			const potencyMod = self.freePotency - self.potency;

			return self.character.power + self.arcanumLevel + self.diceMod + (potencyMod < 0 ? potencyMod*2 : 0);
		},
		paradoxPool() {
			const self = this as any;

			return (self.reach - self.freeReach);
		}
	},
	watch: {
		primaryFactor() {
			this.potency = this.freePotency;
		},
		arcanum() {
			this.potency = this.freePotency;

			if (this.arcanumLevel == 0) {
				this.level = 0;
			} else {
				this.level = 1;
			}
		},
		level() {
			if (this.level > this.arcanumLevel) {
				this.level = this.arcanumLevel;
			} else if (this.level <= 0) {
				this.level = this.arcanumLevel == 0 ? 0 : 1;
			}
		}
	}
});
</script>

<style lang="scss" scoped>
h5 {
	text-align: center;
}
</style>