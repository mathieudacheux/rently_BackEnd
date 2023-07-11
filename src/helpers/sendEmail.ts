import * as SibApiV3Sdk from 'sib-api-v3-typescript'
import { UserSerializer } from 'src/models/UserModel'
import { API_KEY } from '../../src/config'
import { TEMPLATES } from '../../src/constants'

const sendEmail = async (templateLabel: string, user: UserSerializer | null) => {
	const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()

	apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, API_KEY)

	const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

	const template = TEMPLATES.find((value) => value.label === templateLabel)

	if (!user) {
		return 'user not found'
	}
	sendSmtpEmail.templateId = template?.id
	sendSmtpEmail.to = [{ email: user.mail, name: `${user.firstname} ${user.name}` }]
	sendSmtpEmail.params = {
		title: template?.title,
		subject: template?.subject,
		subjectDetails: template?.subjectDetails,
		callToAction: template?.callToAction,
		link: template?.link,
		linkInfo: template?.linkInfo,
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

export default sendEmail
