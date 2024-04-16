import { BodyParams, Controller, Post } from '@tsed/common'
import { Inject } from '@tsed/di'
import { Returns, Summary } from '@tsed/schema'
import * as SibApiV3Sdk from 'sib-api-v3-typescript'
import * as dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import sendEmail from '../../helpers/sendEmail'
import { PrismaService } from '../../services/PrismaService'
import i18n from '../../translations/i18n'
import { TEMPLATES } from '../../constants'
import { PropertySerializer } from '../../models/PropertyModel'

dotenv.config()

@Controller('/')
export class Mails {
	@Inject()
	protected prisma: PrismaService

	protected i18n = i18n

	@Post('/mail_confirm/')
	@Summary('Send a mail with sendingblue')
	@Returns(201).Groups('read')
	@Returns(400, String).Description('Bad request')
	async confirmAccountMail(@BodyParams('id') id: number) {
		const user = await this.prisma.user.findUnique({ where: { user_id: id } })
		const title = this.i18n.t('mail.confirmEmail.title')
		const subject = this.i18n.t('mail.confirmEmail.subject')
		const subjectDetails = this.i18n.t('mail.confirmEmail.subjectDetails')
		const callToAction = this.i18n.t('mail.confirmEmail.callToAction')
		const linkDetail = this.i18n.t('mail.confirmEmail.linkDetail')

		const tokenGeneration = jwt.sign(
			{ user_id: user?.user_id },
			process.env.JWT_SECRET || '',
			{
				algorithm: 'HS256',
				expiresIn: '12h',
			}
		)

		const link = `https://front-rently.mathieudacheux.fr/validate-account?token=${tokenGeneration}`

		return sendEmail(
			TEMPLATES.EMAIL_CONFIRMATION,
			title,
			subject,
			subjectDetails,
			callToAction,
			link,
			linkDetail,
			user
		)
	}

	@Post('/reset_password/')
	@Summary('Send a mail with sendingblue')
	@Returns(201).Groups('read')
	@Returns(400, String).Description('Bad request')
	async resetPasswordMail(@BodyParams('id') id: number) {
		const user = await this.prisma.user.findUnique({ where: { user_id: id } })
		const title = this.i18n.t('mail.resetPassword.title')
		const subject = this.i18n.t('mail.resetPassword.subject')
		const subjectDetails = this.i18n.t('mail.resetPassword.subjectDetails')
		const callToAction = this.i18n.t('mail.resetPassword.callToAction')
		const linkDetail = this.i18n.t('mail.resetPassword.linkDetail')

		const tokenGeneration = jwt.sign(
			{ user_id: user?.user_id },
			process.env.JWT_SECRET || '',
			{
				algorithm: 'HS256',
				expiresIn: '12h',
			}
		)

		const link = `https://front-rently.mathieudacheux.fr/forgot-password?token=${tokenGeneration}`

		return sendEmail(
			TEMPLATES.RESET_PASSWORD,
			title,
			subject,
			subjectDetails,
			callToAction,
			link,
			linkDetail,
			user
		)
	}

	@Post('/subscribe_newsletter/')
	@Summary('Subscribe to newsletter')
	@Returns(201).Groups('read')
	@Returns(400, String).Description('Bad request')
	async subscribeNewsletter(@BodyParams('mail') mail: string) {
		const apiInstance = new SibApiV3Sdk.ContactsApi()

		apiInstance.setApiKey(
			SibApiV3Sdk.ContactsApiApiKeys.apiKey,
			process.env.API_KEY || ''
		)

		const createContact = new SibApiV3Sdk.CreateContact()

		createContact.email = mail
		createContact.listIds = [2]

		return apiInstance.createContact(createContact)
	}

	@Post('/sale_confirmation_saler/')
	@Summary('Mail after a sale')
	@Returns(201).Groups('read')
	@Returns(400, String).Description('Bad request')
	async salesConfirmationSaler(
		@BodyParams('property') property: PropertySerializer,
		@BodyParams('new_owner') new_owner: number
	) {
		const owner = await this.prisma.user.findUnique({
			where: { user_id: property.owner_id },
		})
		const newOwner = await this.prisma.user.findUnique({ where: { user_id: new_owner } })
		const propertyAddress = await this.prisma.address.findUnique({
			where: { address_id: property.address_id },
		})
		const propertyType = await this.prisma.property_type.findUnique({
			where: { property_type_id: property.property_type },
		})
		const agent = await this.prisma.user.findUnique({
			where: { user_id: property.agent_id as number },
		})

		const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()

		apiInstance.setApiKey(
			SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
			process.env.API_KEY ?? ''
		)

		const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

		sendSmtpEmail.templateId = 5
		sendSmtpEmail.to = [
			{
				email: owner?.mail ?? '',
				name: `${owner?.firstname ?? ''} ${owner?.name ?? ''}`,
			},
		]
		sendSmtpEmail.params = {
			owner: `${owner?.firstname ?? ''} ${owner?.name ?? ''}`,
			new_owner: `${newOwner?.firstname ?? ''} ${newOwner?.name ?? ''}`,
			property_name: property.name,
			property_address: `${propertyAddress?.address ?? ''} ${
				propertyAddress?.city ?? ''
			} ${propertyAddress?.zipcode ?? ''}`,
			property_price: property.price.toString(),
			property_type: propertyType?.label ?? '',
			agent_name: `${agent?.firstname ?? ''} ${agent?.name ?? ''}`,
			property_surface: property.surface.toString(),
			property_sale_date: new Date().toLocaleDateString(),
		}

		apiInstance.sendTransacEmail(sendSmtpEmail).then(
			function (data) {
				return data.response
			},
			function (error) {
				return error.response
			}
		)
	}

	@Post('/sale_confirmation_buyer/')
	@Summary('Mail after a sale')
	@Returns(201).Groups('read')
	@Returns(400, String).Description('Bad request')
	async salesConfirmationBuyer(
		@BodyParams('property') property: PropertySerializer,
		@BodyParams('new_owner') new_owner: number
	) {
		const owner = await this.prisma.user.findUnique({
			where: { user_id: property.owner_id },
		})
		const newOwner = await this.prisma.user.findUnique({ where: { user_id: new_owner } })
		const propertyAddress = await this.prisma.address.findUnique({
			where: { address_id: property.address_id },
		})
		const propertyType = await this.prisma.property_type.findUnique({
			where: { property_type_id: property.property_type },
		})
		const agent = await this.prisma.user.findUnique({
			where: { user_id: property.agent_id as number },
		})

		const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()

		apiInstance.setApiKey(
			SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
			process.env.API_KEY ?? ''
		)

		const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

		sendSmtpEmail.templateId = 6
		sendSmtpEmail.to = [
			{
				email: newOwner?.mail ?? '',
				name: `${newOwner?.firstname ?? ''} ${newOwner?.name ?? ''}`,
			},
		]
		sendSmtpEmail.params = {
			owner: `${owner?.firstname ?? ''} ${owner?.name ?? ''}`,
			new_owner: `${newOwner?.firstname ?? ''} ${newOwner?.name ?? ''}`,
			property_name: property.name,
			property_address: `${propertyAddress?.address ?? ''} ${
				propertyAddress?.city ?? ''
			} ${propertyAddress?.zipcode ?? ''}`,
			property_price: property.price.toString(),
			property_type: propertyType?.label ?? '',
			agent_name: `${agent?.firstname ?? ''} ${agent?.name ?? ''}`,
			property_surface: property.surface.toString(),
			property_sale_date: new Date().toLocaleDateString(),
		}

		apiInstance.sendTransacEmail(sendSmtpEmail).then(
			function (data) {
				return data.response
			},
			function (error) {
				return error.response
			}
		)
	}

	@Post('/rent_confirmation_tenant/')
	@Summary('Mail after a location')
	@Returns(201).Groups('read')
	@Returns(400, String).Description('Bad request')
	async rentConfirmationTenant(
		@BodyParams('property') property: PropertySerializer,
		@BodyParams('tenant') tenant: number
	) {
		const owner = await this.prisma.user.findUnique({
			where: { user_id: property.owner_id },
		})
		const tenantFetched = await this.prisma.user.findUnique({
			where: { user_id: tenant },
		})
		const propertyAddress = await this.prisma.address.findUnique({
			where: { address_id: property.address_id },
		})
		const propertyType = await this.prisma.property_type.findUnique({
			where: { property_type_id: property.property_type },
		})
		const agent = await this.prisma.user.findUnique({
			where: { user_id: property.agent_id as number },
		})

		const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()

		apiInstance.setApiKey(
			SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
			process.env.API_KEY ?? ''
		)

		const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

		sendSmtpEmail.templateId = 9
		sendSmtpEmail.to = [
			{
				email: tenantFetched?.mail ?? '',
				name: `${tenantFetched?.firstname ?? ''} ${tenantFetched?.name ?? ''}`,
			},
		]
		sendSmtpEmail.params = {
			owner: `${owner?.firstname ?? ''} ${owner?.name ?? ''}`,
			tenant: `${tenantFetched?.firstname ?? ''} ${tenantFetched?.name ?? ''}`,
			property_name: property.name,
			property_address: `${propertyAddress?.address ?? ''} ${
				propertyAddress?.city ?? ''
			} ${propertyAddress?.zipcode ?? ''}`,
			property_type: propertyType?.label ?? '',
			agent_name: `${agent?.firstname ?? ''} ${agent?.name ?? ''}`,
			property_surface: property.surface.toString(),
			property_sale_date: new Date().toLocaleDateString(),
		}

		apiInstance.sendTransacEmail(sendSmtpEmail).then(
			function (data) {
				return data.response
			},
			function (error) {
				return error.response
			}
		)
	}

	@Post('/rent_confirmation_owner/')
	@Summary('Mail after a location')
	@Returns(201).Groups('read')
	@Returns(400, String).Description('Bad request')
	async rentConfirmationOwner(
		@BodyParams('property') property: PropertySerializer,
		@BodyParams('tenant') tenant: number
	) {
		const owner = await this.prisma.user.findUnique({
			where: { user_id: property.owner_id },
		})
		const tenantFetched = await this.prisma.user.findUnique({
			where: { user_id: tenant },
		})
		const propertyAddress = await this.prisma.address.findUnique({
			where: { address_id: property.address_id },
		})
		const propertyType = await this.prisma.property_type.findUnique({
			where: { property_type_id: property.property_type },
		})
		const agent = await this.prisma.user.findUnique({
			where: { user_id: property.agent_id as number },
		})

		const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()

		apiInstance.setApiKey(
			SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
			process.env.API_KEY ?? ''
		)

		const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

		sendSmtpEmail.templateId = 7
		sendSmtpEmail.to = [
			{
				email: owner?.mail ?? '',
				name: `${owner?.firstname ?? ''} ${owner?.name ?? ''}`,
			},
		]
		sendSmtpEmail.params = {
			owner: `${owner?.firstname ?? ''} ${owner?.name ?? ''}`,
			tenant: `${tenantFetched?.firstname ?? ''} ${tenantFetched?.name ?? ''}`,
			property_name: property.name,
			property_address: `${propertyAddress?.address ?? ''} ${
				propertyAddress?.city ?? ''
			} ${propertyAddress?.zipcode ?? ''}`,
			property_type: propertyType?.label ?? '',
			agent_name: `${agent?.firstname ?? ''} ${agent?.name ?? ''}`,
			property_surface: property.surface.toString(),
			property_sale_date: new Date().toLocaleDateString(),
		}

		apiInstance.sendTransacEmail(sendSmtpEmail).then(
			function (data) {
				return data.response
			},
			function (error) {
				return error.response
			}
		)
	}
}
