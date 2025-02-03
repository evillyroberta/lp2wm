import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import login  from './controle/login.js';
import bcrypt from 'bcrypt';
import {isAuthenticated} from './middleware/auth.js';
import { z } from 'zod';
import { validate } from './middleware/validate.js';
import SendMail from './services/SendMail.js';
import multer from 'multer';
import multerConfig from './config/multer.js';

const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();
const upload = multer(multerConfig);

app.use(cors());
app.use(bodyParser.json());

// Rotas das telas 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../public/')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/home.html'));
});

app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/cadastro.html'));
});

app.get ('/teste', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/teste.html'));
});

// Prisma: Conectando ao banco de dados
(async () => {
    try {
        await prisma.$connect();
        console.log('tudo ok!');
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    }
})();

// Rota de Cadastro
app.post(
  '/cadastro',
  upload.single('image'), // Processa o arquivo de imagem com multer
  validate(
    z.object({
      body: z.object({
        name: z.string().min(5, 'min. 1'),
        email: z.string().email('E-mail inválido'),
        password: z.string(),
      }),
    })
  ),
  async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Criptografando a senha
      const hash = await bcrypt.hash(password, 10);

      // Criando o usuário no banco de dados
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hash,
        },
      });

      // Verifica se há arquivo de imagem
      if (req.file) {
        // Caminho relativo da imagem após o upload
        const imagePath = path.join('imgs', 'profile', req.file.filename); 
        // Criação da imagem no banco de dados
        const createdImage = await prisma.image.create({
          data: {
            path: imagePath, // Salva o caminho relativo da imagem
            user: {
              connect: { id: user.id }, 
            },
          },
        });

        
        await prisma.user.update({
          where: { id: user.id },
          data: {
            image: {
              connect: { id: createdImage.id }, 
            },
          },
        });
      }

      
      await SendMail.createNewUser(user.email);

      res.status(201).json(user);
    } catch (error) {
      console.error('Erro ao inserir o usuário no banco de dados:', error);
      res.status(500).json({ error: 'Erro ao inserir o usuário no banco de dados' });
    }
  }
);

//login
app.post('/', login);    


// criar um card
app.post(
  '/cards',
  isAuthenticated,
  validate(
    z.object({
      body: z.object({
        titulo: z.string().max(10, 'só 10 caracteres'), 
        descricao: z.string(), 
      }),
    })
  ),
  async (req, res) => {
    const { titulo, descricao } = req.body;

    if (!req.userId) { 
      return res.status(401).json({ error: 'Usuário não autenticado.' }); 
    }

    try {
      const card = await prisma.card.create({
        data: {
          titulo,
          descricao,
          userId: req.userId,
        },
      });


      
      res.status(201).json(card);
    } catch (error) {
      console.error('Erro ao inserir o card no banco de dados:', error);
      res.status(500).json({ error: 'Erro ao inserir o card no banco de dados' });
    }
  }
);

//mostra os cards
app.get('/cards', async (req, res) => {
  try {
      const cards = await prisma.card.findMany();
      res.json(cards);
  } catch (error) {
      console.error('Erro ao buscar os cards:', error);
      res.status(500).json({ error: 'Erro ao buscar os cards' });
  }
});

// dados user
app.get('/api/user', isAuthenticated, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { image: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    const defaultImage = 'user.png';

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image ? `${user.image.path}` : defaultImage, 
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});




app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
