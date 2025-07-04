import { Document, Schema, model } from 'mongoose';
import { autoIncrement } from 'mongoose-plugin-autoinc';

interface IBlog extends Document {
    name: string;
    description: string;
    blog_image: string;
    slug: string;
    categoryId: string;
    status: number;
    created_by: number;
    updated_by: number;
}

const blogSchema: Schema = new Schema({
    name: { type: String, default: '' },
    description: { type: String, default: '' },
    blog_image: { type: String, default: '' },
    slug: { type: String, default: '', unique: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'categories',default: null },
    status: { type: Number, default: 1 },
    created_by: { type: Schema.Types.ObjectId, ref: 'users' },
    updated_by: { type: Schema.Types.ObjectId, ref: 'users' }
},
{
    timestamps: true,
    versionKey: false
});

blogSchema.plugin(autoIncrement, { model: 'blogs', field: 'id', startAt: 1 });

const Blog = model<IBlog>('blogs', blogSchema);
export default Blog;