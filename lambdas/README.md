criar acesso para funcao executar outra chamadas que tem permisao ao :

https://console.aws.amazon.com/iam/home#/roles
IAM > criar funcao > escolher o caso de uso - Lambda > políticas de permissões
arn:aws:iam::472986803497:role/lambda_wa


criar credencial para o DEPLOY serveless:
IAM > Adicionar usuário > nome do ususario deploy_lambda > Selecione o tipo de acesso à AWS > 
Acesso programático
Acesso ao Console de Gerenciamento da AWS
Definir permissões > AdministratorAccess > criar usuario > copiar
ID da chave de acesso
Chave de acesso secreta


criar credencial no IAM > admin
https://www.youtube.com/watch?v=KngM5bfpttA
https://www.serverless.com/framework/docs/providers/aws/guide/credentials/#create-an-iam-user-and-access-key

serverless config credentials --provider aws --key AAAAA --secret AAAAAAAA --overwrite

criar api gate > cria recurso > cria metodo > ponta para lambda

## :) Comandos

npm -v
npm i -g npm
| instalacao | npm i -g serverless

| deploy | serverless deploy -v
| delete | serverless remove
| test | npm run test
