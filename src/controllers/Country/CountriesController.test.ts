import request from 'supertest'
import { getUserToken } from '../../helpers/helpersFunctions'
import { BASE_URL } from '../../config'

describe('Countries controller endpoint', () => {
	const newCountry = {
		name: `${Math.random().toString(10).substring(7)}`,
	}

	let country_id: number
	beforeAll(async () => {
		const response = await request(BASE_URL)
			.post('/countries')
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send(newCountry)
		country_id = response.body.country_id
	})
	afterAll(async () => {
		await request(BASE_URL)
			.delete(`/countries/${country_id}`)
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send()
	})
	it('one country should return 200', async () => {
		const response = await request(BASE_URL)
			.get(`/countries/${country_id}`)
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send()
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('all countries should return 200', async () => {
		const response = await request(BASE_URL)
			.get('/countries')
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send()
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('should return countries', async () => {
		const response = await request(BASE_URL)
			.get('/countries')
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send()
		expect(response.body.length >= 1).toBe(true)
	})
})
