import { prop, getModelForClass, modelOptions, index } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { collection: "tbl_user_preferences", timestamps: true } })
@index({ userId: 1 }, { unique: true })
export class UserPreferences {
  @prop({ type: () => String, required: true }) userId!: string;
  @prop({ type: () => String, default: "No Restriction" }) dietType!: string;
  @prop({ type: () => String, default: "Eat Healthier" }) healthGoal!: string;
  @prop({ type: () => [String], default: [] }) allergies!: string[];
  @prop({ type: () => [String], default: [] }) dislikedIngredients!: string[];
  @prop({ type: () => [String], default: [] }) availableIngredients!: string[];
  @prop({ type: () => Number, default: 3 }) mealsPerDay!: number;
  @prop({ type: () => Number, default: 2000 }) dailyCalorieTarget!: number;

  createdAt!: Date;
  updatedAt!: Date;
}

export const UserPreferencesModel = getModelForClass(UserPreferences);
