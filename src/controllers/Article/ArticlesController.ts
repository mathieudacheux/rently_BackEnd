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
import { ArticleSerializer } from '../../models/ArticleModel'
import AuthentificationMiddleware from '../../middlewares/AuthentificationMiddleware'

@Controller('/')
export class Articles {
	@Inject()
	protected prisma: PrismaService

	@Get('/')
	@Summary('Return a list of all articles')
	@Returns(200, Array).Of(ArticleSerializer).Groups('read')
	async getAllArticles(
		@PathParams('offset') offset: number
	): Promise<ArticleSerializer[]> {
		return this.prisma.article.findMany({ take: 15, skip: offset })
	}

	@Get('/:id')
	@Summary('Return a article by his id')
	@Returns(200, ArticleSerializer).Groups('read')
	@Returns(404, String).Description('Not found')
	async getArticleById(@PathParams('id') article_id: number) {
		return this.prisma.article.findUnique({ where: { article_id } })
	}

	@UseBefore(AuthentificationMiddleware)
	@Post('/')
	@Summary('Create a new article')
	@Returns(201, ArticleSerializer).Groups('read')
	@Returns(400, String).Description('Bad request')
	async createArticle(
		@Required() @BodyParams() @Groups('post') article: ArticleSerializer
	) {
		return this.prisma.article.create({ data: article })
	}

	@UseBefore(AuthentificationMiddleware)
	@Put('/:id')
	@Summary('Update a article by its id')
	@Returns(200, ArticleSerializer)
	@Returns(404, String).Description('Not found')
	async updateArticle(
		@PathParams('id') id: number,
		@BodyParams() @Groups('put') article: ArticleSerializer
	): Promise<ArticleSerializer> {
		return this.prisma.article.update({
			where: { article_id: id },
			data: article,
		})
	}

	@UseBefore(AuthentificationMiddleware)
	@Delete('/:id')
	@Summary('Delete a article by its id')
	@Returns(204)
	@Returns(404, String).Description('Not found')
	async deleteArticle(@PathParams('id') article_id: number): Promise<void> {
		await this.prisma.article.delete({ where: { article_id } })
	}
}
