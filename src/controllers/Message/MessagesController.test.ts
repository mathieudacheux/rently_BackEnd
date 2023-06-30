import request from 'supertest'
import { getUserToken } from '../../helpers/helpersFunctions'
import { BASE_URL } from '../../config'

describe('Message controller endpoint', () => {
	const newMessage = {
		content: 'test',
		user_id_1: 47,
		user_id_2: 57,
	}

	let message_id: number
	beforeAll(async () => {
		const response = await request(BASE_URL)
			.post('/messages')
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send(newMessage)
		message_id = response.body.message_id
	})
	afterAll(async () => {
		await request(BASE_URL)
			.delete(`/messages/${message_id}`)
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send()
	})
	it('one message should return 200', async () => {
		const response = await request(BASE_URL)
			.get(`/messages/${message_id}`)
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send()
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('all messages should return 200', async () => {
		const response = await request(BASE_URL)
			.get('/messages')
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send()
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('should return messages', async () => {
		const response = await request(BASE_URL)
			.get('/messages')
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send()
		expect(response.body.length >= 1).toBe(true)
	})
})
