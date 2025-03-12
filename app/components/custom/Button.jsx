import { TouchableOpacity, Text, StyleSheet } from "react-native";

const CustomButton = (props) => {
    return(
        <TouchableOpacity 
            style={styles.button}
            onPress={props.Btn}>
             <Text
                style={styles.text}>{props.titleBtn}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({ 
    button: {
        backgroundColor: 'blue',
        padding: 10,
        margin: 10
    },
    text: {
        color: 'white',
        textAlign: 'center'
    }
});

export default CustomButton;