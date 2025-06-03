# chmod +x setup.sh
# ./setup.sh

#!/bin/bash

# Cria ambiente virtual
python3 -m venv venv

# Ativa o ambiente virtual
source venv/bin/activate

# Atualiza pip e setuptools
pip install --upgrade pip setuptools

# Instala dependências
pip install -r requirements.txt

echo "Setup finalizado. Para ativar o ambiente virtual, rode:"
echo "source venv/bin/activate"
