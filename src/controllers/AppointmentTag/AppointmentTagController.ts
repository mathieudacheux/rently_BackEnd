import { Controller, Get, PathParams } from '@tsed/common'
import { Inject } from '@tsed/di'
import { PrismaService } from '../../services/PrismaService'
import { Returns, Summary } from '@tsed/schema'
import { AppointmentTagSerializer } from '../../models/AppointmentTagModel'
import i18n from '../../translations/i18n'

@Controller('/')
export class AppointmentTags {
	@Inject()
	protected prisma: PrismaService
	protected i18n = i18n

	@Get('/')
	@Summary('Return a list of appointments tags')
	@Returns(200, Array).Of(AppointmentTagSerializer).Groups('read')
	async getAppointmentTags(): Promise<AppointmentTagSerializer[]> {
		const allAppointmentTags = await this.prisma.appointment_tag.findMany()

		if (!allAppointmentTags) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('notFound'),
			}

			throw errorObject
		}

		return allAppointmentTags
	}

	@Get('/:id')
	@Summary('Return an appointment tags by his id')
	@Returns(200, AppointmentTagSerializer).Groups('read')
	async getAppointmentTagById(@PathParams('id') id: number) {
		const uniqueAppointmentTag = await this.prisma.appointment_tag.findUnique({
			where: { appointment_tag_id: id },
		})

		if (!uniqueAppointmentTag) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('idNotFound', { id }),
			}

			throw errorObject
		}

		return uniqueAppointmentTag
	}
}
