import { Commitment, Keypair, LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import { Vault } from "../programs/vault/src/lib/vault";

describe("vault", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.AnchorVault as Program<Vault>;

  const connection = anchor.getProvider().connection;

  const signer = Keypair.generate();

  const vault = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("vault"), signer.publicKey.toBuffer()], program.programId)[0];

  const confirm = async (signature: string): Promise<string> => {
    const block = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
      signature,
      ...block
    })
    return signature
  }

  const log = async(signature: string): Promise<string> => {
    console.log(`Your transaction signature: https://explorer.solana.com/transaction/${signature}?cluster=custom&customUrl=${connection.rpcEndpoint}`);
    return signature;
  }

  it("Airdrop", async () => {
    await connection.requestAirdrop(signer.publicKey, LAMPORTS_PER_SOL * 10)
    .then(confirm)
    .then(log)
  })
  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
