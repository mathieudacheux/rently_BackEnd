import { hash } from 'bcrypt'
import { Controller, Get, PathParams, Post, BodyParams, Put, Delete } from '@tsed/common'
import { Inject } from '@tsed/di'
import { PrismaService } from '../../services/PrismaService'
import { Returns, Summary, Groups } from '@tsed/schema'
import { UserSerialiazer } from '../../models/UserModel'

@Controller('/')
export class Users {
	@Inject()
	protected prisma: PrismaService

	@Get('/')
	@Summary('Return a list of all users')
	@Returns(200, Array).Of(UserSerialiazer).Groups('read')
	@Returns(404, String).Description('Not found')
	async getAllUsers(): Promise<UserSerialiazer[]> {
		return this.prisma.user.findMany()
	}

	@Get('/:id')
	@Summary('Return a user by his id')
	@Returns(200, UserSerialiazer).Groups('read')
	@Returns(404, String).Description('Not found')
	async getUserById(@PathParams('id') user_id: number): Promise<UserSerialiazer | null> {
		return this.prisma.user.findUnique({ where: { user_id } })
	}

	@Get('/:mail')
	@Summary('Return a user by his mail')
	@Returns(200, UserSerialiazer).Groups('read')
	@Returns(404, String).Description('Not found')
	async getUserByMail(@PathParams('mail') mail: string): Promise<UserSerialiazer | null> {
		return this.prisma.user.findUnique({ where: { mail } })
	}

	@Post('/')
	@Summary('Create a new user')
	@Returns(201, UserSerialiazer).Description('Created').Groups('read')
	@Returns(400, String).Description('Bad request')
	async signupUser(
		@BodyParams() @Groups('post') user: UserSerialiazer
	): Promise<UserSerialiazer> {
		const userExists = await this.prisma.user.findUnique({
			where: { mail: user.mail },
		})
		if (userExists) {
			throw new Error('User already exists')
		}
		return this.prisma.user.create({
			data: {
				...user,
				password: await hash(user.password, 10),
			},
		})
	}

	@Put('/:id')
	@Summary('Update a user by its id')
	@Returns(200, UserSerialiazer).Description('Updated').Groups('read')
	@Returns(404, String).Description('Not found')
	async UpdateUser(
		@PathParams('id') id: number,
		@BodyParams() @Groups('put') user: UserSerialiazer
	): Promise<UserSerialiazer> {
		return this.prisma.user.update({
			where: { user_id: id },
			data: user,
		})
	}

	@Delete('/:id')
	@Summary('Delete a user by its id')
	@Returns(204)
	@Returns(404, String).Description('Not found')
	async deleteUser(@PathParams('id') user_id: number): Promise<void> {
		await this.prisma.user.delete({ where: { user_id } })
	}
}
