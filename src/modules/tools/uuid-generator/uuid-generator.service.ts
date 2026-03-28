import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuidv4, v5 as uuidv5, v1 as uuidv1 } from 'uuid';

@Injectable()
export class UuidGeneratorService {
    generate(version: 'v1' | 'v4' | 'v5' = 'v4', namespace?: string, name?: string): { uuid: string; version: string } {
        let uuid: string;

        switch (version) {
            case 'v1':
                uuid = uuidv1();
                break;
            case 'v5':
                if (!namespace || !name) {
                    throw new BadRequestException('Namespace and name required for v5');
                }
                uuid = uuidv5(name, namespace);
                break;
            default:
                uuid = uuidv4();
        }

        return { uuid, version };
    }

    generateMultiple(count: number, version: 'v1' | 'v4' | 'v5' = 'v4'): { uuids: string[]; count: number } {
        const uuids: string[] = [];
        for (let i = 0; i < Math.min(count, 100); i++) {
            uuids.push(this.generate(version).uuid);
        }
        return { uuids, count: uuids.length };
    }
}