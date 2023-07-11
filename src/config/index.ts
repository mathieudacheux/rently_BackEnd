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

export const AUTHORIZED_PASSWORD = 'test'
export const AUTHORIZED_MAIL = 'encoremoi@mail.com'
export const BASE_URL = 'http://localhost:8083'
export const API_KEY =
	'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'
