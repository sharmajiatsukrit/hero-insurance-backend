import { Document, Schema, model } from "mongoose";
import { autoIncrement } from "mongoose-plugin-autoinc";

interface IPageImage extends Document {
    key: string;
    image: string;
    status: boolean;
}

const PageImageSchema: Schema = new Schema(
    {
        key: { type: String, default: "" },
        image: { type: String, default: "" },
        status: { type: Boolean, default: true },
        created_by: { type: Schema.Types.ObjectId, ref: "users", default: null },
        updated_by: { type: Schema.Types.ObjectId, ref: "users", default: null },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

PageImageSchema.plugin(autoIncrement, { model: "pages_image", field: "id", startAt: 1 });

const PageImage = model<IPageImage>("pageImages", PageImageSchema);

export default PageImage;
