import { Permission } from '@prisma/client'
import { Groups } from '@tsed/schema'

class PermissionSerializer implements Permission {
	@Groups('read')
	permission_id: number
	@Groups('post', 'read', 'put')
	properties: string
	@Groups('post', 'read', 'put')
	addresses: string
	@Groups('post', 'read', 'put')
	agencies: string
	@Groups('post', 'read', 'put')
	appointments: string
	@Groups('post', 'read', 'put')
	articles: string
	@Groups('post', 'read', 'put')
	attachments: string
	@Groups('post', 'read', 'put')
	bookmarks: string
	@Groups('post', 'read', 'put')
	countries: string
	@Groups('post', 'read', 'put')
	fees: string
	@Groups('post', 'read', 'put')
	messages: string
	@Groups('post', 'read', 'put')
	roles: string
	@Groups('post', 'read', 'put')
	sectors: string
	@Groups('post', 'read', 'put')
	statuses: string
	@Groups('post', 'read', 'put')
	tags: string
	@Groups('post', 'read', 'put')
	users: string
	created_at: Date
	updated_at: Date | null
	deleted_at: Date | null
}

export { PermissionSerializer }
