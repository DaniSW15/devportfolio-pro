import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('blacklisted_tokens')
export class BlacklistedTokenEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    token!: string;

    @Column()
    userId!: string;

    @Column({ type: 'timestamp' })
    expiresAt!: Date;

    @CreateDateColumn()
    createdAt!: Date;
}
