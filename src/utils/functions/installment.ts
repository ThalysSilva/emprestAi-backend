export function getInstallmentDate(
  loanCreationDate: Date,
  installmentOrder: number,
): Date {
  const installmentDate = new Date(loanCreationDate);
  installmentDate.setMonth(installmentDate.getMonth() + installmentOrder);
  return installmentDate;
}
