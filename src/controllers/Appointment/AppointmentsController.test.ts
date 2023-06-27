import request from 'supertest'

const baseURL = 'http://localhost:8083'

describe('Appointments controller endpoint', () => {
	const newAppointment = {
		tag: 1,
		date_start: new Date(),
		date_end: new Date(),
		note: `${Math.random().toString(10).substring(7)}`,
		reminder: new Date(),
		property_id: 1,
		user_id: 5,
	}

	let appointment_id: number
	beforeAll(async () => {
		appointment_id = (await request(baseURL).post('/appointments').send(newAppointment))
			.body.appointment_id
	})
	afterAll(async () => {
		await request(baseURL).delete(`/appointments/${appointment_id}`)
	})
	it('one appointment should return 200', async () => {
		const response = await request(baseURL).get(`/appointments/${appointment_id}`)
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('all appointments should return 200', async () => {
		const response = await request(baseURL).get('/appointments')
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('should return appointments', async () => {
		const response = await request(baseURL).get('/appointments')
		expect(response.body.length >= 1).toBe(true)
	})
})
