import request from 'supertest'
import { BASE_URL } from '../../config/index'
import { getUserToken } from '../../helpers/helpersFunctions'

describe('Appointments controller endpoint', () => {
	const newAppointment = {
		tag: 1,
		date_start: new Date(),
		date_end: new Date(),
		note: `${Math.random().toString(10).substring(7)}`,
		reminder: new Date(),
		property_id: 1,
		user_id: 47,
	}

	let appointment_id: number
	beforeAll(async () => {
		const response = await request(BASE_URL)
			.post('/appointments')
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send(newAppointment)
		appointment_id = response.body.appointment_id
	})
	afterAll(async () => {
		await request(BASE_URL)
			.delete(`/appointments/${appointment_id}`)
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send()
	})
	it('one appointment should return 200', async () => {
		const response = await request(BASE_URL)
			.get(`/appointments/${appointment_id}`)
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send()
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('all appointments should return 200', async () => {
		const response = await request(BASE_URL)
			.get('/appointments')
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send()
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('should return appointments', async () => {
		const response = await request(BASE_URL)
			.get('/appointments')
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send()
		expect(response.body.length >= 1).toBe(true)
	})
})
