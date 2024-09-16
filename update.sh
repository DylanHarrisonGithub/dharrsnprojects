cd ..
cp -r /home/dharrsnprojects/dharrsnprojects-deploy/public ./
cd dharrsnprojects-deploy
sudo git pull
sudo npm install
cd ..
cp -r public /home/dharrsnprojects/dharrsnprojects-deploy
sudo rm -rf public
cd dharrsnprojects-deploy
sudo pm2 restart index.js
sudo pm2 save