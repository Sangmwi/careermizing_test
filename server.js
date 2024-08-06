const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/api/send-message', async (req, res) => {
    const { assistantId, userInput, threadId } = req.body;

    try {
const response = await fetch(`https://api.openai.com/v1/assistants/${assistantId}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPEN_API_KEY}`
            },
            body: JSON.stringify({
                assistant_id: assistantId,
                input: { text: userInput },
                thread_id: threadId
            })
        });

        const data = await response.json();

        res.json({
            thread_id: threadId || data.id,
            choices: data.choices
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
