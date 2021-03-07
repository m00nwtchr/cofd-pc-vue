<template>
	<div>
		<h3 class="separator col-sm-12">{{ name }}</h3>
		<slot></slot>
		<!-- <div class="sheet-dots" style="margin-top:-10px;"> -->
			<!-- <button v-for="n in maxHealth" :key="n" class="sheet-dot" :class="{'sheet-dot-full': true}"></button> -->
		<!-- </div> -->
		<div class="sheet-boxes" style="margin-top:-7px;">
			<button v-for="n in maxHealth" :key="n" @click="pokeHealth(n-1)" class="sheet-box" :data-healthbox="healthTrack[n-1]"></button>
		</div>
	</div>
</template>

<script lang="ts">
import { Ability } from "@/definitions/Character";
import { defineComponent } from "vue";
export default defineComponent({
	name: "HealthComponent",
	props: {
		"maxHealth": {
			required: true,
			type: Number
		},
		"healthTrack": {
			required: true,
			type: Array
		},
		"name": {
			required: true,
			type: String
		},	
	},
	methods: {
		pokeHealth(n: number) {
			const healthTrack: number[] = this.healthTrack as any;
			const c: number =  healthTrack[n];


			const n2 = c===3?healthTrack.lastIndexOf(c) : healthTrack.indexOf(c);

			// // n2 = n2 === -1 ? 0 : n2;

			if (n !== n2) {
				n = n2;
			}

			healthTrack[n] = c+1;
			if (healthTrack[n] > 3) {
				healthTrack[n] = 0;
			}

			// console.log(n, c);		
			// console.log(healthTrack);
		}
	},
	computed: {
		woundPenalty: function(): number {
			const healthTrack: number[] = this.healthTrack as any;

			const last = healthTrack.lastIndexOf(0);

			return Math.min(healthTrack[this.maxHealth-1] !== 0 ? -3 : 0, healthTrack[this.maxHealth-2] !== 0 ? -2 : 0, healthTrack[this.maxHealth-3] !== 0 ? -1 : 0); 
		}
	},
	beforeMount() {
		if (this.healthTrack.length < this.maxHealth) {
			for (let iii = this.healthTrack.length; iii < this.maxHealth; iii++) {
				// eslint-disable-next-line vue/no-mutating-props
				this.healthTrack.push(0);
			}
		}
	},
	watch: {
		maxHealth: function() {
			if (this.healthTrack.length < this.maxHealth) {
				for (let iii = this.healthTrack.length; iii < this.maxHealth; iii++) {
					// eslint-disable-next-line vue/no-mutating-props
					this.healthTrack.push(0);
				}
			}
			// console.log(this.healthTrack.length);
		}
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
.sheet-box[data-healthbox="1"] {
    background:
        linear-gradient(to top left,
        rgba(0,0,0,0) 0%,
        rgba(0,0,0,0) calc(50% - 0.8px),
        currentColor 50%,
        rgba(0,0,0,0) calc(50% + 0.8px),
        rgba(0,0,0,0) 100%),
        #efefef;	
}

.sheet-box[data-healthbox="2"] {
	background:
        linear-gradient(to top left,
        rgba(0,0,0,0) 0%,
        rgba(0,0,0,0) calc(50% - 0.8px),
        currentColor 50%,
        rgba(0,0,0,0) calc(50% + 0.8px),
        rgba(0,0,0,0) 100%),
        linear-gradient(to top right,
            rgba(0,0,0,0) 0%,
            rgba(0,0,0,0) calc(50% - 0.8px),
            currentColor 50%,
            rgba(0,0,0,0) calc(50% + 0.8px),
            rgba(0,0,0,0) 100%),
        #efefef;
}

.sheet-box[data-healthbox="3"] {
    background:
        linear-gradient(to top left,
           rgba(0,0,0,0) 0%,
           rgba(0,0,0,0) calc(50% - 0.8px),
           currentColor 50%,
           rgba(0,0,0,0) calc(50% + 0.8px),
           rgba(0,0,0,0) 100%),
       linear-gradient(to top right,
           rgba(0,0,0,0) 0%,
           rgba(0,0,0,0) calc(50% - 0.8px),
           currentColor 50%,
           rgba(0,0,0,0) calc(50% + 0.8px),
           rgba(0,0,0,0) 100%),
        linear-gradient(to right,
        rgba(0,0,0,0) 0%,
           rgba(0,0,0,0) calc(50% - 0.8px),
           currentColor 50%,
           rgba(0,0,0,0) calc(50% + 0.8px),
           rgba(0,0,0,0) 100%),
        #efefef;	
}
</style>