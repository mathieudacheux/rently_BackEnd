import { Controller, Get, PathParams, Post, BodyParams, Put, Delete } from '@tsed/common'
import { Inject } from '@tsed/di'
import { PrismaService } from '../../services/PrismaService'
import { Returns, Summary, Groups, Required } from '@tsed/schema'
import { FeeSerializer } from '../../models/FeeModel'

@Controller('/')
export class Fees {
	@Inject()
	protected prisma: PrismaService

	@Get('/')
	@Summary('Return a list of all fees')
	@Returns(200, Array).Of(FeeSerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async getAllFees(): Promise<FeeSerializer[]> {
		return this.prisma.fee.findMany()
	}

	@Get('/:id')
	@Summary('Return a fee by his id')
	@Returns(200, FeeSerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async getFeeById(@PathParams('id') fee_id: number) {
		return this.prisma.fee.findUnique({ where: { fee_id } })
	}

	@Post('/')
	@Summary('Create a new fee')
	@Returns(201, FeeSerializer).Groups('read')
	@Returns(400, String).Description('Bad request')
	async createFee(@Required() @BodyParams() @Groups('put') fee: FeeSerializer) {
		return this.prisma.fee.create({ data: fee })
	}

	@Put('/:id')
	@Summary('Update a fee by its id')
	@Returns(200, FeeSerializer).Groups('read')
	@Returns(400, String).Description('Bad request')
	async updateFee(
		@PathParams('id') id: number,
		@Required() @BodyParams() @Groups('put') fee: FeeSerializer
	): Promise<FeeSerializer> {
		return this.prisma.fee.update({
			where: { fee_id: id },
			data: fee,
		})
	}

	@Delete('/:id')
	@Summary('Delete a fee by its id')
	@Returns(204)
	@Returns(404, String).Description('Not found')
	async deleteFee(@PathParams('id') fee_id: number): Promise<void> {
		await this.prisma.fee.delete({ where: { fee_id } })
	}
}
