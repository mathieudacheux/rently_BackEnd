import { Role } from '@prisma/client'
import { Groups } from '@tsed/schema'

class RoleSerializer implements Role {
	@Groups('read')
	role_id: number
	@Groups('read', 'put', 'post')
	name: string
	created_at: Date
	updated_at: Date | null
	deleted_at: Date | null
	@Groups('read', 'put', 'post')
	permission_id: number
}

export { RoleSerializer }
