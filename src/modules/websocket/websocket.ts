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
import { WsJwtGuard } from './ws-jwt/ws-jwt.guard';

interface Room {
    id: string;
    users: Map<string, { id: string; name: string; socketId: string }>;
    code: string;
    language: string;
    cursors: Map<string, number>;
}

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

    private rooms = new Map<string, Room>();
    private userRooms = new Map<string, string>(); // socketId -> roomId

    handleConnection(client: Socket) {
        console.log(`🔌 Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`❌ Client disconnected: ${client.id}`);

        // Remover de la sala
        const roomId = this.userRooms.get(client.id);
        if (roomId) {
            const room = this.rooms.get(roomId);
            if (room) {
                // Encontrar usuario por socketId
                let userId = '';
                for (const [uid, user] of room.users) {
                    if (user.socketId === client.id) {
                        userId = uid;
                        break;
                    }
                }

                if (userId) {
                    room.users.delete(userId);
                    room.cursors.delete(userId);

                    // Notificar a otros usuarios
                    client.to(roomId).emit('user_left', {
                        userId,
                        users: Array.from(room.users.values()),
                        timestamp: new Date().toISOString(),
                    });
                }

                // Si la sala queda vacía, eliminarla
                if (room.users.size === 0) {
                    this.rooms.delete(roomId);
                }
            }
            this.userRooms.delete(client.id);
        }
    }

    @SubscribeMessage('join_room')
    @UseGuards(WsJwtGuard)
    async handleJoinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { roomId: string; userName: string },
    ) {
        const { roomId, userName } = data;
        const user = client.data.user;

        // Crear sala si no existe
        if (!this.rooms.has(roomId)) {
            this.rooms.set(roomId, {
                id: roomId,
                users: new Map(),
                code: '// Welcome to collaborative coding!\n// Start writing your code here...',
                language: 'javascript',
                cursors: new Map(),
            });
        }

        const room: any = this.rooms.get(roomId);

        // Agregar usuario a la sala
        room.users.set(user.sub, {
            id: user.sub,
            name: userName,
            socketId: client.id,
        });

        this.userRooms.set(client.id, roomId);

        // Unirse a la sala de Socket.IO
        client.join(roomId);

        // Enviar estado actual al usuario que se une
        client.emit('room_state', {
            code: room.code,
            language: room.language,
            users: Array.from(room.users.values()),
            cursors: Array.from(room.cursors.entries()).map(([userId, position]: any) => ({
                userId,
                position,
            })),
        });

        // Notificar a otros usuarios
        client.to(roomId).emit('user_joined', {
            userId: user.sub,
            userName,
            users: Array.from(room.users.values()),
            timestamp: new Date().toISOString(),
        });

        return { success: true, roomId };
    }

    @SubscribeMessage('code_change')
    @UseGuards(WsJwtGuard)
    async handleCodeChange(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { roomId: string; code: string; language: string },
    ) {
        const { roomId, code, language } = data;
        const room = this.rooms.get(roomId);

        if (room) {
            room.code = code;
            if (language) room.language = language;

            client.to(roomId).emit('code_updated', {
                code,
                language: room.language,
                userId: client.data.user.sub,
                timestamp: new Date().toISOString(),
            });
        }
    }

    @SubscribeMessage('cursor_move')
    @UseGuards(WsJwtGuard)
    async handleCursorMove(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { roomId: string; position: number },
    ) {
        const { roomId, position } = data;
        const room = this.rooms.get(roomId);
        const userId = client.data.user.sub;

        if (room) {
            room.cursors.set(userId, position);

            client.to(roomId).emit('cursor_moved', {
                userId,
                position,
                userName: room.users.get(userId)?.name,
                timestamp: new Date().toISOString(),
            });
        }
    }

    @SubscribeMessage('send_message')
    @UseGuards(WsJwtGuard)
    async handleMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { roomId: string; message: string },
    ) {
        const { roomId, message } = data;
        const room = this.rooms.get(roomId);
        const userId = client.data.user.sub;
        const userName = room?.users.get(userId)?.name || 'Anonymous';

        client.to(roomId).emit('new_message', {
            userId,
            userName,
            message,
            timestamp: new Date().toISOString(),
        });
    }

    @SubscribeMessage('leave_room')
    async handleLeaveRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { roomId: string },
    ) {
        const { roomId } = data;
        const room = this.rooms.get(roomId);

        if (room) {
            let userId = '';
            for (const [uid, user] of room.users) {
                if (user.socketId === client.id) {
                    userId = uid;
                    break;
                }
            }

            if (userId) {
                room.users.delete(userId);
                room.cursors.delete(userId);

                client.to(roomId).emit('user_left', {
                    userId,
                    users: Array.from(room.users.values()),
                    timestamp: new Date().toISOString(),
                });
            }

            if (room.users.size === 0) {
                this.rooms.delete(roomId);
            }
        }

        client.leave(roomId);
        this.userRooms.delete(client.id);

        return { success: true };
    }

    @SubscribeMessage('get_rooms')
    async handleGetRooms() {
        const roomList = Array.from(this.rooms.values()).map(room => ({
            id: room.id,
            users: room.users.size,
            language: room.language,
        }));
        return { rooms: roomList };
    }
}