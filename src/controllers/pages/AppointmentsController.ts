import {Controller} from "@tsed/di";
import {Get} from "@tsed/schema";

@Controller("/appointments")
export class AppointmentsController {
  @Get("/")
  get() {
    return "hello";
  }
}
