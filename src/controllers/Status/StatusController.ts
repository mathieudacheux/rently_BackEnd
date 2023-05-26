import { Controller, Get, PathParams, Post, BodyParams, Put, Delete } from '@tsed/common'
import { Inject } from '@tsed/di'
import { PrismaService } from '../../services/PrismaService'
import { Returns, Summary, Groups } from '@tsed/schema'
import { Status } from '@prisma/client'

class StatusModel implements Status {
	@Groups('!creation')
	status_id: number
	name: string
	created_at: Date | null
	updated_at: Date | null
	deleted_at: Date | null
}

@Controller('/')
export class Statuses {
	@Inject()
	protected prisma: PrismaService

	@Get('/')
	@Summary('Return a list of all statuses')
	@Returns(200, Array).Of(StatusModel)
	async getAllStatus(): Promise<StatusModel[]> {
		return this.prisma.status.findMany()
	}

	@Get('/:id')
	@Summary('Return a status by his id')
	@Returns(200, StatusModel)
	async getStatusById(@PathParams('id') status_id: number) {
		return this.prisma.status.findUnique({ where: { status_id } })
	}

	@Post('/')
	@Summary('Create a new status')
	@Returns(201, StatusModel)
	async createStatus(@BodyParams() @Groups('creation') status: StatusModel) {
		return this.prisma.status.create({ data: status })
	}

	@Put('/:id')
	@Summary('Update a status by its id')
	@Returns(200, StatusModel)
	async updateStatus(
		@PathParams('id') status_id: number,
		status: StatusModel
	): Promise<StatusModel> {
		return this.prisma.status.update({
			where: { status_id },
			data: status,
		})
	}

	@Delete('/:id')
	@Summary('Delete a status by its id')
	@Returns(204)
	async deleteStatus(@PathParams('id') status_id: number): Promise<StatusModel> {
		return this.prisma.status.delete({ where: { status_id } })
	}
}
