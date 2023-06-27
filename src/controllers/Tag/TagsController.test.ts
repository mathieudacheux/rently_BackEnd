import request from 'supertest'
import { BASE_URL } from '../../config/index'

describe('Tags controller endpoint', () => {
	const newTag = {
		name: 'tagTest',
	}

	let tag_id: number
	beforeAll(async () => {
		tag_id = (await request(BASE_URL).post('/tags').send(newTag)).body.tag_id
	})
	afterAll(async () => {
		await request(BASE_URL).delete(`/tags/${tag_id}`)
	})
	it('one tag should return 200', async () => {
		const response = await request(BASE_URL).get(`/tags/${tag_id}`)
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('all tags should return 200', async () => {
		const response = await request(BASE_URL).get('/tags')
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('should return tags', async () => {
		const response = await request(BASE_URL).get('/tags')
		expect(response.body.length >= 1).toBe(true)
	})
})
