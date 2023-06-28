import { User } from '@prisma/client'
import { Inject } from '@tsed/di'
import { Controller, BodyParams } from '@tsed/common'
import { PrismaService } from '../../services/PrismaService'
import { Post, Returns, Summary } from '@tsed/schema'
import { NotFound, BadRequest } from '@tsed/exceptions'
import { compare } from 'bcrypt'
import { decode, sign, verify } from 'jsonwebtoken'
import { JWT_SECRET } from '../../constants'

class UserAuth implements Partial<User> {
	token: string | null
}

@Controller('/')
export class Authentifications {
	@Inject()
	protected prisma: PrismaService

	@Post('/')
	@Summary('Login an user and return a token')
	@Returns(200, UserAuth)
	@Returns(404, String).Description('Not found')
	@Returns(400, String).Description('Bad request')
	async login(
		@BodyParams('mail') mail: string,
		@BodyParams('password') password: string
	): Promise<UserAuth> {
		const user = await this.prisma.user.findUnique({
			where: { mail },
		})

		if (!user) {
			throw new NotFound('User not found')
		}

		if (!(await compare(password, user.password))) {
			throw new BadRequest('Wrong password')
		}

		const tokenGeneration = sign(
			{ role_id: user.role_id, user_id: user.user_id },
			JWT_SECRET,
			{
				expiresIn: '12h',
			}
		)

		if (!user.token) {
			await this.prisma.user.update({
				where: { user_id: user.user_id },
				data: { token: tokenGeneration },
			})

			return {
				token: tokenGeneration,
			}
		}

		const decoded = !user.token ? decode(tokenGeneration) : decode(user.token)

		const { exp } = decoded as { exp: number }

		if (Date.now() >= exp * 1000) {
			await this.prisma.user.update({
				where: { user_id: user.user_id },
				data: {
					token: tokenGeneration,
				},
			})

			const newTokenVerify = verify(tokenGeneration, JWT_SECRET)

			if (!newTokenVerify) {
				throw new BadRequest('Token not valid')
			}

			return {
				token: tokenGeneration,
			}
		}
		const tokenVerify = verify(user.token, JWT_SECRET)

		if (!tokenVerify) {
			throw new BadRequest('Token not valid')
		}

		return {
			token: user.token,
		}
	}
}
