import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UnauthorizedException } from '@nestjs/common';
import { SnippetManagerService } from './snippet-manager.service';
import { CreateSnippetDto, UpdateSnippetDto } from './dto/snippet.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('snippet-manager')
export class SnippetManagerController {
    constructor(private readonly snippetService: SnippetManagerService) { }

    @Post()
    async create(@Request() req, @Body() dto: CreateSnippetDto) {
        console.log('req.user:', req.user);
        if (!req.user) {
            throw new UnauthorizedException('User not authenticated');
        }
        return this.snippetService.create(req.user.id, dto);
    }

    @Get()
    async findAll(@Request() req) {
        console.log('req.user:', req.user);
        return this.snippetService.findAll(req.user?.id);
    }

    @Get('search')
    search(@Request() req, @Query('q') query: string) {
        return this.snippetService.search(req.user.id, query);
    }

    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
        return this.snippetService.findOne(id, req.user.id);
    }

    @Put(':id')
    update(@Request() req, @Param('id') id: string, @Body() dto: UpdateSnippetDto) {
        return this.snippetService.update(id, req.user.id, dto);
    }

    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        return this.snippetService.remove(id, req.user.id);
    }
}
