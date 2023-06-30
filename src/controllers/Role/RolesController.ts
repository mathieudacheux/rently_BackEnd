import { Controller, Get, PathParams, Post, BodyParams, Put, Delete } from '@tsed/common'
import { Inject } from '@tsed/di'
import { PrismaService } from '../../services/PrismaService'
import { Required, Returns, Summary, Groups, In } from '@tsed/schema'
import { RoleSerializer } from '../../models/RoleModel'

@Controller('/')
export class Roles {
	@Inject()
	protected prisma: PrismaService

	@Get('/')
	@Summary('Return a list of all roles')
	@Returns(200, Array).Of(RoleSerializer)
	@Returns(404, String).Description('Not found')
	async getAllRoles(): Promise<RoleSerializer[]> {
		return this.prisma.role.findMany()
	}

	@Get('/:id')
	@Summary('Return a role by his id')
	@Returns(200, RoleSerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async getRoleById(@PathParams('id') role_id: number) {
		return this.prisma.role.findUnique({ where: { role_id } })
	}

	@Post('/')
	@Summary('Create a new role')
	@Returns(201, RoleSerializer).Groups('read')
	@Returns(400, String).Description('Bad request')
	async createRole(@Required() @BodyParams() @Groups('post') role: RoleSerializer) {
		return this.prisma.role.create({ data: role })
	}

	@Put('/:id')
	@Summary('Update a role by its id')
	@Returns(200, RoleSerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async updateRole(
		@PathParams('id') id: number,
		@BodyParams()
		@Groups('put')
		role: RoleSerializer
	): Promise<RoleSerializer> {
		return this.prisma.role.update({
			where: { role_id: id },
			data: role,
		})
	}

	@Delete('/:id')
	@Summary('Delete a role by its id')
	@In('authorization').Type(String).Description('Bearer token')
	@Returns(204)
	@Returns(404, String).Description('Not found')
	async deleteRole(@PathParams('id') role_id: number): Promise<void> {
		await this.prisma.role.delete({ where: { role_id } })
	}
}
