import request from 'supertest'
import { getUserToken } from '../../helpers/helpersFunctions'
import { BASE_URL } from '../../config'

describe('Permission controller endpoint', () => {
	const newPermission = {
		properties: JSON.stringify({
			create: true,
			delete: true,
			update: true,
			display: true,
		}),
		addresses: JSON.stringify({
			create: true,
			delete: true,
			update: true,
			display: true,
		}),
		agencies: JSON.stringify({
			create: true,
			delete: true,
			update: true,
			display: true,
		}),
		appointments: JSON.stringify({
			create: true,
			delete: true,
			update: true,
			display: true,
		}),
		articles: JSON.stringify({
			create: true,
			delete: true,
			update: true,
			display: true,
		}),
		attachments: JSON.stringify({
			create: true,
			delete: true,
			update: true,
			display: true,
		}),
		bookmarks: JSON.stringify({
			create: true,
			delete: true,
			update: true,
			display: true,
		}),
		countries: JSON.stringify({
			create: true,
			delete: true,
			update: true,
			display: true,
		}),
		fees: JSON.stringify({
			create: true,
			delete: true,
			update: true,
			display: true,
		}),
		messages: JSON.stringify({
			create: true,
			delete: true,
			update: true,
			display: true,
		}),
		roles: JSON.stringify({
			create: true,
			delete: true,
			update: true,
			display: true,
		}),
		sectors: JSON.stringify({
			create: true,
			delete: true,
			update: true,
			display: true,
		}),
		statuses: JSON.stringify({
			create: true,
			delete: true,
			update: true,
			display: true,
		}),
		tags: JSON.stringify({
			create: true,
			delete: true,
			update: true,
			display: true,
		}),
		users: JSON.stringify({
			create: true,
			delete: true,
			update: true,
			display: true,
		}),
	}

	let permission_id: number
	beforeAll(async () => {
		const response = await request(BASE_URL)
			.post('/permissions')
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send(newPermission)
		permission_id = response.body.permission_id
	})
	afterAll(async () => {
		await request(BASE_URL)
			.delete(`/permissions/${permission_id}`)
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send()
	})
	it('one permission should return 200', async () => {
		const response = await request(BASE_URL)
			.get(`/permissions/${permission_id}`)
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send()
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('all permissions should return 200', async () => {
		const response = await request(BASE_URL)
			.get('/permissions')
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send()
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('should return permissions', async () => {
		const response = await request(BASE_URL)
			.get('/permissions')
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send()
		expect(response.body.length >= 1).toBe(true)
	})
})
