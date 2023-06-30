import request from 'supertest'
import { BASE_URL } from '../../config/index'
import { getUserToken } from '../../helpers/helpersFunctions'

describe('Agencies controller endpoint', () => {
	const newAgency = {
		name: `${Math.random().toString(10).substring(7)}`,
		fee_id: 1,
		address_id: 5,
	}

	let agency_id: number
	beforeAll(async () => {
		const response = await request(BASE_URL)
			.post('/agencies')
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send(newAgency)
		agency_id = response.body.agency_id
	})
	afterAll(async () => {
		await request(BASE_URL)
			.delete(`/agencies/${agency_id}`)
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send()
	})
	it('one agency should return 200', async () => {
		const response = await request(BASE_URL)
			.get(`/agencies/${agency_id}`)
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send()
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('all agencies should return 200', async () => {
		const response = await request(BASE_URL)
			.get('/agencies')
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send()
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('should return agencies', async () => {
		const response = await request(BASE_URL)
			.get('/agencies')
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send()
		expect(response.body.length >= 1).toBe(true)
	})
})
