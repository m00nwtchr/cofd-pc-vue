<template>
	<header class="col-12">
		<div>My Characters</div>
	</header>
	<modal-component
		modalWidth="80%"
		modalHeight="80%"
		title="New Character"
		:button="false"
		:modalOpen="addModalOpen"
		@close="addModalOpen = false; newChar();"
		ref="modal"
	>
		<new-character ref="newchar" />
	</modal-component>

	<floating-action-menu
		:items="[{
			// name: 'Roll Selected',
			icon: 'plus',
			action: () => addModalOpen = true,
		}]"
	></floating-action-menu>

	<ul class="col-12" id="list">
		<router-link :key="key" v-for="(el, key) in characters" :to="'/character/' + key">
			<li class="list-item">
				<div>
					<span class="name">{{ el.name }}</span>
					<br />
					<span style="text-transform: capitalize;" class="desc">
						<!-- <span v-if="el.concept"> -->
						<!-- {{ el.concept }} -->
						<!-- <br /> -->
						<!-- </span> -->
						{{ el.splat.name && $t(el.splat.name) }}
						<!-- {{ el.legacy || "" }} {{ el.subType.name && $t(el.subType.name) }} {{ el.organization.name && $t(el.organization.name) }} -->
						<br />
						<span
							v-if="el.splat.name === ''"
							style="color: red"
						>Warning: Unknown/Unsupported splat or malformed data</span>
					</span>
					<!-- {{key === "b153b71d-57b0-488e-8a14-165f0ebc5b20" && el}} -->
				</div>
			</li>
		</router-link>
	</ul>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from "vue";
import { fromJSON } from "../definitions";
import FloatingActionMenu from "../components/FloatingActionMenu.vue";
import ModalComponent from "../components/ModalComponent.vue";
import NewCharacter from "./NewCharacter.vue";
import { v4 as uuidv4 } from "uuid";

import { useStore } from "../store";
import { MortalCharacter } from "../definitions";
import * as all from "../definitions";

const store = useStore();

const newchar = ref<any>(null);
const modal = ref<any>(null);

let addModalOpen = ref(false);
onMounted(() => {
	Object.assign(window, all);
});

const characters = computed(() => Object.entries(store.state.characters)
	.map(el => [el[0], fromJSON(el[1])])
	.map(el => ({
		[el[0]]: el[1]
	}))
	.reduce((prev, val) => Object.assign(prev, val), {})
);

function newChar() {
	const id = uuidv4();
	console.log(newchar.value.splat);
	const char = fromJSON({
		splat: newchar.value.splat,

		name: "Unnamed",
	});
	console.log(char);
	// console.log(char.toJSON());

	store.commit("UPDATE_CHARACTERS", {
		...store.state.characters,
		[id]: char.toJSON()
	});
}
</script>

<style lang="scss" scoped>
@import "../style/vars.scss";

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

#list {
	margin-top: 25px;

	list-style-type: none;

	line-height: 16px;

	$pad: 35px;

	padding-left: $pad;
	padding-right: $pad;

	li {
		display: block;

		margin-bottom: 10px;

		border-radius: 5px;

		text-align: left;

		height: 60px;
		background-color: $accent;

		border: 2px solid gray;

		div {
			margin-left: 10px;
			padding-top: 6px;
			color: $text-light;
		}
	}
}

.name {
	font-weight: bold;
}

.desc {
	font-size: 10pt;
}

a {
	text-decoration: none;
	color: inherit;
}

a:hover {
	text-decoration: none;
	color: inherit;
}
</style>