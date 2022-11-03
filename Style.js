import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 30,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'orange',
    },
    button: {
      width: 250,
      height: 60,
      backgroundColor: 'lavender',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      marginBottom: 10,
    },
    buttonText: {
      textAlign: 'center',
      fontSize: 15,
      color: '#fff',
    },
    spinnerTextStyle: {
      color: '#FFF',
    },
    shadowProp: {
      shadowColor: 'orange',
      shadowOffset: {width: -50, height: 10},
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
  })