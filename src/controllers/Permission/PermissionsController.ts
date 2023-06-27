import {
	Controller,
	Get,
	PathParams,
	Post,
	BodyParams,
	Put,
	Delete,
	UseBeforeEach,
} from '@tsed/common'
import { Inject } from '@tsed/di'
import { PrismaService } from '../../services/PrismaService'
import { Returns, Summary, Groups, Required } from '@tsed/schema'
import { PermissionSerializer } from '../../models/PermissionModel'
import AuthentificationMiddleware from '../../middlewares/AuthentificationMiddleware'

@Controller('/')
export class Permissions {
	@Inject()
	protected prisma: PrismaService

	@UseBeforeEach(AuthentificationMiddleware)
	@Get('/')
	@Summary('Return a list of all permissions')
	@Returns(200, Array).Of(PermissionSerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async getAllPermissions(): Promise<PermissionSerializer[]> {
		return this.prisma.permission.findMany()
	}

	@Get('/:id')
	@Summary('Return a permission by his id')
	@Returns(200, PermissionSerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async getPermissionById(@PathParams('id') permission_id: number) {
		return this.prisma.permission.findUnique({ where: { permission_id } })
	}

	@Post('/')
	@Summary('Create a new permission')
	@Returns(201, PermissionSerializer).Groups('read')
	@Returns(400, String).Description('Bad request')
	async createPermission(
		@Required() @BodyParams() @Groups('post') permission: PermissionSerializer
	) {
		return this.prisma.permission.create({ data: permission })
	}

	@Put('/:id')
	@Summary('Update a permission by its id')
	@Returns(200, PermissionSerializer).Groups('read')
	@Returns(400, String).Description('Bad request')
	async updatePermission(
		@PathParams('id') permission_id: number,
		@BodyParams() @Groups('put') permission: PermissionSerializer
	): Promise<PermissionSerializer> {
		return this.prisma.permission.update({
			where: { permission_id },
			data: permission,
		})
	}

	@Delete('/:id')
	@Summary('Delete a permission by its id')
	@Returns(204)
	@Returns(400, String).Description('Bad request')
	async deletePermission(@PathParams('id') permission_id: number): Promise<void> {
		await this.prisma.permission.delete({ where: { permission_id } })
	}
}
