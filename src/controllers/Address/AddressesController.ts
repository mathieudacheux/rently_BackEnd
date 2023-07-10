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
import i18n from '../../translations/i18n'

@Controller('/')
export class Addresses {
	@Inject()
	protected prisma: PrismaService
	protected i18n = i18n

	@UseBeforeEach(AuthentificationMiddleware)
	@Get('/')
	@Summary('Return a list of all addresses')
	@Returns(200, Array).Of(AddressSerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async getAllAddresses(): Promise<AddressSerializer[]> {
		const allAddresses = this.prisma.address.findMany()

		if (!allAddresses) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('notFound'),
			}

			throw errorObject
		}

		return allAddresses
	}

	@Get('/:id')
	@Summary('Return a address by his id')
	@Returns(200, AddressSerializer).Groups('read')
	async getAddressById(@PathParams('id') address_id: number) {
		const uniqueAddress = await this.prisma.address.findUnique({
			where: { address_id },
		})

		if (!uniqueAddress) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('idNotFound', { id: address_id }),
			}

			throw errorObject
		}

		return uniqueAddress
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
	async updateAddress(
		@PathParams('id') id: number,
		@BodyParams()
		@Groups('put')
		address: AddressSerializer
	): Promise<AddressSerializer> {
		const updateAddress = this.prisma.address.update({
			where: { address_id: id },
			data: address,
		})

		if (!updateAddress) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('idNotFound', { id }),
			}

			throw errorObject
		}

		return updateAddress
	}

	@Delete('/:id')
	@Summary('Delete a address by its id')
	@Returns(204)
	@Returns(404, String).Description('Not found')
	async deleteAddress(@PathParams('id') address_id: number): Promise<void> {
		const deleteAddress = this.prisma.address.delete({ where: { address_id } })

		if (!deleteAddress) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('idNotFound', { id: address_id }),
			}

			throw errorObject
		}
	}
}
