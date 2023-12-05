import { Keypair, PublicKey} from "@solana/web3.js"
import wallet from "./wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createMetadataAccountV3 } from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, publicKey, signerIdentity } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";

// We're going to import our keypair from the wallet file
//Create a Solana devnet connection
const umi = createUmi('https://api.devnet.solana.com');
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
// Define our Mint address
const mint = new PublicKey("4jtgEDKvVdBo4xiKa8jkEFvHEpFFZ7T8gik1y35RSFX6")

// Add the Token Metadata Program
const token_metadata_program_id = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')

// Create PDA for token metadata
const metadata_seeds = [
    Buffer.from('metadata'),
    token_metadata_program_id.toBuffer(),
    mint.toBuffer(),
];
const [metadata_pda, _bump] = PublicKey.findProgramAddressSync(metadata_seeds, token_metadata_program_id);
umi.use(signerIdentity(myKeypairSigner));

(async () => {
    try {
        // Start here
        let myTransaction = createMetadataAccountV3(
          umi,
          {
              //accounts
              metadata: publicKey(metadata_pda.toString()),
              mint: publicKey(mint.toString()),
              mintAuthority: myKeypairSigner,
              payer: myKeypairSigner,
              updateAuthority: keypair.publicKey,
              data: {
                name: "myname",
                symbol: "exp",
                uri: "example_uri.com",
                sellerFeeBasisPoints: 0,
                creators: null,
                collection: null,
                uses: null
              },
              isMutable: true,
              collectionDetails: null,
          }
      )

      let result = await myTransaction.sendAndConfirm(umi)
      console.log(result.signature);

      const signature = base58.deserialize(result.signature);
      console.log(signature[0]);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();