import request from 'supertest'
import { BASE_URL } from '../../config/index'

describe('Sectors controller endpoint', () => {
	const newSector = {
		name: 'SectorTest',
		polygon: 'polygon',
		agency_id: 6,
	}

	let sector_id: number
	beforeAll(async () => {
		sector_id = (await request(BASE_URL).post('/sectors').send(newSector)).body.sector_id
	})
	afterAll(async () => {
		await request(BASE_URL).delete(`/sectors/${sector_id}`)
	})
	it('one sector should return 200', async () => {
		const response = await request(BASE_URL).get(`/sectors/${sector_id}`)
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('all sectors should return 200', async () => {
		const response = await request(BASE_URL).get('/sectors')
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('should return sectors', async () => {
		const response = await request(BASE_URL).get('/addresses')
		expect(response.body.length >= 1).toBe(true)
	})
})
