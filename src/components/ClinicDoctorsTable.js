import React from 'react'
import ClinicForm from './ClinicAdminForm'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Modal, Button, Card } from "react-bootstrap";
import '../css/ClinicDoctorTable.css';
import docmale from '../icons/onedoctor.svg'
import axios from 'axios';
import { BrowserRouter as Router,Route,Link,Switch,useParams,withRouter } from "react-router-dom";
import ClinicProfile from './ClinicProfile';
import DoctorsTerms from './DoctorsTerms';


class ClinicDoctorTable extends React.Component{
    constructor(props) {
        super(props);


        this.renderTableData = this.renderTableData.bind(this);

    }


    renderTableData() {
      console.log(this.props.content);


    return this.props.content.map((doctor, index) => {
        //const { name, adress, description, clinicAdmin} = clinic
        //console.log(clinic)



        return (
          <div>
          
            <Card key={doctor.name} name={doctor.id} className="cardContainerDoktor" style={{height:'auto',left:'50px'}}>
            <Card.Title className="cardTitleDoktor" style={{'text-transform':'capitalize'}}><b>{doctor.name} {doctor.lastname}</b></Card.Title>


                <Card.Body className = "cardBodyDoktor">

                    <Card.Text className='cardTextDoktor'>
                          <label><b>Doctor does exam type:</b>{doctor.exam.name}</label>
                          <br/>
                          <label><b>Doctors rating: </b></label> &nbsp;

                          <label>{doctor.rating}</label>

                          <br/>
                          <label>Avaliable terms this doctor has for date <u> {this.props.date}:</u></label>
                          <div className="termsdiv">
                          <DoctorsTerms doctor={doctor} date={this.props.date} exam={doctor.exam}/>
                          </div>
                    </Card.Text>
                    <div className="addDoktor">
                    </div>


                </Card.Body>
            </Card>
            </div>
            )


      })
    }



    render() {
      console.log(this.props);
        return (
            <div className="containerRenderCardsClinic">

                {this.renderTableData()}
            </div>
        );

    }


}

export default (ClinicDoctorTable)
