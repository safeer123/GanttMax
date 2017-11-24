import React from "react";

export default class CustomPopover extends React.Component {
  render() {

    if(!this.props.visible) return null;

    return (
      <div
      className="custom-popover"
        style={{
          ...this.props.style,
          left: this.props.position.x,
          top: this.props.position.y,
        }}
      >
        <strong>{ this.props.assignment.BusName}</strong>
        <br />Bus ID: { this.props.assignment.BusID }
        <br />Dest: { this.props.assignment.DestCityCode }
        <br />Orig: { this.props.assignment.OriginCityCode }
        <br />RouteSeq: { this.props.assignment.RouteSeq }
        <br />Schedule Code: { this.props.assignment.ScheduleCode }
        <br />Travel Time: { this.props.assignment.TravelTime }
      </div>
    );
  }
}