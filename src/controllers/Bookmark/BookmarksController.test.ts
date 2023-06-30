import request from 'supertest'
import { getUserToken } from '../../helpers/helpersFunctions'
import { BASE_URL } from '../../config/index'

describe('Bookmarks controller endpoint', () => {
	const newBookmark = {
		user_id: 57,
		property_id: 4,
	}

	let bookmark_id: number
	beforeAll(async () => {
		const response = await request(BASE_URL)
			.post('/bookmarks')
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send(newBookmark)
		bookmark_id = response.body.bookmark_id
	})
	afterAll(async () => {
		await request(BASE_URL)
			.delete(`/bookmarks/${bookmark_id}`)
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send()
	})
	it('one bookmark should return 200', async () => {
		const response = await request(BASE_URL)
			.get(`/bookmarks/${bookmark_id}`)
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send()
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('all bookmarks should return 200', async () => {
		const response = await request(BASE_URL)
			.get('/bookmarks')
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send()
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('should return bookmarks', async () => {
		const response = await request(BASE_URL)
			.get('/bookmarks')
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send()
		expect(response.body.length >= 1).toBe(true)
	})
})
