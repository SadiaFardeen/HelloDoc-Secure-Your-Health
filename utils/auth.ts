import * as Crypto from "expo-crypto";

import { PasswordFields } from "../data/accounts";

export interface PasswordCredential {
  passwordHash: string;
  passwordSalt: string;
}

async function hashPassword(password: string, salt: string): Promise<string> {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${salt}:${password}`
  );
}

export async function createPasswordCredential(
  password: string
): Promise<PasswordCredential> {
  const passwordSalt = Crypto.randomUUID();
  const passwordHash = await hashPassword(password, passwordSalt);

  return { passwordHash, passwordSalt };
}

export async function verifyPassword(
  account: PasswordFields,
  password: string
): Promise<boolean> {
  if (account.passwordHash && account.passwordSalt) {
    const candidateHash = await hashPassword(password, account.passwordSalt);
    return candidateHash === account.passwordHash;
  }

  return account.password === password;
}
