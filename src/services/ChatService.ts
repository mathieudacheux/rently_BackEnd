import { IO, Nsp, Socket, SocketService, Input, Args, Emit } from '@tsed/socketio'
import * as SocketIO from 'socket.io'

@SocketService('/chat')
export class ChatService {
	@Nsp nsp: SocketIO.Namespace

	public clients: Map<string, SocketIO.Socket> = new Map()

	constructor(@IO private io: SocketIO.Server) {}

	/**
	 * Triggered when a new client connects to the Namespace.
	 */
	$onConnection(@Socket socket: SocketIO.Socket) {
		this.clients.set(socket.id, socket)

		// if you pass in a query of some kind you could use an id passed from the front end
		// instead of the socket id, like this.
		const yourId: string | undefined = socket.handshake.query.yourId?.toString()
		if (yourId) this.clients.set(yourId, socket)
	}

	$onDisconnect(@Socket socket: SocketIO.Socket) {
		this.clients.delete(socket.id)
	}

	@Input('message')
	@Emit('message')
	async message(
		@Args(0) sender: string,
		@Args(1) receiver: string,
		@Args(2) message: string
	) {
		this.nsp.emit('message', { sender: sender, receiver: receiver, message: message })
	}
}
