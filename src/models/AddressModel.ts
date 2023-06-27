import { Address } from '@prisma/client'
import { Groups } from '@tsed/schema'

class AddressSerializer implements Address {
	@Groups('read')
	address_id: number
	@Groups('read', 'put', 'post')
	address: string
	@Groups('read', 'put', 'post')
	city: string
	@Groups('read', 'put', 'post')
	zipcode: string
	@Groups('read', 'put', 'post')
	additionnal_info: string | null
	@Groups('read', 'put', 'post')
	longitude: string
	@Groups('read', 'put', 'post')
	latitude: string
	created_at: Date
	updated_at: Date | null
	deleted_at: Date | null
}

export { AddressSerializer }
