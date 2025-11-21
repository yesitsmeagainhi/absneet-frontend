import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


export default function Banner({ title }: { title: string }) {
    return (
        <View style={styles.banner}><Text style={styles.txt}>{title}</Text></View>
    );
}
const styles = StyleSheet.create({
    banner: { backgroundColor: '#E4D5FF', padding: 16, borderRadius: 12, marginVertical: 8 },
    txt: { fontWeight: '600' },
});

// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';

// export default function Banner({ title }: { title: string }) {
//     return (
//         <View style={styles.banner}>
//             <Text style={styles.txt}>{title}</Text>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     banner: {
//         backgroundColor: '#111827',   // dark card
//         paddingVertical: 12,
//         paddingHorizontal: 14,
//         borderRadius: 16,
//         marginVertical: 10,
//         borderWidth: 1,
//         borderColor: '#1D4ED8',       // blue accent (same as hero/banners)
//     },
//     txt: {
//         fontWeight: '700',
//         fontSize: 14,
//         color: '#F9FAFB',             // light text on dark bg
//     },
// });
