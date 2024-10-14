#!/bin/bash

# Verificando se o Besu está instalado
if ! command -v besu &> /dev/null; then
    echo "Erro: Hyperledger Besu não está instalado. Verifique a instalação e tente novamente."
    exit 1
fi

# Diretório base da rede
NETWORK_DIR="../../.docker/besu"

# Verifica e cria o diretório base se não existir
if [ ! -d "$NETWORK_DIR" ]; then
    echo "Criando diretório base em $NETWORK_DIR..."
    mkdir -p $NETWORK_DIR
fi


# Criar diretórios para cada nó e suas pastas de dados
for node in node1 node2 node3 node4; do
    mkdir -p $NETWORK_DIR/$node/data
done

# Criar o arquivo de configuração qbftConfigFile.json
cat <<EOF > $NETWORK_DIR/qbftConfigFile.json
{
  "genesis": {
    "config": {
      "chainId": 1337,
      "berlinBlock": 0,
      "qbft": {
        "blockperiodseconds": 4,
        "epochlength": 30000,
        "requesttimeoutseconds": 4
      }
    },
    "nonce": "0x0",
    "timestamp": "0x58ee40ba",
    "gasLimit": "0x47b760",
    "difficulty": "0x1",
    "mixHash": "0x63746963616c2062797a616e74696e65206661756c7420746f6c6572616e6365",
    "coinbase": "0x0000000000000000000000000000000000000000",
    "alloc": {
      "fe3b557e8fb62b89f4916b721be55ceb828dbd73": {
        "balance": "0xad78ebc5ac6200000"
      },
      "627306090abaB3A6e1400e9345bC60c78a8BEf57": {
        "balance": "90000000000000000000000"
      },
      "f17f52151EbEF6C7334FAD080c5704D77216b732": {
        "balance": "90000000000000000000000"
      }
    }
  },
  "blockchain": {
    "nodes": {
      "generate": true,
      "count": 4
    }
  }
}
EOF

# Gerar as chaves dos nós e o arquivo genesis.json
echo "Gerando chaves dos nós e o arquivo genesis.json..."
besu operator generate-blockchain-config \
    --config-file=$NETWORK_DIR/qbftConfigFile.json \
    --to=$NETWORK_DIR/networkFiles \
    --private-key-file-name=key

# Copiar o arquivo genesis.json para o diretório principal da rede
cp $NETWORK_DIR/networkFiles/genesis.json $NETWORK_DIR/

# Copiar as chaves dos nós para suas respectivas pastas de dados
index=1  # Controla o número do nó
for nodeDir in $NETWORK_DIR/networkFiles/keys/*; do
    echo "Copiando chaves para $NETWORK_DIR/node$index/data..."
    cp $nodeDir/key $NETWORK_DIR/node$index/data/
    cp $nodeDir/key.pub $NETWORK_DIR/node$index/data/
    index=$((index + 1))
done

echo "Chaves e arquivos genesis configurados com sucesso."
