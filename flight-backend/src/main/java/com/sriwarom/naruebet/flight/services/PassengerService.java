package com.sriwarom.naruebet.flight.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.sriwarom.naruebet.flight.dtos.PassengerDto;
import com.sriwarom.naruebet.flight.dtos.UploadResponseDto;
import com.sriwarom.naruebet.flight.enums.Gender;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.format.ResolverStyle;

import org.apache.poi.ss.usermodel.*;

@Service
public class PassengerService {
	
    private static final String CONTENT_TYPE_XLSX =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
	public boolean isExcelFile(MultipartFile file) {
	     String filename = file.getOriginalFilename();
	        String contentType = file.getContentType();

	        boolean hasXlsxExtension = filename != null
	                && filename.toLowerCase().endsWith(".xlsx");
	        boolean hasXlsxContentType = CONTENT_TYPE_XLSX.equals(contentType);

	        return hasXlsxExtension && hasXlsxContentType;
		
	}
	
	public UploadResponseDto processFile(String flightNo, MultipartFile file)  throws IOException {
		List<String> errors = new ArrayList<>();
		List<PassengerDto> passengers = new ArrayList<>();
		
		try (Workbook workbook = WorkbookFactory.create(file.getInputStream())){
			Sheet sheet = workbook.getSheetAt(0);
			
			for (int i=1; i <= sheet.getLastRowNum(); i++) {
				Row row = sheet.getRow(i);
				if (row == null) continue;
				
				  String firstName   = getCellValue(row.getCell(0)); 
	              String lastName    = getCellValue(row.getCell(1)); 
	              String gender      = getCellValue(row.getCell(2)); 
	              String dateOfBirth = getCellValue(row.getCell(3)); 
	              String nationality = getCellValue(row.getCell(4)); 
	              
	            List<String> invalidFields = validateRow(firstName, lastName, gender, dateOfBirth, nationality);
	            
	            int displayRowNum = i + 1;
	            if (!invalidFields.isEmpty()) {
                    errors.add("Row " + displayRowNum
                            + " Invalid " + String.join(", ", invalidFields));
	            } else {
                    Gender genderEnum = Gender.fromString(gender).orElseThrow();
                    LocalDate dob    = parseDateOfBirth(dateOfBirth).orElseThrow();
                    passengers.add(new PassengerDto(
                            firstName, lastName, genderEnum, dob, nationality));
                }
			}
		}
		 return new UploadResponseDto(flightNo, file.getOriginalFilename(),
	                passengers, errors);
	}
	
	private static String getCellValue(Cell cell) {
	    if (cell == null) return "";

	    switch (cell.getCellType()) {
	        case STRING:
	            return cell.getStringCellValue().trim();
	        case NUMERIC:
	            if (DateUtil.isCellDateFormatted(cell)) {
	                return cell.getLocalDateTimeCellValue()
	                        .toLocalDate()
	                        .format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
	            }
	            return String.valueOf((long) cell.getNumericCellValue());
	        default:
	            return "";
	    }
	}
	
	 private List<String> validateRow(String firstName, String lastName,
             String gender, String dateOfBirth,
             String nationality) {
		 	List<String> invalid = new ArrayList<>();

		 	if (!isValidName(firstName))    invalid.add("First name");
		 	if (!isValidName(lastName))     invalid.add("Last name");
		 	if (Gender.fromString(gender).isEmpty())     invalid.add("Gender");
		 	if (parseDateOfBirth(dateOfBirth).isEmpty()) invalid.add("Date of birth");
		 	if (!isValidNationality(nationality)) invalid.add("Nationality");

		 	return invalid;
	 }
	 
	 private boolean isValidName(String value) {
		 if (value ==null || value.isBlank()) return false;
		 return value.matches("^[A-Za-z]{1,20}$");
	 }
	 
	 private Optional<LocalDate> parseDateOfBirth(String value) {
		 if (value == null || value.isBlank()) return Optional.empty();
		 
		 try {
			 DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/uuuu").withResolverStyle(ResolverStyle.STRICT);;
			 LocalDate dob = LocalDate.parse(value, formatter);
			 
			 if (dob.isAfter(LocalDate.now())) {
				 return Optional.empty();
			 }
			 
			 return Optional.of(dob);
		 } catch (DateTimeParseException e) {
		        return Optional.empty();
		 }
	 }
	 
	 private boolean isValidNationality(String value) {
		 if (value ==null || value.isBlank()) return false;
		 return value.matches("^[A-Z]{3}$");
	 }
}