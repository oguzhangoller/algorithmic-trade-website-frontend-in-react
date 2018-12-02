import React from "react";

export class AccountDetail extends React.Component {
  render() {
    return (
      <div className="yatirim-segment">
        <span className="ui segment box" style={{ marginRight: "10%" }}>
          <div className="inline-column">
            <div>Aylık Getiri</div>
            <br />
            <div className="tab2">{this.props.account_data.wealth}</div>
          </div>
        </span>
        <span className="ui segment box" style={{ marginRight: "10%" }}>
          <div className="inline-column">
            <div>Yatırım</div>
            <br />
            <div className="tab2">{this.props.account_data.total_cost}</div>
          </div>
        </span>
        <span className="ui segment box">
          <div className="inline-column">
            <div>Kullanılabilir Bakiye</div>
            <br />
            <div className="tab2">{this.props.account_data.free_cash}</div>
          </div>
        </span>
      </div>
    );
  }
}
