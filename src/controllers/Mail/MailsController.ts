import { BodyParams, Controller, Post } from '@tsed/common'
import { Inject } from '@tsed/di'
import { Returns, Summary } from '@tsed/schema'
import jwt from 'jsonwebtoken'
import sendEmail from '../../helpers/sendEmail'
import { PrismaService } from '../../services/PrismaService'
import i18n from '../../translations/i18n'
import { TEMPLATES } from '../../constants'
import * as dotenv from 'dotenv'

dotenv.config()

@Controller('/')
export class Mails {
	@Inject()
	protected prisma: PrismaService

	protected i18n = i18n

	@Post('/mail_confirm/')
	@Summary('Send a mail with sendingblue')
	@Returns(201).Groups('read')
	@Returns(400, String).Description('Bad request')
	async confirmAccountMail(@BodyParams('id') id: number) {
		const user = await this.prisma.user.findUnique({ where: { user_id: id } })
		const title = this.i18n.t('mail.confirmEmail.title')
		const subject = this.i18n.t('mail.confirmEmail.subject')
		const subjectDetails = this.i18n.t('mail.confirmEmail.subjectDetails')
		const callToAction = this.i18n.t('mail.confirmEmail.callToAction')
		const linkDetail = this.i18n.t('mail.confirmEmail.linkDetail')

		const tokenGeneration = jwt.sign(
			{ user_id: user?.user_id },
			process.env.JWT_SECRET || '',
			{
				algorithm: 'HS256',
				expiresIn: '12h',
			}
		)

		const link = `https://front-rently.mathieudacheux.fr/validate-account?token=${tokenGeneration}`

		return sendEmail(
			TEMPLATES.EMAIL_CONFIRMATION,
			title,
			subject,
			subjectDetails,
			callToAction,
			link,
			linkDetail,
			user
		)
	}

	@Post('/reset_password/')
	@Summary('Send a mail with sendingblue')
	@Returns(201).Groups('read')
	@Returns(400, String).Description('Bad request')
	async resetPasswordMail(@BodyParams('id') id: number) {
		const user = await this.prisma.user.findUnique({ where: { user_id: id } })
		const title = this.i18n.t('mail.resetPassword.title')
		const subject = this.i18n.t('mail.resetPassword.subject')
		const subjectDetails = this.i18n.t('mail.resetPassword.subjectDetails')
		const callToAction = this.i18n.t('mail.resetPassword.callToAction')
		const linkDetail = this.i18n.t('mail.resetPassword.linkDetail')

		const tokenGeneration = jwt.sign(
			{ user_id: user?.user_id },
			process.env.JWT_SECRET || '',
			{
				algorithm: 'HS256',
				expiresIn: '12h',
			}
		)

		const link = `https://front-rently.mathieudacheux.fr/forgot-password?token=${tokenGeneration}`

		return sendEmail(
			TEMPLATES.RESET_PASSWORD,
			title,
			subject,
			subjectDetails,
			callToAction,
			link,
			linkDetail,
			user
		)
	}
}
