import { Controller, Get, PathParams, Post, BodyParams, Put, Delete } from '@tsed/common'
import { Inject } from '@tsed/di'
import { PrismaService } from '../../services/PrismaService'
import { Returns, Summary, Groups } from '@tsed/schema'
import { Bookmark } from '@prisma/client'

class BookmarkModel implements Bookmark {
	@Groups('!creation')
	bookmark_id: number
	created_at: Date | null
	updated_at: Date | null
	deleted_at: Date | null
	user_id: number
	property_id: number
}

@Controller('/')
export class Bookmarks {
	@Inject()
	protected prisma: PrismaService

	@Get('/')
	@Summary('Return a list of all bookmarks')
	@Returns(200, Array).Of(BookmarkModel)
	async getAllBookmarks(): Promise<BookmarkModel[]> {
		return this.prisma.bookmark.findMany()
	}

	@Get('/:id')
	@Summary('Return a bookmark by his id')
	@Returns(200, BookmarkModel)
	async getBookmarkById(@PathParams('id') bookmark_id: number) {
		return this.prisma.bookmark.findUnique({ where: { bookmark_id } })
	}

	@Post('/')
	@Summary('Create a new bookmark')
	@Returns(201, BookmarkModel)
	async createBookmark(@BodyParams() @Groups('creation') bookmark: BookmarkModel) {
		return this.prisma.bookmark.create({ data: bookmark })
	}

	@Put('/:id')
	@Summary('Update a bookmark by its id')
	@Returns(200, BookmarkModel)
	async updateBookmark(
		@PathParams('id') id: number,
		bookmark: BookmarkModel
	): Promise<BookmarkModel> {
		return this.prisma.bookmark.update({
			where: { bookmark_id: id },
			data: bookmark,
		})
	}

	@Delete('/:id')
	@Summary('Delete a bookmark by its id')
	@Returns(204)
	async deleteBookmark(@PathParams('id') bookmark_id: number): Promise<BookmarkModel> {
		return this.prisma.bookmark.delete({ where: { bookmark_id } })
	}
}
