import { Controller, Get, PathParams, Post, BodyParams, Put, Delete } from '@tsed/common'
import { Inject } from '@tsed/di'
import { PrismaService } from '../../services/PrismaService'
import { Returns, Summary, Groups, Required } from '@tsed/schema'
import { SectorSerializer } from '../../models/SectorModel'
import i18n from '../../translations/i18n'
@Controller('/')
export class Sectors {
	@Inject()
	protected prisma: PrismaService
	protected i18n = i18n

	@Get('/')
	@Summary('Return a list of all sectors')
	@Returns(200, Array).Of(SectorSerializer).Groups('read')
	async getAllAgencies(): Promise<SectorSerializer[]> {
		const allSectors = await this.prisma.sector.findMany()

		if (!allSectors) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('notFound'),
			}

			throw errorObject
		}

		return allSectors
	}

	@Get('/:id')
	@Summary('Return a sector by his id')
	@Returns(200, SectorSerializer).Groups('read')
	async getSectorById(@PathParams('id') sector_id: number) {
		const uniqueSector = await this.prisma.sector.findUnique({ where: { sector_id } })

		if (!uniqueSector) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('idNotFound', { id: sector_id }),
			}

			throw errorObject
		}

		return uniqueSector
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
	async updateSector(
		@PathParams('id') id: number,
		@BodyParams()
		@Groups('put')
		sector: SectorSerializer
	): Promise<SectorSerializer> {
		const updateSector = await this.prisma.sector.update({
			where: { sector_id: id },
			data: sector,
		})

		if (!updateSector) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('idNotFound', { id }),
			}

			throw errorObject
		}

		return updateSector
	}

	@Delete('/:id')
	@Summary('Delete a sector by its id')
	@Returns(204)
	async deleteSector(@PathParams('id') sector_id: number): Promise<void> {
		const deleteSector = await this.prisma.sector.delete({ where: { sector_id } })

		if (!deleteSector) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('idNotFound', { id: sector_id }),
			}

			throw errorObject
		}
	}
}
