import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SnippetEntity } from './entity/snippet.entity';
import { Repository } from 'typeorm';
import { CreateSnippetDto, UpdateSnippetDto } from './dto/snippet.dto';

@Injectable()
export class SnippetManagerService {
    constructor(
        @InjectRepository(SnippetEntity)
        private snippetRepository: Repository<SnippetEntity>,
    ) { }

    async create(userId: string, dto: CreateSnippetDto): Promise<SnippetEntity> {
        const snippet = this.snippetRepository.create({
            ...dto,
            user: { id: userId },
        });
        return this.snippetRepository.save(snippet);
    }

    async findAll(userId: string, isPublic?: boolean): Promise<SnippetEntity[]> {
        const where: any = {};

        if (isPublic !== undefined) {
            where.isPublic = isPublic;
        } else {
            // Si no se especifica, traer los propios y los públicos
            return this.snippetRepository.find({
                where: [
                    { user: { id: userId } },
                    { isPublic: true },
                ],
                order: { createdAt: 'DESC' },
            });
        }

        return this.snippetRepository.find({
            where: { ...where, user: { id: userId } },
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string, userId: string): Promise<SnippetEntity> {
        const snippet = await this.snippetRepository.findOne({
            where: [
                { id, user: { id: userId } },
                { id, isPublic: true },
            ],
        });

        if (!snippet) {
            throw new NotFoundException('Snippet not found');
        }

        return snippet;
    }

    async update(id: string, userId: string, dto: UpdateSnippetDto): Promise<SnippetEntity> {
        const snippet = await this.findOne(id, userId);
        Object.assign(snippet, dto);
        return this.snippetRepository.save(snippet);
    }

    async remove(id: string, userId: string): Promise<void> {
        const snippet = await this.findOne(id, userId);
        await this.snippetRepository.remove(snippet);
    }

    async search(userId: string, query: string): Promise<SnippetEntity[]> {
        return this.snippetRepository
            .createQueryBuilder('snippet')
            .where('(snippet.userId = :userId OR snippet.isPublic = :isPublic)', { userId, isPublic: true })
            .andWhere('snippet.title ILIKE :query OR snippet.content ILIKE :query OR snippet.tags ILIKE :query',
                { query: `%${query}%` })
            .orderBy('snippet.createdAt', 'DESC')
            .getMany();
    }
}
