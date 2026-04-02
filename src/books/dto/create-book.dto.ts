import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBookDto {
	@IsString()
	@IsNotEmpty()
	title: string;

	@IsString()
	@IsNotEmpty()
	author: string;

	@IsString()
	@IsNotEmpty()
	category: string;

	@IsOptional()
	@IsBoolean()
	available?: boolean;
}
