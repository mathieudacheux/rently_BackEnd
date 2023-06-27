import request from 'supertest'
import { BASE_URL, AUTHORIZED_MAIL, AUTHORIZED_PASSWORD } from '../../config/index'

describe('Authentifications controller endpoint', () => {
	const loginUser = {
		mail: AUTHORIZED_MAIL,
		password: AUTHORIZED_PASSWORD,
	}

	it('should return 200', async () => {
		const response = await request(BASE_URL).post('/authentifications').send(loginUser)
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('should return a token', async () => {
		const response = await request(BASE_URL).post('/authentifications').send(loginUser)
		expect(response.body.token).toBeTruthy()
	})
})
