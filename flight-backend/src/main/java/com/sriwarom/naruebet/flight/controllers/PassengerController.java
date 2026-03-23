package com.sriwarom.naruebet.flight.controllers;
import java.io.IOException;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sriwarom.naruebet.flight.dtos.UploadResponseDto;
import com.sriwarom.naruebet.flight.services.PassengerService;

@RestController
@RequestMapping("/api/passengers")
public class PassengerController {
	
	private PassengerService passengerService;
	public PassengerController(PassengerService passengerService) {
		this.passengerService = passengerService;
	}
	
	@PostMapping("/upload")
	public ResponseEntity<?> uploadFile (@RequestParam("flightNo") String flightNo,
            @RequestParam("file") MultipartFile file) throws IOException
	{
		if (!passengerService.isExcelFile(file)) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", "File must be .xlsx"));
        }
		
		UploadResponseDto result = passengerService.processFile(flightNo, file);
		if (!result.getErrors().isEmpty()) {
		    return ResponseEntity
		            .badRequest()
		            .body(result);
		}
		return ResponseEntity.ok(result);
	}
}