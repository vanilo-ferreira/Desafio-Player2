CREATE DATABASE desafio_player2;

CREATE TABLE IF NOT EXISTS usuario(
  id SERIAL PRIMARY KEY NOT NULL,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL, 
  senha TEXT NOT NULL
); 

CREATE TABLE IF NOT EXISTS empresa(
  id SERIAL NOT NULL,
  usuario_id INT NOT NULL,
  cnpj varchar(14) PRIMARY KEY NOT NULL,
  identificador_matriz_filial INT,
  descricao_matriz_filial TEXT,
  razao_social TEXT,
  nome_fantasia TEXT,
  situacao_cadastral INT,
  descricao_situacao_cadastral TEXT,
  data_situacao_cadastral DATE,
  motivo_situacao_cadastral INT,
  nome_cidade_exterior TEXT,
  codigo_natureza_juridica INT,
  data_inicio_atividade DATE,
  cnae_fiscal INT ,
  cnae_fiscal_descricao TEXT,
  descricao_tipo_logradouro TEXT,
  logradouro TEXT,
  numero TEXT,
  complemento TEXT,
  bairro TEXT,
  cep INT,
  uf VARCHAR(2),
  codigo_municipio INT,
  municipio TEXT,
  ddd_telefone_1 TEXT,
  ddd_telefone_2 TEXT,
  ddd_fax TEXT,
  qualificacao_do_responsavel INT,
  capital_social BIGINT,
  porte INT,
  descricao_porte TEXT,
  opcao_pelo_simples BOOLEAN,
  data_opcao_pelo_simples DATE,
  data_exclusao_do_simples DATE,
  opcao_pelo_mei BOOLEAN,
  situacao_especial TEXT,
  data_situacao_especial DATE,
  FOREIGN KEY (usuario_id) REFERENCES usuario (id)
);

 CREATE TABLE IF NOT EXISTS qsa(
   id SERIAL PRIMARY KEY NOT NULL,
   cnpj varchar(14) NOT NULL,
   identificador_de_socio INT,
   nome_socio TEXT,
   cnpj_cpf_do_socio varchar(14) NOT NULL,
   codigo_qualificacao_socio INT,
   percentual_capital_social INT,
   data_entrada_sociedade DATE,
   cpf_representante_legal VARCHAR (11),
   nome_representante_legal TEXT,
   codigo_qualificacao_representante_legal INT,
   FOREIGN KEY (cnpj) REFERENCES empresa (cnpj)
);

CREATE TABLE IF NOT EXISTS cnaes_secundarias(
  id SERIAL PRIMARY KEY NOT NULL,
  cnpj varchar(14) NOT NULL,
  codigo INT,
  descricao TEXT,
  FOREIGN KEY (cnpj) REFERENCES empresa (cnpj)
);
