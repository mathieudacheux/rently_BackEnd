import { Controller, Get, PathParams, Post, BodyParams, Put, Delete } from '@tsed/common'
import { Inject } from '@tsed/di'
import { PrismaService } from '../../services/PrismaService'
import { Required, Email, Returns, Summary, Groups } from '@tsed/schema'
import { User } from '@prisma/client'

export default class UserModel implements User {
	@Groups('!creation')
	user_id: number
	@Required()
	@Email()
	mail: string
	@Required()
	password: string
	@Required()
	newsletter: boolean
	token: string | null
	token_expiration: Date | null
	created_at: Date | null
	validated_at: Date | null
	updated_at: Date | null
	deleted_at: Date | null
	firstname: string | null
	name: string | null
	phone: string | null
	address_id: number | null
	@Required()
	country_id: number
	@Required()
	role_id: number
	agency_id: number | null
}

@Controller('/')
export class Users {
	@Inject()
	protected prisma: PrismaService

	// @Get('/')
	// @Summary('Return a list of all users')
	// @Returns(200, Array).Of(UserModel)
	// async getUsers(@PathParams('searchString') searchString: string): Promise<UserModel[]> {
	// 	return this.prisma.users.findMany({
	// 		where: {
	// 			OR: [{ id_users: { equals: Number(searchString) } }, { mail: { contains: searchString } }],
	// 		},
	// 	})
	// }

	@Get('/')
	@Summary('Return a list of all users')
	@Returns(200, Array).Of(UserModel)
	@Returns(404, String).Description('Not found')
	async getAllUsers(): Promise<UserModel[]> {
		return this.prisma.user.findMany()
	}

	@Get('/:id')
	@Summary('Return a user by his id')
	@Returns(200, UserModel)
	@Returns(404, String).Description('Not found')
	async getUserById(@PathParams('id') user_id: number): Promise<UserModel | null> {
		return this.prisma.user.findUnique({ where: { user_id } })
	}

	@Post('/')
	@Summary('Create a new user')
	@Returns(201, UserModel)
	@Returns(201, UserModel)
	async signupUser(@BodyParams() @Groups('creation') user: UserModel) {
		return this.prisma.user.create({ data: user })
	}

	@Put('/:id')
	@Summary('Update a user by its id')
	@Returns(200, UserModel)
	async UpdateUser(@PathParams('id') id: number, user: UserModel): Promise<UserModel> {
		return this.prisma.user.update({
			where: { user_id: id },
			data: user,
		})
	}

	@Delete('/:id')
	@Summary('Delete a user by its id')
	@Returns(204)
	async deleteUser(@PathParams('id') user_id: number): Promise<UserModel> {
		return this.prisma.user.delete({ where: { user_id } })
	}
}
