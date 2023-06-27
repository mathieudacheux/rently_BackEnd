import { Agency } from '@prisma/client'
import { Groups } from '@tsed/schema'

class AgencySerializer implements Agency {
	@Groups('read')
	agency_id: number
	@Groups('read', 'put', 'post')
	name: string
	created_at: Date | null
	updated_at: Date | null
	deleted_at: Date | null
	@Groups('read', 'put', 'post')
	fee_id: number
	@Groups('read', 'put', 'post')
	address_id: number
}

export { AgencySerializer }
