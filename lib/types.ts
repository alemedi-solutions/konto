export interface Category {
  id: string;
  name: string;
  ico: string;
  color: string;
  kind: 'gasto' | 'ingreso';
  budget?: number;
  logo?: string;
}

export interface Transaction {
  id: string;
  name: string;
  catId: string;
  amt: number;
  date: string;
  recurring?: boolean;
}

export interface Profile {
  name: string;
  email: string;
  initials: string;
}

export type GradientKey = 'slate' | 'violet' | 'sunset' | 'ocean' | 'mint';

export type Screen = 'home' | 'tx' | 'stats' | 'budget' | 'cats' | 'me' | 'loans';

export interface Loan {
  id: string;
  name: string;
  ico: string;
  color: string;
  totalAmount: number;
  monthlyPayment: number;
  startDate: string;
  totalMonths: number;
}
