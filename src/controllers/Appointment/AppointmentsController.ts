import { Controller, Get, PathParams, Post, BodyParams, Put, Delete } from '@tsed/common'
import { Inject } from '@tsed/di'
import { PrismaService } from '../../services/PrismaService'
import { Returns, Summary, Groups } from '@tsed/schema'
import { Appointment } from '@prisma/client'

class AppointmentModel implements Appointment {
	@Groups('!creation')
	appointment_id: number
	tag: number
	date_start: Date
	date_end: Date
	note: string | null
	reminder: Date
	created_at: Date
	updated_at: Date | null
	deleted_at: Date | null
	property_id: number
	user_id: number
}

@Controller('/')
export class Appointments {
	@Inject()
	protected prisma: PrismaService

	@Get('/')
	@Summary('Return a list of all appointments')
	@Returns(200, Array).Of(AppointmentModel)
	async getAllAgencies(): Promise<AppointmentModel[]> {
		return this.prisma.appointment.findMany()
	}

	@Get('/:id')
	@Summary('Return a appointment by his id')
	@Returns(200, AppointmentModel)
	async getAppointmentById(@PathParams('id') appointment_id: number) {
		return this.prisma.appointment.findUnique({ where: { appointment_id } })
	}

	@Post('/')
	@Summary('Create a new appointment')
	@Returns(201, AppointmentModel)
	async createAppointment(
		@BodyParams() @Groups('creation') appointment: AppointmentModel
	) {
		return this.prisma.appointment.create({ data: appointment })
	}

	@Put('/:id')
	@Summary('Update a appointment by its id')
	@Returns(200, AppointmentModel)
	async updateAppointment(
		@PathParams('id') appointment_id: number,
		appointment: AppointmentModel
	): Promise<AppointmentModel> {
		return this.prisma.appointment.update({
			where: { appointment_id },
			data: appointment,
		})
	}

	@Delete('/:id')
	@Summary('Delete a appointment by its id')
	@Returns(204)
	async deleteAppointment(
		@PathParams('id') appointment_id: number
	): Promise<AppointmentModel> {
		return this.prisma.appointment.delete({ where: { appointment_id } })
	}
}
