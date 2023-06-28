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
import { Returns, Summary, Groups, Required } from '@tsed/schema'
import { PropertySerializer } from '../../models/PropertyModel'

@Controller('/')
export class Properties {
	@Inject()
	protected prisma: PrismaService

	@Get('/')
	@Summary('Return a list of properties')
	@Returns(200, Array).Of(PropertySerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async getProperties(@QueryParams('page') page: number): Promise<PropertySerializer[]> {
		const pageSize = 50
		return this.prisma.property.findMany({
			take: pageSize,
			skip: (page - 1) * pageSize,
			orderBy: { property_id: 'asc' },
		})
	}

	@Get('/properties_filter')
	@Summary('Return a list of properties by filter')
	@Returns(200, Array).Of(PropertySerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async getPropertiesByFilter(
		@QueryParams('property_type') property_type: number,
		@QueryParams('price') price: number,
		@QueryParams('surface') surface: string,
		@QueryParams('land_size') land_size: string,
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
		@QueryParams('land_size_1') land_size_1: string,
		@QueryParams('garden') garden: boolean,
		@QueryParams('dpe') dpe: number,
		@QueryParams('city') city: string,
		@QueryParams('zipcode') zipcode: string
	): Promise<PropertySerializer[]> {
		const propertyAddresses = await this.prisma.address.findMany({
			where: {
				city,
				zipcode,
			},
		})

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
				address_id: {
					in: propertyAddresses.map((propertyAddresses) => propertyAddresses.address_id),
				},
			},
			orderBy: price ? { price: 'asc' } : { property_id: 'asc' },
		})
	}

	@Get('/:id')
	@Summary('Return a property by his id')
	@Returns(200, PropertySerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async getPropertyById(@PathParams('id') property_id: number) {
		return this.prisma.property.findUnique({ where: { property_id } })
	}

	@Post('/')
	@Summary('Create a new property')
	@Returns(201, PropertySerializer).Groups('read')
	@Returns(400, String).Description('Bad request')
	async createProperty(
		@Required() @BodyParams() @Groups('post') property: PropertySerializer
	) {
		return this.prisma.property.create({ data: property })
	}

	@Put('/:id')
	@Summary('Update a property by its id')
	@Returns(200, PropertySerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async updateProperty(
		@PathParams('id') id: number,
		@BodyParams()
		@Groups('put')
		property: PropertySerializer
	): Promise<PropertySerializer> {
		return this.prisma.property.update({
			where: { property_id: id },
			data: property,
		})
	}

	@Delete('/:id')
	@Summary('Delete a property by its id')
	@Returns(204)
	@Returns(404, String).Description('Not found')
	async deleteProperty(@PathParams('id') property_id: number): Promise<void> {
		await this.prisma.property.delete({ where: { property_id } })
	}
}
