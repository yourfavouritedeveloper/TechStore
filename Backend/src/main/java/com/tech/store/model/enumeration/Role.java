package com.tech.store.model.enumeration;

public enum Role {
    ADMIN("admin"),
    USER("user"),
    GUEST("guest");


    private final String name;

    Role(String name) {
        this.name = name.toLowerCase();
    }

    public String getName() {
        return name;
    }
}
