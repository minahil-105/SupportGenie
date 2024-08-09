'use client';
import { useState } from 'react';
import { Container, Typography, TextField, Button, Paper, List, ListItem, ListItemText, CssBaseline, IconButton } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    background: {
      default: '#121212',
      paper: '#1d1d1d',
    },
    text: {
      primary: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto Mono", monospace',
    h3: {
      fontWeight: 'bold',
      color: '#90caf9',
    },
    body1: {
      fontSize: '1.1rem',
    },
  },
});

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSendMessage = async () => {
    if (input.trim()) {
      const newMessages = [...messages, { sender: 'You', text: input }];
      setMessages(newMessages);
      setInput('');

      console.log("sending response------")
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input, sessionId: 'your-session-id' }),
      });
      const data = await response.json();
      setMessages([...newMessages, { sender: 'AI', text: data.response }]);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="md" style={{ marginTop: '2rem' }}>
        <Typography variant="h3" gutterBottom align="center">
          AI Chatbot
        </Typography>
        <Paper style={{ padding: '1rem', marginBottom: '1rem' }}>
          <List style={{ maxHeight: '50vh', overflow: 'auto' }}>
            {messages.map((message, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={message.sender}
                  secondary={message.text}
                  primaryTypographyProps={{ style: { fontWeight: 'bold', color: '#90caf9' } }}
                  secondaryTypographyProps={{ style: { color: '#ffffff' } }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Your Message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          style={{ marginBottom: '1rem' }}
        />
        <Button variant="contained" color="primary" fullWidth onClick={handleSendMessage}>
          SEND
        </Button>
        {/* Example of using icons */}
        <IconButton>
          <ChevronLeft />
        </IconButton>
        <IconButton>
          <ChevronRight />
        </IconButton>
      </Container>
    </ThemeProvider>
  );
}
