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
import i18n from '../../translations/i18n'

@Controller('/')
export class Countries {
	@Inject()
	protected prisma: PrismaService
	protected i18n = i18n

	@Get('/')
	@Summary('Return a list of all countries')
	@Returns(200, Array).Of(CountryModel).Groups('read')
	async getAllCountries(
		@QueryParams('name') name: string | null
	): Promise<CountryModel[]> {
		if (name) {
			const countryName = this.prisma.country.findMany({
				where: { name: name },
			})

			if (!countryName) {
				const errorObject = {
					status: 404,
					errors: this.i18n.t('notFound'),
				}

				throw errorObject
			}

			return countryName
		}

		const allCountries = this.prisma.country.findMany()

		if (!allCountries) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('notFound'),
			}

			throw errorObject
		}

		return allCountries
	}

	@Get('/:id')
	@Summary('Return a country by his id')
	@Returns(200, CountryModel).Groups('read')
	async getCountryById(@PathParams('id') country_id: number) {
		const uniqueCountry = this.prisma.country.findUnique({ where: { country_id } })

		if (!uniqueCountry) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('idNotFound', { id: country_id }),
			}

			throw errorObject
		}

		return uniqueCountry
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
	async updateCountry(
		@PathParams('id') id: number,
		@BodyParams() country: CountryModel
	): Promise<CountryModel> {
		const updateCountry = this.prisma.country.update({
			where: { country_id: id },
			data: country,
		})

		if (!updateCountry) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('idNotFound', { id }),
			}

			throw errorObject
		}

		return updateCountry
	}

	@UseBefore(AuthentificationMiddleware)
	@Delete('/:id')
	@Summary('Delete a country by its id')
	@Returns(204)
	async deleteCountry(@PathParams('id') country_id: number): Promise<void> {
		const deleteCountry = this.prisma.country.delete({ where: { country_id } })

		if (!deleteCountry) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('idNotFound', { id: country_id }),
			}

			throw errorObject
		}
	}
}
