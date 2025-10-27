export interface DataSendI {
  street: string;
  noExt: string;
  noInt?: string;
  codePostal: number;
  cologne: string;
  state: string;
  city: string;
  phone1: string;
  phone2: string;
  country: string;
}

export interface FacturacionI {
  companyName: string;
  rfc: string;
  CFDI: string;
  taxRegimen: string;
  methodPay: string;
  codePostal: number;
  // cologne: string;
  state: string;
  city: string;
  // street: string;
  // noExt: string;
  // noInt?: string;
  // observations: string;
  country: string;
}

type RegimenFiscal = {
  clave: string;
  descripcion: string;
};

type UsoCFDI = {
  clave: string;
  descripcion: string;
  persona: string;
};

export interface CatalagosCFDI {
  regimenesFiscales: RegimenFiscal[];
  usosCFDI: UsoCFDI[];
}
