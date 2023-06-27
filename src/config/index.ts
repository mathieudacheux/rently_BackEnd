import { readFileSync } from 'fs'
import { envs } from './envs/index'
import loggerConfig from './logger/index'
const pkg = JSON.parse(readFileSync('./package.json', { encoding: 'utf8' }))

export const config: Partial<TsED.Configuration> = {
	version: pkg.version,
	envs,
	logger: loggerConfig,
	// additional shared configuration
}

export const AUTHORIZED_PASSWORD = 'BlackOPS80*'
export const AUTHORIZED_MAIL = 'mathieu@icloud.com'
export const BASE_URL = 'http://localhost:8083'
