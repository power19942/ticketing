import express from 'express';

import { CurrentUserRouter } from './routes/current-user'
import { SignInRouter } from './routes/signin'
import { SignUpRouter } from './routes/signup'
import { SignOutRouter } from './routes/signout'
import { errorHandler } from './middlewares/error-handler';
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.use(CurrentUserRouter)
app.use(SignInRouter)
app.use(SignUpRouter)
app.use(SignOutRouter)

app.use(errorHandler)

app.listen(3000, () => {
    console.log('listen on port 3000');
})