import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class TimestampConverterService {
    convertToDate(timestamp: number): { date: string; iso: string; utc: string; local: string } {
        const date = new Date(timestamp * 1000);
        return {
            date: date.toDateString(),
            iso: date.toISOString(),
            utc: date.toUTCString(),
            local: date.toLocaleString()
        };
    }

    convertToTimestamp(dateString: string): { timestamp: number; date: string } {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            throw new BadRequestException('Invalid date string');
        }
        return {
            timestamp: Math.floor(date.getTime() / 1000),
            date: date.toISOString()
        };
    }

    getCurrent(): { timestamp: number; iso: string; utc: string; local: string } {
        const now = new Date();
        return {
            timestamp: Math.floor(now.getTime() / 1000),
            iso: now.toISOString(),
            utc: now.toUTCString(),
            local: now.toLocaleString()
        };
    }
}