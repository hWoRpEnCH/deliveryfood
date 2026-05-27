# Deploy na Azure - passo a passo iniciante

Este projeto tem 3 partes:

- Banco MongoDB
- Backend NestJS
- Frontend Next.js

O jeito mais simples e previsivel para subir agora e usar Docker + Azure Container Registry + Azure Web App for Containers.

## Visao geral

Voce vai criar:

1. Um banco MongoDB na nuvem.
2. Um Container Registry para guardar as imagens Docker.
3. Um App Service para o backend.
4. Um App Service para o frontend.

No fim voce tera duas URLs:

```text
https://delivery-food-api.azurewebsites.net
https://delivery-food-web.azurewebsites.net
```

Os nomes acima sao exemplos. Troque por nomes unicos, porque Azure exige nomes globais.

## Antes de comecar

Instale:

- Docker Desktop
- Azure CLI
- Node.js 20+

Este guia usa comandos em Bash. No Windows, abra o Git Bash ou o terminal Bash do VS Code. Se usar PowerShell, as quebras de linha com `\` nao funcionam do mesmo jeito.

Depois faca login:

```bash
az login
```

Entre na pasta do projeto:

```bash
cd delivery-food
```

## 1. Escolha os nomes

Use nomes simples, sem acento e sem espaco:

```bash
RG=rg-delivery-food
LOCATION=brazilsouth
ACR=deliveryfoodacr123
PLAN=plan-delivery-food
BACKEND_APP=delivery-food-api-123
FRONTEND_APP=delivery-food-web-123
```

Importante: `ACR`, `BACKEND_APP` e `FRONTEND_APP` precisam ser unicos na Azure. Se der erro de nome indisponivel, troque o numero.

## 2. Crie o grupo de recursos

```bash
az group create --name $RG --location $LOCATION
```

## 3. Crie o MongoDB

Opcao mais simples: use MongoDB Atlas.

1. Crie uma conta em https://www.mongodb.com/atlas
2. Crie um cluster free/shared.
3. Crie um usuario e senha do banco.
4. Libere acesso de rede para Azure. Para testar rapido, voce pode liberar `0.0.0.0/0`.
5. Copie a connection string.

Ela vai parecer com:

```text
mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/DeliveryFood?retryWrites=true&w=majority
```

Guarde essa string. Ela sera o `MONGODB_URI`.

Tambem da para usar Azure Cosmos DB for MongoDB, mas Atlas costuma ser mais direto para primeiro deploy.

## 4. Crie o Azure Container Registry

Se sua assinatura for nova, registre primeiro o provedor do Container Registry:

```bash
az provider register --namespace Microsoft.ContainerRegistry --wait
```

Confira se ficou registrado:

```bash
az provider show --namespace Microsoft.ContainerRegistry --query registrationState -o tsv
```

O retorno esperado e:

```text
Registered
```

Depois crie o registry:

```bash
az acr create \
  --resource-group $RG \
  --name $ACR \
  --sku Basic \
  --admin-enabled true
```

Faca login no registry:

```bash
az acr login --name $ACR
```

Pegue o servidor do registry:

```bash
ACR_LOGIN_SERVER=$(az acr show --name $ACR --query loginServer -o tsv)
```

## 5. Build e push do backend

```bash
docker build -t $ACR_LOGIN_SERVER/delivery-food-backend:latest ./backend
docker push $ACR_LOGIN_SERVER/delivery-food-backend:latest
```

## 6. Crie o App Service do backend

Crie o plano Linux:

```bash
az appservice plan create \
  --name $PLAN \
  --resource-group $RG \
  --is-linux \
  --sku B1
```

Se aparecer erro de quota em `Brazil South`, voce tem 3 caminhos:

1. Usar um App Service Plan Linux que ja exista.
2. Criar em outra regiao, como `eastus` ou `westus2`.
3. Pedir aumento de quota na Azure.

Para ver se ja existe algum plano:

```bash
az appservice plan list --query "[].{name:name, resourceGroup:resourceGroup, location:location, sku:sku.name, reserved:reserved}" -o table
```

Se aparecer um plano Linux, ou seja, `reserved` como `true`, reutilize ele:

```bash
PLAN=<nome-do-plano-linux-existente>
```

Se preferir criar em outra regiao, mude a variavel e rode novamente:

```bash
LOCATION=eastus

az appservice plan create \
  --name $PLAN \
  --resource-group $RG \
  --is-linux \
  --sku B1 \
  --location $LOCATION
```

Se aparecer `No available instances to satisfy this request`, a propria Azure esta sem capacidade imediata para esse App Service Plan naquela combinacao. O caminho mais rapido costuma ser criar um resource group novo em outra regiao:

```bash
RG=rg-delivery-food-eastus
LOCATION=eastus

az group create --name $RG --location $LOCATION

az appservice plan create \
  --name $PLAN \
  --resource-group $RG \
  --is-linux \
  --sku B1 \
  --location $LOCATION
```

Se ainda falhar, tente `westus2`, `centralus` ou `eastus2`.

Alternativa: tentar async scaling:

```bash
az appservice plan create \
  --name $PLAN \
  --resource-group $RG \
  --is-linux \
  --sku B1 \
  --location $LOCATION \
  --async-scaling-enabled true
```

Crie o backend:

```bash
az webapp create \
  --resource-group $RG \
  --plan $PLAN \
  --name $BACKEND_APP \
  --deployment-container-image-name $ACR_LOGIN_SERVER/delivery-food-backend:latest
```

Conecte o App Service ao registry:

```bash
ACR_USERNAME=$(az acr credential show --name $ACR --query username -o tsv)
ACR_PASSWORD=$(az acr credential show --name $ACR --query passwords[0].value -o tsv)

az webapp config container set \
  --name $BACKEND_APP \
  --resource-group $RG \
  --docker-custom-image-name $ACR_LOGIN_SERVER/delivery-food-backend:latest \
  --docker-registry-server-url https://$ACR_LOGIN_SERVER \
  --docker-registry-server-user $ACR_USERNAME \
  --docker-registry-server-password $ACR_PASSWORD
```

Configure as variaveis do backend:

```bash
az webapp config appsettings set \
  --resource-group $RG \
  --name $BACKEND_APP \
  --settings \
  NODE_ENV=production \
  PORT=3001 \
  WEBSITES_PORT=3001 \
  MONGODB_URI="<cole-aqui-sua-string-do-mongodb>" \
  CORS_ORIGIN="https://$FRONTEND_APP.azurewebsites.net"
```

Reinicie:

```bash
az webapp restart --resource-group $RG --name $BACKEND_APP
```

Teste:

```text
https://delivery-food-api-123.azurewebsites.net/health
```

Se aparecer:

```json
{"status":"ok"}
```

o backend esta vivo.

## 7. Build e push do frontend

Agora que voce ja sabe a URL do backend, faca o build do frontend apontando para ela:

```bash
BACKEND_URL=https://$BACKEND_APP.azurewebsites.net

docker build \
  -t $ACR_LOGIN_SERVER/delivery-food-frontend:latest \
  --build-arg NEXT_PUBLIC_API_URL=$BACKEND_URL \
  ./frontend

docker push $ACR_LOGIN_SERVER/delivery-food-frontend:latest
```

## 8. Crie o App Service do frontend

```bash
az webapp create \
  --resource-group $RG \
  --plan $PLAN \
  --name $FRONTEND_APP \
  --deployment-container-image-name $ACR_LOGIN_SERVER/delivery-food-frontend:latest
```

Conecte ao registry:

```bash
az webapp config container set \
  --name $FRONTEND_APP \
  --resource-group $RG \
  --docker-custom-image-name $ACR_LOGIN_SERVER/delivery-food-frontend:latest \
  --docker-registry-server-url https://$ACR_LOGIN_SERVER \
  --docker-registry-server-user $ACR_USERNAME \
  --docker-registry-server-password $ACR_PASSWORD
```

Configure a porta:

```bash
az webapp config appsettings set \
  --resource-group $RG \
  --name $FRONTEND_APP \
  --settings \
  NODE_ENV=production \
  PORT=3000 \
  WEBSITES_PORT=3000
```

Reinicie:

```bash
az webapp restart --resource-group $RG --name $FRONTEND_APP
```

Abra:

```text
https://delivery-food-web-123.azurewebsites.net
```

## 9. Se der erro de CORS

Confirme se o backend tem exatamente a URL do frontend:

```bash
az webapp config appsettings set \
  --resource-group $RG \
  --name $BACKEND_APP \
  --settings CORS_ORIGIN="https://$FRONTEND_APP.azurewebsites.net"

az webapp restart --resource-group $RG --name $BACKEND_APP
```

## 10. Para atualizar depois

Quando alterar o backend:

```bash
docker build -t $ACR_LOGIN_SERVER/delivery-food-backend:latest ./backend
docker push $ACR_LOGIN_SERVER/delivery-food-backend:latest
az webapp restart --resource-group $RG --name $BACKEND_APP
```

Quando alterar o frontend:

```bash
docker build \
  -t $ACR_LOGIN_SERVER/delivery-food-frontend:latest \
  --build-arg NEXT_PUBLIC_API_URL=https://$BACKEND_APP.azurewebsites.net \
  ./frontend

docker push $ACR_LOGIN_SERVER/delivery-food-frontend:latest
az webapp restart --resource-group $RG --name $FRONTEND_APP
```

## Checklist final

- `/health` do backend responde `{"status":"ok"}`.
- `MONGODB_URI` esta configurado no backend.
- `CORS_ORIGIN` do backend aponta para a URL do frontend.
- Frontend foi buildado com `NEXT_PUBLIC_API_URL` apontando para o backend.
- `WEBSITES_PORT` do backend e `3001`.
- `WEBSITES_PORT` do frontend e `3000`.

## Referencias oficiais

- App settings no Azure App Service: https://learn.microsoft.com/en-us/azure/app-service/configure-common
- Variaveis de ambiente no App Service: https://learn.microsoft.com/en-us/azure/app-service/reference-app-settings
- Cosmos DB for MongoDB connection string: https://learn.microsoft.com/en-us/azure/cosmos-db/mongodb/connect-account

## Plano B: Azure Container Apps

Use este caminho se o App Service Plan continuar falhando com:

```text
No available instances to satisfy this request
```

Container Apps nao precisa criar App Service Plan.

Registre os provedores:

```bash
az provider register --namespace Microsoft.App --wait
az provider register --namespace Microsoft.OperationalInsights --wait
```

Crie um resource group para os Container Apps:

```bash
ACA_RG=rg-delivery-food-aca
ACA_LOCATION=eastus
ACA_ENV=delivery-food-env

az group create --name $ACA_RG --location $ACA_LOCATION
```

Crie o ambiente:

```bash
az containerapp env create \
  --name $ACA_ENV \
  --resource-group $ACA_RG \
  --location $ACA_LOCATION
```

Pegue os dados do registry:

```bash
ACR_LOGIN_SERVER=$(az acr show --name $ACR --query loginServer -o tsv)
ACR_USERNAME=$(az acr credential show --name $ACR --query username -o tsv)
ACR_PASSWORD=$(az acr credential show --name $ACR --query passwords[0].value -o tsv)
```

Se ainda nao fez build/push do backend:

```bash
docker build -t $ACR_LOGIN_SERVER/delivery-food-backend:latest ./backend
docker push $ACR_LOGIN_SERVER/delivery-food-backend:latest
```

Crie o backend:

```bash
az containerapp create \
  --name delivery-food-api \
  --resource-group $ACA_RG \
  --environment $ACA_ENV \
  --image $ACR_LOGIN_SERVER/delivery-food-backend:latest \
  --registry-server $ACR_LOGIN_SERVER \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --target-port 3001 \
  --ingress external \
  --env-vars \
  NODE_ENV=production \
  PORT=3001 \
  MONGODB_URI="<cole-aqui-sua-string-do-mongodb>" \
  CORS_ORIGIN="https://temporario.local"
```

Pegue a URL do backend:

```bash
BACKEND_FQDN=$(az containerapp show \
  --name delivery-food-api \
  --resource-group $ACA_RG \
  --query properties.configuration.ingress.fqdn \
  -o tsv)

BACKEND_URL=https://$BACKEND_FQDN
echo $BACKEND_URL
```

Teste:

```bash
curl $BACKEND_URL/health
```

Agora faca build/push do frontend apontando para o backend:

```bash
docker build \
  -t $ACR_LOGIN_SERVER/delivery-food-frontend:latest \
  --build-arg NEXT_PUBLIC_API_URL=$BACKEND_URL \
  ./frontend

docker push $ACR_LOGIN_SERVER/delivery-food-frontend:latest
```

Crie o frontend:

```bash
az containerapp create \
  --name delivery-food-web \
  --resource-group $ACA_RG \
  --environment $ACA_ENV \
  --image $ACR_LOGIN_SERVER/delivery-food-frontend:latest \
  --registry-server $ACR_LOGIN_SERVER \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --target-port 3000 \
  --ingress external \
  --env-vars \
  NODE_ENV=production \
  PORT=3000
```

Pegue a URL do frontend:

```bash
FRONTEND_FQDN=$(az containerapp show \
  --name delivery-food-web \
  --resource-group $ACA_RG \
  --query properties.configuration.ingress.fqdn \
  -o tsv)

FRONTEND_URL=https://$FRONTEND_FQDN
echo $FRONTEND_URL
```

Atualize o CORS do backend com a URL real do frontend:

```bash
az containerapp update \
  --name delivery-food-api \
  --resource-group $ACA_RG \
  --set-env-vars CORS_ORIGIN=$FRONTEND_URL
```

Abra o frontend:

```bash
echo $FRONTEND_URL
```

### Erro: Could not find a replica for this app

Se os logs mostrarem:

```text
Could not find a replica for this app
```

o Container App esta sem replica ativa. Isso pode acontecer porque escalou para zero ou porque a revisao falhou ao iniciar.

Force pelo menos uma replica:

```bash
az containerapp update \
  --name delivery-food-api \
  --resource-group $ACA_RG \
  --min-replicas 1 \
  --max-replicas 1
```

Aguarde 1 minuto e veja as revisoes:

```bash
az containerapp revision list \
  --name delivery-food-api \
  --resource-group $ACA_RG \
  -o table
```

Depois tente os logs novamente:

```bash
az containerapp logs show \
  --name delivery-food-api \
  --resource-group $ACA_RG \
  --follow false \
  --tail 120
```

Se ainda nao houver replica, teste a URL para acordar o app:

```bash
curl https://delivery-food-api.happyground-b15f5207.eastus.azurecontainerapps.io/health
```
