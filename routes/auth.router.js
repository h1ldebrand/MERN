const {Router} = require('express');
const router = Router()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const config = require('config')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')

// /api/auth/register
router.post('/register',
    [
        check('email', 'Email isn`t correct').isEmail(),
        check('password', 'Password must be minimum 6 symbols').isLength({min: 6})
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Data is not corrent'
            })
        }

        const {email, password} = req.body
        const candidate = await User.findOne({email})

        if(candidate){
            return res.status(400).json({message: "This user has already exists."})
        }

        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({email, password: hashedPassword})

        await user.save()

        res.status(201).json({message: "User has created"})
        
    } catch (e) {
        res.status(500).json({message: "Something went wrong. Let's try again."})
    }
})

// /api/auth/login
router.post('/login',
    [
        check('email', 'Enter correct email').normalizeEmail().isEmail(),
        check('password', 'Enter password').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if(!errors.isEmpty()){
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Data is not corrent during log in'
                })
            }

            const {email, password} = req.body

            const user = await User.findOne({email})

            if(!user){
                return res.status(400).json({message: "User is not found"})
            }

            const isMatch = await bcrypt.compare(password, user.password)
            
            if(!isMatch){
                return res.status(400).json({message: "Password is not correct let`s try again"})
            }

            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '1h'} 
            )

            res.json({ token, userId: user.id })
            
        } catch (e) {
            res.status(500).json({message: "Something went wrong. Let's try again."})
        }

})

module.exports = router