<template>
	<div>
		<h3 class="separator col-sm-12">{{ `${name} ${woundPenalty < 0 ? `(${woundPenalty})` : ''}` }}</h3>
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
/* eslint-disable vue/no-mutating-props */

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
		"woundPenalty": {
			required: false,
			type: Number
		},
		"maxMarkValue": {
			required: false,
			default: 3,
			type: Number
		},
		"name": {
			required: true,
			type: String
		},	
	},
	methods: {
		pokeHealth(n: number, remAgg = true) {
			const healthTrack: number[] = this.healthTrack as any;
			const c: number =  healthTrack[n];


			const n2 = c === this.maxMarkValue ? healthTrack.lastIndexOf(c) : healthTrack.indexOf(c);

			if (n !== n2) {
				n = n2;
			}

			console.log(remAgg);

			healthTrack[n] = c !== this.maxMarkValue ? c+1 : c;
			if (remAgg && healthTrack[n] > this.maxMarkValue) {
				healthTrack[n] = 0;
			
				if (this.healthTrack[n+1] !== 0) {
					this.healthTrack.splice(n,1);
					this.healthTrack.push(0);
				}
			}
		}
	},
	computed: {
		// woundPenalty: function(): number {
		// 	const healthTrack: number[] = this.healthTrack as any;

		// 	return healthTrack[this.healthTrack.length - 1] !== 0 ?
		// 		-3 : healthTrack[this.healthTrack.length - 2] !== 0 ?
		// 			-2 : healthTrack[this.healthTrack.length - 3] !== 0 ?
		// 				-1 : 0;
		// }
	},
	beforeMount() {
		if (this.healthTrack.length < this.maxHealth) {
			for (let iii = this.healthTrack.length; iii < this.maxHealth; iii++) {
				this.healthTrack.push(0);
			}
		}
	},
	watch: {
		maxHealth() {
			if (this.healthTrack.length < this.maxHealth) {
				for (let iii = this.healthTrack.length; iii < this.maxHealth; iii++) {
					this.healthTrack.push(0);
				}
			} else if (this.healthTrack.length > this.maxHealth) {
				const diff = this.healthTrack.length - this.maxHealth;
				
				let ind = this.healthTrack.lastIndexOf(this.healthTrack[0]);

				if (ind === this.healthTrack.length-1) {
					ind-=diff;
				}

				for (let i = 0; i < diff; i++) {
					const val = this.healthTrack.pop();

					if (val && val !== 0) {
						this.pokeHealth(ind, false);
					} 
				}

			}
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