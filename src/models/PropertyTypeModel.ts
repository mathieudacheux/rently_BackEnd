import { Property_type } from '@prisma/client'
import { Groups } from '@tsed/schema'

class PropertyTypeSerializer implements Property_type {
	@Groups('read')
	property_type_id: number
	@Groups('read')
	label: string
	created_at: Date
}

export { PropertyTypeSerializer }
