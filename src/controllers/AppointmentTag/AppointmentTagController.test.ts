import request from 'supertest'
import { BASE_URL } from '../../config/index'
import { getUserToken } from '../../helpers/helpersFunctions'

describe('Appointment tags controller endpoint', () => {
	it('one appointment should return 200', async () => {
		const response = await request(BASE_URL)
			.get(`/appointment_tags/1`)
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send()
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('all appointments should return 200', async () => {
		const response = await request(BASE_URL)
			.get('/appointment_tags')
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send()
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('should return appointments', async () => {
		const response = await request(BASE_URL)
			.get('/appointment_tags')
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send()
		expect(response.body.length >= 1).toBe(true)
	})
})
