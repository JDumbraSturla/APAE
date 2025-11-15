import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Atividade } from './atividade.entity';
import { Aluno } from '../aluno/aluno.entity';
import { AtividadeService } from './atividade.service';
import { AtividadeController } from './atividade.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Atividade, Aluno])  // <-- ADICIONE O ALUNO AQUI
  ],
  controllers: [AtividadeController],
  providers: [AtividadeService],
  exports: [AtividadeService],
})
export class AtividadeModule {}
