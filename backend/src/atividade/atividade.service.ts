import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Atividade } from './atividade.entity';
import { CreateAtividadeDto } from './create-atividade.dto';
import { UpdateAtividadeDto } from './update-atividade.dto';
import { Aluno } from 'src/aluno/aluno.entity';

@Injectable()
export class AtividadeService {
  constructor(
    @InjectRepository(Atividade)
    private atividadeRepository: Repository<Atividade>,

    @InjectRepository(Aluno)
    private alunoRepository: Repository<Aluno>,
  ) {}

  // Criar atividade
  async createAtividade(dto: CreateAtividadeDto): Promise<Atividade> {
    const atividade = this.atividadeRepository.create({
      titulo: dto.titulo,
      descricao: dto.descricao,
      data: dto.data,
      hora: dto.hora,
      professor: { id: dto.professorId },
    });

    return this.atividadeRepository.save(atividade);
  }

  // Listar atividades com tratamento seguro de relações
  async getAtividades(professorId?: number, admin?: boolean): Promise<Atividade[]> {
    try {
      let atividades;
      
      if (admin) {
        atividades = await this.atividadeRepository.find({
          relations: ['professor', 'aluno'],
        });
      } else if (professorId) {
        atividades = await this.atividadeRepository.find({
          relations: ['professor', 'aluno'],
          where: { professor: { id: professorId } },
        });
      } else {
        atividades = [];
      }

      // Garante que cada atividade tenha professor e alunos definidos
      return atividades.map((a) => ({
        ...a,
        professor: a.professor || null,
        aluno: a.aluno || [],
      }));
    } catch (err) {
      throw new HttpException(
        'Erro ao buscar atividades',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Buscar 1 atividade
  async getAtividade(id: number): Promise<Atividade> {
    try {
      const atividade = await this.atividadeRepository.findOne({
        where: { id },
        relations: ['professor', 'aluno'],
      });

      if (!atividade) {
        throw new HttpException('Atividade não encontrada', HttpStatus.NOT_FOUND);
      }

      return {
        ...atividade,
        professor: atividade.professor || null,
        aluno: atividade.aluno || [],
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new HttpException(
        'Erro ao buscar atividade',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Atualizar atividade
  async updateAtividade(id: number, dto: UpdateAtividadeDto): Promise<Atividade> {
    const updateData: any = {
      titulo: dto.titulo,
      descricao: dto.descricao,
      data: dto.data,
      hora: dto.hora,
    };
    
    if (dto.professorId) {
      updateData.professor = { id: dto.professorId };
    }
    
    await this.atividadeRepository.update(id, updateData);
    return this.getAtividade(id);
  }

  // Deletar atividade
  async deleteAtividade(id: number): Promise<{ message: string }> {
    try {
      const result = await this.atividadeRepository.delete(id);
      if (result.affected === 0) {
        throw new HttpException('Atividade não encontrada', HttpStatus.NOT_FOUND);
      }
      return { message: 'Atividade removida com sucesso' };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new HttpException(
        'Erro ao remover atividade',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Associar aluno à atividade (pivot)
  async assignAluno(atividadeId: number, alunoId: number): Promise<Atividade> {
    const atividade = await this.atividadeRepository.findOne({
      where: { id: atividadeId },
      relations: ['aluno'],
    });

    if (!atividade) {
      throw new HttpException('Atividade não encontrada', HttpStatus.NOT_FOUND);
    }

    const aluno = await this.alunoRepository.findOne({
      where: { id: alunoId },
    });

    if (!aluno) {
      throw new HttpException('Aluno não encontrado', HttpStatus.NOT_FOUND);
    }

    // Inicializa array caso esteja undefined
    if (!atividade.aluno) atividade.aluno = [];
    
    // Evita duplicação
    const existe = atividade.aluno.find(a => a.id === aluno.id);
    if (!existe) {
      atividade.aluno.push(aluno);
    }

    return this.atividadeRepository.save(atividade);
  }

  // Remover aluno da atividade
  async removeAluno(atividadeId: number, alunoId: number): Promise<Atividade> {
    const atividade = await this.atividadeRepository.findOne({
      where: { id: atividadeId },
      relations: ['aluno'],
    });

    if (!atividade) {
      throw new HttpException('Atividade não encontrada', HttpStatus.NOT_FOUND);
    }

    if (!atividade.aluno) atividade.aluno = [];
    
    atividade.aluno = atividade.aluno.filter(a => a.id !== alunoId);

    return this.atividadeRepository.save(atividade);
  }
}
