import { Controller, Get, PathParams, Post, BodyParams, Put, Delete } from '@tsed/common'
import { Inject } from '@tsed/di'
import { PrismaService } from '../../services/PrismaService'
import { Returns, Summary, Groups } from '@tsed/schema'
import { Property, Prisma } from '@prisma/client'

class PropertyModel implements Property {
	@Groups('!creation')
	property_id: number
	name: string
	description: string
	signature_date: Date | null
	property_type: number
	price: number
	surface: Prisma.Decimal
	land_size: Prisma.Decimal
	bathroom: number
	kitchen: number
	toilet: number
	bedroom: number
	elevator: boolean
	balcony: boolean
	terrace: boolean
	cellar: boolean
	parking: boolean
	number_room: number
	pool: boolean
	caretaker: boolean
	fiber_deployed: boolean
	duplex: boolean
	top_floor: boolean
	garage: boolean
	work_done: boolean
	life_annuity: boolean
	ground_floor: boolean
	land_size_1: Prisma.Decimal
	garden: boolean
	created_at: Date | null
	updated_at: Date | null
	deleted_at: Date | null
	owner_id: number
	status_id: number
	tenant_id: number | null
	address_id: number
	dpe: number
	agency_id: number
}

@Controller('/')
export class Properties {
	@Inject()
	protected prisma: PrismaService

	@Get('/')
	@Summary('Return a list of all properties')
	@Returns(200, Array).Of(PropertyModel)
	async getAllArticles(): Promise<PropertyModel[]> {
		return this.prisma.property.findMany()
	}

	@Get('/:id')
	@Summary('Return a property by his id')
	@Returns(200, PropertyModel)
	async getArticleById(@PathParams('id') property_id: number) {
		return this.prisma.property.findUnique({ where: { property_id } })
	}

	@Post('/')
	@Summary('Create a new property')
	@Returns(201, PropertyModel)
	async createArticle(@BodyParams() @Groups('creation') permission: PropertyModel) {
		return this.prisma.property.create({ data: permission })
	}

	@Put('/:id')
	@Summary('Update a property by its id')
	@Returns(200, PropertyModel)
	async updateArticle(
		@PathParams('id') property_id: number,
		property: PropertyModel
	): Promise<PropertyModel> {
		return this.prisma.property.update({
			where: { property_id },
			data: property,
		})
	}

	@Delete('/:id')
	@Summary('Delete a property by its id')
	@Returns(204)
	async deleteArticle(@PathParams('id') property_id: number): Promise<PropertyModel> {
		return this.prisma.property.delete({ where: { property_id } })
	}
}
