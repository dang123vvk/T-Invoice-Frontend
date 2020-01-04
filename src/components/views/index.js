import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Link } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import blue from '@material-ui/core/colors/blue';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import logotma from '../share/img/logotma.png';
import { connect } from 'react-redux';

const th = createMuiTheme({
    palette: {
        primary: { main: blue[500] }, // Purple and green play nicely together.
        secondary: { main: '#2196f3' }, // This is just green.A700 as hex.
    },
});
class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = { redirect: false }
    }
    render() {
        return (
            <ThemeProvider theme={th}>
                <Container component="main">
                    <CssBaseline />
                    <div style={{ marginTop: '6%', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
                        <Grid container spacing={3}>
                            <Grid item xs>
                            </Grid>
                            <Grid item xs={8}>
                                <div className="row">
                                    <div className="col-sm-4">
                                        <img src={logotma} width="60%" alt="vvn" />
                                    </div>
                                    <div className="col-sm-8">
                                        <Typography variant="h4" style={{ color: 'rgb(23, 105, 170)', marginTop: '2%', marginBottom: '3%' }}>
                                            TMA Invoice Tracking Tool
                                        </Typography>
                                        <Typography variant="h5" style={{ color: 'rgb(23, 105, 170)' }}>
                                            Invoice management system of TMA Solution
                                        </Typography>
                                        <Link to='/signin'>
                                            <Button variant="outlined" color="primary" style={{ marginTop: 40 }}>
                                                GET STARTED
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs>
                            </Grid>
                        </Grid>
                    </div>
                </Container>
            </ThemeProvider>
        );
    }
}
const mapStateToProps = state => {
    return {
      title: state.loginReducer.username,
      isLogin: state.loginReducer.isLogin
    };
  }
export default  connect(mapStateToProps) (HomePage);