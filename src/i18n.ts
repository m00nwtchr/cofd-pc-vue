import { createI18n, LocaleMessages, VueMessageType } from "vue-i18n";
import messages from "@intlify/vite-plugin-vue-i18n/messages";

const env = window["process.env" as any] as any || {};

function getLang() {
	if (navigator.languages != undefined)
		return navigator.languages[0];
	return navigator.language;
}

export default createI18n({
	legacy: false,
	locale: env.VUE_APP_I18N_LOCALE || getLang(),
	fallbackLocale: "en",
	globalInjection: true,
	messages
});
