import { Groups } from '@tsed/schema'

class AuthSerializer {
	@Groups('read')
	token: string
	@Groups('post')
	mail: string
	password: string
}

export { AuthSerializer }
