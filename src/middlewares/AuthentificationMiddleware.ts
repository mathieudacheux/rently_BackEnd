import { Middleware, Req, Next, MiddlewareMethods } from '@tsed/common'
import { Unauthorized } from '@tsed/exceptions'
import { verify } from 'jsonwebtoken'
import { JWT_SECRET } from '../constants'
import { JWTDecoded } from '../types'
import { PrismaClient } from '@prisma/client'
@Middleware()
export default class AuthentificationMiddleware implements MiddlewareMethods {
	async use(@Req() req: Req, @Next() next: Next): Promise<void> {
		const prisma = new PrismaClient()

		if (!req.headers['authorization']) {
			throw new Unauthorized('Unauthorized')
		}

		const token = req.headers['authorization']?.split(' ')[1]

		try {
			const decoded = verify(token, JWT_SECRET) as unknown as JWTDecoded
			const userId = decoded.user_id

			if (!userId) {
				throw new Unauthorized('Unauthorized')
			}

			const getUserById = await prisma.user.findUnique({
				where: { user_id: userId } && { token: token },
			})

			if (!getUserById) {
				throw new Unauthorized('Unauthorized')
			}

			next()
		} catch (err) {
			throw new Unauthorized('Unauthorized')
		}
	}
}
