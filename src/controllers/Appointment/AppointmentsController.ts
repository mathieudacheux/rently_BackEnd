import {
	Controller,
	Get,
	PathParams,
	Post,
	BodyParams,
	Put,
	Delete,
	UseBeforeEach,
} from '@tsed/common'
import { Inject } from '@tsed/di'
import { PrismaService } from '../../services/PrismaService'
import { Returns, Summary, Groups, Required } from '@tsed/schema'
import { AppointmentSerializer } from '../../models/AppointmentModel'
import AuthentificationMiddleware from '../../middlewares/AuthentificationMiddleware'

@Controller('/')
export class Appointments {
	@Inject()
	protected prisma: PrismaService

	@UseBeforeEach(AuthentificationMiddleware)
	@Get('/')
	@Summary('Return a list of all appointments')
	@Returns(200, Array).Of(AppointmentSerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async getAllAppointments(): Promise<AppointmentSerializer[]> {
		return this.prisma.appointment.findMany()
	}

	@Get('/:id')
	@Summary('Return a appointment by his id')
	@Returns(200, AppointmentSerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async getAppointmentById(
		@PathParams('id') appointment_id: number
	): Promise<AppointmentSerializer | null> {
		return this.prisma.appointment.findUnique({ where: { appointment_id } })
	}

	@Post('/')
	@Summary('Create a new appointment')
	@Returns(200, AppointmentSerializer).Groups('read')
	@Returns(400, String).Description('Bad request')
	async createAppointment(
		@Required() @BodyParams() @Groups('post') appointment: AppointmentSerializer
	) {
		return this.prisma.appointment.create({ data: appointment })
	}

	@Put('/:id')
	@Summary('Update a appointment by its id')
	@Returns(200, AppointmentSerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async updateAppointment(
		@PathParams('id') appointment_id: number,
		@BodyParams()
		@Groups('put')
		appointment: AppointmentSerializer
	): Promise<AppointmentSerializer> {
		return this.prisma.appointment.update({
			where: { appointment_id },
			data: appointment,
		})
	}

	@Delete('/:id')
	@Summary('Delete a appointment by its id')
	@Returns(204)
	@Returns(404, String).Description('Not found')
	async deleteAppointment(@PathParams('id') appointment_id: number): Promise<void> {
		await this.prisma.appointment.delete({ where: { appointment_id } })
	}
}
