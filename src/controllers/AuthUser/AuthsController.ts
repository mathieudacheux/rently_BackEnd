import { User } from '@prisma/client'
import { Inject } from '@tsed/di'
import { Controller, BodyParams } from '@tsed/common'
import { PrismaService } from '../../services/PrismaService'
import { Post, Returns, Summary } from '@tsed/schema'
import { NotFound, BadRequest } from '@tsed/exceptions'
import { compare } from 'bcrypt'
import { sign, verify } from 'jsonwebtoken'
import { JWT_SECRET } from '../../constants'

class UserAuth implements Partial<User> {
	user_id: number
	mail: string
	password: string
	token: string | null
}

@Controller('/')
export class Auths {
	@Inject()
	protected prisma: PrismaService

	@Post('/')
	@Summary('Login an user')
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

		if (!user.token) {
			await this.prisma.user.update({
				where: { user_id: user.user_id },
				data: { token: sign({ user_id: user.user_id }, JWT_SECRET) },
			})
			return user
		}

		const decoded = verify(user.token, JWT_SECRET)
		const { exp } = decoded as { exp: number }

		if (!(exp < Date.now())) {
			const token = sign({ user_id: user.user_id }, JWT_SECRET, {
				expiresIn: '12h',
			})

			await this.prisma.user.update({
				where: { user_id: user.user_id },
				data: {
					token,
				},
			})
			return user
		}
		return user
	}
}
