import { Controller, Get, PathParams, Post, BodyParams, Put, Delete } from '@tsed/common'
import { Inject } from '@tsed/di'
import { PrismaService } from '../../services/PrismaService'
import { Returns, Summary, Groups } from '@tsed/schema'
import { Sector } from '@prisma/client'

class SectorModel implements Sector {
	@Groups('!creation')
	sector_id: number
	name: string
	updated_at: Date | null
	deleted_at: Date | null
	polygon: string
	created_at: Date | null
	agency_id: number
}

@Controller('/')
export class Sectors {
	@Inject()
	protected prisma: PrismaService

	@Get('/')
	@Summary('Return a list of all sectors')
	@Returns(200, Array).Of(SectorModel)
	async getAllAgencies(): Promise<SectorModel[]> {
		return this.prisma.sector.findMany()
	}

	@Get('/:id')
	@Summary('Return a sector by his id')
	@Returns(200, SectorModel)
	async getSectorById(@PathParams('id') sector_id: number) {
		return this.prisma.sector.findUnique({ where: { sector_id } })
	}

	@Post('/')
	@Summary('Create a new sector')
	@Returns(201, SectorModel)
	async createSector(@BodyParams() @Groups('creation') sector: SectorModel) {
		return this.prisma.sector.create({ data: sector })
	}

	@Put('/:id')
	@Summary('Update a sector by its id')
	@Returns(200, SectorModel)
	async updateSector(
		@PathParams('id') sector_id: number,
		sector: SectorModel
	): Promise<SectorModel> {
		return this.prisma.sector.update({
			where: { sector_id },
			data: sector,
		})
	}

	@Delete('/:id')
	@Summary('Delete a sector by its id')
	@Returns(204)
	async deleteSector(@PathParams('id') sector_id: number): Promise<SectorModel> {
		return this.prisma.sector.delete({ where: { sector_id } })
	}
}
