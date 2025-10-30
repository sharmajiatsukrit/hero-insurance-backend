import { Document, Schema, model } from "mongoose";
import { autoIncrement } from "mongoose-plugin-autoinc";

interface ISupportEmailConfig extends Document {
    type: string;
    email: object;
}

const SupportEmailConfigSchema: Schema = new Schema(
    {
        type: { type: String, default: "" },
        email: { type: Object, default: {} },
        created_by: { type: Schema.Types.ObjectId, ref: "users", default: null },
        updated_by: { type: Schema.Types.ObjectId, ref: "users", default: null },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

SupportEmailConfigSchema.plugin(autoIncrement, { model: "support-email-configs", field: "id", startAt: 1 });

const SupportEmailConfig = model<ISupportEmailConfig>("support-email-configs", SupportEmailConfigSchema);

export default SupportEmailConfig;
