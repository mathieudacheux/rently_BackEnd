import { Message } from '@prisma/client'
import { Groups } from '@tsed/schema'

class MessageSerializer implements Message {
	@Groups('read')
	message_id: number
	@Groups('post', 'read', 'put')
	content: string
	@Groups('read')
	created_at: Date
	updated_at: Date | null
	deleted_at: Date | null
	@Groups('post', 'read')
	user_id_1: number
	@Groups('post', 'read')
	user_id_2: number
	@Groups('post', 'read')
	sender_id: number | null
}

export { MessageSerializer }
