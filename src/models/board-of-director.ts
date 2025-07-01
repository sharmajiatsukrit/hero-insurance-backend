import { Document, Schema, model } from 'mongoose';
import { autoIncrement } from 'mongoose-plugin-autoinc';

interface IBoardOfDirector extends Document {
    name: string;
    designation:string;
    menu_order: number;
    bod_image: string;
    description:string;
    status: boolean;
    is_deleted:boolean;
    deleted_at:string;
    created_by: number;
    updated_by: number;
}

const BoardOfDirectorSchema: Schema = new Schema({
    name: { type: String, default: '' },
    designation: { type: String, default: '' },
    menu_order: { type: Number, default: '' },
    bod_image: { type: String, default: '' },
    description: { type: String, default: '' },
    status: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
    deleted_at: { type: String, default: '' },
    created_by: { type: Schema.Types.ObjectId, ref: 'users', },
    updated_by: { type: Schema.Types.ObjectId, ref: 'users', }
},
    {
        timestamps: true,
        versionKey: false
    });

BoardOfDirectorSchema.plugin(autoIncrement, { model: 'board_Of_directors', field: 'id', startAt: 1 });

const BoardOfDirector = model<IBoardOfDirector>('board_Of_directors', BoardOfDirectorSchema);

export default BoardOfDirector;