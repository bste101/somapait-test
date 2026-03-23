package com.sriwarom.naruebet.flight.dtos;

import java.util.List;

public class UploadResponseDto {
	 private String flightNo;
     private String fileName;
     private List<PassengerDto> passengers;
     private List<String> errors;
     
     public UploadResponseDto(String flightNo, String fileName,List<PassengerDto> passengers,List<String> errors ) {
    	 this.flightNo = flightNo;
    	 this.fileName = fileName;
    	 this.passengers = passengers;
    	 this.errors = errors;
     }
      
	 public String getFlightNo() {
		return flightNo;
	 }
	 public void setFlightNo(String flightNo) {
		this.flightNo = flightNo;
	 }
	 public String getFileName() {
		return fileName;
	 }
	 public void setFileName(String fileName) {
		this.fileName = fileName;
	 }
	 public List<String> getErrors() {
		return errors;
	 }
	 public void setErrors(List<String> errors) {
		this.errors = errors;
	 }
	 public List<PassengerDto> getPassengers() {
		return passengers;
	 }
	 public void setPassengers(List<PassengerDto> passengers) {
		this.passengers = passengers;
	 }
}