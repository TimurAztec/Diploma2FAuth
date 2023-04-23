import { Module, forwardRef } from "@nestjs/common";
import { EventsController } from "./events.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "src/auth/auth.module";
import { EventSchema } from "./event.schema";
import { EventsService } from "./events.service";


@Module({
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema}])
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService]
})
export class EventsModule {}
