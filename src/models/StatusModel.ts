import { Status } from '@prisma/client'
import { Groups } from '@tsed/schema'

class StatusSerializer implements Status {
	@Groups('read')
	status_id: number
	@Groups('read', 'put', 'post')
	name: string
	created_at: Date
	updated_at: Date | null
	deleted_at: Date | null
}

export { StatusSerializer }
