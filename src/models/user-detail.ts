import { Document, Schema, model } from 'mongoose';
import { autoIncrement } from 'mongoose-plugin-autoinc';

interface IUserDetail extends Document {
    check_mob: string;
    name: string;
    gender: string;
    dob: string;
    email: string;
    mobile: string;
    annual_income:string;
    marital_status:string;
    city:string;
}

const userDetailSchema: Schema = new Schema({
    check_mob: { type: String, default: '' },
    name: { type: String, default: '' },
    gender: { type: String, default: '' },
    dob: { type: String, default: '' },
    email: { type: String, default: '' },
    mobile: { type: String, default: '' },
    annual_income: { type: String, default: '' },
    marital_status: { type: String, default: '' },
    city: { type: String, default: '' },
},
    {
        timestamps: true,
        versionKey: false
    });

userDetailSchema.plugin(autoIncrement, { model: 'user_details', field: 'id', startAt: 1 });

const UserDetail = model<IUserDetail>('user_details', userDetailSchema);

export default UserDetail;