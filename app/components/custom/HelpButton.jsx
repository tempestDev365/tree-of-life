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
        padding: 15,
        margin: 3,
        backgroundColor: 'gray',
        borderRadius: 5

    },
    helpText: {
        textAlign: 'center',
        color: 'white',
    },
 })

 export default HelpButton;