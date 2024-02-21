#!/bin/bash
# © 2024 Luxembourg Institute of Science and Technology

USERNAME="app4cam"

# Turn echo on.
set -x

# Generate a public/private key pair without passphrase.
su - "$USERNAME" -c 'ssh-keygen -t ed25519 -q -N "" -f /home/app4cam/.ssh/id_ed25519'

# Copy public key to authorized keys file.
su - "$USERNAME" -c "cp .ssh/id_ed25519.pub .ssh/authorized_keys"

# Display private key.
echo "Please copy-paste the following private key with an empty line at the end into the corresponding Gitlab variable:"
cat /home/"$USERNAME"/.ssh/id_ed25519

# Delete private key file.
rm /home/"$USERNAME"/.ssh/id_ed25519

# Remove all "group" and "other" permissions for the .ssh directory.
chmod -R go= /home/"$USERNAME"/.ssh

# Disable password authentication for the user.
{
  echo "Match User $USERNAME"
  echo "PasswordAuthentication no"
  echo "Match all"
} >> /etc/ssh/sshd_config

# Restart SSH service.
sudo systemctl restart ssh

# Install rsync.
sudo apt install rsync -y
