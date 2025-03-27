import { TouchableOpacity, Text, StyleSheet } from "react-native";

const HelpButton = (props) => {
    return(
        <TouchableOpacity 
            style={styles.helpButton}
            onPress={props.Btn}>
             <Text
                style={styles.helpText}>{props.titleBtn}</Text>
        </TouchableOpacity>
    )
 }

 const styles = StyleSheet.create({
    helpButton: {
        padding: 10,
        margin: 3,
        backgroundColor: 'green',
        borderRadius: 20,
        borderWidth: 5,
        borderColor: 'brown'
    },
    helpText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 25,
        fontWeight: 'bold',
    },
 })

 export default HelpButton;