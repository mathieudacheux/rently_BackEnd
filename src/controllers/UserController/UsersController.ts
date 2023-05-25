import { Controller, Get, PathParams, Post, BodyParams, Put, Delete } from '@tsed/common'
import { Inject } from '@tsed/di'
import { PrismaService } from '../../services/PrismaService'
import { Required, Email, Returns, Summary, Groups } from '@tsed/schema'
import { users } from '@prisma/client'

class UserModel implements users {
	@Groups('!creation')
	id_users: number
	@Required()
	@Email()
	mail: string
	@Required()
	password: string
	@Required()
	newsletter: boolean
	created_at?: Date
	validated_at?: Date
	updated_at?: Date
	deleted_at?: Date
	firstname?: string
	name?: string
	phone?: string
	id_addresses?: number
	@Required()
	id_countries: number
	@Required()
	id_roles: number
	id_agencies?: number
}

@Controller('/')
export class UsersController {
	@Inject()
	protected prisma: PrismaService

	@Get('/:param')
	@Summary('Return a list of all users')
	@Returns(200, Array).Of(UserModel)
	async getUsers(@PathParams('searchString') searchString: string): Promise<UserModel[]> {
		return this.prisma.users.findMany({
			where: {
				OR: [{ id_users: { equals: Number(searchString) } }, { mail: { contains: searchString } }],
			},
		})
	}

	@Get('/:id')
	@Summary('Return a user by his id')
	@Returns(200, UserModel)
	async getUserById(@PathParams('id') id_users: number) {
		return this.prisma.users.findUnique({ where: { id_users } })
	}

	@Post('/')
	@Summary('Create a new user')
	@Returns(201, UserModel)
	async signupUser(@BodyParams() @Groups('creation') user: UserModel) {
		return this.prisma.users.create({ data: user })
	}

	@Put('/:id')
	@Summary('Update a user by its id')
	@Returns(200, UserModel)
	async publishPost(@PathParams('id') id: number, user: UserModel): Promise<UserModel> {
		return this.prisma.users.update({
			where: { id_users: id },
			data: user,
		})
	}

	@Delete('/:id')
	@Summary('Delete a user by its id')
	@Returns(204)
	async deletePost(@PathParams('id') id: number): Promise<UserModel> {
		return this.prisma.users.delete({ where: { id_users: id } })
	}
}
