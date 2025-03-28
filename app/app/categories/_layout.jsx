import { Stack } from "expo-router";


const CategoriesLayout = () =>{
    return(
        <Stack>

            <Stack.Screen 
                name="categories"
                options={{
                    headerShown: false
                }}  />

                
        </Stack>


    )
}

export default CategoriesLayout