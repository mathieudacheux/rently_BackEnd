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
import { PropertySerializer } from '../../models/PropertyModel'
import { BookmarkSerializer } from '../../models/BookmarkModel'
import AuthentificationMiddleware from '../../middlewares/AuthentificationMiddleware'
import i18n from '../../translations/i18n'

@Controller('/')
export class Bookmarks {
	@Inject()
	protected prisma: PrismaService
	protected i18n = i18n

	@Get('/')
	@Summary('Return a list of all bookmarks')
	@Returns(200, Array).Of(BookmarkSerializer).Groups('read')
	async getAllBookmarks(
		@PathParams('offset') offset: number
	): Promise<BookmarkSerializer[]> {
		const allBookmarks = await this.prisma.bookmark.findMany({ take: 15, skip: offset })

		if (!allBookmarks) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('notFound'),
			}

			throw errorObject
		}

		return allBookmarks
	}

	@Get('/:id')
	@Summary('Return a bookmark by his id')
	@Returns(200, BookmarkSerializer).Groups('read')
	async getBookmarkById(@PathParams('id') bookmark_id: number) {
		const uniqueBookmark = await this.prisma.bookmark.findUnique({
			where: { bookmark_id },
		})

		if (!uniqueBookmark) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('idNotFound', { id: bookmark_id }),
			}

			throw errorObject
		}

		return uniqueBookmark
	}

	// Get bookmarks by user id
	@Get('/user/:id')
	@Summary('Return all properties of a user by his id')
	@Returns(200, PropertySerializer).Groups('read')
	async getBookmarkByUserId(@PathParams('id') user_id: number) {
		const usersBookmark = await this.prisma.bookmark.findMany({
			where: { user_id },
		})

		if (!usersBookmark) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('idNotFound', { id: user_id }),
			}

			throw errorObject
		}

		const properties = await this.prisma.property.findMany({
			where: {
				property_id: { in: usersBookmark.map((bookmark) => bookmark.property_id) },
			},
		})

		const propertiesWithBookmark = properties.map((property) => {
			const bookmark = usersBookmark.find(
				(bookmark) => bookmark.property_id === property.property_id
			)
			return { ...property, bookmark }
		})

		return propertiesWithBookmark
	}

	@UseBefore(AuthentificationMiddleware)
	@Post('/')
	@Summary('Create a new bookmark')
	@Returns(201, BookmarkSerializer).Groups('read')
	@Returns(400, String).Description('Bad request')
	async createBookmark(
		@Required() @BodyParams() @Groups('post') bookmark: BookmarkSerializer
	) {
		return await this.prisma.bookmark.create({ data: bookmark })
	}

	@UseBefore(AuthentificationMiddleware)
	@Put('/:id')
	@Summary('Update a bookmark by its id')
	@Returns(200, BookmarkSerializer).Groups('read')
	async updateBookmark(
		@PathParams('id') id: number,
		@BodyParams() @Groups('put') bookmark: BookmarkSerializer
	): Promise<BookmarkSerializer> {
		const updateBookmark = await this.prisma.bookmark.update({
			where: { bookmark_id: id },
			data: bookmark,
		})

		if (!updateBookmark) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('idNotFound', { id }),
			}

			throw errorObject
		}

		return updateBookmark
	}

	@UseBefore(AuthentificationMiddleware)
	@Delete('/:id')
	@Summary('Delete a bookmark by its id')
	@Returns(204)
	async deleteBookmark(@PathParams('id') bookmark_id: number): Promise<void> {
		const deleteBookmark = await this.prisma.bookmark.delete({ where: { bookmark_id } })

		if (!deleteBookmark) {
			const errorObject = {
				status: 404,
				errors: this.i18n.t('idNotFound', { id: bookmark_id }),
			}

			throw errorObject
		}
	}
}
