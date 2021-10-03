<template>
	<div>
		<div class="col-sm-4">
			<item-list
				id="activeSpells"
				class="col-12"
				name="Active Spells"
				:items="character.activeSpells"
				:mutable="true"
				:min="10 || character.power"
				style="margin-bottom: 15px"
			/>
			<item-list
				id="yantras"
				class="col-12"
				name="yantras"
				:items="character.yantras"
				:mutable="true"
				style="margin-bottom: 15px"
				:min="5"
			/>
			<item-list
				id="tools"
				class="col-12"
				name="magical tools"
				:items="character.magicalTools"
				:mutable="true"
				style="margin-bottom: 15px"
				:min="5"
			/>
			<item-list
				id="praxes"
				class="col-12"
				name="praxes"
				:items="character.praxes"
				:mutable="true"
				style="margin-bottom: 15px"
				:min="12"
			/>
			<item-list
				id="inuredSpells"
				class="col-12"
				name="inured spells"
				:items="character.inuredSpells"
				:mutable="true"
				style="margin-bottom: 15px"
				:min="10"
			/>
		</div>

		<div class="col-sm-8">
			<object-list 
				name="Rotes" 
				:items="character.rotes" 
				:itemFactory="Rote"
				:col-sizes="['2', '1', '5', '2', '2']"
				:min="12"
			>
			</object-list>
			<item-list name="Nimbus" class="w-100" :items="character.nimbus" :min="6" :mutable="true"></item-list>
			<div class="w-100 row">
				<div class="col-6">
					<item-list
						name="Arcana Attainments"
						:items="character.attainments"
						:mutable="true"
						:min="10"
					/>
				</div>
				<div class="col-6">
					<item-list
						name="Legacy Attainments"
						:items="character.legacyAttainments"
						:mutable="true"
						:min="10"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { MageCharacter, Rote } from "../../definitions";
import { defineComponent, PropType } from "vue";

import ItemList from "./ItemList.vue";
import ObjectList from "./ObjectList.vue";

export default defineComponent({
	name: "MageTraits",
	components: {
		ItemList,
		ObjectList
	},
	props: {
		"character": {
			required: true,
			type: Object as PropType<MageCharacter>,
		}
	},
	data: () => ({
		Rote
	}),
	methods: {
	},
	computed: {
	}
});
</script>


			<!-- <div id="rotes" class="row col-sm-12">
				<h4 class="separator col-sm-12" style="margin-bottom: 15px">Rotes</h4>
				<div class="col-2">
					<i class="subtitle">Arcanum</i>
				</div>
				<div id="rote-level" class="col-1">
					<i class="subtitle">Level</i>
				</div>
				<div class="col-5">
					<i class="subtitle">Spell</i>
				</div>
				<div class="col-2">
					<i class="subtitle">Creator</i>
				</div>
				<div class="col-2">
					<i class="subtitle">Rote Skill</i>
				</div>
				<div @input="doInputRote(rote, i)" class="row" v-for="(rote,i) in rotes" :key="i">
					<div class="col-2">
						<input class="line" v-model="rote.arcanum" />
					</div>
					<div id="rote-level" class="col-1">
						<input class="line" v-model.number="rote.level" type="number" />
					</div>
					<div class="col-5">
						<input class="line" v-model="rote.spell" />
					</div>
					<div class="col-2">
						<input class="line" v-model="rote.creator" />
					</div>
					<div class="col-2">
						<input style="text-transform: capitalize;" class="line" v-model="rote.roteSkill" />
					</div>
				</div>
			</div>
			<br> -->