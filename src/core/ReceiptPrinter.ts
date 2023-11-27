import {PosPrinter, PrinterConfig} from '~/native_modules/PosPrinter';
import {DateUtils, generateReceiptNumber} from '~/utils';
import {LocalStorageService} from './LocalStorageService';
import type {Client} from '~/types';
import type {TransactionType, DailyTransaction} from '~/core/models';

export type PrintReceiptParams = {
  price: number;
  customer: Client;
  merchantName: string;
  paymentType: TransactionType;
  paybackPeriod: number;
};

export type PrintBalanceParams = Omit<
  PrintReceiptParams,
  'price' | 'paymentType'
> & {
  balance: number;
  cardNumber: string;
};

export const ReceiptPrinter = {
  async testPrint(testAmount: string, config: PrinterConfig) {
    const textToPrinted =
      "[C]<u><font size='big'>Norsa N.V.</font></u>\n" +
      '[L]\n' +
      `[C]Receipt N.O: ${(Math.random() * 1000).toFixed(0)}\n` +
      `[C]${DateUtils.format('DD/MM/YYYY hh:mm:ss A')}\n` +
      '[L]\n' +
      '[C]================================\n' +
      '[L]\n' +
      `[L]Sale Amount :[R]NAFL ${testAmount}\n` +
      '[L]\n' +
      '[C]================================\n' +
      '[L]\n' +
      "[L]<font size='tall'>Merchant :</font>\n" +
      '[L]Jake Gill\n' +
      "[L]<font size='tall'>Customer :</font>\n" +
      `[L]${'Max'} ${'Norton'}\n` +
      `[L]${'123'}\n` +
      '[L]\n' +
      '[L]\n' +
      "[L]<font size='tall'>Signature :</font>\n" +
      '[L]\n' +
      '[L]\n' +
      '[L]--------------------------------\n' +
      '[L]\n' +
      '[L]Thank you for your purchase\n' +
      '[L]For questions or inquiries call customer service : +5999 767-1563';

    console.log(textToPrinted, config);
    return PosPrinter.print(textToPrinted, config);
  },
  print(text: string) {
    console.log(text);
    return PosPrinter.print(text);
  },
  async printReceipt({
    price,
    customer,
    merchantName,
    paymentType,
    paybackPeriod,
  }: PrintReceiptParams) {
    const textToBePrinted =
      "[C]<u><font size='big'>Norsa N.V.</font></u>\n" +
      '[L]\n' +
      `[C]Receipt N.O: ${generateReceiptNumber()}\n` +
      `[C]${DateUtils.format('DD/MM/YYYY hh:mm:ss A')}\n` +
      '[L]\n' +
      '[C]==============================\n' +
      '[L]\n' +
      `[L]${
        paymentType === TransactionType.Expense ? 'Sale' : 'Retour'
      } Amount :[R]NAFL ${price.toFixed(2)}\n` +
      '[L]\n' +
      '[C]==============================\n' +
      '[L]\n' +
      "[L]<font size='tall'>Payback period (months):</font>\n" +
      `[L]${paybackPeriod}\n` +
      "[L]<font size='tall'>Merchant :</font>\n" +
      `[L]${merchantName}\n` +
      "[L]<font size='tall'>Customer :</font>\n" +
      `[L]${customer.name}\n` +
      `[L]${customer.code}\n` +
      '[L]\n' +
      '[L]\n' +
      "[L]<font size='tall'>Signature :</font>\n" +
      '[L]\n' +
      '[L]\n' +
      '[C]------------------------------\n' +
      '[L]\n' +
      '[L]Thank you for your purchase\n' +
      '[L]For questions or inquiries call customer service:\n' +
      '[L]+5999 767-1563';

    console.log(textToBePrinted);
    const printRes = await PosPrinter.print(textToBePrinted);
    if (printRes.success) {
      LocalStorageService.setString(
        LocalStorageService.Keys.PreviousPrintedReceipt,
        textToBePrinted,
      );
    }

    return printRes;
  },
  async printDailyReceipt(
    dailyTransactions: DailyTransaction[],
    merchantName: string,
  ) {
    const listOfExpenses = dailyTransactions
      .sort(
        (a, b) =>
          new Date(a?.dateTime ?? '').getTime() -
          new Date(b?.dateTime ?? '').getTime(),
      )
      .reduce((prev, curr) => {
        return (
          prev +
          `[L]${curr.Client_id}: [R]NAFL ${
            curr?.transactionType === TransactionType.Retour ? '-' : ' '
          }${curr?.AmountUser?.toFixed(2)}\n` +
          `[L]Payback period (months): [R]     ${
            curr?.totalPaybackPeriods ?? 0
          }\n`
        );
      }, '');
    const totalExpense = dailyTransactions
      .map(trx => trx?.AmountUser ?? 0)
      .reduce(
        (prev, curr, idx) =>
          dailyTransactions[idx].transactionType === TransactionType.Expense
            ? prev + curr
            : prev - curr,
        0,
      )
      .toFixed(2);

    const textToBePrinted =
      "[C]<u><font size='big'>Norsa N.V.</font></u>\n" +
      '[L]\n' +
      `[C]Receipt N.O: ${generateReceiptNumber()}\n` +
      `[C]${DateUtils.format('DD/MM/YYYY hh:mm:ss A')}\n` +
      '[L]\n' +
      '[C]------------------------------\n' +
      '[L]\n' +
      '[C]<b>Daily sales</b>\n' +
      '[L]\n' +
      '[C]==============================\n' +
      '[L]\n' +
      listOfExpenses +
      '[L]\n' +
      '[C]==============================\n' +
      '[L]\n' +
      `[R]<b>Total :</b>[R]NAFL ${totalExpense}\n` +
      "[L]<font size='tall'>Merchant :</font>\n" +
      `[L]${merchantName}\n` +
      '[L]\n' +
      '[L]\n' +
      "[L]<font size='tall'>Signature :</font>\n" +
      '[L]\n' +
      '[L]\n' +
      '[C]------------------------------\n' +
      '[L]\n' +
      '[L]Thank you for your purchase\n' +
      '[L]For questions or inquiries call customer service:\n' +
      '[L]+5999 767-1563';

    console.log(textToBePrinted);
    return PosPrinter.print(textToBePrinted);
  },
  async printBalance({
    balance,
    customer,
    cardNumber,
    merchantName,
    paybackPeriod,
  }: PrintBalanceParams) {
    const textToBePrinted =
      "[C]<u><font size='big'>Norsa N.V.</font></u>\n" +
      '[L]\n' +
      `[C]Receipt N.O: ${generateReceiptNumber()}\n` +
      `[C]${DateUtils.format('DD/MM/YYYY hh:mm:ss A')}\n` +
      '[L]\n' +
      '[C]==============================\n' +
      '[L]\n' +
      `[L]Balance :[R]NAFL ${balance.toFixed(2)}\n` +
      `[L]Card Number :[R]     ${cardNumber}\n` +
      '[L]\n' +
      '[C]==============================\n' +
      '[L]\n' +
      "[L]<font size='tall'>Payback period (months):</font>\n" +
      `[L]${paybackPeriod}\n` +
      "[L]<font size='tall'>Merchant :</font>\n" +
      `[L]${merchantName}\n` +
      "[L]<font size='tall'>Customer :</font>\n" +
      `[L]${customer.name}\n` +
      `[L]${customer.code}\n` +
      '[L]\n' +
      '[L]\n' +
      "[L]<font size='tall'>Signature :</font>\n" +
      '[L]\n' +
      '[L]\n' +
      '[C]------------------------------\n' +
      '[L]\n' +
      '[L]Thank you for your purchase\n' +
      '[L]For questions or inquiries call customer service:\n' +
      '[L]+5999 767-1563';

    console.log(textToBePrinted);
    return PosPrinter.print(textToBePrinted);
  },
};
