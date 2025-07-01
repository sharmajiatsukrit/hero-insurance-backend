import { Document, Schema, model } from 'mongoose';
import { autoIncrement } from 'mongoose-plugin-autoinc';

interface ITestimonial extends Document {
    name: string;
    location:string;
    star_rating: number;
    description: string;
    status: boolean;
    is_deleted:boolean;
    deleted_at:string;
    created_by: number;
    updated_by: number;
}

const TestimonialSchema: Schema = new Schema({
    name: { type: String, default: '' },
    location: { type: String, default: '' },
    star_rating: { type: Number, default: '' },
    description: { type: String, default: '' },
    status: { type: Boolean, default: '' },
    is_deleted: { type: Boolean, default: false },
    deleted_at: { type: String, default: '' },
    created_by: { type: Schema.Types.ObjectId, ref: 'users' },
    updated_by: { type: Schema.Types.ObjectId, ref: 'users' }
},
    {
        timestamps: true,
        versionKey: false
    });

TestimonialSchema.plugin(autoIncrement, { model: 'testimonials', field: 'id', startAt: 1 });

const Testimonial = model<ITestimonial>('testimonials', TestimonialSchema);

export default Testimonial;