import { Toast } from 'native-base';

export default (e) => {
  Toast.show({
    text: e.message,
    position: 'top',
    buttonText: 'Okay',
    type: 'danger',
    duration: 3000
  });
}