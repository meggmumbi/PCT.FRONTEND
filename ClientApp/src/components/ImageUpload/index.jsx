import Grid from "@mui/material/Grid";
import { Fab } from "@mui/material";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { forwardRef, useEffect, useState } from "react";

//function ImageUpload({imageBase64,height=310,defaultImage=null}) {
const Index = forwardRef(({ imageBase64, height = 310, defaultImage = null }) => {

    const [showImage, setShowImage] = useState(false);
    const [image, setImage] = useState();

    const handleUploadClick = (event) => {
        if (!showImage) {
            let file = event.target.files[0];
            const reader = new FileReader();
            let url = reader.readAsDataURL(file);
            reader.onloadend = (e) => {
                setImage(reader.result);
                imageBase64(reader.result)
            }

        } else {
            imageBase64(null)
        }
        setShowImage(!showImage);
    }
    useEffect(() => {
        if (defaultImage != null && defaultImage !== '') {
            setImage(defaultImage);
            setShowImage(true);
        }
    }, [defaultImage])
    return (
        <Grid container direction="row" justifyContent="center" alignItems="center" sx={{
            border: '2px solid',
            height: { height },
            padding: '5px'
        }}>
            {!showImage &&
                <>
                    <input
                        accept="image/*"
                        id="contained-button-file"
                        multiple
                        type="file"
                        onChange={handleUploadClick}
                        style={{
                            display: 'none',

                        }}
                    />
                    <label htmlFor="contained-button-file">
                        <Fab component="span"
                            sx={{
                                color: 'blue[900]',
                                margin: 10
                            }}
                        >
                            <AddPhotoAlternateIcon />
                        </Fab>
                    </label>
                </>

            }
            {showImage &&
                <>
                    <img
                        alt={'Loading'}
                        loading="lazy"
                        width="100%"
                        src={image}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain'
                        }}
                        onClick={handleUploadClick}
                    />
                </>
            }

        </Grid>
    );
})

export default Index;