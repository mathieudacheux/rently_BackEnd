import { join } from 'path'
import { Configuration, Inject } from '@tsed/di'
import { PlatformApplication } from '@tsed/common'
import '@tsed/platform-express'
import '@tsed/ajv'
import '@tsed/swagger'
import { config } from './config/index'
import * as pages from './controllers/pages/index'
import * as addresses from './controllers/Address/AddressesController'
import * as agencies from './controllers/Agency/AgenciesController'
import * as appointments from './controllers/Appointment/AppointmentsController'
import * as articles from './controllers/Article/ArticlesController'
import * as bookmarks from './controllers/Bookmark/BookmarksController'
import * as countries from './controllers/Country/CountriesController'
import * as fees from './controllers/Fee/FeesController'
import * as messages from './controllers/Message/MessagesController'
import * as permissions from './controllers/Permission/PermissionsController'
import * as properties from './controllers/Property/PropertiesController'
import * as roles from './controllers/Role/RolesController'
import * as sectors from './controllers/Sector/SectorsController'
import * as status from './controllers/Status/StatusController'
import * as tags from './controllers/Tag/TagsController'
import * as users from './controllers/User/UsersController'

@Configuration({
	...config,
	acceptMimes: ['application/json'],
	httpPort: process.env.PORT || 8083,
	httpsPort: false,
	disableComponentsScan: true,
	mount: {
		'/addresses': [...Object.values(addresses)],
		'/agencies': [...Object.values(agencies)],
		'/appointments': [...Object.values(appointments)],
		'/articles': [...Object.values(articles)],
		'/bookmarks': [...Object.values(bookmarks)],
		'/countries': [...Object.values(countries)],
		'/fees': [...Object.values(fees)],
		'/messages': [...Object.values(messages)],
		'/permissions': [...Object.values(permissions)],
		'/properties': [...Object.values(properties)],
		'/roles': [...Object.values(roles)],
		'/sectors': [...Object.values(sectors)],
		'/statuses': [...Object.values(status)],
		'/tags': [...Object.values(tags)],
		'/users': [...Object.values(users)],
		'/': [...Object.values(pages)],
	},
	swagger: [
		{
			path: '/doc',
			specVersion: '3.0.1',
		},
	],
	middlewares: [
		'cors',
		'cookie-parser',
		'compression',
		'method-override',
		'json-parser',
		{ use: 'urlencoded-parser', options: { extended: true } },
	],
	views: {
		root: join(process.cwd(), '../views'),
		extensions: {
			ejs: 'ejs',
		},
	},
	exclude: ['**/*.spec.ts'],
})
export class Server {
	@Inject()
	protected app: PlatformApplication

	@Configuration()
	protected settings: Configuration
}
