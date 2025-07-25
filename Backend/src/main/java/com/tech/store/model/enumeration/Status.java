package com.tech.store.model.enumeration;

public enum Status {
    ACTIVE("active"),
    INACTIVE("inactive"),
    CLOSED("closed");

    private final String value;

    Status(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return value;
    }
}

