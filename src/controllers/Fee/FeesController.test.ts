import request from 'supertest'
import { getUserToken } from '../../helpers/helpersFunctions'
import { BASE_URL } from '../../config'

describe('Fees controller endpoint', () => {
	const newFee = {
		rent_fee: '10.1',
		sell_fee: '11.1',
		square_fee: '12.1',
		gestion_fee: '13.12',
	}

	let fee_id: number
	beforeAll(async () => {
		const response = await request(BASE_URL)
			.post('/fees')
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send(newFee)
		fee_id = response.body.fee_id
	})
	afterAll(async () => {
		await request(BASE_URL)
			.delete(`/fees/${fee_id}`)
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send()
	})
	it('one fee should return 200', async () => {
		const response = await request(BASE_URL)
			.get(`/fees/${fee_id}`)
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send()
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('all fees should return 200', async () => {
		const response = await request(BASE_URL)
			.get('/fees')
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send()
		expect(response.statusCode).toBe(200)
		expect(response.error).toBe(false)
	})
	it('should return fees', async () => {
		const response = await request(BASE_URL)
			.get('/fees')
			.set('Authorization', `Bearer ${await getUserToken()}`)
			.send()
		expect(response.body.length >= 1).toBe(true)
	})
})
