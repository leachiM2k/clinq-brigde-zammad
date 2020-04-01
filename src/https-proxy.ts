import { createServer } from 'http-proxy';
import pem from 'pem';

export function startHttpsProxy(httpsPort: number, httpPort: number) {
    pem.createCertificate({
        days: 365,
        selfSigned: true,
        altNames: ['localhost', '127.0.0.1']
    }, (err, keys) => {
        if (err) {
            throw err;
        }
        createServer({
            ssl: { key: keys.serviceKey, cert: keys.certificate },
            target: {
                host: 'localhost',
                port: httpPort
            },
            secure: true // Depends on your needs, could be false.
        }).listen(httpsPort);
        // tslint:disable-next-line:no-console
        console.log(`HTTPS Server is listening on port ${httpsPort}`);
    });
}
