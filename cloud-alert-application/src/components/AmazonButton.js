import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SocialLogin from 'react-social-login';

class Button extends Component {
    static propTypes = {
        triggerLogin: PropTypes.func.isRequired,
        triggerLogin: PropTypes.func.isRequired
    }

    render() {
        const { children, triggerLogin, triggerLogout, ...props } = this.props
        const style = {
        'background-image': 'url("https://images-na.ssl-images-amazon.com/images/G/01/lwa/btnLWA_gold_156x32.png")',
        'background-repeat': 'no-repeat',
        'background-size': '100% 100%', // cover
        display: 'inline-block',
        padding: '10px 10px',
        width: '195px',
        height: '25px'
        }

        return (
        <div onClick={triggerLogin} style={style} {...props}>
            { children }
        </div>
        );
    }
}

export default SocialLogin(Button);
