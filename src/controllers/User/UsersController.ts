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
import i18n from '../../translations/i18n'

@Controller('/')
export class Users {
	@Inject()
	protected prisma: PrismaService
	protected i18n = i18n

	@Get('/')
	@Summary('Return a list of all users')
	@Returns(200, Array).Of(UserSerializer).Groups('read')
	async getAllUsers(@QueryParams('page') page: number): Promise<UserSerializer[]> {
		const pageSize = 20
		const allUsers = await this.prisma.user.findMany({
			take: pageSize,
			skip: (page ? page - 1 : 0) * pageSize,
		})

		if (!allUsers) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('notFound'),
			}

			throw errorObject
		}

		return allUsers
	}

	@Get('/users_filter')
	@Summary('Return a list of users by filter')
	@Returns(200, Array).Of(UserSerializer).Groups('read')
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
				city: city !== '' ? city : undefined,
				zipcode: zipcode !== '' ? zipcode : undefined,
			},
		})

		const filterUsers = await this.prisma.user.findMany({
			where: {
				mail: mail !== '' ? mail : undefined,
				phone: phone !== '' ? phone : undefined,
				name: name !== '' ? name : undefined,
				firstname: firstname !== '' ? firstname : undefined,
				address_id:
					userAddresses.length > 0
						? {
								in: userAddresses.map((userAddresses) => userAddresses.address_id),
						  }
						: undefined,
			},
			orderBy: { name: 'asc' },
		})

		if (!filterUsers) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('notFound'),
			}

			throw errorObject
		}

		return filterUsers
	}

	@Get('/:id')
	@Summary('Return a user by his id')
	@Returns(200, UserSerializer).Groups('read')
	async getUserById(@PathParams('id') id: number) {
		const uniqueUser = await this.prisma.user.findUnique({ where: { user_id: id } })

		if (!uniqueUser) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('notFound'),
			}

			throw errorObject
		}

		return uniqueUser
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
			throw new Error(this.i18n.t('userExists'))
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
	async UpdateUser(
		@PathParams('id') id: number,
		@BodyParams() @Groups('put') user: UserSerializer
	): Promise<UserSerializer> {
		const updateUser = await this.prisma.user.update({
			where: { user_id: id },
			data: user,
		})

		if (!updateUser) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('idNotFound', { id }),
			}

			throw errorObject
		}

		return updateUser
	}

	@Delete('/:id')
	@Summary('Delete a user by its id')
	@Returns(204)
	async deleteUser(@PathParams('id') user_id: number): Promise<void> {
		const deleteUser = await this.prisma.user.delete({ where: { user_id } })

		if (!deleteUser) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('idNotFound', { id: user_id }),
			}

			throw errorObject
		}
	}
}
