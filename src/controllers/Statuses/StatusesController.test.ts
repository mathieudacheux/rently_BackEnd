import request from 'supertest'

const baseURL = 'http://localhost:8083'

describe('GET /status', () => {
	const newStatus = {
		name: 'test' + new Date().getTime(),
	}

	let status_id: number
	beforeAll(async () => {
		status_id = (await request(baseURL).post('/statuses').send(newStatus)).body.status_id
	})
	afterAll(async () => {
		await request(baseURL).delete(`/statuses/${status_id}`)
	})
	it('one status should return 200', async () => {
		const response = await request(baseURL).get(`/statuses/${status_id}`)
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('all status should return 200', async () => {
		const response = await request(baseURL).get('/statuses')
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('should return status', async () => {
		const response = await request(baseURL).get('/statuses')
		expect(response.body.length >= 1).toBe(true)
	})
})
