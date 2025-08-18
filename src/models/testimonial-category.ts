import { Document, Schema, model } from 'mongoose';
import { autoIncrement } from 'mongoose-plugin-autoinc';

interface ITestimonialCategory extends Document {
    name: string;
    status: boolean;
    created_by: number;
    updated_by: number;
}

const testimonialCategorySchema: Schema = new Schema({
    name: { type: String, default: '' },
    status: { type: Boolean, default: true },
    created_by: { type: Schema.Types.ObjectId, ref: 'users' },
    updated_by: { type: Schema.Types.ObjectId, ref: 'users' }
},
    {
        timestamps: true,
        versionKey: false
    });

testimonialCategorySchema.plugin(autoIncrement, { model: 'testimonial_categories', field: 'id', startAt: 1 });

const TestimonialCategory = model<ITestimonialCategory>('testimonial_categories', testimonialCategorySchema);

export default TestimonialCategory;