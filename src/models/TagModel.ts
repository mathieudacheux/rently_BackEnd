import { Tag } from '@prisma/client'
import { Groups } from '@tsed/schema'

class TagSerializer implements Tag {
	@Groups('read')
	tag_id: number
	@Groups('read', 'put', 'post')
	name: string
	created_at: Date
	updated_at: Date | null
	deleted_at: Date | null
}

export { TagSerializer }
