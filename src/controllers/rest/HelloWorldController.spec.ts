import { PlatformTest } from '@tsed/common'
import { HelloWorldController } from './HelloWorldController'

describe('HelloWorldController', () => {
	beforeEach(PlatformTest.create)
	afterEach(PlatformTest.reset)

	it('should do something', () => {
		const instance = PlatformTest.get<HelloWorldController>(HelloWorldController)

		expect(instance).toBeInstanceOf(HelloWorldController)
	})
})
