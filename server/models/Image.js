import prisma from '../database/database.js';
import path from 'path';

async function create({ userId, file }) {
  const imagePath = path.join('imgs', 'profile', file.filename); // A partir do 'multer', você recebe file.filename

  const newImage = await prisma.image.create({
    data: {
      path: imagePath,  // Armazena o caminho da imagem
      user: {
        connect: {
          id: userId,  // Associa a imagem ao usuário
        },
      },
    },
  });

  return newImage;
}



export default  create;
