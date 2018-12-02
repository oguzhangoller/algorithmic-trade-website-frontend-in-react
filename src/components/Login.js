import React from 'react';
import axios from 'axios';
import { history } from '../routers/AppRouter.js';
import { connect } from 'react-redux';
import { loggedIn } from '../actions/LoginManager.js';
import { bindActionCreators } from 'redux';
import { Form, Button } from 'semantic-ui-react';
import '../style.css'

export class Login extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            submitted: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }


    handleSubmit(e) {
        e.preventDefault();
        this.setState({ submitted: true });



        const url = "https://beta.miksinvest.com/auth/login";

        const formData = new FormData();

        if (this.state.email) {

            formData.append('username', this.state.email);
            formData.append('password', this.state.password);
        }


        axios({
            method: 'post',
            url: url,
            data: formData,
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        })
            .then((response) => {
                //handle success
                if (response.data.response === "ok") {
                    console.log("ok");
                    console.log(response);

                    const token = response.data.session_id;
                    localStorage.setItem('jwtToken', token);
                    history.push("/kesfet");
                    this.props.loggedIn();
                    console.log(token);
                }
                else {
                    console.log("not ok");
                    history.push("/failed");
                }

            })
            .catch(function (response) {
                //handle error
                console.log(response);
            });
    }


    render() {

        return (
            <div>

                <form className="ui form login" onSubmit={this.handleSubmit}>
                    <Form.Field>
                        <label className="label-text" htmlFor="email">Email</label>
                        <input className="input-text"
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            onChange={this.handleChange} />
                    </Form.Field>

                    <Form.Field>
                        <label htmlFor="password">Password</label>
                        <input className="input-text"
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            onChange={this.handleChange} />

                    </Form.Field>

                    <Button primary>Login</Button>

                </form>
            </div>
        );
    }

}


function mapStateToProps(state) {
    return {
        login: state.login
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({ loggedIn }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Login);

