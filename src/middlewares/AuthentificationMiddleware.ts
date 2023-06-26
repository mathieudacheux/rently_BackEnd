import { Middleware, Req, Res, Next, MiddlewareMethods } from '@tsed/common'
import { Unauthorized } from '@tsed/exceptions'
import { verify } from 'jsonwebtoken'
import { JWT_SECRET } from '../constants'
// import UserModel from 'src/controllers/User/UsersController'

@Middleware()
export default class AuthentificationMiddleware implements MiddlewareMethods {
	async use(@Req() req: Req, @Res() res: Res, @Next() next: Next): Promise<void> {
		const token = req.headers['Authorization'] as string

		if (!token) {
			throw new Unauthorized('Unauthorized')
		}

		try {
			const decoded = verify(token, JWT_SECRET)

			console.log(decoded)

			next()
		} catch (err) {
			throw new Unauthorized('Unauthorized')
		}
	}
}
