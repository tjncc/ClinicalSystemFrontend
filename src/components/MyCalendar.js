import React, { Component } from 'react';
import { render } from 'react-dom';
import  BigCalendar, {momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/en-gb';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../css/MyCalendar.css'
import tipicon from '../icons/lamp.svg'

const PatientAlert = withReactContent(Swal);
const localizer = momentLocalizer(moment);

class MyCalendar extends React.Component {

  

  constructor() {
    
    super();

    this.createEvents = this.createEvents.bind(this);
    this.createHolidays = this.createHolidays.bind(this);
    this.createOperations = this.createOperations.bind(this);
    this.customEventPropGetter = this.customEventPropGetter.bind(this);
    this.onSelectEvent = this.onSelectEvent.bind(this);
    
    const now = new Date();

    this.state = {
      name: 'React',
      startShift: new Date(),
      endShift: new Date(),
      doctor: {},
      events: [],
      appointments: [],
      holidays: [],
      operations: [],
    };
    
  }

  componentDidMount(){
    
    let token = localStorage.getItem('token');
    const options = {
      headers: { 'Authorization': 'Bearer ' + token}
          };

    axios.get('http://localhost:8081/api/doctors/getdates',options).then(
              (resp) => this.onSuccessHandler(resp),
              (resp) => this.onErrorHandler(resp)
              );


  }

  onErrorHandler(resp) {
    PatientAlert.fire({
        title: "Error occured",
        text: '',
        type: "error",
        button: true
      });
  
  }
   
  
  onSuccessHandler(resp) {
    console.log(resp.data)
  

    var splitedstart = resp.data.start.split(':');
    var splitedend = resp.data.end.split(':');

    var begin = new Date(0,0,0,splitedstart[0],splitedstart[1],splitedstart[2]);
    var end = new Date(0,0,0,splitedend[0],splitedend[1],splitedend[2]);

    this.setState({
  
      startShift : begin,
      endShift : end,
      appointments : resp.data.appointments,
      holidays : resp.data.holidays,
      operations : resp.data.operations,

    })

    this.createEvents();
    this.createHolidays();
    this.createOperations();
  }


  createEvents(){

    var appointEvents = []

    this.state.appointments.map((app, index) => {
      if(app.classification !== "NORMAL"){
        return;
      }

      var splitedstart = app.startTime.split(':');
      var splitedend = app.endTime.split(':');
      var spliteddate = app.date.split('-')
     // var numapp = index + 1;
      var beginApp = new Date(spliteddate[0],spliteddate[1]-1,spliteddate[2],splitedstart[0],splitedstart[1],splitedstart[2]);
      var endApp = new Date(spliteddate[0],spliteddate[1]-1,spliteddate[2],splitedend[0],splitedend[1],splitedend[2]);


    appointEvents.push({
      title: app.examTypeName + " (" + app.patientName + " " + app.patientLastname + ") " ,
      startDate: beginApp,
      endDate: endApp,
      allDay: false,
      resource: app.id, 
  
    });

  })

  this.setState({
    events: this.state.events.concat(appointEvents)
})

console.log(this.state.appointments);

}





createHolidays(){
  var holidayEvents = []

  this.state.holidays.map((holiday, index) => {

    if(holiday.holidayRequestStatus !== "ACCEPTED"){
      return;
  }

    var starth = holiday.startHoliday.split('-');
    var endh = holiday.endHoliday.split('-');
    //var numapp = index + 1;

    var beginH = new Date(starth[0],starth[1]-1,starth[2]);
    var endH = new Date(endh[0],endh[1]-1,endh[2]);


  holidayEvents.push({
    title: 'Holiday',
    startDate: beginH,
    endDate: endH,
    allDay: true,

  });
})


this.setState({
  events: this.state.events.concat(holidayEvents)
})

}



createOperations(){
  var operationEvents = []

  this.state.operations.map((operation, index) => {

      var splitedstart = operation.startTime.split(':');
      var splitedend = operation.endTime.split(':');
      var spliteddate = operation.date.split('-')
    // var numapp = index + 1;
      var beginApp = new Date(spliteddate[0],spliteddate[1]-1,spliteddate[2],splitedstart[0],splitedstart[1],splitedstart[2]);
      var endApp = new Date(spliteddate[0],spliteddate[1]-1,spliteddate[2],splitedend[0],splitedend[1],splitedend[2]);


    operationEvents.push({
      title: operation.name + " (" + operation.patientName + " " + operation.patientLastname + ") " ,
      startDate: beginApp,
      endDate: endApp,
      allDay: false,
      resource: operation.id, 

    });

  })

  this.setState({
    events: this.state.events.concat(operationEvents)
  })

  console.log(this.state.operations);
  }

  customEventPropGetter(event){
    //console.log(event)

    if(event.title.includes('Holiday')){
      return {
        style: {
          backgroundColor: '#4f4f4f',
        },
      }
    } else {
        return {
          style: {
            backgroundColor: '#82c2e0',
            color: 'black',
          }
        }
    
      } 
}


onSelectEvent(event){

  this.state.appointments.forEach(element => {
    if(element.id === event.resource){
      if(!element.status.includes('HAS_HAPPEND')){
        window.location.href=`http://localhost:3000/startappointment/medicalrecord/${event.resource}`
      }
     else if (element.status.includes('HAS_HAPPEND')) {
      PatientAlert.fire({
        title: "This appointment has already happened.",
        text: '',
        type: "error",
        icon: 'error',
        button: true
      });
    }
  }

  });
  
  
  this.state.operations.forEach(element => {
    if(element.id === event.resource){
    PatientAlert.fire({
      title: element.name,
      text: "Doktori: " + element.doctorNames, 
      type: "info",
      icon: 'info',
      button: true
    });
  }
  })

}


  render() {
    
    return (
      <div>
          <br />
          <div className="calendarInfo">
            <img style={{height:'55px', width: 'auto'}} src={tipicon} className="tipIcon" />
          <p>You can start the appointment or view information about operation by clicking on it.</p>
          </div>

        <div  style={{ height: '470pt', margin: '40px 0 0 0'}} >
          
          <BigCalendar
            localizer={localizer}
            events={this.state.events}
            views={['month', 'week', 'day']}
            startAccessor="startDate"
            endAccessor="endDate"
            min={this.state.startShift}
            max={this.state.endShift}
            eventPropGetter={this.customEventPropGetter}
            onSelectEvent={this.onSelectEvent}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(MyCalendar);
