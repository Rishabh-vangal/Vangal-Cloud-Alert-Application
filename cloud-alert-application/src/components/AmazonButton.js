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
        background: '#ffffff',
        // border: '1px solid black',
        'border-width': '1px',
        'border-style': 'solid',
        'border-color': '#000000',
        display: 'inline-block',
        padding: '10px 10px',
        width: '193px',
        }

        return (
        <div onClick={triggerLogin} style={style} {...props}>
            { children }
        </div>
        );
    }
}

export default SocialLogin(Button);
