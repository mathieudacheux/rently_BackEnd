import {
	Controller,
	Get,
	PathParams,
	Post,
	BodyParams,
	Put,
	Delete,
	UseBefore,
} from '@tsed/common'
import { Inject } from '@tsed/di'
import { PrismaService } from '../../services/PrismaService'
import { Returns, Summary, Groups, Required } from '@tsed/schema'
import { FeeSerializer } from '../../models/FeeModel'
import AuthentificationMiddleware from '../../middlewares/AuthentificationMiddleware'
import i18n from '../../translations/i18n'

@Controller('/')
export class Fees {
	@Inject()
	protected prisma: PrismaService
	protected i18n = i18n

	@Get('/')
	@Summary('Return a list of all fees')
	@Returns(200, Array).Of(FeeSerializer).Groups('read')
	async getAllFees(): Promise<FeeSerializer[]> {
		const allFees = await this.prisma.fee.findMany()

		if (!allFees) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('notFound'),
			}

			throw errorObject
		}

		return allFees
	}

	@Get('/:id')
	@Summary('Return a fee by his id')
	@Returns(200, FeeSerializer).Groups('read')
	async getFeeById(@PathParams('id') fee_id: number) {
		const uniqueFee = await this.prisma.fee.findUnique({ where: { fee_id } })

		if (!uniqueFee) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('idNotFound', { id: fee_id }),
			}

			throw errorObject
		}

		return uniqueFee
	}

	@UseBefore(AuthentificationMiddleware)
	@Post('/')
	@Summary('Create a new fee')
	@Returns(201, FeeSerializer).Groups('read')
	@Returns(400, String).Description('Bad request')
	async createFee(@Required() @BodyParams() @Groups('put') fee: FeeSerializer) {
		return await this.prisma.fee.create({ data: fee })
	}

	@UseBefore(AuthentificationMiddleware)
	@Put('/:id')
	@Summary('Update a fee by its id')
	@Returns(200, FeeSerializer).Groups('read')
	async updateFee(
		@PathParams('id') id: number,
		@Required() @BodyParams() @Groups('put') fee: FeeSerializer
	): Promise<FeeSerializer> {
		const updateFee = await this.prisma.fee.update({
			where: { fee_id: id },
			data: fee,
		})

		if (!updateFee) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('idNotFound', { id }),
			}

			throw errorObject
		}

		return updateFee
	}

	@UseBefore(AuthentificationMiddleware)
	@Delete('/:id')
	@Summary('Delete a fee by its id')
	@Returns(204)
	@Returns(404, String).Description('Not found')
	async deleteFee(@PathParams('id') fee_id: number): Promise<void> {
		const deleteFee = await this.prisma.fee.delete({ where: { fee_id } })

		if (!deleteFee) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('idNotFound', { id: fee_id }),
			}

			throw errorObject
		}
	}

	// Endpoint to get all fees of an agency
	@Get('/agency/:agency_id')
	@Summary('Return a list of all fees of an agency')
	@Returns(200, Array).Of(Number).Groups('read')
	async getAllFeesOfAgency(
		@PathParams('agency_id') agency_id: number
	): Promise<number[]> {
		const selectedAgency = await this.prisma.agency.findUnique({ where: { agency_id } })

		const rentedStatus = await this.prisma.status.findFirst({ where: { name: 'Loué' } })

		const monthsTable: number[] = []

		for (let i = 0; i < 12; i++) {
			monthsTable.push(i)
		}

		const agencyFees = await this.prisma.fee.findUnique({
			where: { fee_id: selectedAgency?.fee_id },
		})

		const allFeesTable = monthsTable.map(async (month) => {
			if (new Date().getMonth() > month) {
				return 0
			}

			const allProperties = await this.prisma.property.findMany({
				where: { agency_id, status_id: rentedStatus?.status_id },
			})

			const allFees = allProperties
				?.filter(
					(property) =>
						!property.draft &&
						property?.signature_date &&
						((new Date(property?.signature_date)?.getFullYear() ===
							new Date().getFullYear() &&
							new Date(property?.signature_date)?.getMonth() < month) ||
							new Date(property?.signature_date)?.getFullYear() <
								new Date().getFullYear())
				)
				?.reduce((acc, property) => {
					acc += property.price * (Number(agencyFees?.rent_fee ?? 0) / 100)
					return acc
				}, 0)

			return allFees
		})

		if (!allFeesTable) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('notFound'),
			}

			throw errorObject
		}

		const resolvedAllFeesTable = await Promise.all(allFeesTable)

		return resolvedAllFeesTable
	}
}
