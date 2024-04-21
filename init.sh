wget https://github.com/Harry-zklcdc/go-proxy-bingai/releases/latest/download/go-proxy-bingai-linux-amd64.tar.gz -O go-proxy-bingai-linux-amd64.tar.gz
tar -zxvf go-proxy-bingai-linux-amd64.tar.gz
rm go-proxy-bingai-linux-amd64.tar.gz
chmod +x go-proxy-bingai

curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o cloudflared && \
chmod +x cloudflared