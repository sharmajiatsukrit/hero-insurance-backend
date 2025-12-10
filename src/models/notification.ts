import { Document, Schema, model } from 'mongoose';
import { autoIncrement } from 'mongoose-plugin-autoinc';

interface INotifications extends Document {
    customer_id: number;
    unique_id:string,
    notification_type: string,
}

const notificationSchema: Schema = new Schema({
    customer_id: { type: Schema.Types.ObjectId, ref: 'customers' },
    unique_id: { type: String, default: '' },
    notification_type: { type: String, default: '' },
},
    {
        timestamps: true,
        versionKey: false
    });

notificationSchema.plugin(autoIncrement, { model: 'viewed_notifications', field: 'id', startAt: 1 });

const Notifications = model<INotifications>('viewed_notifications', notificationSchema);

export default Notifications;