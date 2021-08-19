# Desafio Player 2 - Backend

[REPOSITÓRIO NO GITHUB](https://github.com/vanilo-ferreira/Desafio-Player2)

## FUNCIONALIDADES DA API

A API desenvolvida permite:

-   Cadastrar usuários;
-   Logar usuários cadastrados;
-   Cadastrar empresas;
-   Listar todas as empresas cadastradas (independente do usuário);
-   Listar todas as empresas cadastradas (pelo usuário);
-   Obter uma empresa específica;
-   Atualizar dados de uma empresa que o usuário logado cadastrou;
-   Excluir uma empresa cadastrada pelo usuário.

## DEPENDENÊNCIAS DA API

### Dependências:

- axios
- bcrypt
- cors
- express
- jsonwebtoken
- knex
- pg

### Dependências de desenvolvimento: 

- nodemon


##  Banco de dados

Você precisa criar um Banco de Dados PostgreSQL chamado `desafio_player2` contendo as seguintes tabelas e seus respectivos campos:

- `usuarios`
    - id
    - nome
    - email
    - senha

- `empresa`
    - id
    - usuario_id
    - cnpj
    - identificador_matriz_filial
    - descricao_matriz_filial
    - razao_social
    - nome_fantasia
    - situacao_cadastral
    - descricao_situacao_cadastral
    - data_situacao_cadastral
    - motivo_situacao_cadastral
    - nome_cidade_exterior
    - codigo_natureza_juridica
    - data_inicio_atividade
    - cnae_fiscal
    - cnae_fiscal_descricao
    - descricao_tipo_logradouro
    - logradouro
    - numero
    - complemento
    - bairro
    - cep
    - uf
    - codigo_municipio
    - municipio
    - ddd_telefone_1
    - ddd_telefone_2
    - ddd_fax
    - qualificacao_do_responsavel
    - capital_social
    - porte
    - descricao_porte
    - opcao_pelo_simples
    - data_opcao_pelo_simples
    - data_exclusao_do_simples
    - opcao_pelo_mei
    - situacao_especial
    - data_situacao_especial

- `qsa`
    - id
    - cnpj varchar
    - identificador_de_socio
    - nome_socio
    - cnpj_cpf_do_socio
    - codigo_qualificacao_socio
    - percentual_capital_social
    - data_entrada_sociedade
    - cpf_representante_legal
    - nome_representante_legal
    - codigo_qualificacao_representante_legal

- `cnaes_secundarias`
    - id
    - cnpj
    - codigo
    - descricao

**Importante: O Schema do Banco de Dados criado para esta API, encontrasse anexo a esse repositório! [CLIQUE AQUI](https://github.com/vanilo-ferreira/Desafio-Player2/blob/main/src/schema.sql)**

## ENDPOINTS QUE NÃO PRECISAM DE AUTENTIFICAÇÃO

#### `POST` `/cadastrarUsuario`

Essa é a rota que será utilizada para cadastrar um novo usuario no sistema.

Essa rota:

- Valida se o e-mail informado já existe
- Valida os campos obrigatórios:
    - nome
    - email
    - senha
- Criptografa a senha antes de salvar no banco de dados
- Cadastra o usuário no banco de dados

Exemplo do body a ser enviado:

```
{
    "nome": "Fulano de Tal",
    "email": "fulano@email.com",
    "senha": "teste"
}
```

### `POST` `/login`

Essa é a rota que permite ao usuário cadastrado realizar o login no sistema.

Ela:

- Verifica se o e-mail existe;
- Valida o e-mail e a senha;
- Cria um token de autenticação com id do usuário;
- Retorna um objeto com os dados do usuario (sem a senha) e o token criado.

Exemplo do body a ser enviado:

```
{
    "email": "fulano@email.com",
    "senha": "teste"
}
```
Exemplo de resposta da API:

```
{
  "usuario": {
    "id": 1,
    "nome": "Fulano de Tal",
    "email": "fulano@email.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjI5MzQ4Mzc1fQ.nf1tRJJR821qjhEX6xzwoxx_UUDrgfcVFbCInTkr3Kk"
}
```

## ENDPOINTS QUE PRECISAM DE AUTENTIFICAÇÃO

**ATENÇÃO: Todas as rotas abaixo irão exigir o token do usuário logado. Portanto, para cada rota abaixo será necessário validar o token informado.**

### `POST` `/empresas`

Essa é a rota que será chamada quando o usuario quiser cadastrar uma empresa atrelada ao seu próprio cadastro.

Essa rota:

- Validar o campo obrigatório:
    - cnpj
- Integra ao Brasil API e confere se o cnpj fornecido está cadastrado.
- O cadastro só é realizado se a empresa possuir cadastro na Brasil API, caso contrário, a empresa não será cadastrada.
- Verifica se o cnpj informado já não possui já não possui cadastro em nosso banco de dados.
- Se possuir a mensagem "O CNPJ já possui cadastro em nosso sistema" será retornada.
- Cadastra a empresa no banco de dados a atrelando ao id do usuario logado.
- A mensagem "A empresa foi cadastrada com sucesso!" é retornanda quando a empresa é cadastrada.

Exemplo do body a ser enviado:

```
{
    "cnpj": "33200056000149"
}
```

### `GET` `/empresas`

Essa é a rota que será chamada quando o usuario logado quiser listar todas as empresas cadastradas por qualquer usuário.

Ela irá:

- Listar todas as empresas cadastradas independente do usuário que a tenha cadastrado;
- Devolver em formato de array todas as empresas cadastradas e seus respectivos dados.

Exemplo de resposta da API:

```
[
    {
    "id": 3,
    "usuario_id": 1,
    "cnpj": "19131243000197",
    "identificador_matriz_filial": 1,
    "descricao_matriz_filial": "Matriz",
    "razao_social": "OPEN KNOWLEDGE BRASIL",
    "nome_fantasia": "REDE PELO CONHECIMENTO LIVRE",
    "situacao_cadastral": 2,
    "descricao_situacao_cadastral": "Ativa",
    "data_situacao_cadastral": "2013-10-03T03:00:00.000Z",
    "motivo_situacao_cadastral": 0,
    "nome_cidade_exterior": "",
    "codigo_natureza_juridica": 3999,
    "data_inicio_atividade": "2013-10-03T03:00:00.000Z",
    "cnae_fiscal": 9430800,
    "cnae_fiscal_descricao": "Atividades de associações de defesa de direitos sociais",
    "descricao_tipo_logradouro": "AVENIDA",
    "logradouro": "PAULISTA 37",
    "numero": "37",
    "complemento": "ANDAR 4",
    "bairro": "BELA VISTA",
    "cep": 1311902,
    "uf": "SP",
    "codigo_municipio": 7107,
    "municipio": "SAO PAULO",
    "ddd_telefone_1": "11  23851939",
    "ddd_telefone_2": "",
    "ddd_fax": "",
    "qualificacao_do_responsavel": 16,
    "capital_social": "0",
    "porte": 5,
    "descricao_porte": "Demais",
    "opcao_pelo_simples": false,
    "data_opcao_pelo_simples": null,
    "data_exclusao_do_simples": null,
    "opcao_pelo_mei": false,
    "situacao_especial": "",
    "data_situacao_especial": null,
    "qsa": [
      {
        "id": 63,
        "cnpj": "19131243000197",
        "identificador_de_socio": 2,
        "nome_socio": "FERNANDA CAMPAGNUCCI PEREIRA",
        "cnpj_cpf_do_socio": "",
        "codigo_qualificacao_socio": 16,
        "percentual_capital_social": 0,
        "data_entrada_sociedade": "2019-10-25T03:00:00.000Z",
        "cpf_representante_legal": "",
        "nome_representante_legal": "",
        "codigo_qualificacao_representante_legal": 0
      }
    ],
    "cnaes_secundarias": [
      {
        "id": 7,
        "cnpj": "19131243000197",
        "codigo": 9493600,
        "descricao": "Atividades de organizações associativas ligadas à cultura e à arte"
      },
      {
        "id": 8,
        "cnpj": "19131243000197",
        "codigo": 9499500,
        "descricao": "Atividades associativas não especificadas anteriormente"
      },
      {
        "id": 9,
        "cnpj": "19131243000197",
        "codigo": 8599699,
        "descricao": "Outras atividades de ensino não especificadas anteriormente"
      },
      {
        "id": 10,
        "cnpj": "19131243000197",
        "codigo": 8230001,
        "descricao": "Serviços de organização de feiras, congressos, exposições e festas"
      },
      {
        "id": 11,
        "cnpj": "19131243000197",
        "codigo": 6204000,
        "descricao": "Consultoria em tecnologia da informação"
      }
    ]
  },
  {
    "id": 5,
    "usuario_id": 2,
    "cnpj": "23552789000199",
    "identificador_matriz_filial": 1,
    "descricao_matriz_filial": "Matriz",
    "razao_social": "ARMARINHO SHALOM LTDA",
    "nome_fantasia": "FARMACIA SHALOM",
    "situacao_cadastral": 8,
    "descricao_situacao_cadastral": "Baixada",
    "data_situacao_cadastral": "1995-03-16T03:00:00.000Z",
    "motivo_situacao_cadastral": 1,
    "nome_cidade_exterior": "",
    "codigo_natureza_juridica": 2062,
    "data_inicio_atividade": "1988-12-29T02:00:00.000Z",
    "cnae_fiscal": 4755501,
    "cnae_fiscal_descricao": "Comércio varejista de tecidos",
    "descricao_tipo_logradouro": "AVENIDA",
    "logradouro": "SARGENTO HERMINIO",
    "numero": "2505",
    "complemento": "LOJA 4",
    "bairro": "MONTE CASTELO",
    "cep": 60350550,
    "uf": "CE",
    "codigo_municipio": 1389,
    "municipio": "FORTALEZA",
    "ddd_telefone_1": "",
    "ddd_telefone_2": "",
    "ddd_fax": "",
    "qualificacao_do_responsavel": 49,
    "capital_social": "0",
    "porte": 5,
    "descricao_porte": "Demais",
    "opcao_pelo_simples": false,
    "data_opcao_pelo_simples": null,
    "data_exclusao_do_simples": null,
    "opcao_pelo_mei": false,
    "situacao_especial": "",
    "data_situacao_especial": null,
    "qsa": [],
    "cnaes_secundarias": []
  }
]
```

### `GET` `/minhasEmpresas`

Essa é a rota que será chamada quando o usuario logado quiser listar todas as empresas cadastradas por ele. 

Ela irá:

- Listar todas as empresas cadastradas que o usuário logado tenha cadastrado;
- Devolver em formato de array todas as empresas cadastradas e seus respectivos dados.

Exemplo de resposta da API:

```
[
  {
    "id": 4,
    "usuario_id": 2,
    "cnpj": "13028145000142",
    "identificador_matriz_filial": 1,
    "descricao_matriz_filial": "Matriz",
    "razao_social": "LOC- RH- SOLUCOES EM RECURSOS HUMANOS E SERVICOS LTDA",
    "nome_fantasia": "LOC RH RECURSOS HUMANOS",
    "situacao_cadastral": 2,
    "descricao_situacao_cadastral": "Ativa",
    "data_situacao_cadastral": "2010-12-16T03:00:00.000Z",
    "motivo_situacao_cadastral": 0,
    "nome_cidade_exterior": "",
    "codigo_natureza_juridica": 2062,
    "data_inicio_atividade": "2010-12-16T03:00:00.000Z",
    "cnae_fiscal": 7810800,
    "cnae_fiscal_descricao": "Seleção e agenciamento de mão de obra",
    "descricao_tipo_logradouro": "RUA",
    "logradouro": "CORONEL ALMERINDO REHEM",
    "numero": "126",
    "complemento": "EDF EMPRESARIAL           COSTA ANDRADE SALA        210",
    "bairro": "CAMINHO DAS ARVORES",
    "cep": 41820768,
    "uf": "BA",
    "codigo_municipio": 3849,
    "municipio": "SALVADOR",
    "ddd_telefone_1": "71  30111075",
    "ddd_telefone_2": "",
    "ddd_fax": "71  33216500",
    "qualificacao_do_responsavel": 49,
    "capital_social": "1000000",
    "porte": 3,
    "descricao_porte": "Empresa de pequeno porte",
    "opcao_pelo_simples": false,
    "data_opcao_pelo_simples": null,
    "data_exclusao_do_simples": null,
    "opcao_pelo_mei": false,
    "situacao_especial": "",
    "data_situacao_especial": null,
    "qsa": [
      {
        "id": 64,
        "cnpj": "13028145000142",
        "identificador_de_socio": 2,
        "nome_socio": "ANTONIO CARLOS PACHECO DE OLIVEIRA",
        "cnpj_cpf_do_socio": "",
        "codigo_qualificacao_socio": 49,
        "percentual_capital_social": 0,
        "data_entrada_sociedade": "2016-09-02T03:00:00.000Z",
        "cpf_representante_legal": "",
        "nome_representante_legal": "",
        "codigo_qualificacao_representante_legal": 0
      },
      {
        "id": 65,
        "cnpj": "13028145000142",
        "identificador_de_socio": 2,
        "nome_socio": "JONAS CARNEIRO VIDAL",
        "cnpj_cpf_do_socio": "",
        "codigo_qualificacao_socio": 22,
        "percentual_capital_social": 0,
        "data_entrada_sociedade": "2016-09-02T03:00:00.000Z",
        "cpf_representante_legal": "",
        "nome_representante_legal": "",
        "codigo_qualificacao_representante_legal": 0
      }
    ],
    "cnaes_secundarias": [
      {
        "id": 12,
        "cnpj": "13028145000142",
        "codigo": 4321500,
        "descricao": "Instalação e manutenção elétrica"
      },
      {
        "id": 13,
        "cnpj": "13028145000142",
        "codigo": 4330404,
        "descricao": "Serviços de pintura de edifícios em geral"
      },
      {
        "id": 14,
        "cnpj": "13028145000142",
        "codigo": 7020400,
        "descricao": "Atividades de consultoria em gestão empresarial, exceto consultoria técnica específica"
      },
      {
        "id": 15,
        "cnpj": "13028145000142",
        "codigo": 7490199,
        "descricao": "Outras atividades profissionais, científicas e técnicas não especificadas anteriormente"
      },
      {
        "id": 16,
        "cnpj": "13028145000142",
        "codigo": 7820500,
        "descricao": "Locação de mão de obra temporária"
      },
      {
        "id": 17,
        "cnpj": "13028145000142",
        "codigo": 7830200,
        "descricao": "Fornecimento e gestão de recursos humanos para terceiros"
      },
      {
        "id": 18,
        "cnpj": "13028145000142",
        "codigo": 8111700,
        "descricao": "Serviços combinados para apoio a edifícios, exceto condomínios prediais"
      },
      {
        "id": 19,
        "cnpj": "13028145000142",
        "codigo": 8121400,
        "descricao": "Limpeza em prédios e em domicílios"
      },
      {
        "id": 20,
        "cnpj": "13028145000142",
        "codigo": 8130300,
        "descricao": "Atividades paisagísticas"
      },
      {
        "id": 21,
        "cnpj": "13028145000142",
        "codigo": 8230001,
        "descricao": "Serviços de organização de feiras, congressos, exposições e festas"
      },
      {
        "id": 22,
        "cnpj": "13028145000142",
        "codigo": 9001999,
        "descricao": "Artes cênicas, espetáculos e atividades complementares não especificados anteriormente"
      }
    ]
  },
  {
    "id": 5,
    "usuario_id": 2,
    "cnpj": "23552789000199",
    "identificador_matriz_filial": 1,
    "descricao_matriz_filial": "Matriz",
    "razao_social": "ARMARINHO SHALOM LTDA",
    "nome_fantasia": "FARMACIA SHALOM",
    "situacao_cadastral": 8,
    "descricao_situacao_cadastral": "Baixada",
    "data_situacao_cadastral": "1995-03-16T03:00:00.000Z",
    "motivo_situacao_cadastral": 1,
    "nome_cidade_exterior": "",
    "codigo_natureza_juridica": 2062,
    "data_inicio_atividade": "1988-12-29T02:00:00.000Z",
    "cnae_fiscal": 4755501,
    "cnae_fiscal_descricao": "Comércio varejista de tecidos",
    "descricao_tipo_logradouro": "AVENIDA",
    "logradouro": "SARGENTO HERMINIO",
    "numero": "2505",
    "complemento": "LOJA 4",
    "bairro": "MONTE CASTELO",
    "cep": 60350550,
    "uf": "CE",
    "codigo_municipio": 1389,
    "municipio": "FORTALEZA",
    "ddd_telefone_1": "",
    "ddd_telefone_2": "",
    "ddd_fax": "",
    "qualificacao_do_responsavel": 49,
    "capital_social": "0",
    "porte": 5,
    "descricao_porte": "Demais",
    "opcao_pelo_simples": false,
    "data_opcao_pelo_simples": null,
    "data_exclusao_do_simples": null,
    "opcao_pelo_mei": false,
    "situacao_especial": "",
    "data_situacao_especial": null,
    "qsa": [],
    "cnaes_secundarias": []
  }
]
```

### `GET` `/minhasEmpresas/:id`

Essa é a rota que será chamada quando o usuario logado quiser obter uma das suas empresas cadastradas

Ela deverá:

- Buscar a empresa no banco de dados pelo id informado na rota
- Validar se a empresa existe e se pertence ao usuário logado
- Retornar um objeto com as informações da empresa

Exemplo de resposta da API

```
{
  "id": 3,
  "usuario_id": 1,
  "cnpj": "19131243000197",
  "identificador_matriz_filial": 1,
  "descricao_matriz_filial": "Matriz",
  "razao_social": "OPEN KNOWLEDGE BRASIL",
  "nome_fantasia": "REDE PELO CONHECIMENTO LIVRE",
  "situacao_cadastral": 2,
  "descricao_situacao_cadastral": "Ativa",
  "data_situacao_cadastral": "2013-10-03T03:00:00.000Z",
  "motivo_situacao_cadastral": 0,
  "nome_cidade_exterior": "",
  "codigo_natureza_juridica": 3999,
  "data_inicio_atividade": "2013-10-03T03:00:00.000Z",
  "cnae_fiscal": 9430800,
  "cnae_fiscal_descricao": "Atividades de associações de defesa de direitos sociais",
  "descricao_tipo_logradouro": "AVENIDA",
  "logradouro": "PAULISTA 37",
  "numero": "37",
  "complemento": "ANDAR 4",
  "bairro": "BELA VISTA",
  "cep": 1311902,
  "uf": "SP",
  "codigo_municipio": 7107,
  "municipio": "SAO PAULO",
  "ddd_telefone_1": "11  23851939",
  "ddd_telefone_2": "",
  "ddd_fax": "",
  "qualificacao_do_responsavel": 16,
  "capital_social": "0",
  "porte": 5,
  "descricao_porte": "Demais",
  "opcao_pelo_simples": false,
  "data_opcao_pelo_simples": null,
  "data_exclusao_do_simples": null,
  "opcao_pelo_mei": false,
  "situacao_especial": "",
  "data_situacao_especial": null,
  "qsa": [
    {
      "id": 63,
      "cnpj": "19131243000197",
      "identificador_de_socio": 2,
      "nome_socio": "FERNANDA CAMPAGNUCCI PEREIRA",
      "cnpj_cpf_do_socio": "",
      "codigo_qualificacao_socio": 16,
      "percentual_capital_social": 0,
      "data_entrada_sociedade": "2019-10-25T03:00:00.000Z",
      "cpf_representante_legal": "",
      "nome_representante_legal": "",
      "codigo_qualificacao_representante_legal": 0
    }
  ],
  "cnaes_secundarias": [
    {
      "id": 7,
      "cnpj": "19131243000197",
      "codigo": 9493600,
      "descricao": "Atividades de organizações associativas ligadas à cultura e à arte"
    },
    {
      "id": 8,
      "cnpj": "19131243000197",
      "codigo": 9499500,
      "descricao": "Atividades associativas não especificadas anteriormente"
    },
    {
      "id": 9,
      "cnpj": "19131243000197",
      "codigo": 8599699,
      "descricao": "Outras atividades de ensino não especificadas anteriormente"
    },
    {
      "id": 10,
      "cnpj": "19131243000197",
      "codigo": 8230001,
      "descricao": "Serviços de organização de feiras, congressos, exposições e festas"
    },
    {
      "id": 11,
      "cnpj": "19131243000197",
      "codigo": 6204000,
      "descricao": "Consultoria em tecnologia da informação"
    }
  ]
}
```

### `PATCH` `/minhasEmpresas/:id`
Essa é a rota que será chamada quando o usuario logado quiser atualizar uma das suas empresas cadastradas

Ela deverá:

- Buscar a empresa no banco de dados pelo id informado na rota.
- Validar se a empresa existe e se pertence ao usuário logado.
- É obrigatórios encaminhar as requisições dentro de 3 (três) objetos (empresa, cnaes, qsa), cada um desses referente a uma tabela específica do Banco de Dados.
- Caso o dado a ser alterado seja nas tabelas qsa ou cnaes_secundarias:
-   É Obrigátorio encaminhar o id da qsa ou cnaes_secundarias, que será alterada.
- Validar se o id da qsa ou cnaes_secundarias existe, se está atrelada a empresa do id informado na rota e se pertence ao usuário logado.
- Atualizar empresa no banco de dados.

Exemplo do body a ser enviado:

```
{
	"empresa": { 
        "identificador_matriz_filial": 3,
        "descricao_matriz_filial": "MATRIZ",
        "razao_social":"ARMARINHO SHALOM LTDA",
        "nome_fantasia": "ARMARINHO SHALOM",
        "situacao_cadastral": 2,
        "data_situacao_especial": "2021-12-12"
	},
	"qsa": {
        "qsa_id": 62,
        "identificador_de_socio": 5,
        "percentual_capital_social": 30
	},
	"cnaes": {
        "cnaes_id": 6,
        "codigo": 333
	}	
}
```

**ATENÇÃO: Caso os dados a serem alterados não contemplem um ou mais dos 3 objetos, a requisição deverá ser encaminhada com o objeto vazio.**

Exemplo do body a ser enviado quando tiver objetos vazios:

```
{
	"empresa": { 
        "descricao_matriz_filial": "Matriz",
        "razao_social":"ARMARINHO SHALOM LTDA",
        "nome_fantasia": "Armarinho Shalon"
	},
	"qsa": {
        
	"cnaes": {
        
	}	
}
```

#### `DELETE` `/excluirEmpresa/:id`

Essa é a rota que será chamada quando o usuario logado quiser excluir uma de suas empresas cadastradas

Essa rota:

- Busca a empresa no banco de dados pelo id informado na rota.
- Valida se a empresa existe e se pertence ao usuário logado;
- Deleta a empresa do banco de dados.

Obs.: A collection do insomnia está anexada a esse repositório. [CLIQUE AQUI](https://github.com/vanilo-ferreira/Desafio-Player2/tree/main/src/collection)

#####  tags: `back-end` `brasilApi` `nodeJS` `PostgreSQL` `RESTFULAPI` `desafio` `player2` `insommnia` `jwt`