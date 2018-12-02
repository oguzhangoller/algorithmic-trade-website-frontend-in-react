import React from "react";
import axios from "axios";
import { history } from "../routers/AppRouter.js";
import {Table} from "./Table";

export class Favorilerim extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
  }



  componentWillMount() {
    const url = "https://beta.miksinvest.com/kesfet/favorilerim";

    const formData = new FormData();

    const token = localStorage.getItem("jwtToken");
    const app = "true";

    formData.append("session_id", token);
    formData.append("app", app);

    axios({
      method: "get",
      url: url,
      headers: {
        "Content-Type": "multipart/form-data",
        session_id: token,
        app: "true"
      }
    })
      .then(response => {
        //handle success
        this.setState({ data: response.data.data_list });

        if (response.statusText === "OK") {
          console.log("ok");
          console.log(response);
        } else {
          console.log("not ok");
          console.log(response.statusText);
          history.push("/failed");
        }
      })
      .catch(function(response) {
        //handle error
        console.log(response);
      });
  }

  render() {
    const imageurl = "https://beta.miksinvest.com/static";
    return (
      <ul>
        <font style={{ fontSize: "18px" }}> Favorilerim </font>
        <br />
        <br />
        <Table
            row1={"Miks Detayı"}
            row2={"Endeks"}
            row3={"Son 1 Ay"}
            row4={"Son 1 Yıl"}
            row5={"Volatilite"}
            data={this.state.data}
          />
         </ul>
    );
  }
}

