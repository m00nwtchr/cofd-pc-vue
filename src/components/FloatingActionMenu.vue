<template>
	<div class="fam">
		<div v-if="extended">
			<button
				v-for="(item, i) in items"
				:key="i"
				class="fab"
				:style="{ bottom: (i + 1) * (24 * 2 + 15) + 'px' }"
				@click="item.action"
			>
				<span v-if="item.icon" class="material-icons">
					{{ item.icon }}
				</span>
				<span v-else>
					{{ item.name }}
				</span>
			</button>
		</div>
		<button @click="extended = !extended" class="fab material-icons">
			menu
		</button>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

interface MenuItem {
	name: string;
	icon?: string;
	action: () => void;
}

export default defineComponent({
	name: "FloatingActionMenu",
	props: {
		"items": {
			type: Array,
			required: true
		}
	},
	data() {
		return {
			extended: false,
			// items: [
			// 	{
			// 		name: "Roll Selected",
			// 		icon: "casino",
			// 		action: () => {
			// 			alert("Huehuehue");
			// 		}
			// 	},
			// 	{
			// 		name: "Roll Selected",
			// 		action: () => {
			// 			alert("Huehuehue");
			// 		}
			// 	}
			// ] as MenuItem[]
		};
	}
});
</script>


<style lang="scss" scoped>
$radius: 24px;

.fab {
	border-radius: $radius;

	width: $radius * 2;
	height: $radius * 2;

	position: fixed;

	right: 10px;
}

.fam {
	position: fixed;

	right: $radius * 2+10;
	bottom: $radius * 2+10;

	background-color: red;

	z-index: 1;
}
</style>
