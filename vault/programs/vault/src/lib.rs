use anchor_lang::prelude::*;
use anchor_lang::system_program::{Transfer, transfer};
declare_id!("Emi694pE9oyAt2iWchPW7ZjTcbpm22bSqNGF6dQ39WUg");

#[program]
pub mod vault {
    use super::*;

    pub fn deposit(ctx: Context<Vault>, amount: u64) -> Result<()> {
        let cpi_program = ctx.accounts.system_program.to_account_info();
        let cpi_accounts = Transfer {
            from: ctx.accounts.owner.to_account_info(),
            to: ctx.accounts.vault.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        transfer(cpi_ctx, amount)
    }
    pub fn withdraw(ctx: Context<Vault>, amount: u64) -> Result<()> {
        let bump = ctx.bumps.vault;
        let seeds = &[
            "vault".as_bytes(),
            &[bump],
        ];
        let signer_seeds = &[&seeds[..]];
        let cpi_program = ctx.accounts.system_program.to_account_info();
        let cpi_accounts = Transfer {
            from: ctx.accounts.vault.to_account_info(),
            to: ctx.accounts.owner.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

        transfer(cpi_ctx, amount)
    }

}

#[derive(Accounts)]
pub struct Vault<'info>{
    #[account(mut)]
    owner: Signer<'info>,
    #[account(mut, seeds = [b"vault",owner.key().as_ref()], bump)]
    vault: SystemAccount<'info>,
    system_program: Program<'info, System>,

}   


