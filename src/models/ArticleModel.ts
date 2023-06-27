import { Article } from '@prisma/client'
import { Groups } from '@tsed/schema'

class ArticleSerializer implements Article {
	@Groups('read')
	article_id: number
	@Groups('read', 'post', 'put')
	name: string
	@Groups('read', 'post', 'put')
	content: string
	created_at: Date
	updated_at: Date | null
	deleted_at: Date | null
	@Groups('read', 'post', 'put')
	tag_id: number
	@Groups('read', 'post', 'put')
	user_id: number
}

export { ArticleSerializer }
