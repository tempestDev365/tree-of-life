import { Stack } from "expo-router";

const AboutLayout = () => {
    return (
        <Stack>
            <Stack.Screen 
                name="About" 
                options={{
                    headerShown: false,
                }} />
        </Stack>
    );
}

export default AboutLayout;