import request from 'supertest'

const baseURL = 'http://localhost:8083'

describe('GET /users', () => {
	const newUser = {
		mail: `${Math.random().toString(36).substring(7)}@test.com`,
		password: 'string',
		newsletter: true,
		country_id: 1,
		role_id: 1,
	}

	let user_id: number
	beforeAll(async () => {
		user_id = (await request(baseURL).post('/users').send(newUser)).body.user_id
	})
	afterAll(async () => {
		await request(baseURL).delete(`/users/${user_id}`)
	})
	it('one user should return 200', async () => {
		const response = await request(baseURL).get(`/users/${user_id}`)
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('all users should return 200', async () => {
		const response = await request(baseURL).get('/users')
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('should return users', async () => {
		const response = await request(baseURL).get('/users')
		expect(response.body.length >= 1).toBe(true)
	})
})
