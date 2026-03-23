package com.sriwarom.naruebet.flight.enums;

import java.util.Optional;

public enum Gender {
	Male,
	Female,
	Unknown;
	
    public static Optional<Gender> fromString(String value) {
        try {
            return Optional.of(Gender.valueOf(value));
        } catch (IllegalArgumentException e) {
            return Optional.empty();
        }
    }
}