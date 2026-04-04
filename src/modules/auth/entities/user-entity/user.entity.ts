import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Exclude } from "class-transformer";
import * as bcrypt from 'bcrypt';
import { BeforeInsert } from "typeorm";
import { SnippetEntity } from "src/modules/tools/snippet-manager/entity/snippet.entity";
import { ApiKeyEntity } from "../api-key/api-key.entity";

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin'
}

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    name!: string;

    @Column({ nullable: true })
    avatarUrl?: string;

    @Column({ nullable: true })
    bio?: string;

    @Column({ nullable: true })
    location?: string;

    @Column({ nullable: true })
    githubUsername?: string;

    @Column({ type: 'jsonb', default: {} })
    socialLinks?: {
        twitter?: string;
        linkedin?: string;
        facebook?: string;
        instagram?: string;
    };

    @Column({ default: UserRole.USER, enum: UserRole })
    role!: UserRole;

    @Exclude()
    @Column({ select: false })
    password!: string;

    @Column({ default: true })
    isActive!: boolean;

    @Column({ type: 'jsonb', default: {} })
    preferences!: {
        theme?: 'light' | 'dark';
        emailNotifications?: boolean;
    };

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @BeforeInsert()
    async hashPassword() {
        if (this.password) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
    }

    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }

    @OneToMany(() => SnippetEntity, (snippet) => snippet.user)
    snippets!: SnippetEntity[];

    @OneToMany(() => ApiKeyEntity, (apiKey) => apiKey.user)
    apiKeys!: ApiKeyEntity[];
}
