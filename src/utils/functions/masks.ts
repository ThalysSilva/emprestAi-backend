export function removeNotNumbers(input: string): string {
  return input.replace(/[^\d]/g, '');
}

export function onlyNumber(input: string): string {
  if (input) {
    return input.replace(/\D/g, '');
  }
  return input;
}

export function formatCPF(cpf: string): string {
  if (cpf) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  return cpf;
}

export function formatCNPJ(cnpj: string): string {
  if (cnpj) {
    return cnpj.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.$2.$3/$4-$5',
    );
  }
  return cnpj;
}

export function formatPhone(phone: string): string {
  if (phone) {
    phone = phone.replace(/\D/g, '');

    if (phone.length === 13) {
      return phone.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, '+$1 ($2) $3-$4');
    } else if (phone.length === 12) {
      return phone.replace(/(\d{2})(\d{2})(\d{4})(\d{4})/, '+$1 ($2) $3-$4');
    } else {
      return phone;
    }
  }
  return phone;
}

export function formatCEP(cep: string) {
  return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
}
