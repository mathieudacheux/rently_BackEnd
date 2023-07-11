import { Controller, Get, PathParams, Post, BodyParams, Put, Delete } from '@tsed/common'
import { Inject } from '@tsed/di'
import { PrismaService } from '../../services/PrismaService'
import { Returns, Summary, Groups, Required } from '@tsed/schema'
import { StatusSerializer } from '../../models/StatusModel'
import i18n from '../../translations/i18n'

@Controller('/')
export class Statuses {
	@Inject()
	protected prisma: PrismaService
	protected i18n = i18n

	@Get('/')
	@Summary('Return a list of all statuses')
	@Returns(200, Array).Of(StatusSerializer).Groups('read')
	async getAllStatus(): Promise<StatusSerializer[]> {
		const allStatuses = await this.prisma.status.findMany()

		if (!allStatuses) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('notFound'),
			}

			throw errorObject
		}

		return allStatuses
	}

	@Get('/:id')
	@Summary('Return a status by his id')
	@Returns(200, StatusSerializer).Groups('read')
	async getStatusById(@PathParams('id') status_id: number) {
		const uniqueStatus = await this.prisma.status.findUnique({ where: { status_id } })

		if (!uniqueStatus) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('idNotFound', { id: status_id }),
			}

			throw errorObject
		}

		return uniqueStatus
	}

	@Post('/')
	@Summary('Create a new status')
	@Returns(201, StatusSerializer).Groups('read')
	@Returns(400, String).Description('Bad request')
	async createStatus(@Required() @BodyParams() @Groups('post') status: StatusSerializer) {
		return await this.prisma.status.create({ data: status })
	}

	@Put('/:id')
	@Summary('Update a status by its id')
	@Returns(200, StatusSerializer).Groups('read')
	async updateStatus(
		@PathParams('id') id: number,
		@BodyParams()
		@Groups('put')
		status: StatusSerializer
	): Promise<StatusSerializer> {
		const updateStatus = await this.prisma.status.update({
			where: { status_id: id },
			data: status,
		})

		if (!updateStatus) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('idNotFound', { id }),
			}

			throw errorObject
		}

		return updateStatus
	}

	@Delete('/:id')
	@Summary('Delete a status by its id')
	@Returns(204)
	async deleteStatus(@PathParams('id') status_id: number): Promise<void> {
		const deleteStatus = await this.prisma.status.delete({ where: { status_id } })

		if (!deleteStatus) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('idNotFound', { id: status_id }),
			}

			throw errorObject
		}
	}
}
