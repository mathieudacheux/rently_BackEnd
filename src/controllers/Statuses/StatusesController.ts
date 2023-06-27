import { Controller, Get, PathParams, Post, BodyParams, Put, Delete } from '@tsed/common'
import { Inject } from '@tsed/di'
import { PrismaService } from '../../services/PrismaService'
import { Returns, Summary, Groups, Required } from '@tsed/schema'
import { StatusSerializer } from '../../models/StatusModel'

@Controller('/')
export class Statuses {
	@Inject()
	protected prisma: PrismaService

	@Get('/')
	@Summary('Return a list of all statuses')
	@Returns(200, Array).Of(StatusSerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async getAllStatus(): Promise<StatusSerializer[]> {
		return this.prisma.status.findMany()
	}

	@Get('/:id')
	@Summary('Return a status by his id')
	@Returns(200, StatusSerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async getStatusById(@PathParams('id') status_id: number) {
		return this.prisma.status.findUnique({ where: { status_id } })
	}

	@Post('/')
	@Summary('Create a new status')
	@Returns(201, StatusSerializer).Groups('read')
	@Returns(400, String).Description('Bad request')
	async createStatus(@Required() @BodyParams() @Groups('post') status: StatusSerializer) {
		return this.prisma.status.create({ data: status })
	}

	@Put('/:id')
	@Summary('Update a status by its id')
	@Returns(200, StatusSerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async updateStatus(
		@PathParams('id') id: number,
		@BodyParams()
		@Groups('put')
		status: StatusSerializer
	): Promise<StatusSerializer> {
		return this.prisma.status.update({
			where: { status_id: id },
			data: status,
		})
	}

	@Delete('/:id')
	@Summary('Delete a status by its id')
	@Returns(204)
	@Returns(404, String).Description('Not found')
	async deleteStatus(@PathParams('id') status_id: number): Promise<void> {
		await this.prisma.status.delete({ where: { status_id } })
	}
}
