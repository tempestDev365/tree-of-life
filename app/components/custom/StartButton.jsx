import { TouchableOpacity, Text, StyleSheet } from "react-native";

const StartButton  = (props) => {
    return(
        <TouchableOpacity 
            style={styles.startButton}
            onPress={props.Btn}>
             <Text
                style={styles.startText}>{props.titleBtn}</Text>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({ 

    startButton: {
        padding: 10,
        margin: 3,
        backgroundColor: 'green',
        borderRadius: 20,
        borderWidth: 5,
        borderColor: 'brown'
    },
    startText: {
        textAlign: 'center',
        color: 'white',
        fontSize : 25,
        fontWeight: 'bold',
    },

});

export default StartButton;
