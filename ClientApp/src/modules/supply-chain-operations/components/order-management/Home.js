import React from 'react';
import {Grid} from "@mui/material";

function Home(props) {
    return (
        <Grid
            container
            justifyContent="center"
            spacing={1}
            alignItems={"stretch"}
            sx={{ minHeight: "800px" }}>
            <Grid item md={12} zeroMinWidth>
                <iframe
                    title=""
                    width="100%"
                    height="100%"
                    src="https://app.powerbi.com/view?r=eyJrIjoiYzYyNzQxMjQtNzg1MS00ZTUwLWE0NmItNDYzMGQyYzg1ODY2IiwidCI6ImU3OTQyOTc0LTk3MzgtNGE0YS1iNjQ2LTJhYjkwZjc5ZGIwZiIsImMiOjF9&pageName=ReportSectionbca709bb6fc0cdb80d65"
                    frameBorder="0"
                    allowFullScreen={true}></iframe>
            </Grid>
        </Grid>
    );
}

export default Home;
