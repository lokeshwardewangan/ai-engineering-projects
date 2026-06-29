import express from 'express';
import type { Response, Request } from 'express';
const app = express();
const PORT = 5000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello dd');
});

app.get('/api/hello', (req: Request, res: Response) => {
  res.json({
    message: 'Hello',
  });
});

app.listen(PORT, () => {
  console.log(`Sever is listening at http://localhost:${PORT}`);
});
