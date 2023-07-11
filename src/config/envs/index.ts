import dotenv from 'dotenv'

export const envs = {
	...process.env,
	...dotenv.config().parsed,
}

if (process.env.NODE_ENV === 'development') {
	console.log('envs', envs)
}
export const isProduction = process.env.NODE_ENV === 'production'
