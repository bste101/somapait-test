package com.sriwarom.naruebet.flight.services;

import com.sriwarom.naruebet.flight.dtos.UploadResponseDto;
import com.sriwarom.naruebet.flight.enums.Gender;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;

class PassengerServiceTest {

    private PassengerService passengerService;

    @BeforeEach
    void setUp() {
        passengerService = new PassengerService();
    }

    // ==================== isExcelFile ====================

    @Test
    void isExcelFile_shouldReturnTrue_whenValidXlsx() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "Passenger.xlsx",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                new byte[]{1, 2, 3}
        );
        assertTrue(passengerService.isExcelFile(file));
    }

    @Test
    void isExcelFile_shouldReturnFalse_whenCsvFile() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "Passenger.csv",
                "text/csv",
                new byte[]{1, 2, 3}
        );
        assertFalse(passengerService.isExcelFile(file));
    }

    @Test
    void isExcelFile_shouldReturnFalse_whenWrongContentType() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "Passenger.xlsx",
                "text/plain",
                new byte[]{1, 2, 3}
        );
        assertFalse(passengerService.isExcelFile(file));
    }

    // ==================== processFile - Happy Path ====================

    @Test
    void processFile_shouldReturnPassengers_whenDataIsValid() throws IOException {
        MockMultipartFile file = createExcelFile(new String[][]{
                {"Wilbur",  "Rogers",    "Male",    "31/12/1988", "USA"},
                {"Lorenzo", "Underwood", "Female",  "11/04/1976", "FRA"}
        });

        UploadResponseDto result = passengerService.processFile("TG127", file);

        assertTrue(result.getErrors().isEmpty());
        assertEquals(2, result.getPassengers().size());
        assertEquals("Wilbur",  result.getPassengers().get(0).getFirstName());
        assertEquals(Gender.Male, result.getPassengers().get(0).getGender());
    }

    // ==================== processFile - Validation Error ====================

    @Test
    void processFile_shouldReturnError_whenFirstNameInvalid() throws IOException {
        MockMultipartFile file = createExcelFile(new String[][]{
                {"W1lbur", "Rogers", "Male", "31/12/1988", "USA"}
        });

        UploadResponseDto result = passengerService.processFile("TG127", file);

        assertFalse(result.getErrors().isEmpty());
        assertTrue(result.getErrors().get(0).contains("First name"));
    }

    @Test
    void processFile_shouldReturnError_whenGenderInvalid() throws IOException {
        MockMultipartFile file = createExcelFile(new String[][]{
                {"Wilbur", "Rogers", "MALE", "31/12/1988", "USA"}
        });

        UploadResponseDto result = passengerService.processFile("TG127", file);

        assertTrue(result.getErrors().get(0).contains("Gender"));
    }

    @Test
    void processFile_shouldReturnError_whenDobInFuture() throws IOException {
        MockMultipartFile file = createExcelFile(new String[][]{
                {"Wilbur", "Rogers", "Male", "31/12/2099", "USA"}
        });

        UploadResponseDto result = passengerService.processFile("TG127", file);

        assertTrue(result.getErrors().get(0).contains("Date of birth"));
    }

    @Test
    void processFile_shouldReturnError_whenDobNotExist() throws IOException {
        MockMultipartFile file = createExcelFile(new String[][]{
                {"Wilbur", "Rogers", "Male", "31/02/2024", "USA"}
        });

        UploadResponseDto result = passengerService.processFile("TG127", file);

        assertTrue(result.getErrors().get(0).contains("Date of birth"));
    }

    @Test
    void processFile_shouldReturnError_whenNationalityInvalid() throws IOException {
        MockMultipartFile file = createExcelFile(new String[][]{
                {"Wilbur", "Rogers", "Male", "31/12/1988", "us"}
        });

        UploadResponseDto result = passengerService.processFile("TG127", file);

        assertTrue(result.getErrors().get(0).contains("Nationality"));
    }

    @Test
    void processFile_shouldReturnMultipleErrors_whenMultipleRowsInvalid() throws IOException {
        MockMultipartFile file = createExcelFile(new String[][]{
                {"W1lbur", "R0gers",  "Male",   "31/12/1988", "USA"},
                {"Lorenzo","Underwood","Female", "11/04/1976", "FRA"},
                {"Pearl",  "Johnson", "UNKNOWN", "14/05/2001", "AUS"}
        });

        UploadResponseDto result = passengerService.processFile("TG127", file);

        assertEquals(2, result.getErrors().size());
        assertTrue(result.getErrors().get(0).startsWith("Row 2"));
        assertTrue(result.getErrors().get(1).startsWith("Row 4"));
    }

    @Test
    void processFile_shouldReturnCorrectRowNumber_inErrorMessage() throws IOException {
        MockMultipartFile file = createExcelFile(new String[][]{
                {"Wilbur",  "Rogers",   "Male",   "31/12/1988", "USA"},
                {"L0renzo", "Underwood","Female",  "11/04/1976", "FRA"}
        });

        UploadResponseDto result = passengerService.processFile("TG127", file);

        assertEquals(1, result.getErrors().size());
        assertTrue(result.getErrors().get(0).startsWith("Row 3"));
    }

    // ==================== Helper ====================

    private MockMultipartFile createExcelFile(String[][] data) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Sheet1");

        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("First name");
        header.createCell(1).setCellValue("Last name");
        header.createCell(2).setCellValue("Gender");
        header.createCell(3).setCellValue("Date of birth");
        header.createCell(4).setCellValue("Nationality");

        for (int i = 0; i < data.length; i++) {
            Row row = sheet.createRow(i + 1);
            for (int j = 0; j < data[i].length; j++) {
                row.createCell(j).setCellValue(data[i][j]);
            }
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        workbook.close();

        return new MockMultipartFile(
                "file",
                "Passenger_TG127.xlsx",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                out.toByteArray()
        );
    }
}