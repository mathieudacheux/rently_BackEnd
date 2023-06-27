import { Controller, Get, PathParams, Post, BodyParams, Put, Delete } from '@tsed/common'
import { Inject } from '@tsed/di'
import { PrismaService } from '../../services/PrismaService'
import { Required, Returns, Summary, Groups } from '@tsed/schema'
import { Country } from '@prisma/client'

class CountryModel implements Country {
	@Groups('!creation')
	country_id: number
	@Required()
	name: string
	created_at: Date
	updated_at: Date | null
	deleted_at: Date | null
}

@Controller('/')
export class Countries {
	@Inject()
	protected prisma: PrismaService

	@Get('/')
	@Summary('Return a list of all countries')
	@Returns(200, Array).Of(CountryModel)
	async getAllCountries(): Promise<CountryModel[]> {
		return this.prisma.country.findMany()
	}

	@Get('/:id')
	@Summary('Return a country by his id')
	@Returns(200, CountryModel)
	async getCountryById(@PathParams('id') country_id: number) {
		return this.prisma.country.findUnique({ where: { country_id } })
	}

	@Post('/')
	@Summary('Create a new country')
	@Returns(201, CountryModel)
	async createCountry(@BodyParams() @Groups('creation') country: CountryModel) {
		return this.prisma.country.create({ data: country })
	}

	@Put('/:id')
	@Summary('Update a country by its id')
	@Returns(200, CountryModel)
	async updateCountry(
		@PathParams('id') id: number,
		country: CountryModel
	): Promise<CountryModel> {
		return this.prisma.country.update({
			where: { country_id: id },
			data: country,
		})
	}

	@Delete('/:id')
	@Summary('Delete a country by its id')
	@Returns(204)
	async deleteCountry(@PathParams('id') country_id: number): Promise<CountryModel> {
		return this.prisma.country.delete({ where: { country_id } })
	}
}
