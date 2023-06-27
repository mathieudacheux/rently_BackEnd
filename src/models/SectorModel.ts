import { Sector } from '@prisma/client'
import { Groups } from '@tsed/schema'

class SectorSerializer implements Sector {
	@Groups('read')
	sector_id: number
	@Groups('read', 'put', 'post')
	name: string
	created_at: Date
	updated_at: Date | null
	deleted_at: Date | null
	@Groups('read', 'put', 'post')
	polygon: string
	@Groups('read', 'put', 'post')
	agency_id: number
}

export { SectorSerializer }
