import { Alert } from 'react-native';


/**
 * 信息框框通知
 * @param {int} alertType 信息类型
 * @param {int} alertTitle 信息标题
 * @param {string} alertBody 信息內容
 */
export default function SendAlert(alertType: string, alertTitle: string, alertBody: string) {
  Alert.alert(
    alertTitle,
    `[${alertType}] ${alertBody}`,
    [{ text: "OK" }]
  );
}