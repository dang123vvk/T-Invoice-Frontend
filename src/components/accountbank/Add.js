import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { ThemeProvider } from '@material-ui/styles';
import { FormControl } from '@material-ui/core';
import { Redirect } from 'react-router';
import { connect } from "react-redux";
import NotFound from '../views/NotFound';
import { postAccountBank } from '../share/services/accountbank.service';
import { th } from "../share/config";

class AddAccountBank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account_bank_number: '',
      account_bank_name: '',
      account_bank_address: '',
      account_bank_swift: '',
      user_id: 1,
      redirect: false,
      message: ''
    }
    this.onChange = this.onChange.bind(this);
    this.clear = this.clear.bind(this);
    document.title = 'Add An Account Bank';
  }
  handleSubmitForm(event) {
    event.preventDefault();
    const accountbank = {
      account_bank_number: this.state.account_bank_number,
      account_bank_name: this.state.account_bank_name,
      account_bank_address: this.state.account_bank_address,
      account_bank_swift: this.state.account_bank_swift,
    };
    postAccountBank(accountbank,this.props.token).then(data => {
      if (data.status === false) {
        this.setState({ message: 'Account Bank already exists' })
      }
      else {
        this.setState({ redirect: true })
      }
    })
  }
  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }
  clear(e) {
    this.setState({
      account_bank_number: '',
      account_bank_name: '',
      account_bank_address: '',
      account_bank_swift: '',
    })
  }
  render() {
    const redirect = this.state.redirect;
    if (redirect) {
      return <Redirect to='/accountbanks' />;
    }
    if ((this.props.role) || (localStorage.getItem('user_information'))) {
      return (
        <ThemeProvider theme={th} >
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div style={{ marginTop: '2%', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
              <Avatar style={{ marginTop: '2%', backgroundColor: '#3f51b5', }} >
                <AccountBalanceIcon />
              </Avatar>
              <Typography component="h1" variant="h5" style={{ marginTop: '1%', marginBottom: '3%' }}>
                Add an Account Bank
        </Typography>
              <Typography style={{ color: 'red' }}>
                {this.state.message}
              </Typography>
              <form validate="true" onSubmit={event => this.handleSubmitForm(event)}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <FormControl fullWidth={true}>
                      <TextField
                        autoComplete="fname"
                        name="account_bank_number"
                        variant="outlined"
                        required
                        margin="dense"
                        fullWidth
                        id="account_bank_number"
                        label="Account Bank Number"
                        autoFocus
                        onChange={this.onChange}
                        value={this.state.account_bank_number}
                        type="number"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} >
                    <FormControl fullWidth={true}>
                      <TextField
                        variant="outlined"
                        required
                        fullWidth
                        id="account_bank_name"
                        label="Account Bank Name"
                        margin="dense"
                        name="account_bank_name"
                        value={this.state.account_bank_name}
                        onChange={this.onChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth={true}>
                      <TextField
                        variant="outlined"
                        required
                        fullWidth
                        margin="dense"
                        id="account_bank_address"
                        label="Account Bank Address"
                        name="account_bank_address"
                        value={this.state.account_bank_address}
                        onChange={this.onChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth={true}>
                      <TextField
                        variant="outlined"
                        required
                        fullWidth
                        margin="dense"
                        id="account_bank_swift"
                        label="Account Bank Swift"
                        name="account_bank_swift"
                        value={this.state.account_bank_swift}
                        onChange={this.onChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={4}>
                    <Button style={{ marginTop: '2%', color: 'white', backgroundColor: 'red' }}
                      type="button"
                      fullWidth
                      variant="contained"
                      color="secondary"
                      onClick={this.clear}
                    >
                      Clear
          </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button style={{ marginTop: '2%' }}
                      type="submit"
                      fullWidth
                      variant="contained"
                      color='primary'
                    >
                      Save
          </Button>
                  </Grid>
                  <Grid item xs={2}></Grid>
                </Grid>

              </form>
            </div>
          </Container>
        </ThemeProvider>
      );
    }
    return (
      <NotFound />
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user_fullname: state.loginReducer.user_fullname,
    role: state.loginReducer.role,
    token: state.loginReducer.token
  };
}
export default connect(mapStateToProps)(AddAccountBank);