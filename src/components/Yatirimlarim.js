import React from "react";
import axios from "axios";
import { history } from "../routers/AppRouter";
import { AccountDetail } from "./AccountDetail";

export class Yatirimlarim extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      account_data: {
        wealth: undefined,
        total_cost: undefined,
        free_cash: undefined
      },
      portfolios: []
    };
  }

  handleClick(e) {
    const id = e.target.getAttribute("value");
    if (id != null) {
      history.push("/satin-alinan-miks/" + id);
    }
  }

  componentWillMount() {
    const url = "https://beta.miksinvest.com/hesabim/yatirimlarim";

    const token = localStorage.getItem("jwtToken");

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
        this.setState({
          account_data: response.data.user_account_data,
          portfolios: response.data.user_invested_portfolios,
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
        //handle error
        console.log(response);
      });
  }

  render() {
    const imageurl = "https://beta.miksinvest.com/static";
    if (this.state.loaded) {
      return (
        <ul>
          <font style={{ fontSize: "18px" }}> Hesabım </font>
          <br />
          <br />
          <AccountDetail account_data={this.state.account_data} />
          <table
            className="ui selectable celled table"
            onClick={e => this.handleClick(e)}
          >
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>Miks Adı</th>
                <th>Toplam Miktar</th>
                <th>Kar/Zarar</th>
                <th>Volatilite</th>
              </tr>
            </thead>
            <tbody>
              {this.state.portfolios &&
                this.state.portfolios.map(function(datas, i) {
                  return (
                    <tr key={i}>
                      <td value={datas.portfolio_id}>
                        <img
                          className="yatirim image"
                          src={imageurl + "/uploads/" + datas.image}
                        />
                        {datas.name}
                      </td>
                      <td value={datas.portfolio_id}>{datas.market_value}</td>
                      <td value={datas.portfolio_id}>{datas.profit}</td>
                      <td value={datas.portfolio_id}>
                        <div
                          className="inline-column"
                          style={{ color: "black", padding: "0px" }}
                        >
                          <img
                            className="risk image"
                            src={imageurl + datas.risk_image}
                          />
                          <div> {datas.risk_text}</div>{" "}
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </ul>
      );
    } else {
      return <div />;
    }
  }
}
