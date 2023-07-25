import i18next from 'i18next'
import Backend from 'i18next-http-backend'
import i18nextMiddleware from 'i18next-express-middleware'
import { RequestHandler } from 'express'
import enTranslation from './en.json'
import frTranslation from './fr.json'

const ressources = {
	en: {
		translation: enTranslation,
	},
	fr: {
		translation: frTranslation,
	},
}

i18next.use(Backend).use(i18nextMiddleware.LanguageDetector).init({
	resources: ressources,
	lng: 'fr',
	fallbackLng: 'fr',
})

export const i18nMiddleware: RequestHandler = i18nextMiddleware.handle(i18next)

export default i18next
