<template>
	<!-- <div> -->
	<button v-if="button" @click="modalOpen = true">{{ value }}</button>

	<teleport to="body">
		<div v-if="modalOpen" class="modal">
			<div :style="{ 'width': modalWidth, 'height': modalHeight }">
				<h3>{{ title }}</h3>
				<div class="row col-10">
					<slot></slot>
				</div>
				<button @click="$emit('close')">Done</button>
				<!-- <button @click="modalOpen = false">Done</button> -->
			</div>
		</div>
	</teleport>
	<!-- </div> -->
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
	name: "ModalComponent",
	emits: ['close'],
	props: {
		button: {
			type: Boolean,
			required: false,
			default: () => true
		},
		value: {
			type: String,
			required: false
		},
		title: {
			type: String,
			// required: true
		},
		modalWidth: {
			type: String,
			// required: true
			default: "300px"
		},
		modalHeight: {
			type: String,
			// required: true
			default: "300px"
		},
		modalOpen: {
			type: Boolean,
			required: false,
			default: () => false
		},
	},
	data() {return {};
	}
});
</script>

<style lang="scss" scoped>
.modal {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.modal > div {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background-color: white;
	padding: 5px;
}
</style>