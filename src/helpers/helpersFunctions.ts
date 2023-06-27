import request from 'supertest'
import { AUTHORIZED_MAIL, AUTHORIZED_PASSWORD, BASE_URL } from '../config/index'

async function getUserToken() {
	const userToken = await request(BASE_URL).post('/authentifications').send({
		mail: AUTHORIZED_MAIL,
		password: AUTHORIZED_PASSWORD,
	})

	return userToken.body.token
}

export { getUserToken }
