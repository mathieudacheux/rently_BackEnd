import { Groups } from '@tsed/schema'
import { Bookmark } from '@prisma/client'

class BookmarkSerializer implements Bookmark {
	@Groups('read')
	bookmark_id: number
	created_at: Date
	updated_at: Date | null
	deleted_at: Date | null
	@Groups('read', 'post', 'put')
	user_id: number
	@Groups('read', 'post', 'put')
	property_id: number
}

export { BookmarkSerializer }
