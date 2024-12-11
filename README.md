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
SECRET_KEY=CHAVE
```
``` env
echo "SECRET_KEY=CHAVE" >> .env
```

5. Rode o app:
``` env
npm run nodemon
```
 
A API estará disponível em http://localhost:3000

### Observações  
- Certifique-se de configurar as variáveis de ambiente corretamente para rodar a API.
- Use ferramentas como Postman para testar as rotas.
- Com relação a autenticação... (cookies)

## Rotas

### 1. **Teste**  

#### **POST /**  
Retorna uma mensagem indicando que a API está rodando corretamente.  

---

### 2. **User**  

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
    
#### **POST /api/user/login**  
Valida o usuário e retorna cookies contendo um token JWT.

- **Parâmetros**:  
  - Body (JSON):  
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
    
#### **POST /api/user/logout**  
Expira o token JWT dos cookies da requisição.

#### **GET /api/user/profile**  
Retorna o id e username do usuário baseado nos dados do token JWT presente nos cookies da requisição.

---

### 3. **Character**  

#### **GET /api/character?page=**  
Retorna todos os personagens disponiveis (paginados) em https://rickandmortyapi.com/
- **Parâmetros**:  
  - Query:  
    ```
    page = number
    ```
    
#### **POST /api/character/favorite/:id**  
Adiciona o personagem de :id aos favoritos do usuário. Uma linha é adicionada ao banco de dados.

#### **GET /api/character/favorite**  
Retorna todos os personagens favoritos do usuário.

#### **PUT /api/character/favorite/:id**  
Caso usuário tenha algum personagem de characterId = :id (param) em seus favoritos, esse será atualizado para o personagem de characterId = newId (body)

- **Parâmetros**:  
  - Body (JSON):  
    ```json
    {
      "newId": "number"
    }
    ```

#### **DELETE /api/character/favorite/:id**  
Caso o usuário tenha algum personagem de characterId = :id (param) em seus favoritos, esse será removido dos seus favoritos. Uma linha será deletada do banco de dados.

#### **GET /api/character/favorite/episode-count-each**  
Retorna uma contagem de episódios na qual cada personagem presente na lista de favoritos do usuário estava. 

#### **GET /api/character/favorite/episode-count-all**  
Retorna uma contagem de episódios na qual TODOS os personagem presente na lista de favoritos do usuário estavam. 

