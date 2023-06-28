import { hash } from 'bcrypt'
import {
	Controller,
	Get,
	PathParams,
	Post,
	BodyParams,
	Put,
	Delete,
	QueryParams,
} from '@tsed/common'
import { Inject } from '@tsed/di'
import { PrismaService } from '../../services/PrismaService'
import { Returns, Summary, Groups } from '@tsed/schema'
import { UserSerializer } from '../../models/UserModel'

@Controller('/')
export class Users {
	@Inject()
	protected prisma: PrismaService

	@Get('/')
	@Summary('Return a list of all users')
	@Returns(200, Array).Of(UserSerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async getAllUsers(@QueryParams('page') page: number): Promise<UserSerializer[]> {
		const pageSize = 20
		return this.prisma.user.findMany({
			take: pageSize,
			skip: (page ? page - 1 : 0) * pageSize,
		})
	}

	@Get('/users_filter')
	@Summary('Return a list of users by filter')
	@Returns(200, Array).Of(UserSerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async getUsersByFilter(
		@QueryParams('mail') mail: string,
		@QueryParams('phone') phone: string,
		@QueryParams('name') name: string,
		@QueryParams('firstname') firstname: string,
		@QueryParams('city') city: string,
		@QueryParams('zipcode') zipcode: string
	): Promise<UserSerializer[]> {
		const userAddresses = await this.prisma.address.findMany({
			where: {
				city,
				zipcode,
			},
		})

		return this.prisma.user.findMany({
			where: {
				mail,
				phone,
				name,
				firstname,
				address_id: {
					in: userAddresses.map((userAddresses) => userAddresses.address_id),
				},
			},
			orderBy: { name: 'asc' },
		})
	}

	@Get('/:id')
	@Summary('Return a user by his id')
	@Returns(200, UserSerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async getUserById(@PathParams('id') id: number) {
		return this.prisma.user.findUnique({ where: { user_id: id } })
	}

	@Post('/')
	@Summary('Create a new user')
	@Returns(201, UserSerializer).Description('Created').Groups('read')
	@Returns(400, String).Description('Bad request')
	async signupUser(
		@BodyParams() @Groups('post') user: UserSerializer
	): Promise<UserSerializer> {
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
	@Returns(200, UserSerializer).Description('Updated').Groups('read')
	@Returns(404, String).Description('Not found')
	async UpdateUser(
		@PathParams('id') id: number,
		@BodyParams() @Groups('put') user: UserSerializer
	): Promise<UserSerializer> {
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
