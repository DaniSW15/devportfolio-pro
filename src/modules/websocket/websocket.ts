// src/modules/websocket/websocket.gateway.ts
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';

@WebSocketGateway({
    cors: {
        origin: '*',
        credentials: true,
    },
    namespace: 'collaborative',
})
export class CollaborativeGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server!: Server;

    private rooms = new Map<string, Set<string>>();
    private userSessions = new Map<string, string>(); // userId -> socketId

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
        // Remover de todas las salas
        this.rooms.forEach((users, room) => {
            if (users.has(client.id)) {
                users.delete(client.id);
                client.to(room).emit('user_left', { userId: client.id });
            }
        });
    }

    @SubscribeMessage('join_room')
    async handleJoinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { roomId: string; userId: string },
    ) {
        client.join(data.roomId);

        if (!this.rooms.has(data.roomId)) {
            this.rooms.set(data.roomId, new Set());
        }

        this.rooms.get(data.roomId)!.add(client.id);
        this.userSessions.set(data.userId, client.id);

        client.to(data.roomId).emit('user_joined', {
            userId: data.userId,
            timestamp: new Date().toISOString(),
        });

        return { success: true, roomId: data.roomId };
    }

    @SubscribeMessage('code_change')
    async handleCodeChange(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { roomId: string; code: string; language: string; userId: string },
    ) {
        client.to(data.roomId).emit('code_updated', {
            code: data.code,
            language: data.language,
            userId: data.userId,
            timestamp: new Date().toISOString(),
        });

        return { success: true };
    }

    @SubscribeMessage('cursor_move')
    async handleCursorMove(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { roomId: string; position: number; userId: string; userName: string },
    ) {
        client.to(data.roomId).emit('cursor_moved', {
            userId: data.userId,
            userName: data.userName,
            position: data.position,
            timestamp: new Date().toISOString(),
        });

        return { success: true };
    }

    @SubscribeMessage('message')
    async handleMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { roomId: string; message: string; userId: string; userName: string },
    ) {
        client.to(data.roomId).emit('new_message', {
            userId: data.userId,
            userName: data.userName,
            message: data.message,
            timestamp: new Date().toISOString(),
        });

        return { success: true };
    }
}