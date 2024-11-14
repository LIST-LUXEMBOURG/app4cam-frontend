#!/bin/bash
# © 2024 Luxembourg Institute of Science and Technology

USERNAME="app4cam"
PASSWORD="app4cam"

NODE_VERSION="22"

# Turn echo on.
set -x

# Make sure to have Node.js installed in the right version.
if ! command -v node &> /dev/null || node -v != v"$NODE_VERSION"* ; then
  sudo apt install curl -y
  curl -fsSL https://deb.nodesource.com/setup_"$NODE_VERSION".x -o nodesource_setup.sh
  bash nodesource_setup.sh
  sudo apt install nodejs -y
fi

# Install Apache web server.
sudo apt install apache2 -y

# Enable rewrite module.
sudo a2enmod rewrite

# Enable use of .htaccess files in the Apache configuration file.
sudo sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf

# Restart Apache to apply changes.
sudo systemctl restart apache2

# Create the new user if it does not exist already.
if id "$USERNAME" >/dev/null 2>&1; then
  echo "The user $USERNAME exists already."
else
  sudo useradd -m -s /bin/bash -p "$(openssl passwd -6 $PASSWORD)" "$USERNAME"
fi

# Transfer Apache folder ownership to the user.
sudo chown -R "$USERNAME" /var/www/html
