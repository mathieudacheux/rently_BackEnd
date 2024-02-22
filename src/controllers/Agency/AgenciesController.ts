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
import i18n from '../../translations/i18n'

@Controller('/')
export class Agencies {
	@Inject()
	protected prisma: PrismaService
	protected i18n = i18n

	@Get('/')
	@Summary('Return a list of all agencies')
	@Returns(200, Array).Of(AgencySerializer).Groups('read')
	async getAllAgencies(
		@QueryParams('expanded') expanded: boolean
	): Promise<AgencySerializer[]> {
		const allAgencies = await this.prisma.agency.findMany()

		if (!allAgencies) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('notFound'),
			}

			throw errorObject
		}

		const result = expanded
			? await Promise.all(
					allAgencies.map(async (agency) => {
						const address = await this.prisma.address.findUnique({
							where: { address_id: agency.address_id },
						})

						return {
							...agency,
							city: address?.city || '',
							zipcode: address?.zipcode || '',
							way: address?.address || '',
							longitude: address?.longitude || '',
							latitude: address?.latitude || '',
						}
					})
			  )
			: allAgencies

		return result
	}

	@Get('/agency_filter')
	@Summary('Return a list of agencies by filter')
	@Returns(200, Array).Of(AgencySerializer).Groups('read')
	async getAgenciesByFilter(
		@QueryParams('city') city: string,
		@QueryParams('zipcode') zipcode: string
	): Promise<AgencySerializer[]> {
		if (!city && !zipcode) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('notFound'),
			}

			throw errorObject
		}

		const agencyAddresses = await this.prisma.address.findMany({
			where: {
				city: {
					contains: city.toLowerCase(),
				},
				zipcode: {
					contains: zipcode,
				},
			},
		})

		if (!agencyAddresses) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('notFound'),
			}

			throw errorObject
		}

		const addressId = agencyAddresses.map((agencyAddress) => agencyAddress.address_id)

		const agencies = await this.prisma.agency.findMany({
			where: {
				address_id: {
					in: addressId,
				},
			},
		})

		if (!agencies || agencies.length === 0) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('notFound'),
			}

			throw errorObject
		}

		return agencies
	}

	@Get('/:id')
	@Summary('Return a agency by his id')
	@Returns(200, AgencySerializer).Groups('read')
	async getAgencyById(@PathParams('id') agency_id: number) {
		const uniqueAgency = await this.prisma.agency.findUnique({ where: { agency_id } })

		if (!uniqueAgency) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('idNotFound', { agency_id }),
			}

			throw errorObject
		}

		const address = await this.prisma.address.findUnique({
			where: { address_id: uniqueAgency.address_id },
		})

		if (!address) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('idNotFound', { address_id: uniqueAgency.address_id }),
			}

			throw errorObject
		}

		return {
			...uniqueAgency,
			city: address.city,
			zipcode: address.zipcode,
			way: address.address,
			longitude: address.longitude,
			latitude: address.latitude,
		}

		return uniqueAgency
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
	async updateAgency(
		@PathParams('id') agency_id: number,
		@BodyParams() agency: AgencySerializer
	): Promise<AgencySerializer> {
		const updateAgency = await this.prisma.agency.update({
			where: { agency_id },
			data: agency,
		})

		if (!updateAgency) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('idNotFound', { agency_id }),
			}

			throw errorObject
		}

		return updateAgency
	}

	@UseBefore(AuthentificationMiddleware)
	@Delete('/:id')
	@Summary('Delete a agency by its id')
	@Returns(204)
	async deleteAgency(@PathParams('id') agency_id: number): Promise<void> {
		const deleteAgency = await this.prisma.agency.delete({ where: { agency_id } })

		if (!deleteAgency) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('idNotFound', { agency_id }),
			}

			throw errorObject
		}
	}
}
