import { Controller, PathParams, Post } from '@tsed/common'
import { Inject } from '@tsed/di'
import { Returns, Summary } from '@tsed/schema'
import sendEmail from '../../helpers/sendEmail'
import { PrismaService } from '../../services/PrismaService'

@Controller('/')
export class Mails {
	@Inject()
	protected prisma: PrismaService

	@Post('/mail_confirm/:id')
	@Summary('Send a mail with sendingblue')
	@Returns(201).Groups('read')
	@Returns(400, String).Description('Bad request')
	async confirmAccountMail(@PathParams('id') id: number) {
		const user = await this.prisma.user.findUnique({ where: { user_id: id } })
		return sendEmail('EMAIL_CONFIRMATION', user)
	}
	@Post('/reset_password/:id')
	@Summary('Send a mail with sendingblue')
	@Returns(201).Groups('read')
	@Returns(400, String).Description('Bad request')
	async resetPasswordMail(@PathParams('id') id: number) {
		const user = await this.prisma.user.findUnique({ where: { user_id: id } })
		return sendEmail('PASSWORD_RESET', user)
	}
}
