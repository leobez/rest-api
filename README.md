# RESTful API
Teste técnico.

## Tecnologias utilizadas
- Node.js 22.12.0 (LTS)
- Express
- npm
- Postman

## Instalação
1. Clone o repositório:
``` bash
git clone https://github.com/leobez/rest-api.git
```

2. Entre no diretório:
``` bash
cd rest-api
```

3. Instale as dependências:
``` bash
npm install
```

4. Crie um arquivo .env na raiz do projeto e insira a linha abaixo ou utilize o comando echo:
``` env
SECRET=CHAVE
```
``` env
echo "SECRET=CHAVE" >> .env
```

5. Rode o app:
``` env
npm run nodemon
```
 
A API estará disponível em http://localhost:3000

## Rotas

### 1. **Teste**  

#### **POST /**  
Retorna uma mensagem indicando que a API está rodando corretamente.  

---

### 2. **Usuário**  

#### **POST /api/user/register**  
Registra o usuário na base de dados e retorna cookies contendo um token JWT.

- **Parâmetros**:  
  - Body (JSON):  
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```

... (TODO)


### Observações  
- Certifique-se de configurar as variáveis de ambiente corretamente para rodar a API.
- Use ferramentas como Postman para testar as rotas.
- Com relação a autenticação...
