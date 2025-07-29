package com.tech.store.util;

import java.lang.reflect.*;
import java.math.BigDecimal;
import java.util.Map;

public class ConverterUtil {

    public static Object convertValue(Object value, Class<?> targetType) {
        if (value == null) {
            if (targetType.isPrimitive()) {
                if (targetType == boolean.class) return false;
                if (targetType == char.class) return '\0';
                if (targetType == byte.class) return (byte) 0;
                if (targetType == short.class) return (short) 0;
                if (targetType == int.class) return 0;
                if (targetType == long.class) return 0L;
                if (targetType == float.class) return 0f;
                if (targetType == double.class) return 0d;
            }
            return null;
        }

        Class<?> valueType = value.getClass();

        if (targetType.isAssignableFrom(valueType)) {
            return value;
        }

        String stringValue = value.toString();

        try {
            if (targetType == String.class) {
                return stringValue;
            }
            if (targetType == Integer.class || targetType == int.class) {
                return Integer.parseInt(stringValue);
            }
            if (targetType == Long.class || targetType == long.class) {
                return Long.parseLong(stringValue);
            }
            if (targetType == Double.class || targetType == double.class) {
                return Double.parseDouble(stringValue);
            }
            if (targetType == Float.class || targetType == float.class) {
                return Float.parseFloat(stringValue);
            }
            if (targetType == Boolean.class || targetType == boolean.class) {
                return Boolean.parseBoolean(stringValue);
            }
            if (targetType == BigDecimal.class) {
                return new BigDecimal(stringValue);
            }
            if (targetType.isEnum()) {
                return Enum.valueOf((Class<Enum>) targetType, stringValue);
            }
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to convert '" + value + "' to " + targetType.getSimpleName());
        }


        throw new IllegalArgumentException("Unsupported target type: " + targetType.getName());
    }

}