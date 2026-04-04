import { UserEntity } from 'src/modules/auth/entities/user-entity/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

@Entity('snippets')
export class SnippetEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    title!: string;

    @Column({ type: 'text' })
    content!: string;

    @Column()
    language!: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ default: false })
    isPublic!: boolean;

    @Column({ type: 'simple-array', nullable: true })
    tags?: string[];

    @ManyToOne(() => UserEntity, (user: UserEntity) => user.snippets)
    user!: UserEntity;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}