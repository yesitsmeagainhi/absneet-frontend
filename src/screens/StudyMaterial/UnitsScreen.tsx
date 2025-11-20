// import React from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
// import { SUBJECTS } from '../../data/demo';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../navigation/RootNavigator';


// export default function UnitsScreen({ route, navigation }: NativeStackScreenProps<RootStackParamList, 'Units'>) {
//     const { subjectId } = route.params;
//     const subject = SUBJECTS.find(s => s.id === subjectId)!;


//     return (
//         <View style={styles.c}>
//             <FlatList
//                 data={subject.units}
//                 keyExtractor={u => u.id}
//                 renderItem={({ item }) => (
//                     <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Chapters', { subjectId, unitId: item.id })}>
//                         <Text>{item.name}</Text>
//                     </TouchableOpacity>
//                 )}
//             />
//         </View>
//     );
// }
// const styles = StyleSheet.create({ c: { flex: 1, padding: 16 }, row: { padding: 16, borderWidth: 1, borderColor: '#eee', borderRadius: 10, marginBottom: 10 } });





//Firestore inclduedd
// // src/screens/UnitsScreen.tsx
// import React, { useEffect, useState } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     FlatList,
//     TouchableOpacity,
//     ActivityIndicator,
// } from 'react-native';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../navigation/RootNavigator';

// import { db } from '../../firebase'; // ← adjust path if your firebase file is somewhere else
// import {
//     collection,
//     query,
//     where,
//     orderBy,
//     getDocs,
// } from 'firebase/firestore';

// type Props = NativeStackScreenProps<RootStackParamList, 'Units'>;

// type UnitNode = {
//     id: string;
//     name: string;
//     parentId: string;
//     type: string;
//     order?: number;
// };

// export default function UnitsScreen({ route, navigation }: Props) {
//     const { subjectId } = route.params;

//     const [units, setUnits] = useState<UnitNode[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         const fetchUnits = async () => {
//             try {
//                 setLoading(true);
//                 setError(null);

//                 // nodes where parentId = subjectId AND type = 'unit'
//                 const q = query(
//                     collection(db, 'nodes'),
//                     where('parentId', '==', subjectId),
//                     where('type', '==', 'unit'),
//                     orderBy('order', 'asc') // make sure 'order' exists & is indexed
//                 );

//                 const snap = await getDocs(q);
//                 const items: UnitNode[] = snap.docs.map(d => ({
//                     id: d.id,
//                     ...(d.data() as any),
//                 }));

//                 setUnits(items);
//             } catch (e: any) {
//                 console.error('[UnitsScreen] Failed to load units', e);
//                 setError('Failed to load units. Please try again.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchUnits();
//     }, [subjectId]);

//     const handlePressUnit = (unit: UnitNode) => {
//         navigation.navigate('Chapters', {
//             subjectId,
//             unitId: unit.id,
//         });
//     };

//     if (loading) {
//         return (
//             <View style={styles.center}>
//                 <ActivityIndicator />
//                 <Text style={{ marginTop: 8 }}>Loading units...</Text>
//             </View>
//         );
//     }

//     if (error) {
//         return (
//             <View style={styles.center}>
//                 <Text>{error}</Text>
//             </View>
//         );
//     }

//     if (!units.length) {
//         return (
//             <View style={styles.center}>
//                 <Text>No units found for this subject.</Text>
//             </View>
//         );
//     }

//     return (
//         <View style={styles.c}>
//             <FlatList
//                 data={units}
//                 keyExtractor={u => u.id}
//                 renderItem={({ item }) => (
//                     <TouchableOpacity
//                         style={styles.row}
//                         onPress={() => handlePressUnit(item)}
//                     >
//                         <Text>{item.name}</Text>
//                     </TouchableOpacity>
//                 )}
//             />
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     c: { flex: 1, padding: 16 },
//     row: {
//         padding: 16,
//         borderWidth: 1,
//         borderColor: '#eee',
//         borderRadius: 10,
//         marginBottom: 10,
//     },
//     center: {
//         flex: 1,
//         padding: 16,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
// });



// src/screens/MCQ/UnitsScreen.tsx  (or src/screens/UnitsScreen.tsx if that's your path)
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

// 🔹 Static data instead of Firestore
import { SUBJECTS, Unit as DemoUnit, Subject } from '../../data/demo';

type Props = NativeStackScreenProps<RootStackParamList, 'Units'>;

export default function UnitsScreen({ route, navigation }: Props) {
    const { subjectId } = route.params;

    const [units, setUnits] = useState<DemoUnit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadUnitsFromDemo = () => {
            try {
                setLoading(true);
                setError(null);

                // 🔍 find subject in static SUBJECTS list
                const subject: Subject | undefined = SUBJECTS.find(
                    s => s.id === subjectId,
                );

                if (!subject) {
                    setError('Subject not found in demo data.');
                    setUnits([]);
                    return;
                }

                // units for this subject
                setUnits(subject.units || []);
            } catch (e: any) {
                console.error('[UnitsScreen] Failed to load units from demo.ts', e);
                setError('Failed to load units. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        loadUnitsFromDemo();
    }, [subjectId]);

    const handlePressUnit = (unit: DemoUnit) => {
        navigation.navigate('Chapters', {
            subjectId,
            unitId: unit.id,
        });
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator />
                <Text style={{ marginTop: 8 }}>Loading units...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text>{error}</Text>
            </View>
        );
    }

    if (!units.length) {
        return (
            <View style={styles.center}>
                <Text>No units found for this subject in demo data.</Text>
            </View>
        );
    }

    return (
        <View style={styles.c}>
            <FlatList
                data={units}
                keyExtractor={u => u.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.row}
                        onPress={() => handlePressUnit(item)}
                    >
                        <Text>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    c: { flex: 1, padding: 16 },
    row: {
        padding: 16,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 10,
        marginBottom: 10,
    },
    center: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
