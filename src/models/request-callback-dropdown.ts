import { Document, Schema, model } from "mongoose";
import { autoIncrement } from "mongoose-plugin-autoinc";

interface IRequestCallbackDropdown extends Document {
    name: string;
    key: string;
    type: number;
    status: boolean;
    created_by: number;
    updated_by: number;
}

const RequestCallbackDropdownSchema: Schema = new Schema(
    {
        name: { type: String, default: "" },
        key: { type: String, default: "" },
        type: { type: Number, default: 0 },// 0 for product and 1 for time slot
        status: { type: Boolean, default: true },
        created_by: { type: Schema.Types.ObjectId, ref: "users" },
        updated_by: { type: Schema.Types.ObjectId, ref: "users" },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

RequestCallbackDropdownSchema.plugin(autoIncrement, { model: 'request_callback_dropdowns', field: 'id', startAt: 1 });

const RequestCallbackDropdown = model<IRequestCallbackDropdown>('request_callback_dropdowns', RequestCallbackDropdownSchema);

export default RequestCallbackDropdown;