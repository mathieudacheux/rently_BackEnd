import { join } from 'path'
import { Configuration, Inject } from '@tsed/di'
import { PlatformApplication } from '@tsed/common'
import '@tsed/platform-express'
import '@tsed/ajv'
import '@tsed/swagger'
import { config } from './config/index'
import * as users from './controllers/User/UsersController'
import * as appointments from './controllers/Appointment/AppointmentsController'
import * as pages from './controllers/pages/index'

@Configuration({
	...config,
	acceptMimes: ['application/json'],
	httpPort: process.env.PORT || 8083,
	httpsPort: false,
	disableComponentsScan: true,
	mount: {
		'/users': [...Object.values(users)],
		'/appointments': [...Object.values(appointments)],
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
