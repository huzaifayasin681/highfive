# AWS EC2 Deployment Guide for HighFive (Next.js + Prisma + SQLite)

This guide provides step-by-step instructions on how to deploy the **HighFive** application on your AWS EC2 instance (`18.233.184.58`) and make it accessible over the internet.

## Prerequisites
- Your AWS EC2 instance is already running with Elastic IP **18.233.184.58**.
- You have the SSH key (`.pem` file) for this instance.
- **Security Groups Check**: Ensure your EC2 Security Group allows inbound traffic on:
  - **Port 22 (SSH)**
  - **Port 80 (HTTP)**
  - **Port 443 (HTTPS)**

---

## Step 1: Connect to the Instance

Open your terminal and connect to the instance using your key pair:

```bash
# Set appropriate permissions for the key file (only needs to be done once)
chmod 400 path/to/your-key.pem

# Connect to the instance
ssh -i path/to/your-key.pem ubuntu@18.233.184.58
```
*(Note: If you are using an Amazon Linux AMI instead of Ubuntu, the user will be `ec2-user` instead of `ubuntu`)*

---

## Step 2: Server Setup & Dependencies

Once connected, run these commands to update the system and install Node.js (v20+), PM2, and Nginx.

```bash
# Update package list
sudo apt update && sudo apt upgrade -y

# Install curl and git
sudo apt install curl git -y

# Install Node.js v20 (Using NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (Process Manager for keeping Next.js running)
sudo npm install -g pm2

# Install Nginx (Reverse Proxy)
sudo apt install nginx -y
```

---

## Step 3: Clone the Application & Install Dependencies

1. Clone your GitHub repository:
```bash
git clone https://github.com/huzaifayasin681/highfive.git
cd highfive
```

2. Install the project dependencies:
```bash
npm install
```

---

## Step 4: Configure Environment Variables & Database

1. Create a `.env` file in the root of the project:
```bash
nano .env
```

2. Add the required environment variables. **You will need a random secret for Auth.js**. You can run `openssl rand -base64 33` in another terminal to generate one. Paste this into the editor:
```env
# Required for Auth.js
AUTH_SECRET="<paste_your_random_secret_here>"
AUTH_URL="http://18.233.184.58"

# Database URL for SQLite
DATABASE_URL="file:./dev.db"
```
*(Press `Ctrl + O`, `Enter`, and then `Ctrl + X` to save and exit nano)*

3. Run Prisma Migrations to generate the SQLite database and Prisma client:
```bash
npm run db:migrate
```

*(Optional)* Seed the database with initial data:
```bash
npm run db:seed
```

---

## Step 5: Build and Run the Next.js Application

1. Build the production application:
```bash
npm run build
```

2. Start the application using PM2 so it runs continuously in the background:
```bash
pm2 start npm --name "highfive" -- run start

# Configure PM2 to restart the app automatically on server reboot
pm2 startup
# Run the command that PM2 outputs, then save the configuration:
pm2 save
```

Your app is now running locally on the server at `http://localhost:3000`.

---

## Step 6: Configure Nginx as a Reverse Proxy

We need Nginx to route traffic from port 80 (HTTP) to port 3000 (where Next.js is running).

1. Create a new Nginx configuration file:
```bash
sudo nano /etc/nginx/sites-available/highfive
```

2. Paste the following configuration:
```nginx
server {
    listen 80;
    server_name 18.233.184.58;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
*(Press `Ctrl + O`, `Enter`, and then `Ctrl + X` to save and exit nano)*

3. Enable the configuration and restart Nginx:
```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/highfive /etc/nginx/sites-enabled/

# Remove the default Nginx config to avoid conflicts
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## 🎉 You're Done!
Your application is now accessible over the internet via `http://18.233.184.58`.

### What's Next? (Optional: SSL & Custom Domain)
If you want to secure the site with HTTPS:
1. Purchase a domain name and point an `A Record` to `18.233.184.58`.
2. Update `server_name` in `/etc/nginx/sites-available/highfive` to your domain.
3. Update `AUTH_URL` in `.env` to `https://yourdomain.com` and run `pm2 restart highfive`.
4. Install Certbot (`sudo apt install certbot python3-certbot-nginx -y`).
5. Run `sudo certbot --nginx -d yourdomain.com`.
