// import React from 'react';
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import VideosScreen from '../screens/Content/VideosScreen';
// import PdfsScreen from '../screens/Content/PdfsScreen';
// import McqIntroScreen from '../screens/Content/McqIntroScreen';
// import { useRoute } from '@react-navigation/native';


// export type ContentTabParams = { MCQ: undefined; Videos: undefined; PDF: undefined };
// const Tab = createMaterialTopTabNavigator<ContentTabParams>();
// const { params } = useRoute<any>();


// export default function ContentTabs() {
//     return (
//         <Tab.Navigator>
//             <Tab.Screen name="MCQ" component={McqIntroScreen} initialParams={params} />
//             <Tab.Screen name="Videos" component={VideosScreen} initialParams={params} />
//             <Tab.Screen name="PDF" component={PdfsScreen} initialParams={params} />
//         </Tab.Navigator>
//     );
// }


import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import VideosScreen from '../screens/Content/VideosScreen';
import PdfsScreen from '../screens/Content/PdfsScreen';
import McqIntroScreen from '../screens/Content/McqIntroScreen';

const Tab = createMaterialTopTabNavigator();

export default function ContentTabs({ route }: any) {
    // Props from the Stack screen that navigated here
    const params = route?.params ?? {};

    return (
        <Tab.Navigator>
            <Tab.Screen name="MCQ" component={McqIntroScreen} initialParams={params} />
            <Tab.Screen name="Videos" component={VideosScreen} initialParams={params} />
            <Tab.Screen name="PDF" component={PdfsScreen} initialParams={params} />
        </Tab.Navigator>
    );
}
