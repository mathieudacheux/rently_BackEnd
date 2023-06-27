import request from 'supertest'
import { getUserToken } from '../../helpers/helpersFunctions'
import { BASE_URL } from '../../config/index'

describe('Articles controller endpoint', () => {
	const newArticle = {
		name: `${Math.random().toString(10).substring(7)}`,
		content: `${Math.random().toString(10).substring(7)}`,
		tag_id: 10,
		user_id: 57,
	}

	let article_id: number
	beforeAll(async () => {
		const response = await request(BASE_URL)
			.post('/articles')
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send(newArticle)
		article_id = response.body.article_id
	})
	afterAll(async () => {
		await request(BASE_URL)
			.delete(`/articles/${article_id}`)
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send()
	})
	it('one article should return 200', async () => {
		const response = await request(BASE_URL)
			.get(`/articles/${article_id}`)
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send()
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('all articles should return 200', async () => {
		const response = await request(BASE_URL)
			.get('/articles')
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send()
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('should return articles', async () => {
		const response = await request(BASE_URL)
			.get('/articles')
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send()
		expect(response.body.length >= 1).toBe(true)
	})
})
