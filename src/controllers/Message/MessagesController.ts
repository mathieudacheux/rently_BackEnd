import { Controller, Get, PathParams, Post, BodyParams, Put, Delete } from '@tsed/common'
import { Inject } from '@tsed/di'
import { PrismaService } from '../../services/PrismaService'
import { Returns, Summary, Groups } from '@tsed/schema'
import { Message } from '@prisma/client'

class MessageModel implements Message {
	@Groups('!creation')
	message_id: number
	content: string
	created_at: Date | null
	updated_at: Date | null
	deleted_at: Date | null
	user_id_1: number
	user_id_2: number
}

@Controller('/')
export class Messages {
	@Inject()
	protected prisma: PrismaService

	@Get('/')
	@Summary('Return a list of all messages')
	@Returns(200, Array).Of(MessageModel)
	async getAllMessages(@PathParams('offset') offset: number): Promise<MessageModel[]> {
		return this.prisma.message.findMany({
			take: 50,
			skip: offset,
			orderBy: { created_at: 'desc' },
		})
	}

	@Get('/:id')
	@Summary('Return a message by his id')
	@Returns(200, MessageModel)
	async getMessageById(@PathParams('id') message_id: number) {
		return this.prisma.message.findUnique({ where: { message_id } })
	}

	@Post('/')
	@Summary('Create a new message')
	@Returns(201, MessageModel)
	async createMessage(@BodyParams() @Groups('creation') message: MessageModel) {
		return this.prisma.message.create({ data: message })
	}

	@Put('/:id')
	@Summary('Update a message by its id')
	@Returns(200, MessageModel)
	async updateMessage(
		@PathParams('id') id: number,
		message: MessageModel
	): Promise<MessageModel> {
		return this.prisma.message.update({
			where: { message_id: id },
			data: message,
		})
	}

	@Delete('/:id')
	@Summary('Delete a message by its id')
	@Returns(204)
	async deleteMessage(@PathParams('id') message_id: number): Promise<MessageModel> {
		return this.prisma.message.delete({ where: { message_id } })
	}
}
