import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';

export const th = createMuiTheme({
    palette: {
        primary: { main: blue[500] },
        secondary: { main: '#2196f3' },
    },
});

export const API_URL = 'http://127.0.0.1:5001/';
