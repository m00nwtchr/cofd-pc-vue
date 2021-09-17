import { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store, createLogger } from "vuex";

import VuexPersistence, { AsyncStorage } from "vuex-persist";
import localForage from "localforage";
import Character from "@/definitions/Character";
import { RefType } from "@/Util";

const vuexPersist = new VuexPersistence({
	// storage: localForage as AsyncStorage
});

// export type Characters = { [key: string]: Character };

export interface State {
	characters: { [key: string]: Character };
	selectedTraits: { [index: string]: () => number };
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
	plugins: [
		// createLogger(),
		vuexPersist.plugin
	],
	state: {
		characters: {},
		selectedTraits: {}
	},
	mutations: {
		UPDATE_CHARACTERS(state, val) {
			state.characters = val;
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
		}
	},
	getters: {
		export(state) {
			// const url = `data:application/json;base64,${btoa(JSON.stringify(state.characters,null,"\t"))}`;
			return "";
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