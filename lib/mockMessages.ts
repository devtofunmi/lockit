type Message = {
    id: string;
    content: string;
    createdAt: number;
    expiresIn: number; // milliseconds
    viewed: boolean;
  };
  
  const messages: Message[] = [];
  
  export const addMockMessage = (msg: Omit<Message, "id" | "createdAt" | "viewed">): Message => {
    const newMessage = {
      id: Math.random().toString(36).substring(2, 10),
      content: msg.content,
      expiresIn: msg.expiresIn,
      createdAt: Date.now(),
      viewed: false,
    };
    messages.push(newMessage);
    return newMessage;
  };
  
  export const getMockMessage = (id: string): Message | null => {
    const message = messages.find((m) => m.id === id);
    if (!message) return null;
  
    const expired = Date.now() - message.createdAt > message.expiresIn;
    if (expired || message.viewed) return null;
  
    message.viewed = true; // one-time view
    return message;
  };
  