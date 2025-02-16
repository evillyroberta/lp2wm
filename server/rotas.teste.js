import { describe, it, before, beforeEach } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from './server.js';


let validUser;
let validUserLogin;
let createdCard;
let token;

const generateUniqueEmail = () => `test${Date.now()}${Math.random().toString(36).substring(7)}@example.com`;

const newUser = {
  name: 'Usuario Teste',
  email: generateUniqueEmail(),
  password: '9090',
};

const newCard = {
  titulo: 'Teste',
  descricao: 'A Coreia do Sul, uma nação do Leste da Ásia localizada na metade sul da Península da Coreia, compartilha uma das fronteiras mais militarizadas do mundo com a Coreia do Norte.',
};

async function loadToken(user) {
  const response = await request(app).post('/').send({
    email: user.email,
    password: user.password,
  });
  return response.body.token;
}

describe('teste da rota', () => {
  before(async () => {
    
   

    const response = await request(app).post('/cadastro').send(newUser);
    validUser = response.body;
    validUserLogin = { email: validUser.email, password: '9090' };

    
    token = await loadToken(validUserLogin);
  });
});

describe('Cadastro teste', () => {
  it('novo usuário teste', async () => {
    const uniqueUser = { ...newUser, email: generateUniqueEmail() };
    const response = await request(app)
      .post('/cadastro')
      .send(uniqueUser);
    assert.strictEqual(response.statusCode, 201);
    assert.strictEqual(response.body.name, uniqueUser.name);
  });

  it('email unique', async () => {
    const uniqueUser = { ...newUser, email: generateUniqueEmail() };
    await request(app).post('/cadastro').send(uniqueUser);

    const response = await request(app)
      .post('/cadastro')
      .send(uniqueUser);
    assert.strictEqual(response.statusCode, 400); // Ou 500, dependendo do servidor
  });
});

describe('Login do teste', () => {
  it('login', async () => {
    const response = await request(app)
      .post('/')
      .send(validUserLogin);
    assert.strictEqual(response.statusCode, 200);
    assert.ok(response.body.token);
  });
});

describe('card teste', () => {
  it('criae card teste', async () => {
    const response = await request(app)
      .post('/cards')
      .set('Authorization', `Bearer ${token}`)
      .send(newCard);
    assert.strictEqual(response.statusCode, 201);
    createdCard = response.body;
    assert.strictEqual(response.body.titulo, newCard.titulo);
  });
});