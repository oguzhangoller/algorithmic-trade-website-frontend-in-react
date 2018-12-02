import React from "react";
import axios from "axios";
import { history } from "../routers/AppRouter.js";
import { Table } from "./Table";

export class Kesfet extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loaded: false, data: [], tickerDict: [] };
  }

  onClick(e) {
    history.push("/olustur/miks-olustur");
  }

  componentWillMount() {
    const url = "https://beta.miksinvest.com/kesfet";

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
        this.setState({
          data: response.data.data_list,
          tickerDict: response.data.ticker_dict,
          loaded: true
        });

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
        console.log(response);
      });
  }

  render() {
    if (this.state.loaded) {
      return (
        <div>
          <div
            style={{
              fontSize: 18,
              marginTop: 25,
              marginBottom: 25,
              marginLeft: 20
            }}
          >
            {" "}
            Miksleri Keşfet{" "}
          </div>

          <Table data={this.state.data} />

          <div className="ui segment" id="bottom-segment">
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "26px", marginTop: "30px" }}>
                Yatırım tercihlerinize uygun bir miks bulamadınız mı?
              </div>
              <div
                style={{ fontSize: "18px", marginTop: "20px", color: "#666" }}
              >
                Miks Oluştur sayfasından yatırım tercihlerinize uygun olan
                miksleri oluşturabilirsiniz.
              </div>
            </div>
            <div
              className="ui button olustur"
              id="miks-olustur"
              onClick={this.onClick}
            >
              Miks Oluştur
            </div>
          </div>
        </div>
      );
    } else {
      return <div />;
    }
  }
}

