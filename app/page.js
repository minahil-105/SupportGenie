
import { Container, Typography, Button } from '@mui/material';
import Link from 'next/link';

export default function HomePage() {
  return (
    <Container>
      <Typography variant="h1" gutterBottom>
        Welcome to SupportGenie, Your ultimate Custom Chatbot!
      </Typography>
      <Link href="/chat" passHref>
        <Button variant="contained">Go to Chat</Button>
      </Link>
    </Container>
  );
}
