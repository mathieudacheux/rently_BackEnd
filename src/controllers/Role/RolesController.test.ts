import request from 'supertest'
import { BASE_URL } from '../../config/index'

describe('Roles controller endpoint', () => {
	const newRole = {
		name: 'RoleTest',
		permission_id: 5,
	}

	let role_id: number
	beforeAll(async () => {
		role_id = (await request(BASE_URL).post('/roles').send(newRole)).body.role_id
	})
	afterAll(async () => {
		await request(BASE_URL).delete(`/roles/${role_id}`)
	})
	it('one role should return 200', async () => {
		const response = await request(BASE_URL).get(`/roles/${role_id}`)
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('all roles should return 200', async () => {
		const response = await request(BASE_URL).get('/roles')
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('should return roles', async () => {
		const response = await request(BASE_URL).get('/roles')
		expect(response.body.length >= 1).toBe(true)
	})
})
