import { Controller } from '@tsed/di'
import { Get } from '@tsed/schema'

@Controller('/')
export class Appointments {
	@Get('/')
	get() {
		return 'hello'
	}
}
