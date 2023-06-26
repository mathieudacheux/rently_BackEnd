import { Controller, Get, PathParams, Post, BodyParams, Put, Delete } from '@tsed/common'
import { Inject } from '@tsed/di'
import { PrismaService } from '../../services/PrismaService'
import { Returns, Summary, Groups } from '@tsed/schema'
import { Address, Prisma } from '@prisma/client'

class AddressModel implements Address {
	@Groups('!creation')
	address_id: number
	address: string
	city: string
	zipcode: string
	additionnal_info: string | null
	longitude: Prisma.Decimal
	latitude: Prisma.Decimal
	created_at: Date
	updated_at: Date | null
	deleted_at: Date | null
}

@Controller('/')
export class Addresses {
	@Inject()
	protected prisma: PrismaService

	@Get('/')
	@Summary('Return a list of all addresses')
	@Returns(200, Array).Of(AddressModel)
	async getAllAddresses(): Promise<AddressModel[]> {
		return this.prisma.address.findMany()
	}

	@Get('/:id')
	@Summary('Return a address by his id')
	@Returns(200, AddressModel)
	async getAddressById(@PathParams('id') address_id: number) {
		return this.prisma.address.findUnique({ where: { address_id } })
	}

	@Post('/')
	@Summary('Create a new address')
	@Returns(201, AddressModel)
	async createAddress(@BodyParams() @Groups('creation') address: AddressModel) {
		return this.prisma.address.create({ data: address })
	}

	@Put('/:id')
	@Summary('Update a address by its id')
	@Returns(200, AddressModel)
	async updateAddress(@PathParams('id') id: number, address: AddressModel): Promise<AddressModel> {
		return this.prisma.address.update({
			where: { address_id: id },
			data: address,
		})
	}

	@Delete('/:id')
	@Summary('Delete a address by its id')
	@Returns(204)
	async deleteAddress(@PathParams('id') address_id: number): Promise<AddressModel> {
		return this.prisma.address.delete({ where: { address_id } })
	}
}
