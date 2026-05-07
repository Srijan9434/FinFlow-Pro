export type TxType = "expense" | "income";
export const CATEGORIES = [
  "Rent",
  "Food",
  "Transport",
  "Shopping",
  "Gifting",
  "SIP",
  "Investment",
  "Emergency Fund",
  "Misc",
] as const;

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  category: string;
  type: TxType;
  date: string; // ISO
  note?: string;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  balance: number;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
}

const K = {
  users: "ff_users",
  session: "ff_userId",
  accounts: "ff_accounts",
  txs: "ff_transactions",
};

function read<T>(k: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(k: string, v: T) {
  localStorage.setItem(k, JSON.stringify(v));
}

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export const auth = {
  current(): string | null {
    return typeof window === "undefined" ? null : localStorage.getItem(K.session);
  },
  user(): User | null {
    const id = auth.current();
    if (!id) return null;
    return read<User[]>(K.users, []).find((u) => u.id === id) ?? null;
  },
  signup(email: string, password: string, name: string): User {
    const users = read<User[]>(K.users, []);
    if (users.some((u) => u.email === email)) throw new Error("Email already in use");
    const u: User = { id: uid(), email, password, name };
    users.push(u);
    write(K.users, users);
    localStorage.setItem(K.session, u.id);
    return u;
  },
  login(email: string, password: string): User {
    const u = read<User[]>(K.users, []).find((x) => x.email === email && x.password === password);
    if (!u) throw new Error("Invalid credentials");
    localStorage.setItem(K.session, u.id);
    return u;
  },
  logout() {
    localStorage.removeItem(K.session);
  },
};

export const accountsStore = {
  list(): Account[] {
    const id = auth.current();
    return read<Account[]>(K.accounts, []).filter((a) => a.userId === id);
  },
  get(id: string): Account | undefined {
    return read<Account[]>(K.accounts, []).find((a) => a.id === id);
  },
  add(name: string, balance = 0): Account {
    const userId = auth.current()!;
    const all = read<Account[]>(K.accounts, []);
    const a: Account = { id: uid(), userId, name, balance, createdAt: new Date().toISOString() };
    all.push(a);
    write(K.accounts, all);
    return a;
  },
  addBalance(id: string, amount: number) {
    const all = read<Account[]>(K.accounts, []);
    const idx = all.findIndex((a) => a.id === id);
    if (idx >= 0) {
      all[idx].balance += amount;
      write(K.accounts, all);
    }
  },
  remove(id: string) {
    write(
      K.accounts,
      read<Account[]>(K.accounts, []).filter((a) => a.id !== id),
    );
    write(
      K.txs,
      read<Transaction[]>(K.txs, []).filter((t) => t.accountId !== id),
    );
  },
};

export const txStore = {
  list(accountId: string): Transaction[] {
    return read<Transaction[]>(K.txs, []).filter((t) => t.accountId === accountId);
  },
  add(t: Omit<Transaction, "id">): Transaction {
    const all = read<Transaction[]>(K.txs, []);
    const tx: Transaction = { ...t, id: uid() };
    all.push(tx);
    write(K.txs, all);
    // adjust balance
    const accs = read<Account[]>(K.accounts, []);
    const idx = accs.findIndex((a) => a.id === t.accountId);
    if (idx >= 0) {
      accs[idx].balance += t.type === "income" ? t.amount : -t.amount;
      write(K.accounts, accs);
    }
    return tx;
  },
  remove(id: string) {
    const all = read<Transaction[]>(K.txs, []);
    const tx = all.find((t) => t.id === id);
    if (!tx) return;
    write(K.txs, all.filter((t) => t.id !== id));
    const accs = read<Account[]>(K.accounts, []);
    const idx = accs.findIndex((a) => a.id === tx.accountId);
    if (idx >= 0) {
      accs[idx].balance += tx.type === "income" ? -tx.amount : tx.amount;
      write(K.accounts, accs);
    }
  },
};

export function inr(n: number) {
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}
