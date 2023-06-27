import { Controller, Get, PathParams, Post, BodyParams, Put, Delete } from '@tsed/common'
import { Inject } from '@tsed/di'
import { PrismaService } from '../../services/PrismaService'
import { Returns, Summary, Groups } from '@tsed/schema'
import { Fee, Prisma } from '@prisma/client'

class FeeModel implements Fee {
	@Groups('!creation')
	fee_id: number
	rent_fee: Prisma.Decimal
	sell_fee: Prisma.Decimal
	square_fee: Prisma.Decimal
	gestion_fee: Prisma.Decimal
	created_at: Date
	updated_at: Date | null
	deleted_at: Date | null
}

@Controller('/')
export class Fees {
	@Inject()
	protected prisma: PrismaService

	@Get('/')
	@Summary('Return a list of all fees')
	@Returns(200, Array).Of(FeeModel)
	async getAllFees(): Promise<FeeModel[]> {
		return this.prisma.fee.findMany()
	}

	@Get('/:id')
	@Summary('Return a fee by his id')
	@Returns(200, FeeModel)
	async getFeeById(@PathParams('id') fee_id: number) {
		return this.prisma.fee.findUnique({ where: { fee_id } })
	}

	@Post('/')
	@Summary('Create a new fee')
	@Returns(201, FeeModel)
	async createFee(@BodyParams() @Groups('creation') fee: FeeModel) {
		return this.prisma.fee.create({ data: fee })
	}

	@Put('/:id')
	@Summary('Update a fee by its id')
	@Returns(200, FeeModel)
	async updateFee(@PathParams('id') id: number, fee: FeeModel): Promise<FeeModel> {
		return this.prisma.fee.update({
			where: { fee_id: id },
			data: fee,
		})
	}

	@Delete('/:id')
	@Summary('Delete a fee by its id')
	@Returns(204)
	async deleteFee(@PathParams('id') fee_id: number): Promise<FeeModel> {
		return this.prisma.fee.delete({ where: { fee_id } })
	}
}
