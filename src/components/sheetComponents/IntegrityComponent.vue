<template>
	<div>
		<div class="touchstone" v-if="integrityTrackType === 'dualTouchstone'">
			<h3 class="separator col-sm-12">{{ splat.integrityTrackType.names[0] }} Touchstone</h3>
			<!-- eslint-disable-next-line vue/no-mutating-props -->
			<input class="line" @input="doInput(1)" v-model="touchstonesTemp[0].name">
		</div>
		<h3 class="separator col-sm-12">{{ splat.integrityTraitName }}</h3>
		<div class="sheet-dots" style="margin-top:-10px;">
		<span v-for="n in items" :key="n" >
				<button class="sheet-dot" @click="$parent.setTrait('integrityTrait', n)" :class="{'sheet-dot-full': character.integrityTrait >= n}"></button>
				<span v-if="integrityTrackType === 'verticalTouchstoneTrack'">
					<!-- <input class="line" @input="doInput(n)" v-if="character.touchstones[n-1]" v-model="character.touchstones[n-1].name"> -->
					<!-- <input class="line" @input="doInput(n)" v-else> -->
					<!-- eslint-disable-next-line vue/no-mutating-props -->
					<input class="line" @input="doInput(n)" v-model="touchstonesTemp[n-1].name">
					<br>
				</span>
			</span>
		</div>
		<div class="touchstone" v-if="integrityTrackType === 'dualTouchstone'">
			<h3 class="separator col-sm-12">{{ splat.integrityTrackType.names[1] }} Touchstone</h3>
			<!-- eslint-disable-next-line vue/no-mutating-props -->
			<input class="line" @input="doInput(2)" v-model="touchstonesTemp[1].name">
		</div>		
	</div>
</template>

<script lang="ts">
/* eslint-disable vue/no-mutating-props */

import { Ability } from "@/definitions/Character";
import { EnumSplat } from "@/definitions/Splat";
import { defineComponent } from "vue";
export default defineComponent({
	name: "IntegrityComponent",
	props: {
		"character": {
			required: true,
			type: Object
		},
		"splat": {
			required: true,
			type: Object
		}	
	},
	data() {
		return {
			// tmpVals: []
		};
	},
	beforeMount() {
		console.log(this.integrityTrackType);

		if (this.integrityTrackType === "verticalTouchstoneTrack") {
			for (let i = 0; i < 10; i++) {
				// this.character.touchstones[i] = {name: ""};
			}
		}
		console.log(this.character.touchstones);
	},
	methods: {
		doInput(n: number) {
			if (this.character.touchstones[n-1] != this.touchstonesTemp[n-1]){
				this.character.touchstones[n-1] = this.touchstonesTemp[n-1];
			}

			if (!this.character.touchstones[n-1]) {
				///
			} else if (this.character.touchstones[n-1].name === "") {
				// console.log("e");
				delete this.character.touchstones[n-1];
				// this.character.touchstones.splice(n-1, 1);
			}
		}
	},
	computed: {
		items(): number[] {
			const list = [1,2,3,4,5,6,7,8,9,10];
			return this.integrityTrackType === "verticalTouchstoneTrack" ? list.reverse() : list;
		},
		touchstonesTemp() {
			const arr: string[]=[];

			(this.integrityTrackType !== "dualTouchstone" ? this.items : [1,2]).forEach((el,i) => {
				arr[i] = this.character.touchstones[i] || {name:""};
			});

			return arr;
		},
		integrityTrackType(): string {
			return typeof this.splat.integrityTrackType === "string" ? this.splat.integrityTrackType : this.splat.integrityTrackType.type;
		}
	},
	watch: {
	}
});

// <div id="merits" class="block">
// 	<h3 class="separator col-sm-12">Merits</h3>
// 	<div style="margin:0" v-for="(merit, i) in character.merits" :key="i" class="block row col-sm-12">
// 		<!-- <span style="text-transform: capitalize" v-for="j in attributes[i-1].length" :key="j"> -->
// 		<input v-model="merit.name" class="line col-7">
// 		<div class="sheet-dots col-5">
// 			<button @click="merit.dots = (merit.dots === n ? n-1 : n)" v-for="n in 5" :key="n" :class="{'sheet-dot':true,'sheet-dot-full':merit.dots>=n}"></button>
// 		</div>
// 		<!-- <br> -->
// 		<!-- </span> -->
// 	</div>
// </div> -->
</script>

<style lang="scss" scoped>
.touchstone {
	margin-bottom: 10px !important;
	margin-top:10px;
}
</style>