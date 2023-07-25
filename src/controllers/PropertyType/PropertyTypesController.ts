import { Controller, Get, PathParams } from '@tsed/common'
import { Inject } from '@tsed/di'
import { PrismaService } from '../../services/PrismaService'
import { Returns, Summary } from '@tsed/schema'
import { PropertyTypeSerializer } from '../../models/PropertyTypeModel'
import i18n from '../../translations/i18n'

@Controller('/')
export class PropertyTypes {
	@Inject()
	protected prisma: PrismaService
	protected i18n = i18n

	@Get('/')
	@Summary('Return a list of property types')
	@Returns(200, Array).Of(PropertyTypeSerializer).Groups('read')
	async getAllPropertyTypes(): Promise<PropertyTypeSerializer[]> {
		const allPropertyTypes = await this.prisma.property_type.findMany()

		if (!allPropertyTypes) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('notFound'),
			}

			throw errorObject
		}

		return allPropertyTypes
	}

	@Get('/:id')
	@Summary('Return a property type by his id')
	@Returns(200, PropertyTypeSerializer).Groups('read')
	async getPropertyTypeById(@PathParams('id') id: number) {
		const uniquePropertyType = await this.prisma.property_type.findUnique({
			where: { property_type_id: id },
		})

		if (!uniquePropertyType) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('idNotFound', { id }),
			}

			throw errorObject
		}

		return uniquePropertyType
	}
}
