import { 
    View, 
    Text, 
    Image,
    ImageBackground,
    StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import StartButton from '../components/custom/StartButton';
import HelpButton from '../components/custom/HelpButton';
import AboutButton from '../components/custom/AboutButton';
import TreeHero from '@/assets/images/hero.png';
import Banner from '@/assets/images/TOL-BANNER.png';


const App = () => {

    const router = useRouter();

    return (
        <View style={styles.mainContainer}>
            <ImageBackground
                source={TreeHero}
                resizeMode='cover'
                style={styles.imageBg}
            >
                <ImageBackground
                    source={Banner}
                    resizeMode='contain'
                    style={{
                        width: '100%', // Adjust width as needed
                        height: "80%",  // Increase height for a bigger banner
                        alignSelf: 'center',
                        position: 'absolute',
                        top: '20%', // Adjust position as needed
                    }}
                >
                <View style={styles.buttonContainer}>
                    <StartButton 
                        titleBtn="START"
                        Btn={()=> router.push('/categories')}/>

                    <HelpButton
                        titleBtn="MECHANICS"
                        Btn={() => router.push('/help')}/>

                    <AboutButton
                        titleBtn="ABOUT"
                        Btn={() => router.push('/about')}/>
                </View> 
                </ImageBackground>
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
        fontSize: 50,
        fontWeight: 'bold',
    },

    banner: {
        width: '80%',
        height: 100,
        alignSelf: 'center',
        position: 'absolute',
        top: '20%',
    },

    buttonContainer: {
        position: 'absolute',
        top: '24%',
        alignSelf: 'center',
        gap: 3,
        width: '45%',
    }

})  



export default App;