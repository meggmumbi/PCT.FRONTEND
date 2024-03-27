
import * as React from 'react';
import { Viewer } from '@react-pdf-viewer/core';

import '@react-pdf-viewer/core/lib/styles/index.css';

const LoadFromBase64 = (data) => {
    const base64 =
        'data:application/pdf;base64,'+data;
    // console.log("LoadFromBase64", base64);
    const pdfContentType = 'application/pdf';

    const base64toBlob = (data) => {
        // Cut the prefix `data:application/pdf;base64` from the raw base 64
        const base64WithoutPrefix = data.substr(`data:${pdfContentType};base64,`.length);

        const bytes = atob(base64WithoutPrefix);
        let length = bytes.length;
        let out = new Uint8Array(length);

        while (length--) {
            out[length] = bytes.charCodeAt(length);
        }

        return new Blob([out], { type: pdfContentType });
    };

    const url = URL.createObjectURL(base64toBlob(base64));
    // console.log("Morning URLd : ", url);


    const w = window.open(url, '_blank');
    w && w.focus();
};

// export const SimpleDocumentViewer = async (props) => {

//     const base64toBlob =  async (data, type) => {
//         console.log("Document url function call is herw")
//         if(data === null ){
//             return null;
//         }
//         // Cut the prefix `data:application/pdf;base64` from the raw base 64
//         const base64WithoutPrefix = data.substr('data:'+type+';base64,'.length);
    
//         const bytes = atob(base64WithoutPrefix);
//         let length = bytes.length;
//         let out = new Uint8Array(length);
    
//         while (length--) {
//             out[length] = bytes.charCodeAt(length);
//         }
    
//         let _blob =  new Blob([out], { type: type });

//         return new Promise((resolve) => {
//             const reader = new FileReader()
//             reader.onloadend = () => resolve(reader.result)
//             reader.readAsDataURL(_blob)
//         })
      
//     };

//     const uri = await base64toBlob(props.file, "text/plain");
//     console.log("Some data URL ", uri);
//     return  (
//         <DocViewer
//         documents={[{uri: window.URL.createObjectURL(uri), fileType:"text/plain" }]}
//         // pluginRenderers={DocViewerRenderers}
//     />
//     )

// }
export default LoadFromBase64;