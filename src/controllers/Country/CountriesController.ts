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
import AuthentificationMiddleware from '../../middlewares/AuthentificationMiddleware'
import { CountryModel } from '../../models/CountryModel'

@Controller('/')
export class Countries {
	@Inject()
	protected prisma: PrismaService

	@Get('/')
	@Summary('Return a list of all countries')
	@Returns(200, Array).Of(CountryModel).Groups('read')
	@Returns(404, String).Description('Not found')
	async getAllCountries(
		@QueryParams('name') name: string | null
	): Promise<CountryModel[]> {
		if (name) {
			return this.prisma.country.findMany({
				where: { name: name },
			})
		}
		return this.prisma.country.findMany()
	}

	@Get('/:id')
	@Summary('Return a country by his id')
	@Returns(200, CountryModel).Groups('read')
	@Returns(404, String).Description('Not found')
	async getCountryById(@PathParams('id') country_id: number) {
		return this.prisma.country.findUnique({ where: { country_id } })
	}

	@UseBefore(AuthentificationMiddleware)
	@Post('/')
	@Summary('Create a new country')
	@Returns(201, CountryModel).Groups('read')
	@Returns(400, String).Description('Bad request')
	async createCountry(
		@Required() @BodyParams() @Groups('creation') country: CountryModel
	) {
		return this.prisma.country.create({ data: country })
	}

	@UseBefore(AuthentificationMiddleware)
	@Put('/:id')
	@Summary('Update a country by its id')
	@Returns(200, CountryModel)
	@Returns(404, String).Description('Not found')
	async updateCountry(
		@PathParams('id') id: number,
		@BodyParams() country: CountryModel
	): Promise<CountryModel> {
		return this.prisma.country.update({
			where: { country_id: id },
			data: country,
		})
	}

	@UseBefore(AuthentificationMiddleware)
	@Delete('/:id')
	@Summary('Delete a country by its id')
	@Returns(204)
	@Returns(404, String).Description('Not found')
	async deleteCountry(@PathParams('id') country_id: number): Promise<void> {
		await this.prisma.country.delete({ where: { country_id } })
	}
}
