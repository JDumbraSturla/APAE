import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateAtividadeDto {
  @IsOptional()
  @IsString()
  readonly titulo?: string;

  @IsOptional()
  @IsString()
  readonly descricao?: string;

  @IsOptional()
  @IsString()
  readonly data?: string;

  @IsOptional()
  @IsString()
  readonly hora?: string;

  @IsOptional()
  @IsNumber()
  readonly professorId?: number;
}
