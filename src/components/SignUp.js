import React from "react";
import axios from "axios";
import { history } from "../routers/AppRouter.js";
import { Form, Button } from "semantic-ui-react";
import "../style.css";

export class SignUp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      code: "",
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

    const url = "https://beta.miksinvest.com/auth/register";

    const formData = new FormData();
    formData.append("register_username", this.state.email);
    formData.append("register_password", this.state.password);
    formData.append("register_access_code", this.state.code);

    let result = "no data";

    axios({
      method: "post",
      url: url,
      data: formData,
      config: { headers: { "Content-Type": "multipart/form-data" } }
    })
      .then(function(response) {
        //handle success
        console.log(response);
        result = response.data.response;
        if (result === "ok") history.push("/signUpSuccess");
        else history.push("/failed");
      })
      .catch(function(response) {
        //handle error
        console.log(response);
      });
  }

  render() {
    return (
      <div>
        <form className="ui form login" onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Email</label>
            <input
              className="input-text"
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              onChange={this.handleChange}
            />
          </Form.Field>

          <Form.Field>
            <label>Password</label>
            <input
              className="input-text"
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              onChange={this.handleChange}
            />
          </Form.Field>

          <Form.Field>
            <label>Code</label>
            <input
              className="input-text"
              id="code"
              name="code"
              placeholder="Access Code"
              onChange={this.handleChange}
            />
          </Form.Field>

          <Button primary>Sign Up</Button>
        </form>
      </div>
    );
  }
}
