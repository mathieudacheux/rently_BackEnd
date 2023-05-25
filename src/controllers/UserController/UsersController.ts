import { Controller, Get, PathParams } from '@tsed/common'
import { Inject } from '@tsed/di'
import { PrismaService } from '../../services/PrismaService'
import { Groups, Required, Email, Returns, Summary } from '@tsed/schema'

class UserModel {
	@Required()
	@Groups('!creation')
	id_users: number

	@Required()
	@Email()
	mail: string
}

@Controller('/')
export class UsersController {
	@Inject()
	protected prisma: PrismaService

	@Get('/')
	@Summary('Return a list of all users')
	@Returns(200, Array).Of(UserModel)
	getUsers() {
		return this.prisma.users.findMany()
	}

	@Get('/:id')
	@Summary('Return a user by his id')
	@Returns(200, UserModel)
	async getUserById(@PathParams('id') id_users: number) {
		return this.prisma.users.findUnique({ where: { id_users } })
	}
}
