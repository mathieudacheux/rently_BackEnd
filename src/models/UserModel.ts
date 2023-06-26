import { User } from '@prisma/client'
import { Groups, Required } from '@tsed/schema'

class UserRead implements User {
	@Groups('!creation')
	user_id: number
	@Groups('!creation')
	firstname: string | null
	@Groups('!creation')
	name: string | null
	@Groups('!creation')
	phone: string | null
	@Groups('!creation')
	mail: string
	password: string
	@Groups('!creation')
	newsletter: boolean
	token: string | null
	created_at: Date | null
	validated_at: Date | null
	updated_at: Date | null
	deleted_at: Date | null
	@Groups('!creation')
	address_id: number | null
	@Groups('!creation')
	country_id: number
	@Groups('!creation')
	role_id: number
	@Groups('!creation')
	agency_id: number | null
}

class UserPost implements User {
	user_id: number
	firstname: string | null
	name: string | null
	phone: string | null
	@Groups('creation')
	@Required()
	mail: string
	@Groups('creation')
	@Required()
	password: string
	@Groups('creation')
	@Required()
	newsletter: boolean
	token: string | null
	created_at: Date | null
	validated_at: Date | null
	updated_at: Date | null
	deleted_at: Date | null
	address_id: number | null
	@Groups('creation')
	@Required()
	country_id: number
	@Groups('creation')
	@Required()
	role_id: number
	agency_id: number | null
}

class UserPut implements User {
	user_id: number
	@Groups('put')
	firstname: string | null
	@Groups('put')
	name: string | null
	@Groups('put')
	phone: string | null
	@Groups('put')
	mail: string
	@Groups('put')
	password: string
	@Groups('put')
	newsletter: boolean
	token: string | null
	created_at: Date | null
	validated_at: Date | null
	updated_at: Date | null
	deleted_at: Date | null
	@Groups('put')
	address_id: number | null
	@Groups('put')
	country_id: number
	@Groups('put')
	role_id: number
	@Groups('put')
	agency_id: number | null
}

export { UserRead, UserPost, UserPut }
