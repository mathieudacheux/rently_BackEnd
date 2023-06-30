import {
	Controller,
	Get,
	PathParams,
	Post,
	BodyParams,
	Put,
	Delete,
	UseBefore,
} from '@tsed/common'
import { Inject } from '@tsed/di'
import { PrismaService } from '../../services/PrismaService'
import { Returns, Summary, Groups, Required } from '@tsed/schema'
import { BookmarkSerializer } from '../../models/BookmarkModel'
import AuthentificationMiddleware from '../../middlewares/AuthentificationMiddleware'

@Controller('/')
export class Bookmarks {
	@Inject()
	protected prisma: PrismaService

	@Get('/')
	@Summary('Return a list of all bookmarks')
	@Returns(200, Array).Of(BookmarkSerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async getAllBookmarks(
		@PathParams('offset') offset: number
	): Promise<BookmarkSerializer[]> {
		return this.prisma.bookmark.findMany({ take: 15, skip: offset })
	}

	@Get('/:id')
	@Summary('Return a bookmark by his id')
	@Returns(200, BookmarkSerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async getBookmarkById(@PathParams('id') bookmark_id: number) {
		return this.prisma.bookmark.findUnique({ where: { bookmark_id } })
	}

	@UseBefore(AuthentificationMiddleware)
	@Post('/')
	@Summary('Create a new bookmark')
	@Returns(201, BookmarkSerializer).Groups('read')
	@Returns(400, String).Description('Bad request')
	async createBookmark(
		@Required() @BodyParams() @Groups('post') bookmark: BookmarkSerializer
	) {
		return this.prisma.bookmark.create({ data: bookmark })
	}

	@UseBefore(AuthentificationMiddleware)
	@Put('/:id')
	@Summary('Update a bookmark by its id')
	@Returns(200, BookmarkSerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async updateBookmark(
		@PathParams('id') id: number,
		@BodyParams() @Groups('put') bookmark: BookmarkSerializer
	): Promise<BookmarkSerializer> {
		return this.prisma.bookmark.update({
			where: { bookmark_id: id },
			data: bookmark,
		})
	}

	@UseBefore(AuthentificationMiddleware)
	@Delete('/:id')
	@Summary('Delete a bookmark by its id')
	@Returns(204)
	@Returns(404, String).Description('Not found')
	async deleteBookmark(@PathParams('id') bookmark_id: number): Promise<void> {
		await this.prisma.bookmark.delete({ where: { bookmark_id } })
	}
}
