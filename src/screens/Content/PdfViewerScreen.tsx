// // // src/screens/Content/PdfViewerScreen.tsx
// // import React from 'react';
// // import {
// //     View,
// //     ActivityIndicator,
// //     StyleSheet,
// //     Text,
// // } from 'react-native';
// // import { NativeStackScreenProps } from '@react-navigation/native-stack';
// // import { RootStackParamList } from '../../navigation/RootNavigator';
// // import { WebView } from 'react-native-webview';

// // type Props = NativeStackScreenProps<RootStackParamList, 'PdfViewer'>; // ✅

// // export default function PdfViewerScreen({ route }: Props) {
// //     const { url } = route.params;

// //     if (!url) {
// //         return (
// //             <View style={styles.center}>
// //                 <Text>No PDF URL provided.</Text>
// //             </View>
// //         );
// //     }

// //     return (
// //         <View style={styles.container}>
// //             <WebView
// //                 source={{ uri: url }}
// //                 startInLoadingState
// //                 renderLoading={() => (
// //                     <View style={styles.center}>
// //                         <ActivityIndicator />
// //                         <Text style={{ marginTop: 8 }}>Loading PDF…</Text>
// //                     </View>
// //                 )}
// //                 javaScriptEnabled
// //                 domStorageEnabled
// //                 allowFileAccess
// //                 allowsFullscreenVideo
// //             />
// //         </View>
// //     );
// // }

// // const styles = StyleSheet.create({
// //     container: { flex: 1, backgroundColor: '#000' },
// //     center: {
// //         flex: 1,
// //         alignItems: 'center',
// //         justifyContent: 'center',
// //     },
// // });// src/screens/Content/PdfViewerScreen.tsx
// import React, { useMemo, useState } from 'react';
// import {
//   View,
//   ActivityIndicator,
//   StyleSheet,
//   Text,
//   Dimensions,
// } from 'react-native';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../navigation/RootNavigator';
// import Pdf from 'react-native-pdf';
// import { WebView } from 'react-native-webview';

// type Props = NativeStackScreenProps<RootStackParamList, 'PDFViewer'>;

// // 👉 Convert Google Drive sharing link to direct download
// function toDirectDriveUrl(raw: string): string {
//   if (!raw) return raw;
//   try {
//     const u = new (URL as any)(raw) as any; // TS-friendly
//     const host = (u.hostname || '').toLowerCase();

//     if (host.includes('drive.google.com') && u.pathname.includes('/file/d/')) {
//       const m = u.pathname.match(/\/file\/d\/([^/]+)/);
//       const id = m?.[1];
//       if (id) {
//         return `https://drive.google.com/uc?export=download&id=${id}`;
//       }
//     }
//     return raw;
//   } catch {
//     return raw;
//   }
// }

// // 👉 Fallback preview URL (Google viewer) if native fails
// function toPreviewUrl(raw: string): string {
//   if (!raw) return raw;
//   try {
//     const u = new (URL as any)(raw) as any;
//     const host = (u.hostname || '').toLowerCase();

//     if (host.includes('drive.google.com') && u.pathname.includes('/file/d/')) {
//       const m = u.pathname.match(/\/file\/d\/([^/]+)/);
//       const id = m?.[1];
//       if (id) {
//         return `https://drive.google.com/file/d/${id}/preview`;
//       }
//     }
//     return raw;
//   } catch {
//     return raw;
//   }
// }

// export default function PdfViewerScreen({ route }: Props) {
//   const { url, title } = route.params;
//   const [nativeFailed, setNativeFailed] = useState(false);

//   const pdfSource = useMemo(() => {
//     if (!url) return null;
//     const direct = toDirectDriveUrl(url);
//     return {
//       uri: direct,
//       cache: true,
//       trustAllCerts: false as const, // force system trust manager
//     };
//   }, [url]);

//   if (!url) {
//     return (
//       <View style={styles.center}>
//         <Text>No PDF URL provided.</Text>
//       </View>
//     );
//   }

//   // 🔁 If native PDF failed, fall back to WebView preview
//   if (nativeFailed || !pdfSource) {
//     const previewUrl = toPreviewUrl(url);
//     return (
//       <View style={styles.container}>
//         <WebView
//           source={{ uri: previewUrl }}
//           startInLoadingState
//           javaScriptEnabled
//           domStorageEnabled
//           renderLoading={() => (
//             <View style={styles.center}>
//               <ActivityIndicator />
//               <Text style={{ marginTop: 8, color: '#fff' }}>
//                 Loading {title || 'PDF'}…
//               </Text>
//             </View>
//           )}
//         />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Pdf
//         source={pdfSource}
//         style={styles.pdf}
//         onLoadComplete={(pages) => {
//           console.log('[PdfViewer] loaded, pages =', pages);
//         }}
//         onError={(error) => {
//           console.log('[PdfViewer] error', error);
//           // 👇 If BlobUtil / trust-manager / ENOENT error → fallback to WebView
//           setNativeFailed(true);
//         }}
//         renderActivityIndicator={(progress) => (
//           <View style={styles.center}>
//             <ActivityIndicator />
//             <Text style={{ marginTop: 8, color: '#fff' }}>
//               Loading {title || 'PDF'}… {Number.isFinite(progress)
//                 ? `${Math.round(progress * 100)}%`
//                 : ''}
//             </Text>
//           </View>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   pdf: {
//     flex: 1,
//     width: Dimensions.get('window').width,
//   },
//   center: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

// src/screens/Content/PdfViewerScreen.tsx
import React, { useMemo } from 'react';
import {
    View,
    ActivityIndicator,
    StyleSheet,
    Text,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { WebView } from 'react-native-webview';

type Props = NativeStackScreenProps<RootStackParamList, 'PDFViewer'>;

// Turn a Drive "share" link into an embedded preview URL
function toPreviewUrl(raw: string): string {
    if (!raw) return raw;
    try {
        const u = new (URL as any)(raw) as any;  // TS-safe
        const host = (u.hostname || '').toLowerCase();

        if (host.includes('drive.google.com') && u.pathname.includes('/file/d/')) {
            const m = u.pathname.match(/\/file\/d\/([^/]+)/);
            const id = m?.[1];
            if (id) {
                // This is the clean embed URL (opens directly in viewer)
                return `https://drive.google.com/file/d/${id}/preview`;
            }
        }
        return raw;
    } catch {
        return raw;
    }
}

export default function PdfViewerScreen({ route }: Props) {
    const { url, title } = route.params;

    const previewUrl = useMemo(() => toPreviewUrl(url), [url]);

    if (!previewUrl) {
        return (
            <View style={styles.center}>
                <Text>No PDF URL provided.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <WebView
                source={{ uri: previewUrl }}
                startInLoadingState
                javaScriptEnabled
                domStorageEnabled
                renderLoading={() => (
                    <View style={styles.center}>
                        <ActivityIndicator />
                        <Text style={{ marginTop: 8, color: '#fff' }}>
                            Loading {title || 'PDF'}…
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
