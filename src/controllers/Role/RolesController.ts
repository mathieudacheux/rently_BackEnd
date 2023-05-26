import { Controller, Get, PathParams, Post, BodyParams, Put, Delete } from '@tsed/common'
import { Inject } from '@tsed/di'
import { PrismaService } from '../../services/PrismaService'
import { Required, Returns, Summary, Groups } from '@tsed/schema'
import { Role } from '@prisma/client'

class RoleModel implements Role {
	@Groups('!creation')
	role_id: number
	@Required()
	name: string
	created_at: Date | null
	updated_at: Date | null
	deleted_at: Date | null
	@Required()
	permission_id: number
}

@Controller('/')
export class Roles {
	@Inject()
	protected prisma: PrismaService

	@Get('/')
	@Summary('Return a list of all roles')
	@Returns(200, Array).Of(RoleModel)
	async getAllAgencies(): Promise<RoleModel[]> {
		return this.prisma.role.findMany()
	}

	@Get('/:id')
	@Summary('Return a role by his id')
	@Returns(200, RoleModel)
	async getRoleById(@PathParams('id') role_id: number) {
		return this.prisma.role.findUnique({ where: { role_id } })
	}

	@Post('/')
	@Summary('Create a new role')
	@Returns(201, RoleModel)
	async createRole(@BodyParams() @Groups('creation') role: RoleModel) {
		return this.prisma.role.create({ data: role })
	}

	@Put('/:id')
	@Summary('Update a role by its id')
	@Returns(200, RoleModel)
	async updateRole(@PathParams('id') role_id: number, role: RoleModel): Promise<RoleModel> {
		return this.prisma.role.update({
			where: { role_id },
			data: role,
		})
	}

	@Delete('/:id')
	@Summary('Delete a role by its id')
	@Returns(204)
	async deleteRole(@PathParams('id') role_id: number): Promise<RoleModel> {
		return this.prisma.role.delete({ where: { role_id } })
	}
}
