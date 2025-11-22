import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AtividadeService } from './atividade.service';
import { UpdateAtividadeDto } from './update-atividade.dto';
import { CreateAtividadeDto } from './create-atividade.dto';
import { AssignAlunoDto } from './assign-aluno.dto';

@Controller('atividade')
export class AtividadeController {
  constructor(private atividadeService: AtividadeService) {}

  // Criar atividade
  @Post()
  createAtividade(@Body() dto: CreateAtividadeDto) {
    return this.atividadeService.createAtividade(dto);
  }

  // Listar todas
  @Get()
  getAtividades(@Query('professorId') professorId?: number, @Query('admin') admin?: boolean) {
    return this.atividadeService.getAtividades(professorId, admin);
  }

  // Buscar uma atividade
  @Get(':id')
  getAtividade(@Param('id') id: number) {
    return this.atividadeService.getAtividade(id);
  }

  // Atualizar
  @Patch(':id')
  updateAtividade(@Param('id') id: number, @Body() dto: UpdateAtividadeDto) {
    return this.atividadeService.updateAtividade(id, dto);
  }

  // Remover
  @Delete(':id')
  deleteAtividade(@Param('id') id: number) {
    return this.atividadeService.deleteAtividade(id);
  }

  // Associar aluno à atividade (pivot table)
  @Post(':atividadeId/assign')
  assignAluno(
    @Param('atividadeId') atividadeId: number,
    @Body() dto: AssignAlunoDto,
  ) {
    return this.atividadeService.assignAluno(atividadeId, dto.alunoId);
  }

  // Remover aluno da atividade
  @Delete(':atividadeId/assign/:alunoId')
  removeAluno(
    @Param('atividadeId') atividadeId: number,
    @Param('alunoId') alunoId: number,
  ) {
    return this.atividadeService.removeAluno(atividadeId, alunoId);
  }
}
