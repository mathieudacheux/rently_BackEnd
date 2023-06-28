import { Appointment_tag } from '@prisma/client'
import { Groups } from '@tsed/schema'

class AppointmentTagSerializer implements Appointment_tag {
	@Groups('read')
	appointment_tag_id: number
	@Groups('read')
	label: string
	created_at: Date
}

export { AppointmentTagSerializer }
