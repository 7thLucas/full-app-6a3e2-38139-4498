import { prop, getModelForClass, modelOptions, index } from "@typegoose/typegoose";

class NutritionInfo {
  @prop({ type: () => Number, default: 0 }) calories!: number;
  @prop({ type: () => Number, default: 0 }) protein!: number;
  @prop({ type: () => Number, default: 0 }) carbs!: number;
  @prop({ type: () => Number, default: 0 }) fat!: number;
  @prop({ type: () => Number, default: 0 }) fiber!: number;
}

class MealEntry {
  @prop({ type: () => String, required: true }) mealType!: string;
  @prop({ type: () => String, required: true }) name!: string;
  @prop({ type: () => String }) description?: string;
  @prop({ type: () => [String], default: [] }) ingredients!: string[];
  @prop({ type: () => [String], default: [] }) instructions!: string[];
  @prop({ type: () => Number, default: 30 }) prepTime!: number;
  @prop({ type: () => Number, default: 1 }) servings!: number;
  @prop({ _id: false, type: () => NutritionInfo }) nutrition?: NutritionInfo;
  @prop({ type: () => Boolean, default: false }) isFavorited!: boolean;
}

class DayPlan {
  @prop({ type: () => String, required: true }) date!: string;
  @prop({ _id: false, type: () => MealEntry, default: [] }) meals!: MealEntry[];
}

@modelOptions({ schemaOptions: { collection: "tbl_meal_plans", timestamps: true } })
@index({ userId: 1, weekStart: -1 })
export class MealPlan {
  @prop({ type: () => String, required: true }) userId!: string;
  @prop({ type: () => String, required: true }) weekStart!: string;
  @prop({ _id: false, type: () => DayPlan, default: [] }) days!: DayPlan[];
  @prop({ type: () => String }) dietType?: string;
  @prop({ type: () => String }) healthGoal?: string;
  @prop({ type: () => [String], default: [] }) allergies!: string[];
  @prop({ type: () => [String], default: [] }) availableIngredients!: string[];
  @prop({ type: () => Boolean, default: false }) isGenerated!: boolean;

  createdAt!: Date;
  updatedAt!: Date;
}

export const MealPlanModel = getModelForClass(MealPlan);
