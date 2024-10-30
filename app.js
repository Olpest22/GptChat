const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv')
const app = express();

dotenv.config()
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const openai = new OpenAI({
    apiKey: "" // Используйте переменные окружения
});

app.get('/getResponse', async (req, res) => {
    const userPrompt = req.query.userPrompt;
    console.log('User Prompt:', userPrompt);
    
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: userPrompt }],
            max_tokens: 1000
        });
        console.log('GPT Response:', response.choices[0].message.content);
        res.json({ reply: response.choices[0].message.content });
    } catch (error) {
        console.error(error);
        if (error.response && error.response.status) {
            if (error.response.status === 429) {
                res.status(429).send('Слишком много запросов. Пожалуйста, попробуйте позже.');
            } else if (error.response.status === 403) {
                res.status(403).send('Вы не включили VPN');
            } else {
                res.status(500).send('Ошибка при обращении к OpenAI API');
            }
        } else {
            res.status(500).send('Неизвестная ошибка');
        }
    }
});

app.listen(3000, () => {
    console.log('Сервер запущен на http://localhost:3000');
});
