import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class ListarEbooksDto {
  @IsInt()
  @IsPositive()
  @IsOptional()
  page?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  itemsPerPage?: number;
}
