// server.js
const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const port = 8000;
// app.post('/init')
// app.post('/reset')

app.post('/generate-template', (req, res) => {
  const { message } = req.body;
  const pythonProcess = spawn('python3', ['test.py', message], {
    env: {
      ...process.env,
      PYTORCH_ENABLE_MPS_FALLBACK: '1',
    }
  });

  let generatedText = '';

  pythonProcess.stdout.on('data', (data) => {
    generatedText += data.toString();
  });

  pythonProcess.on('close', (code) => {
    if (code === 0) {
      res.json({ generatedText });
    } else {
      res.status(500).send('Error in Python script execution');
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});