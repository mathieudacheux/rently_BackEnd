import { Controller, Get, PathParams } from '@tsed/common'
import { Inject } from '@tsed/di'
import { PrismaService } from '../../services/PrismaService'
import { Returns, Summary } from '@tsed/schema'
import { AppointmentTagSerializer } from '../../models/AppointmentTagModel'

@Controller('/')
export class AppointmentTags {
	@Inject()
	protected prisma: PrismaService

	@Get('/')
	@Summary('Return a list of appointments tags')
	@Returns(200, Array).Of(AppointmentTagSerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async getAppointmentTags(): Promise<AppointmentTagSerializer[]> {
		return this.prisma.appointment_tag.findMany()
	}

	@Get('/:id')
	@Summary('Return an appointment tags by his id')
	@Returns(200, AppointmentTagSerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async getAppointmentTagById(@PathParams('id') id: number) {
		return this.prisma.appointment_tag.findUnique({ where: { appointment_tag_id: id } })
	}
}
