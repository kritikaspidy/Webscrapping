import { IsString, IsNumber, IsOptional, IsUrl } from 'class-validator';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsNumber()
  price: number;

  @IsUrl()
  imageUrl: string;

  @IsUrl()
  productUrl: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsUrl()
  productUrl?: string;
  

  @IsOptional()
  @IsString()
  description?: string;
}
