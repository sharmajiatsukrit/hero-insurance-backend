import { Document, Schema, model } from "mongoose";
import { autoIncrement } from "mongoose-plugin-autoinc";

interface ITailoredBusinessInsuranceType extends Document {
    name: string;
    status: boolean;
    created_by: number;
    updated_by: number;
}

const TailoredBusinessInsuranceTypeSchema: Schema = new Schema(
    {
        name: { type: String, default: "" },
        status: { type: Boolean, default: true },
        created_by: { type: Schema.Types.ObjectId, ref: "users" },
        updated_by: { type: Schema.Types.ObjectId, ref: "users" },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

TailoredBusinessInsuranceTypeSchema.plugin(autoIncrement, { model: 'tailored_business_insurance_types', field: 'id', startAt: 1 });

const TailoredBusinessInsuranceType = model<ITailoredBusinessInsuranceType>('tailored_business_insurance_types', TailoredBusinessInsuranceTypeSchema);

export default TailoredBusinessInsuranceType;