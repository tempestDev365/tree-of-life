import { Stack } from "expo-router";

const HelpLayout = () => {
    <Stack>
        <Stack.Screen 
            name="Help"
            options={{
                headerShown: false
            }}
        />
    </Stack>
}

export default HelpLayout