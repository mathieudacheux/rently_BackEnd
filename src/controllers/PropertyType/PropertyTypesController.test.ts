import request from 'supertest'
import { BASE_URL } from '../../config/index'

describe('Property types controller endpoint', () => {
	it('one sector should return 200', async () => {
		const response = await request(BASE_URL).get(`/property_types/1`)
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('all property types should return 200', async () => {
		const response = await request(BASE_URL).get('/property_types')
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('should return property types', async () => {
		const response = await request(BASE_URL).get('/property_types')
		expect(response.body.length >= 1).toBe(true)
	})
})
