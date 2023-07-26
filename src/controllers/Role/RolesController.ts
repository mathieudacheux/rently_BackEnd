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
import { Required, Returns, Summary, Groups, In } from '@tsed/schema'
import { RoleSerializer } from '../../models/RoleModel'
import i18n from '../../translations/i18n'

@Controller('/')
export class Roles {
	@Inject()
	protected prisma: PrismaService
	protected i18n = i18n

	@Get('/')
	@Summary('Return a list of all roles')
	@Returns(200, Array).Of(RoleSerializer)
	async getAllRoles(@QueryParams('name') name: string): Promise<RoleSerializer[]> {
		const allRoles = await this.prisma.role.findMany({
			where: {
				name: name !== '' ? name : undefined,
			},
		})

		if (!allRoles) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('notFound'),
			}

			throw errorObject
		}

		return allRoles
	}

	@Get('/:id')
	@Summary('Return a role by his id')
	@Returns(200, RoleSerializer).Groups('read')
	async getRoleById(@PathParams('id') role_id: number) {
		const uniqueRole = await this.prisma.role.findUnique({ where: { role_id } })

		if (!uniqueRole) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('idNotFound', { id: role_id }),
			}

			throw errorObject
		}

		return uniqueRole
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
	async updateRole(
		@PathParams('id') id: number,
		@BodyParams()
		@Groups('put')
		role: RoleSerializer
	): Promise<RoleSerializer> {
		const updateRole = await this.prisma.role.update({
			where: { role_id: id },
			data: role,
		})

		if (!updateRole) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('idNotFound', { id }),
			}

			throw errorObject
		}

		return updateRole
	}

	@Delete('/:id')
	@Summary('Delete a role by its id')
	@In('authorization').Type(String).Description('Bearer token')
	@Returns(204)
	async deleteRole(@PathParams('id') role_id: number): Promise<void> {
		const deleteRole = await this.prisma.role.delete({ where: { role_id } })

		if (!deleteRole) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('idNotFound', { id: role_id }),
			}

			throw errorObject
		}
	}
}
