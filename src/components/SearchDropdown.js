import React from 'react'
import { Dropdown } from 'semantic-ui-react'


export class SearchDropdown extends React.Component{

   render(){ 
       return(<div className="edit section">
  <Dropdown placeholder='Hisse Seç' fluid search selection options={this.props.list} />
  <div className="ui button edit"> Gönder</div>
  <div className="ui button edit"> Gönder</div>
  </div>
       );
   }

}