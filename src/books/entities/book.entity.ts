import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BookDocument = HydratedDocument<Book>;

@Schema({ timestamps: true })
export class Book {
	@Prop({ required: true })
	title: string;

	@Prop({ required: true })
	author: string;

	@Prop({ required: true })
	category: string;

	@Prop({ default: true })
	available: boolean;
}

export const BookSchema = SchemaFactory.createForClass(Book);
