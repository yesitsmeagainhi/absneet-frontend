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


// src/screens/MCQ/UnitsScreen.tsx 
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

                const subject: Subject | undefined = SUBJECTS.find(
                    s => s.id === subjectId,
                );

                if (!subject) {
                    setError('Subject not found in demo data.');
                    setUnits([]);
                    return;
                }

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
                <Text style={styles.centerText}>Loading units...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (!units.length) {
        return (
            <View style={styles.center}>
                <Text style={styles.centerText}>
                    No units found for this subject in demo data.
                </Text>
                {/* You can also show the Home button here if you want – optional */}
            </View>
        );
    }

    return (
        <View style={styles.c}>
            <FlatList
                data={units}
                keyExtractor={u => u.id}
                contentContainerStyle={{ paddingBottom: 80 }} // extra space so FAB doesn't cover last row
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        style={styles.row}
                        activeOpacity={0.8}
                        onPress={() => handlePressUnit(item)}
                    >
                        <Text style={styles.unitIndex}>Unit {index + 1}</Text>
                        <Text style={styles.unitName}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />

            {/* 🔹 Floating Home button (bottom-right) */}
            <TouchableOpacity
                style={styles.fab}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('HomeTabs')}
            >
                <Text style={styles.fabText}>Home</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    // 🔹 main screen wrapper – light background
    c: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F9FAFB',
    },

    // unit card
    row: {
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 12,
        marginBottom: 10,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    unitIndex: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 2,
        fontWeight: '500',
    },
    unitName: {
        fontSize: 15,
        color: '#111827',
        fontWeight: '600',
    },

    // loading / error / empty
    center: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F9FAFB',
    },
    centerText: {
        marginTop: 8,
        fontSize: 13,
        color: '#4B5563',
        textAlign: 'center',
    },
    errorText: {
        marginTop: 8,
        fontSize: 13,
        color: '#DC2626',
        textAlign: 'center',
    },

    // 🔹 Floating Home button
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        backgroundColor: '#4F46E5',
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 999,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
    },
    fabText: {
        color: '#F9FAFB',
        fontWeight: '700',
        fontSize: 13,
    },
});


// export default UnitsScreen;
