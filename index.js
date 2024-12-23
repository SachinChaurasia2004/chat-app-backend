import express from "express";
import { connectDB } from "./config/db.js";
import { config } from "dotenv";
import http from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/authRoutes.js";
import conversationsRoutes from "./routes/conversationsRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"
import { saveMessage } from "./controllers/messageController.js";

const app = express();
const server = http.createServer(app);
config({
    path: ".env"
})
connectDB();

app.use(express.json());
const io = new Server(server, {
    cors:{
        origin: '*'
    }
})

app.use('/auth', authRoutes);
app.use('/conversations', conversationsRoutes);
app.use('/messages', messageRoutes);
app.use((error, req, res, next) => {
    res.status(500).json({
        success: false,
        message: error.message
    });
});

io.on("connection", (socket)=> {
    console.log('A user connected:', socket.id);

    socket.on('joinConversation', (conversationId)=> {
       socket.join(conversationId); 
       console.log('User joined conversation :'+conversationId);
    })

    socket.on('sendMessage', async (message)=> {
        const{conversationId, senderId, content} = message;
        try {
            const savedMessage = await saveMessage(conversationId, senderId, content);
            console.log(savedMessage);
            io.to(conversationId).emit('newMessage', savedMessage);

            io.emit('conversationUpdated', {
                conversationId,
                lastMessage: savedMessage.content,
                lastMessageTime: savedMessage.createdAt,
            });
        } catch (error) {
            console.log('Failed to save message:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
    })
})

const PORT = process.env.PORT || 2000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})