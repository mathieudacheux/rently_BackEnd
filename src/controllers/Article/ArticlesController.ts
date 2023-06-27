import { Controller, Get, PathParams, Post, BodyParams, Put, Delete } from '@tsed/common'
import { Inject } from '@tsed/di'
import { PrismaService } from '../../services/PrismaService'
import { Returns, Summary, Groups } from '@tsed/schema'
import { Article } from '@prisma/client'

class ArticleModel implements Article {
	@Groups('!creation')
	article_id: number
	name: string
	content: string
	created_at: Date
	updated_at: Date | null
	deleted_at: Date | null
	tag_id: number
	user_id: number
}

@Controller('/')
export class Articles {
	@Inject()
	protected prisma: PrismaService

	@Get('/')
	@Summary('Return a list of all articles')
	@Returns(200, Array).Of(ArticleModel)
	async getAllArticles(@PathParams('offset') offset: number): Promise<ArticleModel[]> {
		return this.prisma.article.findMany({ take: 15, skip: offset })
	}

	@Get('/:id')
	@Summary('Return a article by his id')
	@Returns(200, ArticleModel)
	async getArticleById(@PathParams('id') article_id: number) {
		return this.prisma.article.findUnique({ where: { article_id } })
	}

	@Post('/')
	@Summary('Create a new article')
	@Returns(201, ArticleModel)
	async createArticle(@BodyParams() @Groups('creation') article: ArticleModel) {
		return this.prisma.article.create({ data: article })
	}

	@Put('/:id')
	@Summary('Update a article by its id')
	@Returns(200, ArticleModel)
	async updateArticle(
		@PathParams('id') id: number,
		article: ArticleModel
	): Promise<ArticleModel> {
		return this.prisma.article.update({
			where: { article_id: id },
			data: article,
		})
	}

	@Delete('/:id')
	@Summary('Delete a article by its id')
	@Returns(204)
	async deleteArticle(@PathParams('id') article_id: number): Promise<ArticleModel> {
		return this.prisma.article.delete({ where: { article_id } })
	}
}
