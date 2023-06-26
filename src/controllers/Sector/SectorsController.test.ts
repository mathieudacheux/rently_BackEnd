import request from 'supertest'

const baseURL = 'http://localhost:8083'

describe('GET /sectors', () => {
	const newSector = {
		name: `${Math.random().toString(36).substring(7)}@test.com`,
		polygon: 'test',
		agency_id: 1,
	}

	let sector_id: number
	beforeAll(async () => {
		sector_id = (await request(baseURL).post('/sectors').send(newSector)).body.sector_id
	})
	afterAll(async () => {
		await request(baseURL).delete(`/sectors/${sector_id}`)
	})
	it('one sector should return 200', async () => {
		const response = await request(baseURL).get(`/sectors/${sector_id}`)
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('all sectors should return 200', async () => {
		const response = await request(baseURL).get('/sectors')
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('should return sectors', async () => {
		const response = await request(baseURL).get('/sectors')
		expect(response.body.length >= 1).toBe(true)
	})
})
