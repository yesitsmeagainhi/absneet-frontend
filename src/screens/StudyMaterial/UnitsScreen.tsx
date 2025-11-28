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





//Firestore included
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
// });// src/screens/MCQ/UnitsScreen.tsx
import React, { useEffect, useState, useMemo } from 'react';
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
import { useTheme } from '../../theme/ThemeContext';
import firestore, {
    FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

type Props = NativeStackScreenProps<RootStackParamList, 'Units'>;

type UnitDoc = {
    id: string;
    type: 'unit';
    subjectId?: string;
    parentId?: string;
    name: string;
    order?: number;
    active?: boolean;
    createdAt?: FirebaseFirestoreTypes.Timestamp | null;
};

export default function UnitsScreen({ route, navigation }: Props) {
    const { subjectId } = route.params;

    const { isDark } = useTheme();
    const styles = useMemo(() => createStyles(isDark), [isDark]);

    const [units, setUnits] = useState<UnitDoc[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadUnitsFromFirestore = async () => {
            setLoading(true);
            setError(null);

            console.log('[UnitsScreen] subjectId from route =', subjectId);

            try {
                const col = firestore().collection('nodes');

                // main query
                const q = col
                    .where('type', '==', 'unit')
                    .where('parentId', '==', subjectId)
                    .orderBy('order', 'asc');

                console.log('[UnitsScreen] running query for parentId =', subjectId);
                const snap = await q.get();

                if (!isMounted) return;

                let rows: UnitDoc[] = snap.docs.map(d => {
                    const data = d.data() as any;
                    return {
                        id: d.id,
                        type: data.type,
                        subjectId: data.subjectId,
                        parentId: data.parentId,
                        name: data.name ?? '(No name)',
                        order: data.order,
                        active: data.active,
                        createdAt: data.createdAt ?? null,
                    };
                });

                console.log('[UnitsScreen] fetched units =', rows.length, rows);
                setUnits(rows);
            } catch (e: any) {
                console.error('[UnitsScreen] error loading units', e);
                setError('Failed to load units. Please try again.');
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadUnitsFromFirestore();

        return () => {
            isMounted = false;
        };
    }, [subjectId]);
    const [subjectName, setSubjectName] = useState<string>('');

    useEffect(() => {
        const loadSubjectMeta = async () => {
            try {
                if (!subjectId) return;

                const snap = await firestore()
                    .collection('nodes')
                    .doc(subjectId)
                    .get();

                const data = snap.data() as any | undefined;
                console.log('[UnitsScreen] subject meta =', data);

                setSubjectName(data?.name ?? '');
            } catch (e) {
                console.log('[UnitsScreen] failed to load subject meta', e);
            }
        };

        loadSubjectMeta();
    }, [subjectId]);
    const handlePressUnit = (unit: UnitDoc) => {
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
                    No units found for this subject.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.c}>
            <FlatList
                data={units}
                keyExtractor={u => u.id}
                contentContainerStyle={{ paddingBottom: 80 }}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        style={styles.row}
                        activeOpacity={0.8}
                        onPress={() => handlePressUnit(item)}
                    >
                        <Text style={styles.unitIndex}>
                            {subjectName
                                ? `${subjectName}`        // e.g. "Physics"
                                : `Unit ${index + 1}`}    
                        </Text>
                        <Text style={styles.unitName}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />

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
/**
 * Themed styles – dark by default, flip when isDark = false
 */
const createStyles = (isDark: boolean) =>
    StyleSheet.create({
        // main screen wrapper
        c: {
            flex: 1,
            padding: 16,
            backgroundColor: isDark ? '#0F172A' : '#F9FAFB',
        },

        // unit card
        row: {
            paddingVertical: 14,
            paddingHorizontal: 12,
            borderRadius: 12,
            marginBottom: 10,
            backgroundColor: isDark ? '#020617' : '#FFFFFF',
            borderWidth: 1,
            borderColor: isDark ? '#1F2937' : '#E5E7EB',
        },
        unitIndex: {
            fontSize: 12,
            color: isDark ? '#9CA3AF' : '#6B7280',
            marginBottom: 2,
            fontWeight: '500',
        },
        unitName: {
            fontSize: 15,
            color: isDark ? '#F9FAFB' : '#111827',
            fontWeight: '600',
        },

        // loading / error / empty
        center: {
            flex: 1,
            padding: 16,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isDark ? '#0F172A' : '#F9FAFB',
        },
        centerText: {
            marginTop: 8,
            fontSize: 13,
            color: isDark ? '#E5E7EB' : '#4B5563',
            textAlign: 'center',
        },
        errorText: {
            marginTop: 8,
            fontSize: 13,
            color: '#F97373',
            textAlign: 'center',
        },

        // Floating Home button
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
