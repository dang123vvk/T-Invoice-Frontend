import React, { Component } from 'react';
import { Container, CssBaseline, Typography } from '@material-ui/core';
class NotFound extends Component {
    render() {
        return (
            <Container component="main">
                <CssBaseline />
                <div style={{ marginTop: '8%', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h4" style={{ color: 'rgb(23, 105, 170)', marginTop: '1%', marginBottom: '3%' }}>
                        404 PAGE NOT FOUND
                    </Typography>
                </div>
            </Container>
        )
    }
}

export default NotFound;