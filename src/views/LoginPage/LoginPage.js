import React, { useState, useEffect } from 'react';
import { Box, Grid, Button, Typography, Modal } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { authLogin } from '../../services/app.service';


export default function LoginPage(props) {
    const { handleSuccessfulAuthentication } = props;
    let navigate = useNavigate();

    const googleLogin = useGoogleLogin({
        onSuccess: async ({ code }) => {
            console.log("code " + code);
            authLogin(code)
            .then(response => response.json())
            .then((data) => {
                if (data.access_token !== undefined) {
                    let access_token = data.access_token
                    let refresh_token = data.refresh_token
                    let id_token = data.id_token
                    handleSuccessfulAuthentication(access_token, refresh_token, id_token)
                } else {
                    // unable to authenticate
                }
            })
        },
        flow: 'auth-code',
      });

    const styles = {
        outerBox: {
            backgroundColor: "#F5F5F6",
            height: "100vh"
        },
        innerBox: {
            paddingY:5,
            paddingX:5,
        },
        modalBox: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            // minHeight: "40vh"
        },
        modalTitle: {
            display: "flex", 
            justifyContent: "center",
        },
        modalBody: {
            display: "flex",
            justifyContent: "center",
            mt: 2
        }
    }

    return (
        <Box sx={styles.outerBox}>
            <Box sx={styles.innerBox}>
            <Modal
                open={true}
                // onClose={handleClose}
            >
            <Box sx={styles.modalBox}>
                <Typography sx={styles.modalTitle} variant="h6" component="h2">
                    Undocumented Orphan Wells UI
                </Typography>
                <Typography sx={styles.modalBody} component="span">
                    <Button onClick={googleLogin} variant="contained">
                        Login with Google
                    </Button>
                    {/* {() => googleLogin()} */}
                </Typography>
            </Box>
            </Modal>
            </Box>
        </Box>
    );
}

const google = () => {

    return (
        <GoogleLogin
            onSuccess={credentialResponse => {
              console.log(credentialResponse);
            }}
            onError={() => {
              console.log('Login Failed');
            }}
          />
    )
}
  