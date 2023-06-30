import { Groups } from '@tsed/schema'
import { Country } from '@prisma/client'

class CountryModel implements Country {
	@Groups('read')
	country_id: number
	@Groups('creation', 'read', 'put')
	name: string
	created_at: Date
	updated_at: Date | null
	deleted_at: Date | null
}

export { CountryModel }
