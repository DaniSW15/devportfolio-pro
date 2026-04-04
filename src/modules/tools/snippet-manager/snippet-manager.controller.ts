import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { SnippetManagerService } from './snippet-manager.service';
import { CreateSnippetDto, UpdateSnippetDto } from './dto/snippet.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtOrApiKeyGuard } from 'src/modules/auth/guards/jwt-or-api-key/jwt-or-api-key.guard';

interface AuthRequest extends Request {
    user: { id: string };
}

@ApiBearerAuth()
@UseGuards(JwtOrApiKeyGuard)
@Controller('snippet-manager')
export class SnippetManagerController {
    constructor(private readonly snippetService: SnippetManagerService) { }

    @Post()
    async create(@Request() req: AuthRequest, @Body() dto: CreateSnippetDto) {
        return this.snippetService.create(req.user.id, dto);
    }

    @Get()
    async findAll(@Request() req: AuthRequest) {
        return this.snippetService.findAll(req.user.id);
    }

    @Get('search')
    search(@Request() req: AuthRequest, @Query('q') query: string) {
        return this.snippetService.search(req.user.id, query);
    }

    @Get(':id')
    findOne(@Request() req: AuthRequest, @Param('id') id: string) {
        return this.snippetService.findOne(id, req.user.id);
    }

    @Put(':id')
    update(@Request() req: AuthRequest, @Param('id') id: string, @Body() dto: UpdateSnippetDto) {
        return this.snippetService.update(id, req.user.id, dto);
    }

    @Delete(':id')
    remove(@Request() req: AuthRequest, @Param('id') id: string) {
        return this.snippetService.remove(id, req.user.id);
    }
}
