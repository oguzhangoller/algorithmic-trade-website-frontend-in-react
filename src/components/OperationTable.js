import React from "react";

export class OperationTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const imageurl = "https://beta.miksinvest.com/static";

    return (
      <table className="ui selectable celled table">
        <thead>
          <tr>
            <th>Miks Adı</th>
            <th>İşlem</th>
            <th>Tutar</th>
            <th>Komisyon</th>
            <th>Tarih</th>
            <th>Detay</th>
          </tr>
        </thead>
        <tbody>
          {this.props.data &&
            this.props.data.map(function(datas, i) {
              return (
                <tr key={i}>
                  <td value={datas.portfolio_id} style={{ width: "400px" }}>
                    <img
                      className="yatirim image"
                      style={{ marginRight: "20px" }}
                      src={imageurl + "/uploads/" + datas.image}
                    />
                    <div
                      className="portfolio name"
                      style={{ marginTop: "25px" }}
                    >
                      {datas.portfolio_name}
                    </div>
                  </td>
                  <td>{datas.type}</td>
                  <td>{datas.amount + " TL"}</td>
                  <td>{datas.commission}</td>
                  <td>{datas.date}</td>
                  <td>
                    <a>Detay</a>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    );
  }
}
