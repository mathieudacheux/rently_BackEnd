import { User } from '@prisma/client'
import { Groups } from '@tsed/schema'

class UserSerializer implements User {
	@Groups('read')
	user_id: number
	@Groups('read')
	firstname: string | null
	@Groups('read', 'put')
	name: string | null
	@Groups('read', 'put')
	phone: string | null
	@Groups('read', 'put', 'post')
	mail: string
	@Groups('post', 'put')
	password: string
	@Groups('post', 'put', 'read')
	newsletter: boolean
	token: string | null
	created_at: Date
	@Groups('read', 'put')
	validated_at: Date | null
	updated_at: Date | null
	deleted_at: Date | null
	@Groups('read', 'put')
	address_id: number | null
	@Groups('post', 'put', 'read')
	country_id: number
	@Groups('post', 'put', 'read')
	role_id: number
	@Groups('put', 'read')
	agency_id: number | null
}

export { UserSerializer }
