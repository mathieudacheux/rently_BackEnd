import request from 'supertest'
import { BASE_URL } from '../../config/index'

describe('Agencies controller endpoint', () => {
	const newAgency = {
		name: `${Math.random().toString(10).substring(7)}`,
		fee_id: 1,
		address_id: 1,
	}

	let agency_id: number
	beforeAll(async () => {
		agency_id = (await request(BASE_URL).post('/agencies').send(newAgency)).body.agency_id
	})
	afterAll(async () => {
		await request(BASE_URL).delete(`/agencies/${agency_id}`)
	})
	it('one agency should return 200', async () => {
		const response = await request(BASE_URL).get(`/agencies/${agency_id}`)
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('all agencies should return 200', async () => {
		const response = await request(BASE_URL).get('/agencies')
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('should return agencies', async () => {
		const response = await request(BASE_URL).get('/agencies')
		expect(response.body.length >= 1).toBe(true)
	})
})
