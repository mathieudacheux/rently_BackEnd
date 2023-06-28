import { Controller, Get, PathParams } from '@tsed/common'
import { Inject } from '@tsed/di'
import { PrismaService } from '../../services/PrismaService'
import { Returns, Summary } from '@tsed/schema'
import { PropertyTypeSerializer } from '../../models/PropertyTypeModel'

@Controller('/')
export class PropertyTypes {
	@Inject()
	protected prisma: PrismaService

	@Get('/')
	@Summary('Return a list of property types')
	@Returns(200, Array).Of(PropertyTypeSerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async getAllPropertyTypes(): Promise<PropertyTypeSerializer[]> {
		return this.prisma.property_type.findMany()
	}

	@Get('/:id')
	@Summary('Return a property type by his id')
	@Returns(200, PropertyTypeSerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async getPropertyTypeById(@PathParams('id') id: number) {
		return this.prisma.property_type.findUnique({ where: { property_type_id: id } })
	}
}
