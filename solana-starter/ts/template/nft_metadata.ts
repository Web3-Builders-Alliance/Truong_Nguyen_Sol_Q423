import wallet from "../cluster1/wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { createBundlrUploader } from "@metaplex-foundation/umi-uploader-bundlr"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');
const bundlrUploader = createBundlrUploader(umi);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        const image = "https://arweave.net/ivF84XF73KsHlaN2PAAT5Dk0-6rQkMoTJ6u4vsnB-_E";
        
        const metadata = {
            name: "WBA Cool!",
            symbol: "WBA",
            description: "WBA Cool!",
            image: image,
            attributes: [
                {trait_type: 'WBA_Rare', value: '100'}
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: image
                    },
                ]
            },
            creators: []
        };
        // evaluate way
        // const myUri = await bundlrUploader.uploadJson(metadata);
        const myUri = await bundlrUploader.upload([createGenericFile(JSON.stringify(metadata), "application/json")]);
        console.log("Your image URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();