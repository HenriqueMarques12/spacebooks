import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class ListarEbooksDto {
  @IsInt()
  @IsPositive()
  @IsOptional()
  page?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  itemsPerPage?: number;

  @IsString()
  @IsOptional()
  search?: string;
}
