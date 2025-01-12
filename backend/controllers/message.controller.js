import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const findParticipants = async (req, res) => {
    try {
      const userId = req.id; // Current user ID
      const participantIds = new Set();
  
      // Fetch all conversations where the current user is a participant
      const conversations = await Conversation.find({ participants: userId });
      
      // Collect all participant IDs
      conversations.forEach(conversation => {
        conversation.participants.forEach(participantId => {
          participantIds.add(participantId.toString());
        });
      });
  
      // Remove the current user ID from the participants
      participantIds.delete(userId);
  
      // Find the participants' usernames
      const participants = await User.find({
        _id: { $in: [...participantIds] }
      }).select('username');
  
      // Prepare the response
      for (const participant of participants) {
        const participantId = participant._id.toString();
  
        // Find the first message in the conversation between the current user and this participant
        const firstMessage = await Message.findOne({
          $or: [
            { senderId: userId, receiverId: participantId },
            { senderId: participantId, receiverId: userId },
          ],
        }).sort({ createdAt: 1 });
  
        if (firstMessage) {
          // Check who sent the first message
          
            if(!(firstMessage.senderId.toString() === userId)) {
                participant.username = "Unknown"
            }
  
        }
      }
  
      return res.status(200).json({ success: true, participants });

    } catch (error) {
      console.log('Error fetching participants:', error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
  

export const sendPersonalMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { message } = req.body;

        if (!message) return res.status(404).json({ message: "Messsage not found", success: false });

        let conversation = await Conversation.findOne({ participants: { $all: [senderId, receiverId] } });
        //establish conversation if not started yet
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });

        conversation.messages.push(newMessage._id);

        await conversation.save();

        //implement socket io

        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }


        return res.status(201).json({ newMessage, success: true });

    } catch (error) {
        console.log(error);

    }
}



export const getPersonalMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const conversation = await Conversation.findOne({ participants: { $all: [senderId, receiverId] } }).populate('messages');

        // findOne retrieve a single conversation document where the participants match. 
        // If you use find, it returns an array of documents,

        //so if using find , then also do this
        //const conversation = conversations[0]; // Access the first conversation document

        if (!conversation) return res.status(200).json({ messages: [], success: true });

        return res.status(200).json({ success: true, messages: conversation.messages });

    } catch (error) {
        console.log(error);

    }
}

export const sendGroupMessage = async(req, res) => {
    try {
        const senderId = req.id;
        const {message} = req.body;
        
        if(!message) {
            return res.status(400).json({ success: false, message: 'Message is required' });
        }

        const newMessage  = await Message.create({
            senderId,
            message
        });

        //socket implementation

        io.emit('groupMessage', newMessage);

        
        return res.status(201).json({ newMessage, success: true });

    } catch (error) {
        console.log(error.message);
        
    }
}


export const getGroupMessage = async(req, res) => {
    try {
        const messages = await Message.find({receiverId:null}).sort({createdAt: 1});

        return res.status(200).json({ success: true, messages: messages });
    } catch (error) {
        console.log(error);
        
    }
}



export const deleteOldGroupMessages = async (req, res) => {
    try {
      // Calculate the timestamp for 5 hours ago
      const fiveHoursAgo = new Date(Date.now() - 5 * 60 * 60 * 1000);
  
      // Delete messages where receiver is null (group messages) and createdAt is older than 5 hours
      const result = await Message.deleteMany({
        receiverId: null,
        createdAt: { $lt: fiveHoursAgo },
      });
  
      // Respond with the number of deleted messages
      console.log(`${result.deletedCount} group messages older than 5 hours have been deleted.`);
      
    } catch (error) {
      console.error("Error deleting old group messages:", error);
    }
  };