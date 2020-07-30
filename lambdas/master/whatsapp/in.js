exports.extract = async (req) => {

    console.log("WWWWWWWWWWWWWWWWWWWWWWWWWWWWW ", JSON.stringify(req))

    let objUser = {
        serverId: req.to,
        userId: req.from,
        dataHora: new Date().toLocaleString('en-us', {
            timeZone: 'America/Sao_Paulo'
        }),
        context: {
            telefone: req.from,
            type: req.type
        }
    };
    if (req.type == "chat") {
        let tamanho_texto = req.body.length
        if (tamanho_texto > 2048) {
            objUser.context.texto_grande = tamanho_texto;
        } else {
            objUser.message = req.body;
        }
    } else {
        objUser.context.body = req.body;
    }
    //devolve o objeto formatado
    return objUser
}