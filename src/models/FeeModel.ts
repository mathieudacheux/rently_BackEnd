import { Fee } from '@prisma/client'
import { Groups, Pattern } from '@tsed/schema'

class FeeSerializer implements Fee {
	@Groups('read')
	fee_id: number
	@Groups('creation', 'read', 'put')
	@Pattern(/^[0-9]{1,2}([.][0-9]{1,2})?$/)
	rent_fee: string
	@Groups('creation', 'read', 'put')
	@Pattern(/^[0-9]{1,2}([.][0-9]{1,2})?$/)
	sell_fee: string
	@Groups('creation', 'read', 'put')
	@Pattern(/^[0-9]{1,2}([.][0-9]{1,2})?$/)
	square_fee: string
	@Groups('creation', 'read', 'put')
	@Pattern(/^[0-9]{1,2}([.][0-9]{1,2})?$/)
	gestion_fee: string
	created_at: Date
	updated_at: Date | null
	deleted_at: Date | null
}

export { FeeSerializer }
