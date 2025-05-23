import { Document, Schema, model } from 'mongoose';
import { autoIncrement } from 'mongoose-plugin-autoinc';
import { User } from ".";

interface IOtps extends Document {
    user_id: number;
    otp: string;
    openotp: string;
    valid_till: String;
}

const otpSchema: Schema = new Schema({
    user_id: { type: Number },
    otp: { type: String, default: '' },
    openotp: { type: String, default: '' },
    valid_till: { type: String }
},
{
    timestamps: true,
    versionKey: false
});

otpSchema.plugin(autoIncrement, { model: 'otps', field: 'id', startAt: 1 });

const Otps = model<IOtps>('otps', otpSchema);

export default Otps;