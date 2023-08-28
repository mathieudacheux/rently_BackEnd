import { Property } from '@prisma/client'
import { Groups } from '@tsed/schema'

class PropertySerializer implements Property {
	@Groups('read')
	property_id: number
	@Groups('read', 'put', 'post')
	name: string
	@Groups('read', 'put', 'post')
	description: string
	@Groups('read', 'put', 'post')
	signature_date: Date | null
	@Groups('read', 'put', 'post')
	property_type: number
	@Groups('read', 'put', 'post')
	price: number
	@Groups('read', 'put', 'post')
	surface: string
	@Groups('read', 'put', 'post')
	land_size: string
	@Groups('read', 'put', 'post')
	bathroom: number
	@Groups('read', 'put', 'post')
	kitchen: number
	@Groups('read', 'put', 'post')
	toilet: number
	@Groups('read', 'put', 'post')
	bedroom: number
	@Groups('read', 'put', 'post')
	elevator: boolean
	@Groups('read', 'put', 'post')
	balcony: boolean
	@Groups('read', 'put', 'post')
	terrace: boolean
	@Groups('read', 'put', 'post')
	cellar: boolean
	@Groups('read', 'put', 'post')
	parking: boolean
	@Groups('read', 'put', 'post')
	number_room: number
	@Groups('read', 'put', 'post')
	pool: boolean
	@Groups('read', 'put', 'post')
	caretaker: boolean
	@Groups('read', 'put', 'post')
	fiber_deployed: boolean
	@Groups('read', 'put', 'post')
	duplex: boolean
	@Groups('read', 'put', 'post')
	top_floor: boolean
	@Groups('read', 'put', 'post')
	garage: boolean
	@Groups('read', 'put', 'post')
	work_done: boolean
	@Groups('read', 'put', 'post')
	life_annuity: boolean
	@Groups('read', 'put', 'post')
	ground_floor: boolean
	@Groups('read', 'put', 'post')
	land_size_1: string
	@Groups('read', 'put', 'post')
	garden: boolean
	created_at: Date
	updated_at: Date | null
	deleted_at: Date | null
	@Groups('read', 'put', 'post')
	owner_id: number
	@Groups('read', 'put', 'post')
	status_id: number
	@Groups('read', 'put', 'post')
	tenant_id: number | null
	@Groups('read', 'put', 'post')
	address_id: number
	@Groups('read')
	city?: string
	@Groups('read')
	zipcode?: string
	@Groups('read')
	way?: string
	@Groups('read')
	longitude?: string
	@Groups('read')
	latitude?: string
	@Groups('read', 'put', 'post')
	dpe: number
	@Groups('read', 'put', 'post')
	agency_id: number
}

export { PropertySerializer }
