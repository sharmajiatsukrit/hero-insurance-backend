import { Document, Schema, model } from "mongoose";
import { autoIncrement } from "mongoose-plugin-autoinc";

interface IBlog extends Document {
    name: string;
    description: string;
    blog_image: string;
    slug: string;
    categoryId: string;
    locationId: string;
    meta_title: string;
    meta_description: string;
    key_words: string[];
    meta_tag: string;
    alt_tag: string;
    status: number;
    visited_count: number;
    created_by: number;
    updated_by: number;
}

const blogSchema: Schema = new Schema(
    {
        name: { type: String, default: "" },
        introduction: { type: String, default: "" },
        sub_description: { type: String, default: "" },
        description: { type: String, default: "" },
        blog_image: { type: String, default: "" },
        slug: { type: String, default: "", unique: true },
        locationId: { type: Schema.Types.ObjectId, ref: "locations", default: null },
        categoryId: { type: Schema.Types.ObjectId, ref: "categories", default: null },
        meta_title: { type: String, default: "" },
        meta_description: { type: String, default: "" },
        key_words: { type: [String], default: [] },
        meta_tag: { type: String, default: "" },
        alt_tag: { type: String, default: "" },
        visited_count: { type: Number, default: 0 },
        status: { type: Number, default: 1 },
        created_by: { type: Schema.Types.ObjectId, ref: "users" },
        updated_by: { type: Schema.Types.ObjectId, ref: "users" },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

blogSchema.plugin(autoIncrement, { model: "blogs", field: "id", startAt: 1 });

const Blog = model<IBlog>("blogs", blogSchema);
export default Blog;
