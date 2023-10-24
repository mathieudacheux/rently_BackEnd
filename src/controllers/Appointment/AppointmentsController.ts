import {
	Controller,
	Get,
	PathParams,
	Post,
	BodyParams,
	Put,
	Delete,
	UseBeforeEach,
	QueryParams,
} from '@tsed/common'
import { Inject } from '@tsed/di'
import { PrismaService } from '../../services/PrismaService'
import { Returns, Summary, Groups, Required } from '@tsed/schema'
import { AppointmentSerializer } from '../../models/AppointmentModel'
import AuthentificationMiddleware from '../../middlewares/AuthentificationMiddleware'
import i18n from '../../translations/i18n'

@Controller('/')
export class Appointments {
	@Inject()
	protected prisma: PrismaService
	protected i18n = i18n

	@UseBeforeEach(AuthentificationMiddleware)
	@Get('/')
	@Summary('Return a list of all appointments')
	@Returns(200, Array).Of(AppointmentSerializer).Groups('read')
	async getAllAppointments(): Promise<AppointmentSerializer[]> {
		const allAppointments = await this.prisma.appointment.findMany()

		if (!allAppointments) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('notFound'),
			}

			throw errorObject
		}

		return allAppointments
	}

	@Get('/appointments_filter')
	@Summary('Return a list of appointments by filter')
	@Returns(200, Array).Of(AppointmentSerializer).Groups('read')
	async getAppointmentsByFilter(
		@QueryParams('user_id_1') user_id_1: number,
		@QueryParams('user_id_2') user_id_2: number
	): Promise<AppointmentSerializer[]> {
		if (!user_id_1 && !user_id_2) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('notFound'),
			}

			throw errorObject
		}

		const user1 = await this.prisma.user.findUnique({
			where: { user_id: user_id_1 },
		})

		if (!user1) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('idNotFound', { id: user_id_1 }),
			}

			throw errorObject
		}

		const user2 = await this.prisma.user.findUnique({
			where: { user_id: user_id_2 },
		})

		if (!user2) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('idNotFound', { id: user_id_2 }),
			}

			throw errorObject
		}

		const getAppointment = await this.prisma.appointment.findMany({
			where: {
				user_id_1,
				user_id_2,
			},

			orderBy: { date_start: 'asc' },
		})

		if (!getAppointment) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('notFound'),
			}

			throw errorObject
		}

		return getAppointment
	}

	@Get('/:id')
	@Summary('Return a appointment by his id')
	@Returns(200, AppointmentSerializer).Groups('read')
	async getAppointmentById(
		@PathParams('id') appointment_id: number
	): Promise<AppointmentSerializer | null> {
		const uniqueAppointment = await this.prisma.appointment.findUnique({
			where: { appointment_id },
		})

		if (!uniqueAppointment) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('idNotFound', { id: appointment_id }),
			}

			throw errorObject
		}

		return uniqueAppointment
	}

	@Post('/')
	@Summary('Create a new appointment')
	@Returns(200, AppointmentSerializer).Groups('read')
	@Returns(400, String).Description('Bad request')
	async createAppointment(
		@Required() @BodyParams() @Groups('post') appointment: AppointmentSerializer
	) {
		return await this.prisma.appointment.create({ data: appointment })
	}

	@Put('/:id')
	@Summary('Update a appointment by its id')
	@Returns(200, AppointmentSerializer).Groups('read')
	async updateAppointment(
		@PathParams('id') appointment_id: number,
		@BodyParams()
		@Groups('put')
		appointment: AppointmentSerializer
	): Promise<AppointmentSerializer> {
		const updateAppointment = await this.prisma.appointment.update({
			where: { appointment_id },
			data: appointment,
		})

		if (!updateAppointment) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('idNotFound', { id: appointment_id }),
			}

			throw errorObject
		}

		return updateAppointment
	}

	@Delete('/:id')
	@Summary('Delete a appointment by its id')
	@Returns(204)
	async deleteAppointment(@PathParams('id') appointment_id: number): Promise<void> {
		const deleteAppointment = await this.prisma.appointment.delete({
			where: { appointment_id },
		})

		if (!deleteAppointment) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('idNotFound', { id: appointment_id }),
			}

			throw errorObject
		}
	}

	// get appointments by user id
	@Get('/user/:id')
	@Summary('Return a list of appointments by user id')
	@Returns(200, Array).Of().Groups('read')
	async getAppointmentsByUserId(@PathParams('id') user_id: number): Promise<
		{
			dateStart: string
			appointments: AppointmentSerializer[]
		}[]
	> {
		const user = await this.prisma.user.findUnique({
			where: { user_id },
		})

		if (!user) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('idNotFound', { id: user_id }),
			}

			throw errorObject
		}

		const getAppointments = await this.prisma.appointment.findMany({
			where: {
				user_id_1: user_id,
			},

			orderBy: { date_start: 'asc' },
		})

		const formatDate = (date: Date): string => {
			const d = new Date(date)
			let month = '' + (d.getMonth() + 1)
			let day = '' + d.getDate()
			const year = d.getFullYear()

			if (month.length < 2) month = '0' + month
			if (day.length < 2) day = '0' + day

			return [day, month, year].join('-')
		}

		if (!getAppointments) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('notFound'),
			}

			throw errorObject
		}

		const allDays: { dateStart: string; appointments: AppointmentSerializer[] }[] = []

		getAppointments.forEach((appointment) => {
			const dateStart = formatDate(appointment.date_start)

			if (!allDays.find((item) => item.dateStart === dateStart)) {
				allDays.push({ dateStart: dateStart, appointments: [] })
			}
		})

		getAppointments.forEach((appointment) => {
			const dateStart = formatDate(appointment.date_start)

			allDays.forEach((day) => {
				if (day.dateStart === dateStart) {
					day.appointments.push(appointment)
				}
			})
		})

		console.log(allDays)

		return allDays
	}
}
