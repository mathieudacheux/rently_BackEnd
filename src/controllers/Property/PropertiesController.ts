import {
	Controller,
	Get,
	PathParams,
	Post,
	BodyParams,
	Put,
	Delete,
	QueryParams,
} from '@tsed/common'
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
	created_at: Date
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
	@Summary('Return a list of properties')
	@Returns(200, Array).Of(PropertyModel)
	async getProperties(@QueryParams('offset') offset: number): Promise<PropertyModel[]> {
		return this.prisma.property.findMany({
			take: 50,
			skip: offset,
			orderBy: { property_id: 'asc' },
		})
	}

	// get properties by filter
	@Get('/filter')
	@Summary('Return a list of properties by filter')
	@Returns(200, Array).Of(PropertyModel)
	async getPropertiesByFilter(
		@QueryParams('property_type') property_type: number,
		@QueryParams('price') price: number,
		@QueryParams('surface') surface: number,
		@QueryParams('land_size') land_size: number,
		@QueryParams('bathroom') bathroom: number,
		@QueryParams('kitchen') kitchen: number,
		@QueryParams('toilet') toilet: number,
		@QueryParams('bedroom') bedroom: number,
		@QueryParams('elevator') elevator: boolean,
		@QueryParams('balcony') balcony: boolean,
		@QueryParams('terrace') terrace: boolean,
		@QueryParams('cellar') cellar: boolean,
		@QueryParams('parking') parking: boolean,
		@QueryParams('number_room') number_room: number,
		@QueryParams('pool') pool: boolean,
		@QueryParams('caretaker') caretaker: boolean,
		@QueryParams('fiber_deployed') fiber_deployed: boolean,
		@QueryParams('duplex') duplex: boolean,
		@QueryParams('top_floor') top_floor: boolean,
		@QueryParams('garage') garage: boolean,
		@QueryParams('work_done') work_done: boolean,
		@QueryParams('life_annuity') life_annuity: boolean,
		@QueryParams('ground_floor') ground_floor: boolean,
		@QueryParams('land_size_1') land_size_1: number,
		@QueryParams('garden') garden: boolean,
		@QueryParams('dpe') dpe: number
	): Promise<PropertyModel[]> {
		return this.prisma.property.findMany({
			where: {
				property_type,
				price,
				surface,
				land_size,
				bathroom,
				kitchen,
				toilet,
				bedroom,
				elevator,
				balcony,
				terrace,
				cellar,
				parking,
				number_room,
				pool,
				caretaker,
				fiber_deployed,
				duplex,
				top_floor,
				garage,
				work_done,
				life_annuity,
				ground_floor,
				land_size_1,
				garden,
				dpe,
			},
			orderBy: price ? { price: 'asc' } : { property_id: 'asc' },
		})
	}

	@Get('/:id')
	@Summary('Return a property by his id')
	@Returns(200, PropertyModel)
	async getPropertyById(@PathParams('id') property_id: number) {
		return this.prisma.property.findUnique({ where: { property_id } })
	}

	@Post('/')
	@Summary('Create a new property')
	@Returns(201, PropertyModel)
	async createProperty(@BodyParams() @Groups('creation') requestBody: PropertyModel) {
		return this.prisma.property.create({ data: requestBody })
	}

	@Put('/:id')
	@Summary('Update a property by its id')
	@Returns(200, PropertyModel)
	async updateProperty(
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
	async deleteProperty(@PathParams('id') property_id: number): Promise<PropertyModel> {
		return this.prisma.property.delete({ where: { property_id } })
	}
}
