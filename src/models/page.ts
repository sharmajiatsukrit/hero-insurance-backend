import { Document, Schema, model } from "mongoose";
import { autoIncrement } from "mongoose-plugin-autoinc";

interface IPage extends Document {
    key: string;
    value: object;
    status: boolean;
}

const PageSchema: Schema = new Schema(
    {
        key: { type: String, default: "" },
        value: { type: Object, default: {} },
        status: { type: Boolean, default: true },
        created_by: { type: Schema.Types.ObjectId, ref: "users", default: null },
        updated_by: { type: Schema.Types.ObjectId, ref: "users", default: null },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

PageSchema.plugin(autoIncrement, { model: "pages", field: "id", startAt: 1 });

const Page = model<IPage>("pages", PageSchema);

export default Page;
