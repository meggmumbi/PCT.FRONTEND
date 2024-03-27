import React, { useState } from "react"

import {
    useCSVReader,
    lightenDarkenColor,
    formatFileSize
} from "react-papaparse"

const GREY = "#CCC"
const GREY_LIGHT = "rgba(255, 255, 255, 0.4)"
const DEFAULT_REMOVE_HOVER_COLOR = "#A01919"
const REMOVE_HOVER_COLOR_LIGHT = lightenDarkenColor(
    DEFAULT_REMOVE_HOVER_COLOR,
    40
)
const GREY_DIM = "#686868"

const styles = {
    zone: {
        alignItems: "center",
        border: `2px dashed ${GREY}`,
        borderRadius: 20,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
        padding: 10
    },
    file: {
        background: "#fff",
        borderRadius: 5,
        display: "flex",
        height: 40,
        width: 300,
        position: "relative",
        zIndex: 10,
        flexDirection: "column",
        justifyContent: "center"
    },
    info: {
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        paddingLeft: 10,
        paddingRight: 10
    },
    size: {
        backgroundColor: GREY_LIGHT,
        borderRadius: 3,
        marginBottom: "0.5em",
        justifyContent: "center",
        display: "flex"
    },
    name: {
        backgroundColor: GREY_LIGHT,
        borderRadius: 3,
        fontSize: 12,
        marginBottom: "0.5em"
    },
    progressBar: {
        bottom: 14,
        position: "absolute",
        width: "100%",
        paddingLeft: 10,
        paddingRight: 10
    },
    zoneHover: {
        borderColor: GREY_DIM
    },
    default: {
        borderColor: GREY
    },
    remove: {
        height: 23,
        position: "absolute",
        right: 6,
        top: 6,
        width: 23
    }
}

export default function CSVReader(props) {
    const { CSVReader } = useCSVReader()
    const [zoneHover, setZoneHover] = useState(false)
    const [removeHoverColor, setRemoveHoverColor] = useState(
        DEFAULT_REMOVE_HOVER_COLOR
    )
    let fileName = null;
    let fileSize=null;
    const convertToJson = (data) => {
        const result = []
        if(data.length >= 1){
            const headers =data[0];
            data.shift()
            data.pop()
            data.map(l => {
                const obj = {}
                const line = l

                headers.map((h, i) => {
                    obj[h] = line[i]
                })

                result.push(obj)
            })
            return {headers:headers,data:result,fileName:fileName,fileSize:fileSize,fileType:'csv'}
        }

        return {headers:[], data:[],fileName:null,fileSize:null,fileType:null}
    };
    const setDetails = (name, size) =>{
        fileSize=size;
        fileName=name;
    }

    return (
        <CSVReader
            onUploadAccepted={results => {
                props.setData(convertToJson(results.data));
                props.action(true)
                setZoneHover(false)
            }}
            onDragOver={event => {
                event.preventDefault()
                setZoneHover(true)
            }}
            onDragLeave={event => {
                event.preventDefault()
                setZoneHover(false)
            }}
        >
            {({
                  getRootProps,
                  acceptedFile,
                  ProgressBar,
                  getRemoveFileProps,
                  Remove
              }) => (
                <>
                    <div
                        {...getRootProps()}
                        style={Object.assign(
                            {},
                            styles.zone,
                            zoneHover && styles.zoneHover
                        )}
                    >
                        {acceptedFile ? (
                            <>
                                <div style={styles.file}>
                                    <div style={styles.info}>
                                        <span style={styles.size}>
                                            {formatFileSize(acceptedFile.size)}
                                            {setDetails(acceptedFile.name,formatFileSize(acceptedFile.size))}
                                        </span>
                                        <span style={styles.name}>{acceptedFile.name}</span>
                                    </div>
                                    <div style={styles.progressBar}>
                                        <ProgressBar />
                                    </div>
                                    <div
                                        {...getRemoveFileProps()}
                                        style={styles.remove}
                                        onMouseOver={event => {
                                            event.preventDefault()
                                            setRemoveHoverColor(REMOVE_HOVER_COLOR_LIGHT)
                                        }}
                                        onMouseOut={event => {
                                            event.preventDefault()
                                            setRemoveHoverColor(DEFAULT_REMOVE_HOVER_COLOR)
                                        }}
                                        onClick={(event) => {
                                            getRemoveFileProps().onClick(event);
                                            props.action(false)
                                            props.setData( {headers:[], data:[],fileName:null,fileSize:null,fileType:null});
                                        }}
                                    >
                                        <Remove color={removeHoverColor} />
                                    </div>
                                </div>
                            </>
                        ) : (
                            "Drop CSV file here or click to upload"
                        )}
                    </div>
                </>
            )}
        </CSVReader>
    )
}
