import { User } from '@prisma/client'
import { Inject } from '@tsed/di'
import { Controller, BodyParams } from '@tsed/common'
import { PrismaService } from '../../services/PrismaService'
import { Post, Returns, Summary } from '@tsed/schema'
import { NotFound, BadRequest } from '@tsed/exceptions'
import { compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { AuthSerializer } from '../../models/AuthentificationModel'
import i18n from '../../translations/i18n'
import * as dotenv from 'dotenv'

dotenv.config()

class UserAuth implements Partial<User> {
	token: string | null
}

@Controller('/')
export class Authentifications {
	@Inject()
	protected prisma: PrismaService
	protected i18n = i18n

	@Post('/')
	@Summary('Login an user and return a token')
	@Returns(200).Of(AuthSerializer).Groups('read')
	async login(
		@BodyParams('mail') mail: string,
		@BodyParams('password') password: string
	): Promise<UserAuth> {
		const user = await this.prisma.user.findUnique({
			where: { mail },
		})

		if (!user) {
			throw new NotFound(this.i18n.t('idNotFound', { id: 'user' }))
		}

		if (!(await compare(password, user.password))) {
			throw new BadRequest(this.i18n.t('wrongPassword'))
		}

		const tokenGeneration = jwt.sign(
			{ role_id: user.role_id, user_id: user.user_id },
			process.env.JWT_SECRET || '',
			{
				algorithm: 'HS256',
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

		const decoded = !user.token ? jwt.decode(tokenGeneration) : jwt.decode(user.token)

		const { exp } = decoded as { exp: number }

		if (Date.now() >= exp * 1000) {
			await this.prisma.user.update({
				where: { user_id: user.user_id },
				data: {
					token: tokenGeneration,
				},
			})

			const newTokenVerify = jwt.verify(tokenGeneration, process.env.JWT_SECRET || '')

			if (!newTokenVerify) {
				throw new BadRequest(this.i18n.t('tokenInvalid'))
			}

			return {
				token: tokenGeneration,
			}
		}

		const tokenVerify = jwt.verify(user.token, process.env.JWT_SECRET || '')

		if (!tokenVerify) {
			throw new BadRequest(this.i18n.t('tokenInvalid'))
		}

		return {
			token: user.token,
		}
	}
}
