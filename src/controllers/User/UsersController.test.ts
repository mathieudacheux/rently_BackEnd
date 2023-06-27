import request from 'supertest'
import { BASE_URL } from '../../config/index'

describe('Users controller endpoint', () => {
	const newUser = {
		mail: `bibibi@test.com`,
		password: 'string',
		newsletter: true,
		country_id: 1,
		role_id: 1,
	}

	let user_id: number
	beforeAll(async () => {
		user_id = (await request(BASE_URL).post('/users').send(newUser)).body.user_id
	})
	afterAll(async () => {
		await request(BASE_URL).delete(`/users/${user_id}`)
	})
	it('one user should return 200', async () => {
		const response = await request(BASE_URL).get(`/users/${user_id}`)
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('all users should return 200', async () => {
		const response = await request(BASE_URL).get('/users')
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('should return users', async () => {
		const response = await request(BASE_URL).get('/users')
		expect(response.body.length >= 1).toBe(true)
	})
})
