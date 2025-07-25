package com.tech.store.util;

import java.lang.reflect.*;
import java.util.Map;

public class ReflectionUpdater {

    public static <T> T updateFields(T object, Map<String, String> updates) throws Exception {
        Class<?> clazz = object.getClass();

        for (Map.Entry<String, String> entry : updates.entrySet()) {
            String fieldName = entry.getKey();
            String stringValue = entry.getValue();

            Field field = clazz.getDeclaredField(fieldName);
            Class<?> fieldType = field.getType();

            String setterName = "set" + Character.toUpperCase(fieldName.charAt(0)) + fieldName.substring(1);

            Method setter = clazz.getMethod(setterName, fieldType);

            Object typedValue = convertValue(stringValue, fieldType);

            setter.invoke(object, typedValue);
        }

        return object;
    }

    private static Object convertValue(String value, Class<?> type) {
        if (type == String.class) return value;
        if (type == int.class || type == Integer.class) return Integer.parseInt(value);
        if (type == long.class || type == Long.class) return Long.parseLong(value);
        if (type == boolean.class || type == Boolean.class) return Boolean.parseBoolean(value);
        if (type == double.class || type == Double.class) return Double.parseDouble(value);
        throw new IllegalArgumentException("Unsupported field type: " + type.getName());
    }
}