import { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store, createLogger } from "vuex";

import VuexPersistence, { AsyncStorage } from "vuex-persist";
import localForage from "localforage";

import _ from "lodash";

import { Character, createCharacter } from "../definitions";

const vuexPersist = new VuexPersistence<State>({
	strictMode: true,
	// reducer: (state: State) => {
	// 	const ch = Object.entries(state.characters)
	// 		.map(([key, val]) => val.getData ?
	// 			({ [key]: val.getData() }) : { [key]: val })
	// 		.reduce((acc, el) => Object.assign(acc, el), {});

	// 	return {
	// 		characters: ch
	// 	};
	// },
	// storage: localForage as AsyncStorage,
	// asyncStorage: true
});

// export type Characters = { [key: string]: Character };

export interface State {
	debug: boolean;
	flag: boolean;
	characters: { [key: string]: Character };
	selectedTraits: { [index: string]: () => number };
	creationMode: boolean;
}

abstract class AsyncStore<T> extends Store<T> {
	restored!: Promise<State>;
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
		selectedTraits: {},
		debug: false,
		creationMode: false,
	},
	mutations: {
		UPDATE_ENV(state, val) {
			state.debug = val;
		},
		UPDATE_CHARACTERS(state, val) {
			state.characters = val;
		},
		UPDATE_CHARACTER(state, { id, val }) {
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

		CREATION_MODE(state, val) {
			if (typeof val !== "undefined") {
				state.creationMode = val;
			} else {
				state.creationMode = !state.creationMode;
			}
		},


		// RESTORE_MUTATION: vuexPersist.RESTORE_MUTATION
		RESTORE_MUTATION(state, savedState) {
			const mergedState = _.merge(state, savedState || {})
			for (const propertyName of Object.keys(mergedState as {})) {
				(state as any)[propertyName] = (mergedState as any)[propertyName];
			}
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