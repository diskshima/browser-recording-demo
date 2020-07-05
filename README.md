# Browser Recording Demo

## Setup and Running

```bash
$ npm install -g parcel-bundler
$ parcel index.html
```

### Running With TLS

1. Download xip.io certificate and private key from [here](https://github.com/bsstokes/xip.io-cert/).
1. Run with HTTPS specifying the downloaded certificates
    ```bash
    parcel serve --host YOUR_LOCAL_IP --https --cert certs/xip.io.crt --key certs/xip.io.key index.html
    ```
1. Access `YOUR_LOCAL_IP.xip.io:1234`.
