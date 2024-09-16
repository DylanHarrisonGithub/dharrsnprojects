cd ..
cp -r /home/app-root/app-root-deploy/public ./
cd app-root-deploy
sudo git pull
sudo npm install
cd ..
cp -r public /home/app-root/app-root-deploy
sudo rm -rf public
cd app-root-deploy
sudo pm2 restart index.js
sudo pm2 save