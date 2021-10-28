<template>
	<div id="werewolf-forms" class="row w-100">
		<div
			v-for="(form,key) in character.forms"
			:key="key"
			style="text-align: left; width: 100%"
			class="col-sm"
		>
			<h4
				@click="character.data.set('currentForm', key)"
				:class="{
					'form-active': character.data.get('currentForm') === key
				}"
				class="separator col-sm-12"
			>{{ form.name }}</h4>
			<i class="subtitle">({{ $t(form.desc) }})</i>

			<div>
				<span
					v-for="attr in ATTRIBUTES.flat().filter(el => [
						'strength',
						'dexterity',
						'stamina',
						'manipulation'
					].includes(el) || form[el + 'Mod'] !== 0)"
					:key="attr"
				>
					{{
						$t("character.attribute." + attr)
					}}
					<!--
					-->
					{{ formatNum(form[attr + "Mod"]) }}:
					<span class="default-font">
						{{
							character.attributes[attr] -
								character.currentForm[attr + "Mod"] +
								form[attr + "Mod"]
						}}
					</span>
					<br>
				</span>

				<br>
				{{
					$t("character.trait.size")
				}}
				<!--
				-->
				{{ formatNum(form.sizeMod) }}:
				<input
					v-if="key === 'hishu'"
					v-model.number="sizeMinusForm"
					type="number"
				/>
				<span class="default-font" v-else>
					{{
						character.size - character.currentForm.sizeMod + form.sizeMod
					}}
				</span>
				<br>
				{{
					$t("character.trait.defense")
				}}
				<!--
				-->
				{{ formatNum(formDefenseMod(form)) }}:
				<span class="default-font">{{ formDefense(form) }}</span>
				<br>
				{{
					$t("character.trait.initative")
				}}
				<!--
				-->
				{{
					formatNum(
						form.dexterityMod +
						form.composureMod -
						character.forms["hishu"].dexterityMod -
						character.forms["hishu"].composureMod
					)
				}}:
				<span
					class="default-font"
				>
					{{
						character.initative -
							character.currentForm.dexterityMod -
							character.currentForm.composureMod +
							form.dexterityMod +
							form.composureMod
					}}
				</span>
				<br>

				<!-- Armor: <input v-model="character.armor" /><br> -->
				{{
					$t("character.trait.speed")
				}}
				<!--
				-->
				{{ formatNum(form.speedMod + form.strengthMod + form.dexterityMod) }}:
				<span
					class="default-font"
				>
					{{
						character.speed -
							character.currentForm.strengthMod -
							character.currentForm.dexterityMod -
							character.currentForm.speedMod +
							form.strengthMod +
							form.dexterityMod +
							form.speedMod
					}}
				</span>
				<br>
				{{ $t("character.trait.armor") }}:
				<span class="default-font">
					{{
						`${character.armor.general -
							character.currentForm.armorMod.general +
							form.armorMod.general}/${character.armor
								.ballistic -
							character.currentForm.armorMod.ballistic +
							form.armorMod.ballistic}`
					}}
				</span>
				<br>
				{{
					$t("character.trait.perception")
				}}
				<!--
				-->
				{{ formatNum(form.perceptionMod + form.witsMod + form.composureMod) }}:
				<span
					class="default-font"
				>
					{{
						character.perception -
							character.currentForm.perceptionMod +
							form.perceptionMod
					}}
				</span>
				<br>

				<span v-if="form.name === 'Gauru'">
					Kuruth Limit:
					<span class="default-font">
						{{
							character.attributes.stamina -
								character.currentForm.staminaMod +
								character.power
						}}
					</span>
				</span>
				<br>

				<div style="line-height: 15px" class="form-traits">
					<span v-for="(trait, i) in form.traits" :key="i">
						<br>
						<i class="subtitle">{{ trait }}</i>
					</span>
				</div>
			</div>
		</div>
	</div>

	<div class="row">
		<div class="col-sm-4">
			<h2 class="separator col-sm-12" style="margin-bottom: 20px;">Totem</h2>
		</div>
		<div class="col-sm-8">
			<h2 class="separator col-sm-12" style="margin-bottom: 20px;">Gifts and Rites</h2>

			<div class="row" style="margin-bottom: 10px">
				<ability-list
					class="col-12"
					:character="character"
					:abilities="character.moonGifts"
					abilityName="Moon Gifts"
					translationKey="splat.werewolf.gift.moon."
					:optionsMutable="true"
					:length="2"
					:horizontal="true"
				/>
			</div>
			<div class="row col-sm-12">
				<div class="col-sm-6">
					<h4 class="separator">Shadow Gifts</h4>
					<item-list 
						class="col-12" 
						:items="character.shadowGifts" 
						:mutable="true"

						:min="Math.max(character.shadowGifts.length, character.wolfGifts.length)+1"
					/>
				</div>
				<div class="col-sm-6">
					<h4 class="separator">Wolf Gifts</h4>
					<item-list 
						class="col-12" 
						:items="character.wolfGifts" 
						:mutable="true" 
					
						:min="Math.max(character.shadowGifts.length, character.wolfGifts.length)+1"
					/>
				</div>
			</div>
			<div class="row col-sm-12">
				<h4 class="separator">Rites</h4>
				<item-list class="col-12" :items="character.rites" :mutable="true" :cols="2" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Character, WerewolfCharacter, ATTRIBUTES, Form } from "../../definitions";
import { defineComponent, PropType } from "vue";

import { useStore } from "../../store";

import AbilityList from "./AbilityList.vue";
import ItemList from "./ItemList.vue";

export default defineComponent({
	name: "WerewolfTraits",
	components: {
		AbilityList,
		ItemList
	},
	props: {
		"character": {
			required: true,
			type: Object as PropType<WerewolfCharacter>,
		}
	},
	data: () => ({
		store: useStore(),

		ATTRIBUTES,
	}),
	methods: {
		formatNum(num: number): string {
			return num !== 0 ? `(${num > 0 ? "+" : ""}${num})` : "";
		},
		formDefense(form: Form) {
			if (!(this.character instanceof WerewolfCharacter)) return 0;

			return (
				(form.defenseCalcMax ? Math.max : Math.min)(
					this.character.attributes.dexterity -
					this.character.currentForm.dexterityMod +
					form.dexterityMod,
					this.character.attributes.wits -
					this.character.currentForm.witsMod +
					form.witsMod
				) +
				(this.character.skills.athletics || 0) +
				(this.character.mod("defense") -
					(this.character.currentForm.defenseMod || 0) +
					(form.defenseMod || 0))
			);
			// return (this as any).character.defense - (this as any).currentForm.dexterityMod + form.dexterityMod;
		},
		formDefenseMod(form: Form) {
			if (!(this.character instanceof WerewolfCharacter)) return 0;

			const hishu = this.character.forms["hishu"];
			let sub = 0;

			const dexterity = this.character.attributes.dexterity - this.character.currentForm.dexterityMod + form.dexterityMod;
			const wits = this.character.attributes.wits - this.character.currentForm.witsMod + form.witsMod;

			const res = (form.defenseCalcMax ? Math.max : Math.min)(dexterity, wits);

			if (res == dexterity) {
				sub = form.dexterityMod;
			} else if (res == wits) {
				sub = form.witsMod;
			}

			return this.formDefense(form) - this.formDefense(hishu) -
				sub;
			// return form.defenseMod;
		},

	},
	computed: {
		sizeMinusForm: {
			get() {
				return this.character.size - this.character.currentForm.sizeMod;
			},
			set(val: number) {
				this.character.size = val;
			}
		},
	}
});
</script>
<style lang="scss">
#werewolf-forms {
	padding-left: 30px;
	// background-image: url('../assets/images/werewolf-forms.webp');
	background-repeat: no-repeat;
	background-origin: content-box;
	background-size: contain;
	background-position: center;

	font-size: 11pt;
}
</style>