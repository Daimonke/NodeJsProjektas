import 'dotenv/config';
import express from 'express';
import index from './routes/index.js'
import users from './routes/api/users.js'
import blog from './routes/api/blog.js'
import path from 'path'
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 3010;

app.set('views', path.join('views'));
app.set('view engine', 'ejs');

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded( {extended:false} ));

app.use('/api/users', users)
app.use('/api/blog', blog)
app.use('/', index)

app.listen(PORT, () => console.log(`Server running at: http://localhost:${PORT}`))