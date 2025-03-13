import { 
    View, 
    Text, 
    Alert,
    ImageBackground,
    StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import StartButton from '../components/custom/StartButton';
import HelpButton from '../components/custom/HelpButton';
import TreeHero from '@/assets/images/tree-of-life-hero.png';


const App = () => {

    const router = useRouter();

    return (
        <View
            style={styles.mainContainer}>
            <ImageBackground
                source={TreeHero}
                resizeMode='cover'
                style={styles.imageBg}
                >
                <View>
                    <Text
                        style={styles.textTitle}>Tree Of Life
                    </Text>
                    <View>

                        <StartButton 
                            titleBtn="Start"
                            btn={()=> Alert.alert("System", "Sure kana ba?", [
                                {
                                text: "Yes",
                                },
                                {
                                text: "No",
                                }
                            ])}/>

                        <HelpButton
                            titleBtn="Help"/>

                        

                    </View>

                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({

    mainContainer: {
        flex: 1,
    },
    
    imageBg: {
        flex: 1,
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'cover',
    },

    textTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },


})  



export default App;