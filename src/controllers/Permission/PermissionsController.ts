import { Controller, Get, PathParams, Post, BodyParams, Put, Delete } from '@tsed/common'
import { Inject } from '@tsed/di'
import { PrismaService } from '../../services/PrismaService'
import { Required, Returns, Summary, Groups } from '@tsed/schema'
import { Permission } from '@prisma/client'

class PermissionModel implements Permission {
	@Groups('!creation')
	permission_id: number
	@Required()
	name: string
	created_at: Date | null
	updated_at: Date | null
	deleted_at: Date | null
}

@Controller('/')
export class Permissions {
	@Inject()
	protected prisma: PrismaService

	@Get('/')
	@Summary('Return a list of all permissions')
	@Returns(200, Array).Of(PermissionModel)
	async getAllPermissions(): Promise<PermissionModel[]> {
		return this.prisma.permission.findMany()
	}

	@Get('/:id')
	@Summary('Return a permission by his id')
	@Returns(200, PermissionModel)
	async getPermissionById(@PathParams('id') permission_id: number) {
		return this.prisma.permission.findUnique({ where: { permission_id } })
	}

	@Post('/')
	@Summary('Create a new permission')
	@Returns(201, PermissionModel)
	async createPermission(@BodyParams() @Groups('creation') permission: PermissionModel) {
		return this.prisma.permission.create({ data: permission })
	}

	@Put('/:id')
	@Summary('Update a permission by its id')
	@Returns(200, PermissionModel)
	async updatePermission(
		@PathParams('id') permission_id: number,
		permission: PermissionModel
	): Promise<PermissionModel> {
		return this.prisma.permission.update({
			where: { permission_id },
			data: permission,
		})
	}

	@Delete('/:id')
	@Summary('Delete a permission by its id')
	@Returns(204)
	async deletePermission(@PathParams('id') permission_id: number): Promise<PermissionModel> {
		return this.prisma.permission.delete({ where: { permission_id } })
	}
}
