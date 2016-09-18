# apiRestFull
//clone o repositorio 
git clone https://github.com/projetoch/apiRestFull 

//vá para a pasta da api 
cd apiRestFull/api-nodejs 

//instale as dependencias locais 
npm install 

//instale as dependencias globais 
sudo npm install -g forever 
sudo npm install -g supervisor 

//Para rodar com o forever:
	forever start ./bin/www 
//Para rodar com o supervisor:
	npm start
