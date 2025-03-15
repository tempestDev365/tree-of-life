import { Stack } from "expo-router";


const CategoriesLayout = () =>{
    return(
        <Stack>
            <Stack.Screen 
                name="Categories"
                options={{
                    headerShown: false
                }}  />
        </Stack>
    )
}

export default CategoriesLayout