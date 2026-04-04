import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../user-entity/user.entity';

@Entity('api_keys')
export class ApiKeyEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column({ unique: true })
    key!: string;

    @Column({ default: true })
    isActive!: boolean;

    @Column({ type: 'int', default: 0 })
    usageCount!: number;

    @Column({ type: 'timestamp', nullable: true })
    lastUsedAt?: Date;

    @Column({ type: 'timestamp', nullable: true })
    expiresAt?: Date;

    @ManyToOne(() => UserEntity, (user: UserEntity) => user.apiKeys)
    user!: UserEntity;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}