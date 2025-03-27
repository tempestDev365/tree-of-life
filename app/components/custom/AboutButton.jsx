import { TouchableOpacity, Text, StyleSheet } from "react-native";

const AboutButton = (props) => {
    return(
        <TouchableOpacity 
            style={styles.aboutButton}
            onPress={props.Btn}>
             <Text
                style={styles.aboutText}>{props.titleBtn}</Text>
        </TouchableOpacity>
    )
 }

 const styles = StyleSheet.create({
    aboutButton: {
        padding: 10,
        margin: 3,
        backgroundColor: 'green',
        borderRadius: 20,
        borderWidth: 5,
        borderColor: 'brown'
    },
    aboutText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 25,
        fontWeight: 'bold',
    },
 })

 export default AboutButton;