import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from '@mui/icons-material/Send';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

function PostForm(props) {
    return (
        <form>
            <Grid container>
                <Grid item xs={12}>
                    <TextField
                        label="title"
                        id="title"
                        value={props.inputs["title"]}
                        onChange={(e) => props.onChange("title", e)}
                    />
                </Grid>
                <Grid item xs={2}/>
                <Grid item xs={8}>
                    <TextField
                        label="content"
                        id="content"
                        multiline
                        fullWidth
                        value={props.inputs["content"]}
                        onChange={(e) => props.onChange("content", e)}
                    />
                </Grid>
                <Grid item xs={2}/>
                <Grid item xs={12}>
                    <Box mt={5}>
                        <Button
                            variant="contained"
                            color="primary"
                            endIcon={<SendIcon />}
                            onClick={props.onSubmit}
                        >
                            CREATE
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </form>
    );
}

export default PostForm;
