import moment from 'moment';
import {Alert, ToastAndroid} from 'react-native';
import {PrinterConfig} from '~/types';

const floatNumberRegex = /^(\d+(\.\d+)?)$|^(.?\d+)$/;
const intNumberRegex = /^[0-9]+$/;
const emailRegex =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export const printerDefaultConfig: PrinterConfig = {
  printerDpi: 150,
  printerWidthMM: 48,
  printerNbrCharactersPerLine: 30,
};

export const noop: () => void = () => {};

export const showToast: (message: string, duration?: number) => void = (
  message,
  duration = ToastAndroid.SHORT,
) => {
  ToastAndroid.show(message, duration);
};

export const flatListKeyExtractor: (item: any, index: number) => string = (
  _,
  idx,
) => `${idx}-${Math.random()}`;

export const isValidFloatNumber: (value: string) => boolean = value =>
  floatNumberRegex.test(value);

export const isValidIntNumber: (value: string) => boolean = value =>
  intNumberRegex.test(value);

export const isEmailValid: (email: string) => boolean = email =>
  emailRegex.test(email);

export const showAlert: (title: string, message: string) => void = (
  title,
  message,
) => {
  Alert.alert(title, message, [
    {
      text: 'OK',
      onPress: noop,
    },
  ]);
};

export const showPrintDailyReportAlert = () => {
  showAlert('Print Daily Report', 'Please print daily report first');
};

export const showPrintBalanceAlert: (
  balance: number,
  onPrintPress: () => void,
) => void = (balance, onPrintPress) => {
  Alert.alert('Balance', `Your balance is : NAFL ${balance}`, [
    {
      text: 'Print',
      onPress: onPrintPress,
    },
    {
      text: 'OK',
      onPress: noop,
    },
  ]);
};

export const getCurrentUtcTimestamp = () => moment.utc().toISOString();

export const getLocalTimestamp = (utcTimestamp: string) =>
  moment
    .utc(utcTimestamp)
    .utcOffset(moment().utcOffset())
    .format('YYYY-MM-DDTHH:mm:ssZ');
