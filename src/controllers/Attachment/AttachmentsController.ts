import { MulterOptions, MultipartFile, PathParams, PlatformMulterFile } from '@tsed/common'
import { Post } from '@tsed/schema'
import { Controller } from '@tsed/di'
import multer from 'multer'
import { access, mkdir, unlink } from 'fs'
import sharp from 'sharp'

@Controller('/')
export class AttachmentController {
	@Post('/:folder/:id')
	@MulterOptions({
		storage: multer.diskStorage({
			destination: async function (req, file, cb) {
				const path = `./src/uploads/${req.params.folder}/${req.params.id}`
				access(path, function (error) {
					if (error) {
						mkdir(path, (err) => {
							if (err) {
								throw new Error('Error during directory creation')
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
	async uploadFile1(
		@MultipartFile('file') file: PlatformMulterFile,
		@PathParams('id') idUser: number,
		@PathParams('folder') folder: string
	) {
		const newPath = `./src/uploads/${folder}/${idUser}/resized-${file.filename}`
		switch (file.mimetype) {
			case 'image/jpeg' || 'image/jpg':
				await sharp(file.path).resize().jpeg({ quality: 45 }).toFile(newPath)
				break
			case 'image/png':
				await sharp(file.path).resize().png({ quality: 45 }).toFile(newPath)
				break
			case 'image/heic':
				await sharp(file.path).resize().heif({ quality: 45 }).toFile(newPath)
				break
			default:
				throw new Error('Bad file extension (only .jpeg, .jpg, .png, .heic, .heif')
		}

		unlink(file.path, (error) => {
			if (error) {
				throw new Error('Error during file deletion')
			}
		})
		// console.log('File : ', file, idUser)
		return { file: file, id_user: idUser }
	}
}
