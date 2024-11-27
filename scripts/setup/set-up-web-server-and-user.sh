#!/bin/bash
# © 2024 Luxembourg Institute of Science and Technology

USERNAME="app4cam"
PASSWORD="app4cam"

NODE_VERSION="22"

# Ask the user for the IP address.
echo "Please enter the IP address of the access point (AP):"
read ip_address
if [[ -z "$ip_address" ]]; then
  echo "You must enter an IP address!"
  exit 1
fi

# Make sure to have Node.js installed in the right version.
if ! command -v node &> /dev/null || node -v != v"$NODE_VERSION"* ; then
  sudo apt install curl -y
  curl -fsSL https://deb.nodesource.com/setup_"$NODE_VERSION".x -o nodesource_setup.sh
  bash nodesource_setup.sh
  sudo apt install nodejs -y
fi

# Install Apache web server.
sudo apt install apache2 openssl -y

# Enable rewrite and SSL modules.
sudo a2enmod rewrite
sudo a2enmod ssl

# Enable use of .htaccess files in the Apache configuration file.
sudo sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf

# Generate a certificate.
mkdir -p /etc/ssl/localcerts
openssl genpkey -algorithm RSA -out /etc/ssl/localcerts/app4cam.key -pkeyopt rsa_keygen_bits:4096
openssl req -utf8 -new -key /etc/ssl/localcerts/app4cam.key -subj "/CN=$ip_address/OU=LIST/C=LU" -out /etc/ssl/localcerts/app4cam.csr
openssl x509 -req -days 9125 -in /etc/ssl/localcerts/app4cam.csr -signkey /etc/ssl/localcerts/app4cam.key -out /etc/ssl/localcerts/app4cam.crt
chmod ugo+r /etc/ssl/localcerts/app4cam.crt
chmod ugo+r /etc/ssl/localcerts/app4cam.key

# Backup SSL configuration file and link to certificate and key.
cp /etc/apache2/sites-available/default-ssl.conf /etc/apache2/sites-available/default-ssl.backup.conf
sed -i "s|^\(\s*SSLCertificateFile\s\+\).*|\1/etc/ssl/localcerts/app4cam.crt|" /etc/apache2/sites-available/default-ssl.conf
sed -i "s|^\(\s*SSLCertificateKeyFile\s\+\).*|\1/etc/ssl/localcerts/app4cam.key|" /etc/apache2/sites-available/default-ssl.conf

# Enable the SSL configuration.
a2ensite default-ssl

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
