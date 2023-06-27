import { Controller, Get, PathParams, Post, BodyParams, Put, Delete } from '@tsed/common'
import { Inject } from '@tsed/di'
import { PrismaService } from '../../services/PrismaService'
import { Returns, Summary, Groups, Required } from '@tsed/schema'
import { SectorSerializer } from '../../models/SectorModel'
@Controller('/')
export class Sectors {
	@Inject()
	protected prisma: PrismaService

	@Get('/')
	@Summary('Return a list of all sectors')
	@Returns(200, Array).Of(SectorSerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async getAllAgencies(): Promise<SectorSerializer[]> {
		return this.prisma.sector.findMany()
	}

	@Get('/:id')
	@Summary('Return a sector by his id')
	@Returns(200, SectorSerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async getSectorById(@PathParams('id') sector_id: number) {
		return this.prisma.sector.findUnique({ where: { sector_id } })
	}

	@Post('/')
	@Summary('Create a new sector')
	@Returns(201, SectorSerializer).Groups('read')
	@Returns(400, String).Description('Bad request')
	async createSector(@Required() @BodyParams() @Groups('post') sector: SectorSerializer) {
		return this.prisma.sector.create({ data: sector })
	}

	@Put('/:id')
	@Summary('Update a sector by its id')
	@Returns(200, SectorSerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async updateSector(
		@PathParams('id') id: number,
		@BodyParams()
		@Groups('put')
		sector: SectorSerializer
	): Promise<SectorSerializer> {
		return this.prisma.sector.update({
			where: { sector_id: id },
			data: sector,
		})
	}

	@Delete('/:id')
	@Summary('Delete a sector by its id')
	@Returns(204)
	@Returns(404, String).Description('Not found')
	async deleteSector(@PathParams('id') sector_id: number): Promise<void> {
		await this.prisma.sector.delete({ where: { sector_id } })
	}
}
