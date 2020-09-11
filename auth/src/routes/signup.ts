import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator'

const router = express.Router()


router.post('/api/users/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Email must be valid'),
        body('password')
            .trim()
            .isLength({ min: 4, max: 20 })
            .withMessage('Password must be at between 4 and 20 characters')
    ],
    (req: Request, res: Response) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new Error('invalid email or password')
        }
        const { email, password } = req.body
        throw new Error('error connecting to database')
        console.log('creating user')
        res.send('ok')

    })


export { router as SignUpRouter }