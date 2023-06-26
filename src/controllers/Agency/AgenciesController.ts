import { Controller, Get, PathParams, Post, BodyParams, Put, Delete } from '@tsed/common'
import { Inject } from '@tsed/di'
import { PrismaService } from '../../services/PrismaService'
import { Returns, Summary, Groups } from '@tsed/schema'
import { Agency } from '@prisma/client'

class AgencyModel implements Agency {
	@Groups('!creation')
	agency_id: number
	name: string
	created_at: Date | null
	updated_at: Date | null
	deleted_at: Date | null
	fee_id: number
	address_id: number
}

@Controller('/')
export class Agencies {
	@Inject()
	protected prisma: PrismaService

	@Get('/')
	@Summary('Return a list of all agencies')
	@Returns(200, Array).Of(AgencyModel)
	async getAllAgencies(): Promise<AgencyModel[]> {
		return this.prisma.agency.findMany()
	}

	@Get('/:id')
	@Summary('Return a agency by his id')
	@Returns(200, AgencyModel)
	async getAgencyById(@PathParams('id') agency_id: number) {
		return this.prisma.agency.findUnique({ where: { agency_id } })
	}

	@Post('/')
	@Summary('Create a new agency')
	@Returns(201, AgencyModel)
	async createAgency(@BodyParams() @Groups('creation') agency: AgencyModel) {
		return this.prisma.agency.create({ data: agency })
	}

	@Put('/:id')
	@Summary('Update a agency by its id')
	@Returns(200, AgencyModel)
	async updateAgency(
		@PathParams('id') agency_id: number,
		agency: AgencyModel
	): Promise<AgencyModel> {
		return this.prisma.agency.update({
			where: { agency_id },
			data: agency,
		})
	}

	@Delete('/:id')
	@Summary('Delete a agency by its id')
	@Returns(204)
	async deleteAgency(@PathParams('id') agency_id: number): Promise<AgencyModel> {
		return this.prisma.agency.delete({ where: { agency_id } })
	}
}
