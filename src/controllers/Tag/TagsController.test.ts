import request from 'supertest'

const baseURL = 'http://localhost:8083'

describe('GET /tags', () => {
	const newTag = {
		name: 'test',
	}

	let tag_id: number
	beforeAll(async () => {
		tag_id = (await request(baseURL).post('/tags').send(newTag)).body.tag_id
	})
	afterAll(async () => {
		await request(baseURL).delete(`/tags/${tag_id}`)
	})
	it('one tag should return 200', async () => {
		const response = await request(baseURL).get(`/tags/${tag_id}`)
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('all tags should return 200', async () => {
		const response = await request(baseURL).get('/tags')
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('should return tags', async () => {
		const response = await request(baseURL).get('/tags')
		expect(response.body.length >= 1).toBe(true)
	})
})
