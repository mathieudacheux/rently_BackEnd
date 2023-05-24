import { Controller, Get, PathParams } from '@tsed/common'
import { Inject } from '@tsed/di'
import { PrismaService } from '../../services/PrismaService'
import { Groups, Required, Email, Returns, Summary } from '@tsed/schema'
// import { users } from '@prisma/client'

class UserModel {
	@Required()
	@Groups('!creation')
	id_users: number

	@Email()
	mail: string
}

@Controller('/users')
export class UsersController {
	@Inject()
	protected prisma: PrismaService

	@Get('/:id')
	@Summary('Return a use by his id')
	@Returns(200, UserModel)
	async getUserById(@PathParams('id') id_users: number) {
		return this.prisma.users.findUnique({ where: { id_users } })
	}

	// @Get('/:mail')
	// @Summary('Return a use by his mail')
	// @Returns(200, UserModel)
	// async getUserByMail(@Email() mail: string) {
	// 	return this.prisma.users.findUnique({ where: { mail } })
	// }

	@Get('/')
	@Summary('Return a list of User')
	@Returns(200, Array).Of(UserModel)
	getUsers() {
		return this.prisma.users.findMany()
	}
}
