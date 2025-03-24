import { Text, View, StyleSheet } from 'react-native';

const Help = () => {
    return (
        <View>
            <Text style={styles.textTitle}>This feature is not available yet!!</Text>
        </View>
    );
}


const styles = StyleSheet.create({
    textTitle: {
        fontSize: 30,
        color: 'black',
        textAlign: 'center',
        marginTop: 50,
    },
});
export default Help;