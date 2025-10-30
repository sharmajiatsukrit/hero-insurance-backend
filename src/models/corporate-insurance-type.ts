import { Document, Schema, model } from "mongoose";
import { autoIncrement } from "mongoose-plugin-autoinc";

interface ICorporateInsuranceType extends Document {
    name: string;
    status: boolean;
    created_by: number;
    updated_by: number;
}

const CorporateInsuranceTypeSchema: Schema = new Schema(
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

CorporateInsuranceTypeSchema.plugin(autoIncrement, { model: 'corporate_insurance_types', field: 'id', startAt: 1 });

const CorporateInsuranceType = model<ICorporateInsuranceType>('corporate_insurance_types', CorporateInsuranceTypeSchema);

export default CorporateInsuranceType;