import { Text, View, ScrollView, StyleSheet } from 'react-native';

const About = () => {
    return (
        <View style={styles.container}>
            <ScrollView>
                <Text>How it works?</Text>
                <Text>1. User select a category ( Walking, Jogging, Running ).</Text>
                <Text>2. The user need reach the required minimum distance and steps. </Text>
                <Text>3. Math quiz appears after they finished the activity ( 10 seconds timer per question ).</Text>
                <Text>4. Correct answer = Full points, Incorrect answer = 0 points</Text>
                <Text>
                    
                </Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 30,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'black',
    },
    text: {
        fontSize: 20,
        margin: 10,
    },
});

export default About;