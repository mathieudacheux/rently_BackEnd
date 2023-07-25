import * as SibApiV3Sdk from 'sib-api-v3-typescript'
import { UserSerializer } from 'src/models/UserModel'
import { API_KEY } from '../../src/config'

const sendEmail = async (
	templateId: number,
	title: string,
	subject: string,
	subjectDetails: string,
	callToAction: string,
	link: string,
	linkInfo: string,
	user: UserSerializer | null
) => {
	const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()

	apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, API_KEY)

	const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

	if (!user) {
		return 'user not found'
	}
	sendSmtpEmail.templateId = templateId
	sendSmtpEmail.to = [{ email: user.mail, name: `${user.firstname} ${user.name}` }]
	sendSmtpEmail.params = {
		title,
		subject,
		subjectDetails,
		callToAction,
		link,
		linkInfo,
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
