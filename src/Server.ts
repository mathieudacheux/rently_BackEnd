import { join } from 'path'
import { Configuration, Inject } from '@tsed/di'
import { PlatformApplication } from '@tsed/common'
import '@tsed/platform-express'
import '@tsed/ajv'
import '@tsed/swagger'
import '@tsed/socketio'
import { config } from './config/index'
import * as pages from './controllers/pages/IndexController'
import * as addresses from './controllers/Address/AddressesController'
import * as agencies from './controllers/Agency/AgenciesController'
import * as appointments from './controllers/Appointment/AppointmentsController'
import * as appointmentsTags from './controllers/AppointmentTag/AppointmentTagController'
import * as articles from './controllers/Article/ArticlesController'
import * as bookmarks from './controllers/Bookmark/BookmarksController'
import * as countries from './controllers/Country/CountriesController'
import * as fees from './controllers/Fee/FeesController'
import * as mails from './controllers/Mail/MailsController'
import * as messages from './controllers/Message/MessagesController'
import * as permissions from './controllers/Permission/PermissionsController'
import * as properties from './controllers/Property/PropertiesController'
import * as property_types from './controllers/PropertyType/PropertyTypesController'
import * as roles from './controllers/Role/RolesController'
import * as sectors from './controllers/Sector/SectorsController'
import * as status from './controllers/Statuses/StatusesController'
import * as tags from './controllers/Tag/TagsController'
import * as users from './controllers/User/UsersController'
import * as authentifications from './controllers/AuthentificationUser/AuthentificationsController'
import * as attachment from './controllers/Attachment/AttachmentsController'

@Configuration({
	...config,
	acceptMimes: ['application/json', 'multipart/form-data'],
	httpPort: process.env.PORT || 8083,
	httpsPort: false,
	disableComponentsScan: true,

	statics: {
		'/property': [
			{
				root: './public/property',
			},
		],
	},

	socketIO: {
		path: '/socket.io',
		cors: {
			origin: '*',
		},
	},

	mount: {
		'/users': [...Object.values(users)],
		'/authentifications': [...Object.values(authentifications)],
		'/addresses': [...Object.values(addresses)],
		'/agencies': [...Object.values(agencies)],
		'/appointments': [...Object.values(appointments)],
		'/appointment_tags': [...Object.values(appointmentsTags)],
		'/articles': [...Object.values(articles)],
		'/bookmarks': [...Object.values(bookmarks)],
		'/countries': [...Object.values(countries)],
		'/fees': [...Object.values(fees)],
		'/mail': [...Object.values(mails)],
		'/messages': [...Object.values(messages)],
		'/permissions': [...Object.values(permissions)],
		'/properties': [...Object.values(properties)],
		'/property_types': [...Object.values(property_types)],
		'/roles': [...Object.values(roles)],
		'/sectors': [...Object.values(sectors)],
		'/statuses': [...Object.values(status)],
		'/tags': [...Object.values(tags)],
		'/file': [...Object.values(attachment)],
		'/': [...Object.values(pages)],
	},
	// swagger with jwt auth
	swagger: [
		{
			path: '/doc',
			specVersion: '3.0.1',
			spec: {
				components: {
					securitySchemes: {
						bearerAuth: {
							type: 'http',
							scheme: 'bearer',
							bearerFormat: 'JWT',
						},
					},
				},
				security: [
					{
						bearerAuth: [],
					},
				],
			},
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
