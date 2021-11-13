<template>
	<div>
		<div class="col-sm-4">
			<item-list
				id="activeSpells"
				class="col-12 block"
				name="Active Spells"
				:items="character.activeSpells"
				:mutable="true"
				:min="10 || character.power"
			/>
			<item-list
				id="yantras"
				class="col-12 block"
				name="yantras"
				:items="character.yantras"
				:mutable="true"
				:min="5"
			/>
			<item-list
				id="tools"
				class="col-12 block"
				name="magical tools"
				:items="character.magicalTools"
				:mutable="true"
				:min="5"
			/>
			<item-list
				id="praxes"
				class="col-12 block"
				name="praxes"
				:items="character.praxes"
				:mutable="true"
				:min="12"
			/>
			<item-list
				id="inuredSpells"
				class="col-12 block"
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
				class=""
				:items="character.rotes" 
				:itemFactory="Rote"
				:col-sizes="['2', '1', '5', '2', '2']"
				:min="12"
			>
			</object-list>
			<item-list name="Nimbus" class="w-100 block" :items="character.nimbus" :min="6" :mutable="true"></item-list>
			<div class="w-100 row block">
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

import ItemList from "../sheetComponents/ItemList.vue";
import ObjectList from "../sheetComponents/ObjectList.vue";

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