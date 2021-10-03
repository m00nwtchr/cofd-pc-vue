import { createI18n } from "vue-i18n";
import messages from "@intlify/vite-plugin-vue-i18n/messages";

function getLang() {
	if (navigator.languages != undefined)
		return navigator.languages[0];
	return navigator.language;
}

export default createI18n({
	legacy: false,
	locale: "en",
	// locale: process.env.VUE_APP_I18N_LOCALE || getLang(),
	fallbackLocale: "en",
	globalInjection: true,
	messages
});
