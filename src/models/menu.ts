import { Document, Schema, model } from 'mongoose';
import { autoIncrement } from 'mongoose-plugin-autoinc';

interface IMenu extends Document {
    name: string;
    link: string;
    menu_order:number;
    status: boolean;
    is_deleted:boolean;
    created_by: number;
    updated_by: number;
}

const MenuSchema: Schema = new Schema({
    name: { type: String, required:true, index: {unique:true} },
    link: { type: String, required:true,  index: {unique:true} },
    menu_order: { type: String, default: 0 },
    status: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
    created_by: { type: Schema.Types.ObjectId, ref: 'users' },
    updated_by: { type: Schema.Types.ObjectId, ref: 'users' }
},
    {
        timestamps: true,
        versionKey: false
    });

MenuSchema.plugin(autoIncrement, { model: 'menus', field: 'id', startAt: 1 });

const Menu = model<IMenu>('menus', MenuSchema);

export default Menu;