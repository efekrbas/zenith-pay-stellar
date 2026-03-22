import { Keypair } from 'stellar-sdk';

const addresses = [
    'GBBD47IF6LWNC7F7M6DHXGLP27VCOUAXALCO3TCTWBE3S7XVS2B6ST6K',
    'GBBD47OIRG2ZFBPU66D7YIXX5QPRFXC6D5T3G43J7RFLZ47E3A63QW7',
    'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5'
];

addresses.forEach(addr => {
    try {
        Keypair.fromPublicKey(addr);
        console.log(addr + ' is VALID');
    } catch (e) {
        console.log(addr + ' is INVALID: ' + e.message);
    }
});
