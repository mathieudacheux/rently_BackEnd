import request from 'supertest'
import { BASE_URL } from '../../config/index'

describe('Addresses controller endpoint', () => {
	const newAddress = {
		address: `${Math.random().toString(36).substring(7)}`,
		city: `${Math.random().toString(36).substring(7)}`,
		zipcode: '80000',
		additionnal_info: `Encore plus d'informations`,
		longitude: `${Math.random().toString(5).substring(7)}`,
		latitude: `${Math.random().toString(5).substring(7)}`,
	}

	let address_id: number
	beforeAll(async () => {
		address_id = (await request(BASE_URL).post('/addresses').send(newAddress)).body
			.address_id
	})
	afterAll(async () => {
		await request(BASE_URL).delete(`/addresses/${address_id}`)
	})
	it('one address should return 200', async () => {
		const response = await request(BASE_URL).get(`/addresses/${address_id}`)
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('all addresses should return 200', async () => {
		const response = await request(BASE_URL).get('/addresses')
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('should return addresses', async () => {
		const response = await request(BASE_URL).get('/addresses')
		expect(response.body.length >= 1).toBe(true)
	})
})
