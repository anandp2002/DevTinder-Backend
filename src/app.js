const express = require('express');

const app = express();

app.use('/', (req, res) => {
  res.send('Hai');
});

app.listen(3000, () => {
  console.log('Server is listening on port 300');
});
