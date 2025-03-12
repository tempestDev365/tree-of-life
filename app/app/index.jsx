import { View, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import CustomButton from '../components/custom/Button';


const App = () => {

    const router = useRouter();

    return (
        <View>
            <View>
                <Text>My first App</Text>
                <CustomButton Btn={() => router.push("../about/About")} titleBtn="Start" />
            </View>
        </View>
    );
}

export default App;