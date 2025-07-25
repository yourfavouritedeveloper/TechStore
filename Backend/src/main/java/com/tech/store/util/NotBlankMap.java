package com.tech.store.util;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = NotBlankMapValidator.class)
@Documented
public @interface NotBlankMap {
    String message() default "Map keys and values cannot be blank";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
