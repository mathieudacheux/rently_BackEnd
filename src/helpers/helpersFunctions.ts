import request from 'supertest'
import { AUTHORIZED_MAIL, AUTHORIZED_PASSWORD, BASE_URL } from '../config/index'
import { PrismaService } from '../services/PrismaService'
import { JWT_SECRET } from '../constants'
import { decode, verify, sign } from 'jsonwebtoken'

async function getUserToken() {
	const prisma = new PrismaService()

	const tokenGeneration = sign({ role_id: 2, user_id: 57 }, JWT_SECRET, {
		expiresIn: '12h',
	})

	const userToken = await request(BASE_URL).post('/authentifications').send({
		mail: AUTHORIZED_MAIL,
		password: AUTHORIZED_PASSWORD,
	})

	const decoded = !userToken.body.token
		? decode(tokenGeneration)
		: decode(userToken.body.token)
	const { exp } = decoded as { exp: number }

	if (Date.now() >= exp * 1000) {
		await prisma.user.update({
			where: { user_id: 57 },
			data: {
				token: tokenGeneration,
			},
		})

		const newTokenVerify = verify(tokenGeneration, JWT_SECRET)

		if (!newTokenVerify) {
			throw new Error('Token not valid')
		}

		return tokenGeneration
	}

	return userToken.body.token
}

export { getUserToken }
