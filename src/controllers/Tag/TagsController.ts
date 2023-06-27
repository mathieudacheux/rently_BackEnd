import { Controller, Get, PathParams, Post, BodyParams, Put, Delete } from '@tsed/common'
import { Inject } from '@tsed/di'
import { Returns, Summary, Groups, Required } from '@tsed/schema'
import { PrismaService } from '../../services/PrismaService'
import { TagSerializer } from '../../models/TagModel'

@Controller('/')
export class Tags {
	@Inject()
	protected prisma: PrismaService

	@Get('/')
	@Summary('Return a list of all tags')
	@Returns(200, Array).Of(TagSerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async getAllTag(): Promise<TagSerializer[]> {
		return this.prisma.tag.findMany()
	}

	@Get('/:id')
	@Summary('Return a tag by his id')
	@Returns(200, TagSerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async getTagById(@PathParams('id') tag_id: number) {
		return this.prisma.tag.findUnique({ where: { tag_id } })
	}

	@Post('/')
	@Summary('Create a new tag')
	@Returns(201, TagSerializer).Groups('read')
	@Returns(400, String).Description('Bad request')
	async createTag(@Required() @BodyParams() @Groups('post') tag: TagSerializer) {
		return this.prisma.tag.create({ data: tag })
	}

	@Put('/:id')
	@Summary('Update a tag by its id')
	@Returns(200, TagSerializer)
	@Returns(404, String).Description('Not found')
	async updateTag(
		@PathParams('id') id: number,
		@BodyParams()
		@Groups('put')
		tag: TagSerializer
	): Promise<TagSerializer> {
		return this.prisma.tag.update({
			where: { tag_id: id },
			data: tag,
		})
	}

	@Delete('/:id')
	@Summary('Delete a Tag by its id')
	@Returns(204)
	@Returns(404, String).Description('Not found')
	async deleteTag(@PathParams('id') tag_id: number): Promise<void> {
		await this.prisma.tag.delete({ where: { tag_id } })
	}
}
