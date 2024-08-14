import React from 'react'
import Logo from '../public/logo.png'
import { Avatar } from '@mui/material'
import profileImg from "../public/profile.jpg"
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    header: {
        width: "100%",
        height: "60px",
        display: 'flex',

        alignItems: 'center',
        justifyContent: 'space-between'
    },
    logo: {
        paddingLeft: "5%",
        height: '40px'
    },
    profile: {
        paddingRight: "5%"
    }
});

function Header() {
    const classes = useStyles();
    return (
        <div className={classes.header}>
            <img src={Logo} className={classes.logo} />
            <div className={classes.profile}>
                <Avatar
                    name="Profile"
                    src={profileImg}

                    size="md"
                    cursor={'pointer'} />
            </div>
        </div>
    )
}

export default Header
