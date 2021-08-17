const knex = require('../../conexao');
const axios = require('axios');

const cadastrarEmpresa = async (req, res) => {
    const { id } = req.usuario;
    const { cnpj } = req.body;

    try {
        //brasilApiResposta 
        const companyEnrichmentResponse = await axios.get(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
        
        const empresaCadastrada = await knex('empresa').where({ cnpj }).first();

        if (empresaCadastrada) {
            return res.status(400).json("O CNPJ já possui cadastro em nosso sistema");
        }

        const cadastrandoEmpresa = await knex('empresa')
            .insert({
                usuario_id: id,
                cnpj: companyEnrichmentResponse.data.cnpj,
                identificador_matriz_filial: companyEnrichmentResponse.data.identificador_matriz_filial,
                descricao_matriz_filial: companyEnrichmentResponse.data.descricao_matriz_filial,
                razao_social: companyEnrichmentResponse.data.razao_social,
                nome_fantasia: companyEnrichmentResponse.data.nome_fantasia,
                situacao_cadastral: companyEnrichmentResponse.data.situacao_cadastral,
                descricao_situacao_cadastral: companyEnrichmentResponse.data.descricao_situacao_cadastral,
                data_situacao_cadastral: companyEnrichmentResponse.data.data_situacao_cadastral,
                motivo_situacao_cadastral: companyEnrichmentResponse.data.motivo_situacao_cadastral,
                nome_cidade_exterior: companyEnrichmentResponse.data.nome_cidade_exterior,
                codigo_natureza_juridica: companyEnrichmentResponse.data.codigo_natureza_juridica,
                data_inicio_atividade: companyEnrichmentResponse.data.data_inicio_atividade,
                cnae_fiscal: companyEnrichmentResponse.data.cnae_fiscal,
                cnae_fiscal_descricao: companyEnrichmentResponse.data.cnae_fiscal_descricao,
                descricao_tipo_logradouro: companyEnrichmentResponse.data.descricao_tipo_logradouro,
                logradouro: companyEnrichmentResponse.data.logradouro,
                numero: companyEnrichmentResponse.data.numero,
                complemento: companyEnrichmentResponse.data.complemento,
                bairro: companyEnrichmentResponse.data.bairro,
                cep: companyEnrichmentResponse.data.cep,
                uf: companyEnrichmentResponse.data.uf,
                codigo_municipio: companyEnrichmentResponse.data.codigo_municipio,
                municipio: companyEnrichmentResponse.data.municipio,
                ddd_telefone_1: companyEnrichmentResponse.data.ddd_telefone_1,
                ddd_telefone_2: companyEnrichmentResponse.data.ddd_telefone_2,
                ddd_fax: companyEnrichmentResponse.data.ddd_fax,
                qualificacao_do_responsavel: companyEnrichmentResponse.data.qualificacao_do_responsavel,
                capital_social: companyEnrichmentResponse.data.capital_social,
                porte: companyEnrichmentResponse.data.porte,
                descricao_porte: companyEnrichmentResponse.data.descricao_porte,
                opcao_pelo_simples: companyEnrichmentResponse.data.opcao_pelo_simples,
                data_opcao_pelo_simples: companyEnrichmentResponse.data.data_opcao_pelo_simples,
                data_exclusao_do_simples: companyEnrichmentResponse.data.data_exclusao_do_simples,
                opcao_pelo_mei: companyEnrichmentResponse.data.opcao_pelo_mei,
                situacao_especial: companyEnrichmentResponse.data.situacao_especial,
                data_situacao_especial: companyEnrichmentResponse.data.data_situacao_especial
            }).returning('*');;


        if (companyEnrichmentResponse.data.cnaes_secundarias) {
            for (const company of companyEnrichmentResponse.data.cnaes_secundarias) {
                company.cnpj = cadastrandoEmpresa[0].cnpj;
            }

            const empresas = await knex('cnaes_secundarias')
                .insert(
                    companyEnrichmentResponse.data.cnaes_secundarias
                );
        }

        if (companyEnrichmentResponse.data.qsa) {
            for (const company of companyEnrichmentResponse.data.qsa) {
                company.cnpj = cadastrandoEmpresa[0].cnpj;
            }

            const qsa = await knex('qsa')
                .insert(
                    companyEnrichmentResponse.data.qsa
                );
        }

        //RETORNAR DADOS DA EMPRESA
        return res.json("Cadastrada");

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    cadastrarEmpresa
}