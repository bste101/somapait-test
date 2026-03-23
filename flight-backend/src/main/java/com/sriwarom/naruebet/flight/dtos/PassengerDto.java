package com.sriwarom.naruebet.flight.dtos;

import java.time.LocalDate;

import com.sriwarom.naruebet.flight.enums.Gender;

public class PassengerDto{
        private String firstName;
        private String lastName;
        private Gender gender;
        private LocalDate dateOfBirth;
        private String nationality;
		public PassengerDto(String firstName, String lastName, Gender gender, LocalDate dateOfBirth,
				String nationality) {
			this.firstName = firstName;
			this.lastName = lastName;
			this.gender = gender;
			this.dateOfBirth = dateOfBirth;
			this.nationality = nationality;
		}
		public String getFirstName() {
			return firstName;
		}
		public void setFirstName(String firstName) {
			this.firstName = firstName;
		}
		public String getLastName() {
			return lastName;
		}
		public void setLastName(String lastName) {
			this.lastName = lastName;
		}
		public LocalDate getDateOfBirth() {
			return dateOfBirth;
		}
		public void setDateOfBirth(LocalDate dateOfBirth) {
			this.dateOfBirth = dateOfBirth;
		}
		public Gender getGender() {
			return gender;
		}
		public void setGender(Gender gender) {
			this.gender = gender;
		}
		public String getNationality() {
			return nationality;
		}
		public void setNationality(String nationality) {
			this.nationality = nationality;
		}
}