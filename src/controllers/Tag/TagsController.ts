import { Controller, Get, PathParams, Post, BodyParams, Put, Delete } from '@tsed/common'
import { Inject } from '@tsed/di'
import { Returns, Summary, Groups, Required } from '@tsed/schema'
import { PrismaService } from '../../services/PrismaService'
import { TagSerializer } from '../../models/TagModel'
import i18n from '../../translations/i18n'

@Controller('/')
export class Tags {
	@Inject()
	protected prisma: PrismaService
	protected i18n = i18n

	@Get('/')
	@Summary('Return a list of all tags')
	@Returns(200, Array).Of(TagSerializer).Groups('read')
	async getAllTag(): Promise<TagSerializer[]> {
		const allTags = await this.prisma.tag.findMany()

		if (!allTags) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('notFound'),
			}

			throw errorObject
		}

		return allTags
	}

	@Get('/:id')
	@Summary('Return a tag by his id')
	@Returns(200, TagSerializer).Groups('read')
	async getTagById(@PathParams('id') tag_id: number) {
		const uniqueTag = await this.prisma.tag.findUnique({ where: { tag_id } })

		if (!uniqueTag) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('idNotFound', { id: tag_id }),
			}

			throw errorObject
		}

		return uniqueTag
	}

	@Post('/')
	@Summary('Create a new tag')
	@Returns(201, TagSerializer).Groups('read')
	@Returns(400, String).Description('Bad request')
	async createTag(@Required() @BodyParams() @Groups('post') tag: TagSerializer) {
		return await this.prisma.tag.create({ data: tag })
	}

	@Put('/:id')
	@Summary('Update a tag by its id')
	@Returns(200, TagSerializer)
	async updateTag(
		@PathParams('id') id: number,
		@BodyParams()
		@Groups('put')
		tag: TagSerializer
	): Promise<TagSerializer> {
		const updateTag = await this.prisma.tag.update({
			where: { tag_id: id },
			data: tag,
		})

		if (!updateTag) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('idNotFound', { id }),
			}

			throw errorObject
		}

		return updateTag
	}

	@Delete('/:id')
	@Summary('Delete a Tag by its id')
	@Returns(204)
	async deleteTag(@PathParams('id') tag_id: number): Promise<void> {
		const deleteTag = await this.prisma.tag.delete({ where: { tag_id } })

		if (!deleteTag) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('idNotFound', { id: tag_id }),
			}

			throw errorObject
		}
	}
}
