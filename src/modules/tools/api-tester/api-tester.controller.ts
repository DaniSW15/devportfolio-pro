import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Request, UnauthorizedException } from '@nestjs/common';
import { ApiTesterService } from './api-tester.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiTesterDto, ApiTesterResponseDto, CollectionDto, SaveRequestDto } from './dto/api-tester.dto';

@ApiBearerAuth()
@Controller('api-tester')
export class ApiTesterController {
    constructor(private readonly apiTesterService: ApiTesterService) { }

    @Post('execute')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Execute an API request based on the provided configuration' })
    @ApiResponse({ status: 200, description: 'API request executed successfully' })
    @ApiResponse({ status: 400, description: 'Invalid request configuration' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    executeRequest(@Body() dto: ApiTesterDto): Promise<ApiTesterResponseDto> {
        return this.apiTesterService.executeRequest(dto);
    }

    @Post('save')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Save the API request configuration' })
    @ApiResponse({ status: 200, description: 'API request configuration saved successfully' })
    @ApiResponse({ status: 400, description: 'Invalid request configuration' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    saveRequest(@Request() req, @Body() dto: SaveRequestDto): Promise<SaveRequestDto> {
        const userId = req.user?.id;
        if (!userId) {
            throw new UnauthorizedException('User not authenticated');
        }
        return this.apiTesterService.saveRequest(userId, dto);
    }

    @Get('history')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get the history of saved API requests' })
    @ApiResponse({ status: 200, description: 'History retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    getHistory(@Request() req): Promise<SaveRequestDto[]> {
        const userId = req.user?.id;
        if (!userId) {
            throw new UnauthorizedException('User not authenticated');
        }
        return this.apiTesterService.getHistory(userId);
    }

    @Delete('history/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete a specific saved API request by ID' })
    @ApiResponse({ status: 200, description: 'Saved API request deleted successfully' })
    @ApiResponse({ status: 404, description: 'Saved API request not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async deleteHistoryById(@Request() req, @Body('id') id: string) {
        const userId = req.user?.id;
        const deleted = await this.apiTesterService.deleteHistoryById(userId, id);
        if (!userId) {
            throw new UnauthorizedException('User not authenticated');
        }

        if (!deleted) {
            throw new UnauthorizedException('Saved API request not found');
        }
        return { success: deleted, message: deleted ? 'Saved API request deleted successfully' : 'Saved API request not found' };
    }

    @Delete('history/delete')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Clear all history' })
    @ApiResponse({ status: 200, description: 'All saved API requests deleted successfully' })
    @ApiResponse({ status: 404, description: 'Saved API request not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async clearHistory(@Request() req) {
        const userId = req.user?.id;
        if (!userId) {
            throw new UnauthorizedException('User not authenticated');
        }
        await this.apiTesterService.clearHistory(userId);
        return { success: true, message: 'All saved API requests deleted successfully' };
    }

    @Post('collections')
    @ApiOperation({ summary: 'Create a new collection of API requests' })
    @ApiResponse({ status: 201, description: 'Collection created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid collection data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async createCollection(@Request() req, @Body() collection: CollectionDto): Promise<CollectionDto> {
        const userId = req.user?.id;
        if (!userId) {
            throw new UnauthorizedException('User not authenticated');
        }
        return this.apiTesterService.createCollection(userId, collection);
    }

    @Get('collections')
    @ApiOperation({ summary: 'Get all collections of API requests' })
    @ApiResponse({ status: 200, description: 'Collections retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getCollections(@Request() req): Promise<CollectionDto[]> {
        const userId = req.user?.id;
        if (!userId) {
            throw new UnauthorizedException('User not authenticated');
        }
        return this.apiTesterService.getCollections(userId);
    }

    @Get('stats')
    @ApiOperation({ summary: 'Get statistics for API Tester tool' })
    @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
    async getStats() {
        return this.apiTesterService.getStats();
    }
}
