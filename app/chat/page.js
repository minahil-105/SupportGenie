
'use client';

import { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Paper, List, ListItem, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const ChatBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  maxHeight: '400px',
  overflow: 'auto',
}));

const InputField = styled(TextField)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const SendButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const ChatPage = () => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    setSessionId(Date.now().toString());
  }, []);

  const handleSendMessage = async () => {
    if (message.trim() === '') return;

    setConversation([...conversation, { role: 'user', content: message }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId, message }),
      });

      const data = await response.json();
      setConversation((prevConversation) => [
        ...prevConversation,
        { role: 'user', content: message },
        { role: 'assistant', content: data.response },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
    }

    setMessage('');
  };

  return (
    <StyledContainer>
      <Typography variant="h4" gutterBottom>
        AI Chatbot
      </Typography>
      <ChatBox>
        <List>
          {conversation.map((msg, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={msg.role === 'user' ? 'You' : 'AI'}
                secondary={msg.content}
              />
            </ListItem>
          ))}
        </List>
      </ChatBox>
      <InputField
        label="Your Message"
        variant="outlined"
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
      />
      <SendButton
        variant="contained"
        color="primary"
        onClick={handleSendMessage}
      >
        Send
      </SendButton>
    </StyledContainer>
  );
};

export default ChatPage;
