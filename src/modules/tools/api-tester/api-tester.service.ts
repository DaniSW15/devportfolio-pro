import { Injectable, BadRequestException } from '@nestjs/common';
import { ApiTesterDto, ApiTesterResponseDto, CollectionDto, SaveRequestDto } from './dto/api-tester.dto';
import { BodyType } from './interfaces/http-method.interface';
import axios from 'axios';

@Injectable()
export class ApiTesterService {
    private history: SaveRequestDto[] = [];
    private collections: Map<string, CollectionDto> = new Map();

    async executeRequest(dto: ApiTesterDto): Promise<ApiTesterResponseDto> {
        const startTime = Date.now();

        try {
            const headers = this.prepareHeaders(dto.headers, dto.bodyType);
            let data: any;

            if (dto.bodyType === BodyType.GRAPHQL && dto.graphql) {
                data = {
                    query: dto.graphql.query,
                    variables: dto.graphql.variables,
                    operationName: dto.graphql.operationName,
                };
                headers['Content-Type'] = 'application/json';
            } else if (dto.bodyType === BodyType.JSON && dto.body) {
                data = typeof dto.body === 'string' ? JSON.parse(dto.body) : dto.body;
                headers['Content-Type'] = 'application/json';
            } else if (dto.bodyType === BodyType.FORM_DATA && dto.body) {
                data = dto.body;
            } else if (dto.bodyType === BodyType.X_WWW_FORM_URLENCODED && dto.body) {
                data = new URLSearchParams(dto.body).toString();
                headers['Content-Type'] = 'application/x-www-form-urlencoded';
            } else if (dto.bodyType === BodyType.TEXT && dto.body) {
                data = dto.body;
                headers['Content-Type'] = 'text/plain';
            }

            const response = await axios({
                method: dto.method,
                url: dto.url,
                headers,
                data,
                timeout: dto.timeout || 30000,
                validateStatus: () => true,
            });

            const time = Date.now() - startTime;
            const size = Buffer.byteLength(JSON.stringify(response.data), 'utf8');

            return {
                success: response.status >= 200 && response.status < 300,
                status: response.status,
                statusText: response.statusText,
                headers: response.headers as Record<string, string>,
                data: response.data,
                size,
                time,
                timestamp: new Date().toISOString(),
            };
        } catch (error: any) {
            const time = Date.now() - startTime;

            return {
                success: false,
                status: error.response?.status || 0,
                statusText: error.response?.statusText || 'Network Error',
                headers: error.response?.headers || {},
                data: error.response?.data || error.message,
                size: 0,
                time,
                error: error.message,
                timestamp: new Date().toISOString(),
            };
        }
    }

    private prepareHeaders(headers?: { key: string; value: string }[], bodyType?: BodyType): Record<string, string> {
        const result: Record<string, string> = {};

        if (headers) {
            headers.forEach(header => {
                if (header.key && header.value) {
                    result[header.key] = header.value;
                }
            });
        }

        // Don't set Content-Type for FormData
        if (bodyType !== BodyType.FORM_DATA) {
            if (!result['Content-Type']) {
                result['Content-Type'] = 'application/json';
            }
        }

        if (!result['Accept']) {
            result['Accept'] = '*/*';
        }

        return result;
    }

    async saveRequest(userId: string, dto: SaveRequestDto): Promise<SaveRequestDto> {
        const savedRequest = {
            ...dto,
            id: `${Date.now()}-${Math.random()}`,
            userId,
            createdAt: new Date().toISOString(),
        };

        this.history.unshift(savedRequest);

        if (this.history.length > 100) {
            this.history.pop();
        }

        return savedRequest;
    }

    async getHistory(userId: string): Promise<SaveRequestDto[]> {
        return this.history.filter((request: any) => request.userId === userId);
    }

    async getHistoryById(userId: string, id: string): Promise<SaveRequestDto | null> {
        const request = this.history.find((req: any) => req.id === id && req.userId === userId);
        return request || null;
    }

    async deleteHistoryById(userId: string, id: string): Promise<boolean> {
        const index = this.history.findIndex((req: any) => req.id === id && req.userId === userId);

        if (index !== -1) {
            this.history.splice(index, 1);
            return true;
        }

        return false;
    }

    async clearHistory(userId: string): Promise<void> {
        this.history = this.history.filter((req: any) => req.userId !== userId);
    }

    async createCollection(userId: string, dto: CollectionDto): Promise<CollectionDto> {
        const id = `${Date.now()}-${Math.random()}`;
        const newCollection = { ...dto, id, userId, createdAt: new Date().toISOString() };
        this.collections.set(id, newCollection);
        return newCollection;
    }

    async getCollections(userId: string): Promise<CollectionDto[]> {
        const collections: CollectionDto[] = [];
        this.collections.forEach((collection: any) => {
            if (collection.userId === userId) {
                collections.push(collection);
            }
        });
        return collections;
    }

    async getStats() {
        return {
            tool: 'api-tester',
            version: '1.0.0',
            features: ['rest', 'graphql', 'history', 'collections', 'headers', 'body-types'],
            supportedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
            bodyTypes: ['json', 'form-data', 'x-www-form-urlencoded', 'text', 'graphql', 'none'],
        };
    }
}
