import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const SECRET = process.env.SECRET;

async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    try {
        const dbUser = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!dbUser) {
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        const isValidPassword = await bcrypt.compare(password, dbUser.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Senha incorreta' });
        }
       const token = jwt.sign(
            { id: dbUser.id }, 
            SECRET, { expiresIn: '1h' });
            console.log("Token gerado:", token);
            res.json({ token });

    } catch (error) {
        console.error('Erro ao realizar login:', error);
        res.status(500).json({ message: 'Erro interno no servidor' });
    }
}

export default login;