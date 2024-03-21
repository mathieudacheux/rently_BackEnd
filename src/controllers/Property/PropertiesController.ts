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
import { getDistance } from 'geolib'
import { PrismaService } from '../../services/PrismaService'
import { Returns, Summary, Groups, Required } from '@tsed/schema'
import { PropertySerializer } from '../../models/PropertyModel'
import i18n from '../../translations/i18n'

@Controller('/')
export class Properties {
	@Inject()
	protected prisma: PrismaService
	protected i18n = i18n

	@Get('/')
	@Summary('Return a list of properties')
	@Returns(200, Array).Of(PropertySerializer).Groups('read')
	async getProperties(@QueryParams('page') page: number): Promise<PropertySerializer[]> {
		const pageSize = 50
		const allProperties = await this.prisma.property.findMany({
			take: pageSize,
			skip: (page ? page - 1 : 0) * pageSize,
			orderBy: { property_id: 'asc' },
		})

		if (!allProperties) {
			const errorObject = {
				status: 404,
				message: this.i18n.t('notFound'),
			}

			throw errorObject
		}
		const propertiesExpanded = await Promise.all(
			allProperties.map(async (property) => {
				const address = await this.prisma.address.findUnique({
					where: { address_id: property.address_id },
				})

				return {
					...property,
					city: address?.city || '',
					zipcode: address?.zipcode || '',
					way: address?.address || '',
					latitude: Number(address?.latitude) || 0,
					longitude: Number(address?.longitude) || 0,
				}
			})
		)

		return propertiesExpanded
	}

	@Get('/properties_filter')
	@Summary('Return a list of properties by filter')
	@Returns(200, Array).Of(PropertySerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async getPropertiesByFilter(
		@QueryParams('property_type') property_type?: number,
		@QueryParams('price') price?: number,
		@QueryParams('surface') surface?: string,
		@QueryParams('land_size') land_size?: string,
		@QueryParams('bathroom') bathroom?: number,
		@QueryParams('kitchen') kitchen?: number,
		@QueryParams('toilet') toilet?: number,
		@QueryParams('bedroom') bedroom?: number,
		@QueryParams('elevator') elevator?: boolean,
		@QueryParams('balcony') balcony?: boolean,
		@QueryParams('terrace') terrace?: boolean,
		@QueryParams('cellar') cellar?: boolean,
		@QueryParams('parking') parking?: boolean,
		@QueryParams('number_room') number_room?: number,
		@QueryParams('pool') pool?: boolean,
		@QueryParams('caretaker') caretaker?: boolean,
		@QueryParams('fiber_deployed') fiber_deployed?: boolean,
		@QueryParams('duplex') duplex?: boolean,
		@QueryParams('top_floor') top_floor?: boolean,
		@QueryParams('garage') garage?: boolean,
		@QueryParams('work_done') work_done?: boolean,
		@QueryParams('life_annuity') life_annuity?: boolean,
		@QueryParams('ground_floor') ground_floor?: boolean,
		@QueryParams('land_size_1') land_size_1?: string,
		@QueryParams('garden') garden?: boolean,
		@QueryParams('dpe') dpe?: number,
		@QueryParams('city') city?: string,
		@QueryParams('zipcode') zipcode?: string,
		@QueryParams('agent_id') agent_id?: number,
		@QueryParams('draft') draft?: boolean,
		@QueryParams('status_id') status_id?: number
	): Promise<PropertySerializer[]> {
		const propertyAddresses = await this.prisma.address.findMany({
			where: {
				city: city !== '' ? city : undefined,
				zipcode: zipcode !== '' ? zipcode : undefined,
			},
		})

		const allProperties = await this.prisma.property.findMany({
			where: {
				property_type: property_type !== null ? property_type : undefined,
				price:
					price && price !== null
						? { lte: price + 15000, gte: price - 15000 }
						: undefined,
				surface: surface !== '' ? surface : undefined,
				land_size: land_size !== '' ? land_size : undefined,
				bathroom: bathroom !== null ? bathroom : undefined,
				kitchen: kitchen !== null ? kitchen : undefined,
				toilet: toilet !== null ? toilet : undefined,
				bedroom: bedroom !== null ? bedroom : undefined,
				elevator,
				balcony,
				terrace,
				cellar,
				parking,
				number_room: number_room !== null ? number_room : undefined,
				pool,
				caretaker,
				fiber_deployed,
				duplex,
				top_floor,
				garage,
				work_done,
				life_annuity,
				ground_floor,
				land_size_1: land_size_1 !== '' ? land_size_1 : undefined,
				garden,
				dpe: dpe !== null ? dpe : undefined,
				agent_id: agent_id !== null ? agent_id : undefined,
				address_id: {
					in: propertyAddresses.map((propertyAddresses) => propertyAddresses.address_id),
				},
				draft: draft !== null ? draft : false,
				status_id,
			},
			orderBy: price ? { price: 'asc' } : { property_id: 'asc' },
		})

		const propertiesExpanded = await Promise.all(
			allProperties.map(async (property) => {
				const address = await this.prisma.address.findUnique({
					where: { address_id: property.address_id },
				})

				return {
					...property,
					city: address?.city || '',
					zipcode: address?.zipcode || '',
					way: address?.address || '',
					latitude: Number(address?.latitude) || 0,
					longitude: Number(address?.longitude) || 0,
				}
			})
		)

		return propertiesExpanded
	}

	@Get('/properties_home')
	@Summary('Return a list of 6 properties for the home page')
	@Returns(200, Array).Of(PropertySerializer).Groups('read')
	async getPropertiesForHome(
		@QueryParams('base_latitude') baseLatitude: number,
		@QueryParams('base_longitude') baseLongitude: number
	): Promise<PropertySerializer[]> {
		const allProperties = await this.prisma.property.findMany({
			orderBy: { property_id: 'asc' },
		})

		if (!allProperties) {
			const errorObject = {
				status: 404,
				message: this.i18n.t('notFound'),
			}

			throw errorObject
		}

		if (allProperties.length < 6) {
			return allProperties
		}

		const propertiesExpanded = await Promise.all(
			allProperties.map(async (property) => {
				const address = await this.prisma.address.findUnique({
					where: { address_id: property.address_id },
				})

				return {
					...property,
					city: address?.city || '',
					zipcode: address?.zipcode || '',
					way: address?.address || '',
					latitude: Number(address?.latitude) || 0,
					longitude: Number(address?.longitude) || 0,
				}
			})
		)

		const getHomeProperties = (
			baseLatitude: number,
			baseLongitude: number,
			propertiesExpanded: PropertySerializer[],
			maxDistance: number
		) => {
			const result = propertiesExpanded.filter(
				(property) =>
					getDistance(
						{ latitude: baseLatitude, longitude: baseLongitude },
						{
							latitude: property.latitude || 0,
							longitude: property.longitude || 0,
						}
					) /
						1000 <
					maxDistance
			)

			// While the result has less than 6 properties, we increase the max distance
			if (result.length < 6) {
				getHomeProperties(
					baseLatitude,
					baseLongitude,
					propertiesExpanded,
					maxDistance + 30
				)
			} else {
				return result
			}
		}

		const maxDistance = 30

		return (
			getHomeProperties(baseLatitude, baseLongitude, propertiesExpanded, maxDistance) ||
			[]
		)
	}

	@Get('/:id')
	@Summary('Return a property by his id')
	@Returns(200, PropertySerializer).Groups('read')
	async getPropertyById(@PathParams('id') property_id: number) {
		const uniqueProperty = await this.prisma.property.findUnique({
			where: { property_id },
		})

		const agent = uniqueProperty?.agent_id
			? await this.prisma.user.findUnique({
					where: { user_id: uniqueProperty?.agent_id },
			  })
			: undefined

		if (!uniqueProperty) {
			const errorObject = {
				status: 404,
				message: this.i18n.t('idNotFound', { id: property_id }),
			}

			throw errorObject
		}

		const address = await this.prisma.address.findUnique({
			where: { address_id: uniqueProperty.address_id },
		})

		return {
			...uniqueProperty,
			city: address?.city || '',
			zipcode: address?.zipcode || '',
			way: address?.address || '',
			latitude: Number(address?.latitude) || 0,
			longitude: Number(address?.longitude) || 0,
			agent_firstname: agent?.firstname,
			agent_name: agent?.name,
			agent_phone: agent?.phone,
			agent_mail: agent?.mail,
		}
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
	async updateProperty(
		@PathParams('id') id: number,
		@BodyParams()
		@Groups('put')
		property: PropertySerializer
	): Promise<PropertySerializer> {
		const updateProperty = await this.prisma.property.update({
			where: { property_id: id },
			data: property,
		})

		if (!updateProperty) {
			const errorObject = {
				status: 404,
				message: this.i18n.t('idNotFound', { id }),
			}

			throw errorObject
		}
		const updatedProperty = await this.prisma.property.findUnique({
			where: { property_id: id },
		})

		if (!updatedProperty) {
			const errorObject = {
				status: 404,
				message: this.i18n.t('idNotFound', { id }),
			}

			throw errorObject
		}

		const address = await this.prisma.address.findUnique({
			where: { address_id: updatedProperty.address_id },
		})

		const propertyExpanded = {
			...updateProperty,
			city: address?.city || '',
			zipcode: address?.zipcode || '',
			way: address?.address || '',
			latitude: Number(address?.latitude) || 0,
			longitude: Number(address?.longitude) || 0,
		}

		return propertyExpanded
	}

	@Delete('/:id')
	@Summary('Delete a property by its id')
	@Returns(204)
	async deleteProperty(@PathParams('id') property_id: number): Promise<void> {
		const deleteProperty = await this.prisma.property.delete({ where: { property_id } })

		if (!deleteProperty) {
			const errorObject = {
				status: 404,
				message: this.i18n.t('idNotFound', { id: property_id }),
			}

			throw errorObject
		}
	}
}
