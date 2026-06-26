import { prop, getModelForClass, modelOptions, index } from "@typegoose/typegoose";

class ShoppingItem {
  @prop({ type: () => String, required: true }) name!: string;
  @prop({ type: () => String }) quantity?: string;
  @prop({ type: () => String }) unit?: string;
  @prop({ type: () => String }) category?: string;
  @prop({ type: () => Boolean, default: false }) isChecked!: boolean;
}

@modelOptions({ schemaOptions: { collection: "tbl_shopping_lists", timestamps: true } })
@index({ userId: 1, weekStart: 1 })
export class ShoppingList {
  @prop({ type: () => String, required: true }) userId!: string;
  @prop({ type: () => String }) mealPlanId?: string;
  @prop({ type: () => String, required: true }) weekStart!: string;
  @prop({ _id: false, type: () => ShoppingItem, default: [] }) items!: ShoppingItem[];

  createdAt!: Date;
  updatedAt!: Date;
}

export const ShoppingListModel = getModelForClass(ShoppingList);
