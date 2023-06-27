import { Prisma, Fee } from '@prisma/client'
import { Groups } from '@tsed/schema'

class FeeSerializer implements Fee {
	@Groups('read')
	fee_id: number
	@Groups('creation', 'read', 'put')
	rent_fee: Prisma.Decimal
	@Groups('creation', 'read', 'put')
	sell_fee: Prisma.Decimal
	@Groups('creation', 'read', 'put')
	square_fee: Prisma.Decimal
	@Groups('creation', 'read', 'put')
	gestion_fee: Prisma.Decimal
	created_at: Date
	updated_at: Date | null
	deleted_at: Date | null
}

export { FeeSerializer }
