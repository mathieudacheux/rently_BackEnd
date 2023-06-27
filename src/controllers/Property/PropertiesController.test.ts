import request from 'supertest'
import { BASE_URL } from '../../config/index'

describe('Properties controller endpoint', () => {
	const newProperty = {
		name: 'PropertyTest',
		description: 'test',
		signature_date: null,
		property_type: 1,
		price: 200000,
		surface: '12.5',
		land_size: '12.5',
		bathroom: 1,
		kitchen: 1,
		toilet: 1,
		bedroom: 1,
		elevator: true,
		balcony: true,
		terrace: true,
		cellar: true,
		parking: true,
		number_room: 1,
		pool: true,
		caretaker: true,
		fiber_deployed: true,
		duplex: true,
		top_floor: true,
		garage: true,
		work_done: true,
		life_annuity: true,
		ground_floor: true,
		land_size_1: '12.5',
		garden: true,
		owner_id: 47,
		status_id: 6,
		tenant_id: 57,
		address_id: 5,
		dpe: 1,
		agency_id: 6,
	}

	let property_id: number
	beforeAll(async () => {
		property_id = (await request(BASE_URL).post('/properties').send(newProperty)).body
			.property_id
	})
	afterAll(async () => {
		await request(BASE_URL).delete(`/properties/${property_id}`)
	})
	it('one property should return 200', async () => {
		const response = await request(BASE_URL).get(`/properties/${property_id}`)
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('all properties should return 200', async () => {
		const response = await request(BASE_URL).get('/properties')
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('should return properties', async () => {
		const response = await request(BASE_URL).get('/properties')
		expect(response.body.length >= 1).toBe(true)
	})
})
