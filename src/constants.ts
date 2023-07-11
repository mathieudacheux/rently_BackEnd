const JWT_SECRET = 'rlknjreljnzmkljzlknvelmqnrvljkqenrgmzejfzljeflejrnvln1093'

const TEMPLATES = [
	{
		id: 3,
		label: 'EMAIL_CONFIRMATION',
		title: "Confirmation d'inscription",
		subject: [
			'Nous vous remercions de vous être inscrit sur Rently. Afin de valider votre compte, veuillez cliquer sur le bouton ci-dessous.',
		],
		subjectDetails: [
			"Il est essentiel de compléter cette étape dans les 15 minutes à compter de la réception de cet e-mail. Passé ce délai, votre lien de validation expirera et vous devrez recommencer le processus d'inscription.",
			'Après avoir validé votre compte, vous aurez accès à votre compte personnel. Nous espérons que vous apprécierez votre expérience parmi nous.',
			"Si vous rencontrez des difficultés lors du processus de validation ou si vous avez des questions supplémentaires, n'hésitez pas à nous contacter à  contact@front-rently.mathieudacheux ou en répondant à cet e-mail. Notre équipe de support se fera un plaisir de vous aider.",
			'Nous vous remercions de votre confiance et nous sommes impatients de vous accueillir sur Rently.',
		],
		callToAction: 'Confirmer mon compte',
		link: 'lien',
		linkInfo: 'Confirmer mon adresse mail',
	},
	{
		id: 3,
		label: 'PASSWORD_RESET',
		title: 'Réinitialisation de mot de passe',
		subject: [
			'Nous avons bien reçu votre demande de réinitialisation de mot de passe pour votre compte.',
			'Veuillez cliquer sur le lien ci-dessous pour accéder à la page de changement de mot de passe',
		],
		subjectDetails: [
			'Il est important de noter que ce lien de réinitialisation est temporaire et expirera dans les 15 minutes pour des raisons de sécurité. Si le lien expire, vous devrez recommencer le processus de réinitialisation en suivant les instructions de cet e-mail.',
			"Si vous n'avez pas demandé la réinitialisation de votre mot de passe, veuillez ignorer cet e-mail et prendre contact avec notre équipe de support à contact@front-rently.mathieudacheux. Nous vous aiderons à résoudre toute activité suspecte liée à votre compte.",
		],
		callToAction: 'Réinitialiser mon mot de passe',
		link: 'lien',
		linkInfo: 'Réinitialiser',
	},
]

export { JWT_SECRET, TEMPLATES }
