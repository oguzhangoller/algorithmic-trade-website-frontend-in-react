import React from "react";
import axios from "axios";
import { history } from "../routers/AppRouter";
import { AccountDetail } from "./AccountDetail";

export class ToplamPortfoyum extends React.Component {
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

  componentWillMount() {
    const url = "https://beta.miksinvest.com/hesabim/toplam-portfoyum";

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
        this.setState({
          account_data: response.data.user_account_data,
          portfolios: response.data.user_account_data.overall_portfolio,
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
    if (this.state.loaded) {
      return (
        <ul>
          <font style={{ fontSize: "18px" }}> Hesabım </font>
          <br />
          <br />
          <AccountDetail account_data={this.state.account_data} />
          <table className="ui celled table" onClick={e => this.handleClick(e)}>
            <thead>
              <tr>
                <th>Hisse</th>
                <th>Sembol</th>
                <th>Ağırlık</th>
                <th>Miktar</th>
                <th>Lot Sayısı</th>
                <th>Kar/Zarar</th>
              </tr>
            </thead>
            <tbody>
              {this.state.portfolios &&
                this.state.portfolios.map(function(datas, i) {
                  return (
                    <tr key={i}>
                      <td>
                        <a>{datas.description}</a>
                      </td>
                      <td>
                        <a>{datas.symbol}</a>
                      </td>
                      <td>{datas.percent}</td>
                      <td>{datas.cost}</td>
                      <td>{datas.shares}</td>
                      <td>{"%" + datas.profit} </td>
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
