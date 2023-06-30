import {
	Controller,
	Get,
	PathParams,
	Post,
	BodyParams,
	Put,
	Delete,
	UseBefore,
	QueryParams,
} from '@tsed/common'
import { Inject } from '@tsed/di'
import { PrismaService } from '../../services/PrismaService'
import { Returns, Summary, Groups, Required } from '@tsed/schema'
import { AgencySerializer } from '../../models/AgencyModel'
import AuthentificationMiddleware from '../../middlewares/AuthentificationMiddleware'

@Controller('/')
export class Agencies {
	@Inject()
	protected prisma: PrismaService

	@Get('/')
	@Summary('Return a list of all agencies')
	@Returns(200, Array).Of(AgencySerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async getAllAgencies(): Promise<AgencySerializer[]> {
		return this.prisma.agency.findMany()
	}

	@Get('/agency_filter')
	@Summary('Return a list of agencies by filter')
	@Returns(200, Array).Of(AgencySerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async getAgenciesByFilter(
		@QueryParams('name') name: string,
		@QueryParams('city') city: string,
		@QueryParams('zipcode') zipcode: string
	): Promise<AgencySerializer[]> {
		const agencyAddresses = await this.prisma.address.findMany({
			where: {
				city,
				zipcode,
			},
		})

		return this.prisma.agency.findMany({
			where: {
				name,
				address_id: {
					in: agencyAddresses.map((agencyAddress) => agencyAddress.address_id),
				},
			},

			orderBy: { name: 'asc' },
		})
	}

	@Get('/:id')
	@Summary('Return a agency by his id')
	@Returns(200, AgencySerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async getAgencyById(@PathParams('id') agency_id: number) {
		return this.prisma.agency.findUnique({ where: { agency_id } })
	}

	@UseBefore(AuthentificationMiddleware)
	@Post('/')
	@Summary('Create a new agency')
	@Returns(201, AgencySerializer).Groups('read')
	@Returns(400, String).Description('Bad request')
	async createAgency(@Required() @BodyParams() @Groups('post') agency: AgencySerializer) {
		return this.prisma.agency.create({ data: agency })
	}

	@UseBefore(AuthentificationMiddleware)
	@Put('/:id')
	@Summary('Update a agency by its id')
	@Returns(200, AgencySerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async updateAgency(
		@PathParams('id') agency_id: number,
		@BodyParams() agency: AgencySerializer
	): Promise<AgencySerializer> {
		return this.prisma.agency.update({
			where: { agency_id },
			data: agency,
		})
	}

	@UseBefore(AuthentificationMiddleware)
	@Delete('/:id')
	@Summary('Delete a agency by its id')
	@Returns(204)
	@Returns(404, String).Description('Not found')
	async deleteAgency(@PathParams('id') agency_id: number): Promise<void> {
		await this.prisma.agency.delete({ where: { agency_id } })
	}
}
