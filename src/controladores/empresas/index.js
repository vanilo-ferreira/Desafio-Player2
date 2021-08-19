const knex = require('../../conexao');
const axios = require('axios');

const cadastrarEmpresa = async (req, res) => {

    const { id } = req.usuario;
    const { cnpj } = req.body;

    if (!cnpj) {
        return res.status(404).json("O campo cnpj é obrigatório");
    }

    try {

        const respostaBrasilApi = await axios.get(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);

        const empresaCadastrada = await knex('empresa').where({ cnpj }).first();

        if (empresaCadastrada) {
            return res.status(400).json("O CNPJ já possui cadastro em nosso sistema");
        }

        const cadastrandoEmpresa = await knex('empresa')
            .insert({
                usuario_id: id,
                cnpj: respostaBrasilApi.data.cnpj,
                identificador_matriz_filial: respostaBrasilApi.data.identificador_matriz_filial,
                descricao_matriz_filial: respostaBrasilApi.data.descricao_matriz_filial,
                razao_social: respostaBrasilApi.data.razao_social,
                nome_fantasia: respostaBrasilApi.data.nome_fantasia,
                situacao_cadastral: respostaBrasilApi.data.situacao_cadastral,
                descricao_situacao_cadastral: respostaBrasilApi.data.descricao_situacao_cadastral,
                data_situacao_cadastral: respostaBrasilApi.data.data_situacao_cadastral,
                motivo_situacao_cadastral: respostaBrasilApi.data.motivo_situacao_cadastral,
                nome_cidade_exterior: respostaBrasilApi.data.nome_cidade_exterior,
                codigo_natureza_juridica: respostaBrasilApi.data.codigo_natureza_juridica,
                data_inicio_atividade: respostaBrasilApi.data.data_inicio_atividade,
                cnae_fiscal: respostaBrasilApi.data.cnae_fiscal,
                cnae_fiscal_descricao: respostaBrasilApi.data.cnae_fiscal_descricao,
                descricao_tipo_logradouro: respostaBrasilApi.data.descricao_tipo_logradouro,
                logradouro: respostaBrasilApi.data.logradouro,
                numero: respostaBrasilApi.data.numero,
                complemento: respostaBrasilApi.data.complemento,
                bairro: respostaBrasilApi.data.bairro,
                cep: respostaBrasilApi.data.cep,
                uf: respostaBrasilApi.data.uf,
                codigo_municipio: respostaBrasilApi.data.codigo_municipio,
                municipio: respostaBrasilApi.data.municipio,
                ddd_telefone_1: respostaBrasilApi.data.ddd_telefone_1,
                ddd_telefone_2: respostaBrasilApi.data.ddd_telefone_2,
                ddd_fax: respostaBrasilApi.data.ddd_fax,
                qualificacao_do_responsavel: respostaBrasilApi.data.qualificacao_do_responsavel,
                capital_social: respostaBrasilApi.data.capital_social,
                porte: respostaBrasilApi.data.porte,
                descricao_porte: respostaBrasilApi.data.descricao_porte,
                opcao_pelo_simples: respostaBrasilApi.data.opcao_pelo_simples,
                data_opcao_pelo_simples: respostaBrasilApi.data.data_opcao_pelo_simples,
                data_exclusao_do_simples: respostaBrasilApi.data.data_exclusao_do_simples,
                opcao_pelo_mei: respostaBrasilApi.data.opcao_pelo_mei,
                situacao_especial: respostaBrasilApi.data.situacao_especial,
                data_situacao_especial: respostaBrasilApi.data.data_situacao_especial
            }).returning('*');;


        if (respostaBrasilApi.data.cnaes_secundarias) {
            for (const company of respostaBrasilApi.data.cnaes_secundarias) {
                company.cnpj = cadastrandoEmpresa[0].cnpj;
            }

            const empresas = await knex('cnaes_secundarias')
                .insert(
                    respostaBrasilApi.data.cnaes_secundarias
                );
        }

        if (respostaBrasilApi.data.qsa) {
            for (const company of respostaBrasilApi.data.qsa) {
                company.cnpj = cadastrandoEmpresa[0].cnpj;
            }

            const qsa = await knex('qsa')
                .insert(
                    respostaBrasilApi.data.qsa
                );
        }

        return res.json("A empresa foi cadastrada com sucesso!");

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const listarTodasEmpresas = async (req, res) => {

    const { offset } = req.query;
    const listaDeEmpresas = offset ? offset : 0;

    try {

        const empresas = await knex('empresa')
            .select('*')
            .limit(10)
            .offset(listaDeEmpresas);

        if (!empresas) {
            return res.status(404).json('Empresas não encontradas');
        }

        for (empresa of empresas) {

            const qsa = await knex('qsa')
                .where({ cnpj: empresa.cnpj })
                .select("*");
            empresa.qsa = qsa;

            const cnaesSecundarias = await knex('cnaes_secundarias')
                .where({ cnpj: empresa.cnpj })
                .select("*");
            empresa.cnaes_secundarias = cnaesSecundarias;
        }
        return res.status(200).json(empresas);

    } catch (error) {
        return res.status(400).json(error.message);
    }

}

const obterMinhasEmpresas = async (req, res) => {

    const { id } = req.usuario;
    const { offset } = req.query;
    const listaDeEmpresas = offset ? offset : 0;

    try {

        const empresas = await knex('empresa')
            .select('*')
            .where({ usuario_id: id })
            .limit(10)
            .offset(listaDeEmpresas);

        if (!empresas) {
            return res.status(404).json('Empresas não encontradas');
        }

        for (empresa of empresas) {

            const qsa = await knex('qsa')
                .where({ cnpj: empresa.cnpj })
                .select("*");
            empresa.qsa = qsa;

            const cnaesSecundarias = await knex('cnaes_secundarias')
                .where({ cnpj: empresa.cnpj })
                .select("*");
            empresa.cnaes_secundarias = cnaesSecundarias;
        }
        return res.status(200).json(empresas);

    } catch (error) {
        return res.status(400).json(error.message);
    }

}

const obterUmaEmpresa = async (req, res) => {

    const { id } = req.params;
    const { usuario } = req;

    try {

        const empresaEncontrada = await knex('empresa')
            .select('*')
            .where({ id, usuario_id: usuario.id })
            .first();

        if (!empresaEncontrada) {
            return res.status(404).json('Empresa não encontrada!');
        }


            const qsa = await knex('qsa')
                .where({ cnpj: empresaEncontrada.cnpj })
                .select("*");
            empresaEncontrada.qsa = qsa;

            const cnaesSecundarias = await knex('cnaes_secundarias')
                .where({ cnpj: empresaEncontrada.cnpj })
                .select("*");
            empresaEncontrada.cnaes_secundarias = cnaesSecundarias;

        return res.status(200).json(empresaEncontrada);

    } catch (error) {
        return res.status(400).json(error.message);
    }

}

const atualizarEmpresa = async (req, res) => {

    const { usuario } = req;
    const { id } = req.params;
    const {
        identificador_matriz_filial,
        descricao_matriz_filial,
        razao_social,
        nome_fantasia,
        situacao_cadastral,
        descricao_situacao_cadastral,
        data_situacao_cadastral,
        motivo_situacao_cadastral,
        nome_cidade_exterior,
        codigo_natureza_juridica,
        data_inicio_atividade,
        cnae_fiscal,
        cnae_fiscal_descricao,
        descricao_tipo_logradouro,
        logradouro,
        numero,
        complemento,
        bairro,
        cep,
        uf,
        codigo_municipio,
        municipio,
        ddd_telefone_1,
        ddd_telefone_2,
        ddd_fax,
        qualificacao_do_responsavel,
        capital_social,
        porte,
        descricao_porte,
        opcao_pelo_simples,
        data_opcao_pelo_simples,
        data_exclusao_do_simples,
        opcao_pelo_mei,
        situacao_especial,
        data_situacao_especial } = req.body.empresa;
    const {
        qsa_id,
        identificador_de_socio,
        nome_socio,
        cnpj_cpf_do_socio,
        codigo_qualificacao_socio,
        percentual_capital_social,
        data_entrada_sociedade,
        cpf_representante_legal,
        nome_representante_legal,
        codigo_qualificacao_representante_legal } = req.body.qsa;
    const { cnaes_id, codigo, descricao } = req.body.cnaes;

    try {

        const empresaEncontrada = await knex('empresa')
            .where({ id, usuario_id: usuario.id })
            .first();

        if (!empresaEncontrada) {
            return res.status(404).json('Empresa não encontrada!');
        }

        if (Object.values(req.body.empresa).length !== 0) {
            const atualizandoEmpresa = await knex('empresa')
                .where({ id })
                .update({
                    identificador_matriz_filial,
                    descricao_matriz_filial,
                    razao_social,
                    nome_fantasia,
                    situacao_cadastral,
                    descricao_situacao_cadastral,
                    data_situacao_cadastral,
                    motivo_situacao_cadastral,
                    nome_cidade_exterior,
                    codigo_natureza_juridica,
                    data_inicio_atividade,
                    cnae_fiscal,
                    cnae_fiscal_descricao,
                    descricao_tipo_logradouro,
                    logradouro,
                    numero,
                    complemento,
                    bairro,
                    cep,
                    uf,
                    codigo_municipio,
                    municipio,
                    ddd_telefone_1,
                    ddd_telefone_2,
                    ddd_fax,
                    qualificacao_do_responsavel,
                    capital_social,
                    porte,
                    descricao_porte,
                    opcao_pelo_simples,
                    data_opcao_pelo_simples,
                    data_exclusao_do_simples,
                    opcao_pelo_mei,
                    situacao_especial,
                    data_situacao_especial
                });

            if (!atualizandoEmpresa) {
                return res.status(400).json("Os dados da empresa não foram atualizados");
            }
        }

        if (Object.values(req.body.qsa).length !== 0) {
            if (qsa_id) {
                const qsaEncontrada = await knex('qsa')
                    .where({ id: qsa_id })
                    .first();

                if (!qsaEncontrada.cnpj || qsaEncontrada.cnpj !== empresaEncontrada.cnpj) {
                    return res.status(404).json('A qsa não foi encontrada ou não está registrada atrelada a sua empresa!');
                }

                const qsaAtualizada = await knex('qsa')
                    .where({ id: qsaEncontrada.id })
                    .update({
                        identificador_de_socio,
                        nome_socio,
                        cnpj_cpf_do_socio,
                        codigo_qualificacao_socio,
                        percentual_capital_social,
                        data_entrada_sociedade,
                        cpf_representante_legal,
                        nome_representante_legal,
                        codigo_qualificacao_representante_legal
                    });
            } else {
                return res.status(404).json('Se deseja alterar a qsa de uma empresa. O id da qsa que deseja alterar é obrigatório!');
            }
        }

        if (Object.values(req.body.cnaes).length !== 0) {
            if (cnaes_id) {
                const cnaesEncontrada = await knex('cnaes_secundarias')
                    .where({ id: cnaes_id })
                    .first();


                if (!cnaesEncontrada || cnaesEncontrada.cnpj !== empresaEncontrada.cnpj) {
                    return res.status(404).json('A cnaes é inexistente ou não está atrelada a sua empresa!');
                }

                const cnaesAtualizada = await knex('cnaes_secundarias')
                    .where({ id: cnaesEncontrada.id })
                    .update({
                        codigo,
                        descricao
                    });
            } else {
                return res.status(404).json('Se deseja alterar alguma cnaes secundária de uma empresa. O id da cnaes secundária que deseja alterar é obrigatório!');
            }
        }

        return res.status(200).json('Empresa atualizada com sucesso');

    } catch (error) {
        return res.status(400).json(error.message);
    }

}

const excluirEmpresa = async (req, res) => {

    const { usuario } = req;
    const { id } = req.params;

    try {

        const empresaEncontrada = await knex('empresa')
            .where({ id, usuario_id: usuario.id })
            .first();

        if (!empresaEncontrada) {
            return res.status(404).json('Empresa não encontrada');
        }

        const qsaExcluida = await knex('qsa')
            .where({ cnpj: empresaEncontrada.cnpj })
            .del();

        const cnaesExcluida = await knex('cnaes_secundarias')
            .where({ cnpj: empresaEncontrada.cnpj })
            .del();

        const empresaExcluida = await knex('empresa').where({
            id,
            usuario_id: usuario.id
        }).del();

        if (!empresaExcluida) {
            return res.status(400).json("A empresa não foi excluída");
        }

        return res.status(200).json('Empresa excluida com sucesso');

    } catch (error) {
        return res.status(400).json(error.message);
    }

}

module.exports = {
    cadastrarEmpresa,
    listarTodasEmpresas,
    obterMinhasEmpresas,
    obterUmaEmpresa,
    atualizarEmpresa,
    excluirEmpresa
}