// Тестування Pull Request
const express = require('express');
const mysql = require('mysql2');

const app = express();
app.use(express.json());


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Apple44?', 
    database: 'hotel_system'
});

db.connect((err) => {
    if (err) {
        console.error('Помилка підключення до БД:', err);
        return;
    }
    console.log('Успішно підключено до бази hotel_system!');
});


// CRUD ОПЕРАЦІЇ (REST API) 


// 1. READ (GET) - Отримати всіх гостей 
app.get('/guests', (req, res) => {
    db.query('SELECT * FROM guests', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// 2. CREATE (POST) - Додати нового гостя
app.post('/guests', (req, res) => {
    const { id, full_name, phone, email, passport_number, loyalty_tier } = req.body;
    
    // Додаємо колонку registration_date та функцію NOW() у запит
    db.query(
        'INSERT INTO guests (id, full_name, phone, email, passport_number, loyalty_tier, registration_date) VALUES (?, ?, ?, ?, ?, ?, NOW())',
        [id, full_name, phone, email, passport_number, loyalty_tier],
        (err, results) => {
            if (err) {
                console.error("Помилка БД:", err.message);
                return res.status(500).json({ error: err.message }); 
            }
            res.json({ message: 'Гостя успішно додано!', id: id });
        }
    );
});

// 3. UPDATE (PUT) - Оновити дані гостя [cite: 726-736]
app.put('/guests/:id', (req, res) => {
    const { full_name, phone, email, loyalty_tier } = req.body;
    const { id } = req.params;
    db.query(
        'UPDATE guests SET full_name = ?, phone = ?, email = ?, loyalty_tier = ? WHERE id = ?',
        [full_name, phone, email, loyalty_tier, id],
        (err) => {
            if (err) throw err;
            res.json({ message: 'Дані гостя оновлено!' });
        }
    );
});

// 4. DELETE (DELETE) - Видалити гостя [cite: 737-745]
app.delete('/guests/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM guests WHERE id = ?', [id], (err) => {
        if (err) throw err;
        res.json({ message: 'Гостя видалено!' });
    });
});

// Запуск сервера [cite: 715]
app.listen(3000, () => {
    console.log('Сервер запущено на порту 3000.');
});