import { Document, Schema, model } from "mongoose";
import { autoIncrement } from "mongoose-plugin-autoinc";

interface IMenuItem extends Document {
    title: string;
    url: string;
    parent_id: number;
    menu_order: number;
    is_main_menu_item: boolean;
    status: boolean;
    created_by: number;
    updated_by: number;
}

const MenuItemSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        url: { type: String, required: true },
        parent_id: { type: Number, default: null },
        menu_order: { type: Number, default: 0 },
        is_main_menu_item: { type: Boolean, default: false },
        menu_type: { type: String, default: 0 },// 0 => main menu ,1 => dropdown menu 
        status: { type: Boolean, default: true },
        created_by: { type: Schema.Types.ObjectId, ref: "users" },
        updated_by: { type: Schema.Types.ObjectId, ref: "users" },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

MenuItemSchema.plugin(autoIncrement, { model: "menu_items", field: "id", startAt: 1 });

const MenuItem = model<IMenuItem>("menu_items", MenuItemSchema);

export default MenuItem;
