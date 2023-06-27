import {
	Controller,
	Get,
	PathParams,
	Post,
	BodyParams,
	Put,
	Delete,
	UseBeforeEach,
} from '@tsed/common'
import { Inject } from '@tsed/di'
import { PrismaService } from '../../services/PrismaService'
import { Returns, Summary, Groups, Required } from '@tsed/schema'
import { AddressSerializer } from '../../models/AddressModel'
import AuthentificationMiddleware from '../../middlewares/AuthentificationMiddleware'

@Controller('/')
export class Addresses {
	@Inject()
	protected prisma: PrismaService

	@UseBeforeEach(AuthentificationMiddleware)
	@Get('/')
	@Summary('Return a list of all addresses')
	@Returns(200, Array).Of(AddressSerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async getAllAddresses(): Promise<AddressSerializer[]> {
		return this.prisma.address.findMany()
	}

	@Get('/:id')
	@Summary('Return a address by his id')
	@Returns(200, AddressSerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async getAddressById(@PathParams('id') address_id: number) {
		return this.prisma.address.findUnique({ where: { address_id } })
	}

	@Post('/')
	@Summary('Create a new address')
	@Returns(201, AddressSerializer).Groups('read')
	@Returns(400, String).Description('Bad request')
	async createAddress(
		@Required() @BodyParams() @Groups('post') address: AddressSerializer
	) {
		return this.prisma.address.create({ data: address })
	}

	@Put('/:id')
	@Summary('Update a address by its id')
	@Returns(200, AddressSerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async updateAddress(
		@PathParams('id') id: number,
		@BodyParams()
		@Groups('put')
		address: AddressSerializer
	): Promise<AddressSerializer> {
		return this.prisma.address.update({
			where: { address_id: id },
			data: address,
		})
	}

	@Delete('/:id')
	@Summary('Delete a address by its id')
	@Returns(204)
	@Returns(404, String).Description('Not found')
	async deleteAddress(@PathParams('id') address_id: number): Promise<void> {
		await this.prisma.address.delete({ where: { address_id } })
	}
}
