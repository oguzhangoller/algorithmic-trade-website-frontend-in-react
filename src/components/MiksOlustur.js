import React from "react";
import axios from "axios";
import { history } from "../routers/AppRouter.js";
import { favorite } from "./Favorite";

export class MiksOlustur extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
  }

  handleRate(props) {
    favorite({ p_id: props });
  }

  handleClick(e) {
    const id = e.target.getAttribute("value");

    if (id != null) {
      history.push({
        pathname: "/miks-detayi/" + id,
        state: { id: id }
      });
    }
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
        <font style={{ fontSize: "18px" }}> Miks Oluştur </font>
        <br/><br/>
        <div style={{ position: "relative",width:"250px",display:"inline" }}>
          <img
            style={{width:"250px"}}
            src={imageurl + "/uploads/" + "default6.jpg"}
          />
          <div className="miks text on image second">
            <button className="imagebutton">Edit</button>
          </div>
          <div className="ui form" style={{width:"100px"}}>
  <div className="field">
    <input type="text"/>
    </div>
    </div>
        </div>
        
      </ul>
    );
  }
}
