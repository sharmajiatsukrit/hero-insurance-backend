import { Document, Schema, model } from "mongoose";
import { autoIncrement } from "mongoose-plugin-autoinc";

interface IPospData extends Document {
    key: string;
    value: object;
    status: boolean;
}

const PospDataSchema: Schema = new Schema(
    {
        phone: { type: String, default: "" },
        value: { type: Object, default: {} },
        status: { type: Boolean, default: true },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

PospDataSchema.plugin(autoIncrement, { model: "posp_datas", field: "id", startAt: 1 });

const PospData = model<IPospData>("posp_datas", PospDataSchema);

export default PospData;
