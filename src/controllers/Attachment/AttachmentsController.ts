import {
	MulterOptions,
	MultipartFile,
	PathParams,
	PlatformMulterFile,
} from '@tsed/common'
import { Controller } from '@tsed/di'
import { Get, Post, Summary } from '@tsed/schema'
import { access, mkdir, promises, unlink } from 'fs'
import multer from 'multer'
import sharp from 'sharp'
import i18n from '../../translations/i18n'

@Controller('/')
export class Attachment {
	protected i18n = i18n

	@Post('/img/:folder/:id')
	@Summary("Create the image in the folder 'id' in the folder 'folder'")
	@MulterOptions({
		storage: multer.diskStorage({
			destination: function (req, file, cb) {
				const path = `./public/img/${req.params.folder}/${req.params.id}`
				access(path, function (error) {
					if (error) {
						mkdir(path, (err) => {
							if (err) {
								cb(err, path)
							} else {
								cb(null, path)
							}
						})
					} else {
						cb(null, path)
					}
				})
			},
			filename: function (req, file, cb) {
				cb(null, file.originalname)
			},
		}),
		limits: { fileSize: 5000000 },
	})
	async uploadFileImg(
		@MultipartFile('file') file: PlatformMulterFile,
		@PathParams('id') idUser: number,
		@PathParams('folder') folder: string
	) {
		const newPath = `./public/img/${folder}/${idUser}/resized-${file.filename}`
		switch (file.mimetype) {
			case 'image/jpeg':
			case 'image/jpg':
				await sharp(file.path).resize().jpeg({ quality: 45 }).toFile(newPath)
				break
			case 'image/png':
				await sharp(file.path).resize().png({ quality: 45 }).toFile(newPath)
				break
			case 'image/heic':
				await sharp(file.path).resize().heif({ quality: 45 }).toFile(newPath)
				break
			default:
				throw new Error(this.i18n.t('attachmentFailed'))
		}

		unlink(file.path, (error) => {
			if (error) {
				console.error('Error during file deletion:', error)
			}
		})
		return { file: file, id_user: idUser }
	}

	@Post('/pdf/:folder/:id')
	@Summary("Create the pdf in the folder 'id' in the folder 'folder'")
	@MulterOptions({
		storage: multer.diskStorage({
			destination: async function (req, file, cb) {
				const path = `./src/uploads/${req.params.folder}/${req.params.id}`
				access(path, function (error) {
					if (error) {
						mkdir(path, (err) => {
							if (err) {
								throw new Error(this.i18n.t('attachmentFailed'))
							}
						})
					}
					cb(null, path)
				})
			},
			filename: function (req, file, cb) {
				cb(null, file.originalname)
			},
		}),
		limits: { fileSize: 5000000 },
	})
	async uploadFilePDF(
		@MultipartFile('file') file: PlatformMulterFile,
		@PathParams('id') idUser: number
	) {
		return { file: file, id_user: idUser }
	}

	@Get('/img/:id')
	@Summary("Return all the images in the folder 'id'")
	async getAllFolderImg(@PathParams('id') id: number) {
		const files = await promises.readdir(`./public/img/property/${id}`)

		return files
	}

	@Get('/pdf/:id')
	@Summary("Return all the pdf in the folder 'id'")
	async getAllFolderPdf(@PathParams('id') id: number) {
		const files = await promises.readdir(`./src/uploads/pdf/${id}`)
		return await Promise.all(
			files.map((file) => promises.readFile(`./src/uploads/pdf/${id}/${file}`))
		)
	}

	@Get('/img/:id/:file')
	@Summary("Return the image 'file' in the folder 'id'")
	async getOneFileImg(@PathParams('id') id: number, @PathParams('file') file: string) {
		const data = await sharp(`./src/uploads/img/${id}/${file}`)
			.jpeg({ quality: 60 })
			.toBuffer()
		return data
	}

	@Get('/pdf/:id/:file')
	@Summary("Return the pdf 'file' in the folder 'id'")
	async getOneFilePdf(@PathParams('id') id: number, @PathParams('file') file: string) {
		const pdf = await promises.readFile(`./src/uploads/pdf/${id}/${file}`)

		return pdf
	}
}
