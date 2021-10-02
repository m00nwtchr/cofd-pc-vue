import { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store, createLogger } from "vuex";

import VuexPersistence, { AsyncStorage } from "vuex-persist";
import localForage from "localforage";

import { Character, createCharacter } from "../definitions";
import { conforms } from "lodash";

const vuexPersist = new VuexPersistence<State>({
	strictMode: true,
	reducer: (state: State) => {
		const ch = Object.entries(state.characters)
		.map(([key, val]) => val.getData ?
			({[key]: val.getData()}) : {[key]: val})
		.reduce((acc, el) => Object.assign(acc, el), {});

		console.log("Reducer",ch);
		return {
			characters: ch
		};
	},
	storage: localForage as AsyncStorage,
	asyncStorage: true
});

// export type Characters = { [key: string]: Character };

export interface State {
	flag: boolean;
	characters: { [key: string]: Character };
	selectedTraits: { [index: string]: () => number };
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
	// strict: true,
	plugins: [
		// createLogger(),
		vuexPersist.plugin
	],
	state: {
		flag: true,
		characters: {},
		selectedTraits: {}
	},
	mutations: {
		UPDATE(state) {
			state = {...state};
		},

		UPDATE_CHARACTERS(state, val) {
			state.characters = val;
		},
		UPDATE_CHARACTER(state, {id, val}) {
			state.characters[id] = val;
			state.flag = true;
		},
		UPDATE_SELECTED(state, val) {
			state.selectedTraits = val;
		},
		SELECT_TRAIT(state, payload) {
			state.selectedTraits = {
				...state.selectedTraits,
				[payload.name]: payload.value
			};
		},
		UNSELECT_TRAIT(state, name) {
			// Vue.set(state.selectedTraits, name, undefined);
			delete state.selectedTraits[name];
		},
		
		// RESTORE_MUTATION: vuexPersist.RESTORE_MUTATION
		RESTORE_MUTATION(state, savedState) {
			console.log("RESTORE_MUTATION", savedState);
			Object.assign(state.characters, savedState.characters);
		
			// Object.entries(state.characters).forEach(([key, val]) => {
			// 	state.characters[key] = createCharacter(val);
			// });
		}
	},
	getters: {
		export(state) {
			const data = new Blob([
				JSON.stringify(state.characters, null, "\t")
			], { type: 'application/json' });

			return URL.createObjectURL(data);
		}
	},
	actions: {
	},
	modules: {
	}
});

export function useStore(): Store<State> {
	return baseUseStore(key);
}