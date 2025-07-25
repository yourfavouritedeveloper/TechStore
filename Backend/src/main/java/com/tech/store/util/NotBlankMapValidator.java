package com.tech.store.util;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.Map;

public class NotBlankMapValidator implements ConstraintValidator<NotBlankMap, Map<String, String>> {

    @Override
    public boolean isValid(Map<String, String> map, ConstraintValidatorContext context) {
        if (map == null || map.isEmpty()) {
            return false; // consider empty or null map invalid
        }

        for (Map.Entry<String, String> entry : map.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();

            if (key == null || key.trim().isEmpty()) {
                return false;
            }
            if (value == null || value.trim().isEmpty()) {
                return false;
            }
        }

        return true;
    }
}
