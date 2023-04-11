import { Module, forwardRef } from "@nestjs/common";
import { InventoryService } from "./inventory.service";
import { InventoryController } from "./inventory.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Item, ItemSchema } from "./item.schema";
import { AuthModule } from "src/auth/auth.module";


@Module({
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema}])
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService]
})
export class InventoryModule {}
