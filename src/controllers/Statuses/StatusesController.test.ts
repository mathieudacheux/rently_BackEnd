import request from 'supertest'
import { BASE_URL } from '../../config/index'

describe('Status controller endpoint', () => {
	const newStatus = {
		name: 'test' + new Date().getTime(),
	}

	let status_id: number
	beforeAll(async () => {
		status_id = (await request(BASE_URL).post('/statuses').send(newStatus)).body.status_id
	})
	afterAll(async () => {
		await request(BASE_URL).delete(`/statuses/${status_id}`)
	})
	it('one status should return 200', async () => {
		const response = await request(BASE_URL).get(`/statuses/${status_id}`)
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('all status should return 200', async () => {
		const response = await request(BASE_URL).get('/statuses')
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('should return status', async () => {
		const response = await request(BASE_URL).get('/statuses')
		expect(response.body.length >= 1).toBe(true)
	})
})
