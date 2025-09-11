package com.tech.store.util;

import com.tech.store.dao.entity.BaseEntity;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Component
public class UpdateUtils {


    public BaseEntity update(BaseEntity entity, Map<String, String> updates) throws Exception {
        if (updates.isEmpty()) {
            throw new IllegalArgumentException("No properties to update.");
        }

        for (String key : updates.keySet()) {
            String valueObj = updates.get(key);

            String setterName = "set" + key.substring(0, 1).toUpperCase() + key.substring(1);

            Method setterMethod = null;

            try {
                setterMethod = entity.getClass().getMethod(setterName, valueObj.getClass());
            } catch (NoSuchMethodException e) {
                for (Method m : entity.getClass().getMethods()) {
                    if (m.getName().equals(setterName) && m.getParameterCount() == 1) {
                        setterMethod = m;
                        break;
                    }
                }
                if (setterMethod == null) {
                    throw new NoSuchMethodException("Setter not found for property: " + key);
                }
            }

            Class<?> paramType = setterMethod.getParameterTypes()[0];
            Object convertedValue = ConverterUtil.convertValue(valueObj, paramType);

            setterMethod.invoke(entity, convertedValue);
        }

        return entity;
    }

    public void copyNonNullProperties(Object src, Object target) {
        BeanUtils.copyProperties(src, target, getNullPropertyNames(src));
    }

    private String[] getNullPropertyNames(Object source) {
        final BeanWrapper src = new BeanWrapperImpl(source);
        java.beans.PropertyDescriptor[] pds = src.getPropertyDescriptors();

        Set<String> emptyNames = new HashSet<>();
        for (java.beans.PropertyDescriptor pd : pds) {
            Object srcValue = src.getPropertyValue(pd.getName());
            if (srcValue == null) emptyNames.add(pd.getName());
        }
        return emptyNames.toArray(new String[0]);
    }

}
