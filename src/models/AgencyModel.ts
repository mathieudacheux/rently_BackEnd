import { Agency } from '@prisma/client'
import { Groups } from '@tsed/schema'

class AgencySerializer implements Agency {
	@Groups('read')
	agency_id: number
	@Groups('read', 'put', 'post')
	name: string
	created_at: Date
	updated_at: Date | null
	deleted_at: Date | null
	@Groups('read', 'put', 'post')
	fee_id: number
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
}

export { AgencySerializer }
