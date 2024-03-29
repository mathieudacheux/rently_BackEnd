import {
	Controller,
	Get,
	PathParams,
	Post,
	BodyParams,
	Put,
	Delete,
	UseBeforeEach,
	QueryParams,
} from '@tsed/common'
import { Inject } from '@tsed/di'
import { PrismaService } from '../../services/PrismaService'
import { Returns, Summary, Groups, Required } from '@tsed/schema'
import { MessageSerializer } from '../../models/MessageModel'
import AuthentificationMiddleware from '../../middlewares/AuthentificationMiddleware'
import { ChatService } from '../../services/ChatService'

@Controller('/')
export class Messages {
	@Inject()
	protected chatService: ChatService
	@Inject()
	protected prisma: PrismaService

	@UseBeforeEach(AuthentificationMiddleware)
	@Get('/')
	@Summary('Return a list of all messages')
	@Returns(200, Array).Of(MessageSerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async getAllMessages(
		@QueryParams('user_id_1') user_id_1: number,
		@QueryParams('user_id_2') user_id_2: number
	): Promise<MessageSerializer[]> {
		const userOneSend = await this.prisma.message.findMany({
			where: { user_id_1, user_id_2 },
			orderBy: { created_at: 'desc' },
		})

		const userTwoSend = await this.prisma.message.findMany({
			where: { user_id_1: user_id_2, user_id_2: user_id_1 },
			orderBy: { created_at: 'desc' },
		})

		const messages = [...userOneSend, ...userTwoSend]

		return messages
	}

	@Get('/:id')
	@Summary('Return a message by his id')
	@Returns(200, MessageSerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async getMessageById(@PathParams('id') message_id: number) {
		return this.prisma.message.findUnique({ where: { message_id } })
	}

	@Post('/')
	@Summary('Create a new message')
	@Returns(201, MessageSerializer).Groups('read')
	@Returns(400, String).Description('Bad request')
	async createMessage(
		@Required() @BodyParams() @Groups('post') message: MessageSerializer
	) {
		this.chatService.message(
			String(message?.user_id_1),
			String(message?.user_id_2),
			message?.content
		)
		return this.prisma.message.create({ data: message })
	}

	@Put('/:id')
	@Summary('Update a message by its id')
	@Returns(200, MessageSerializer).Groups('read')
	async updateMessage(
		@PathParams('id') id: number,
		@BodyParams() @Groups('put') message: MessageSerializer
	): Promise<MessageSerializer> {
		return this.prisma.message.update({
			where: { message_id: id },
			data: message,
		})
	}

	@Delete('/:id')
	@Summary('Delete a message by its id')
	@Returns(204)
	@Returns(404, String).Description('Not found')
	async deleteMessage(@PathParams('id') message_id: number): Promise<void> {
		await this.prisma.message.delete({ where: { message_id } })
	}
}
