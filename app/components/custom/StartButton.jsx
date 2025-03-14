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
        padding: 15,
        margin: 3,
        backgroundColor: 'green',
        borderRadius: 5
    },
    startText: {
        textAlign: 'center',
        color: 'white',
    },

});

export default StartButton;
