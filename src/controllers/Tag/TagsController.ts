import { Controller, Get, PathParams, Post, BodyParams, Put, Delete } from '@tsed/common'
import { Inject } from '@tsed/di'
import { PrismaService } from '../../services/PrismaService'
import { Returns, Summary, Groups, Required } from '@tsed/schema'
import { Tag } from '@prisma/client'

class TagModel implements Tag {
	@Groups('!creation')
	tag_id: number
	@Required()
	name: string
	created_at: Date | null
	updated_at: Date | null
	deleted_at: Date | null
}

@Controller('/')
export class Tags {
	@Inject()
	protected prisma: PrismaService

	@Get('/')
	@Summary('Return a list of all tags')
	@Returns(200, Array).Of(TagModel)
	async getAllTag(): Promise<TagModel[]> {
		return this.prisma.tag.findMany()
	}

	@Get('/:id')
	@Summary('Return a tag by his id')
	@Returns(200, TagModel)
	async getTagById(@PathParams('id') tag_id: number) {
		return this.prisma.tag.findUnique({ where: { tag_id } })
	}

	@Post('/')
	@Summary('Create a new tag')
	@Returns(201, TagModel)
	async createTag(@BodyParams('name') name: string): Promise<TagModel> {
		return this.prisma.tag.create({ data: { name } })
	}

	@Put('/:id')
	@Summary('Update a tag by its id')
	@Returns(200, TagModel)
	async updateTag(@PathParams('id') tag_id: number, tag: TagModel): Promise<TagModel> {
		return this.prisma.tag.update({
			where: { tag_id },
			data: tag,
		})
	}

	@Delete('/:id')
	@Summary('Delete a Tag by its id')
	@Returns(204)
	async deleteTag(@PathParams('id') tag_id: number): Promise<TagModel> {
		return this.prisma.tag.delete({ where: { tag_id } })
	}
}
