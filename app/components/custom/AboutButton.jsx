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
        padding: 15,
        margin: 3,
        backgroundColor: 'gray',
        borderRadius: 5

    },
    aboutText: {
        textAlign: 'center',
        color: 'white',
    },
 })

 export default AboutButton;