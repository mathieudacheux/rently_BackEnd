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
}
